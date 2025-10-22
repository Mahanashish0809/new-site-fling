import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();
const prisma = new PrismaClient();

// --- Gmail transporter (requires App Password from Gmail account) ---
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // sender Gmail (your service account)
    pass: process.env.EMAIL_PASS, // Gmail App Password (16 chars, no spaces)
  },
});

// --- OTP generator ---
const genOtp = () => Math.floor(100000 + Math.random() * 900000).toString();
const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes

// --- Helper to send OTP mail ---
async function sendOtpEmail(receiverEmail, otp) {
  const mailOptions = {
    from: `"JoltQ Verification" <${process.env.EMAIL_USER}>`, // Sender Gmail
    to: receiverEmail, // Receiver = user email
    subject: "Your JoltQ Verification Code",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="color:#2563eb;">Verify Your Account</h2>
        <p>Hello,</p>
        <p>Your One-Time Password (OTP) for verifying your JoltQ account is:</p>
        <h1 style="letter-spacing: 4px; color:#2563eb;">${otp}</h1>
        <p>This OTP will expire in 10 minutes. Please do not share it with anyone.</p>
        <p>Regards,<br/>The JoltQ Team</p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
}

// ---------------- SIGNUP ----------------
router.post("/signup", async (req, res) => {
  try {
    const { email, username, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Email and password required" });

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing && existing.isVerified)
      return res.status(400).json({ error: "User already exists" });

    const otp = genOtp();
    const otpExpiresAt = new Date(Date.now() + OTP_TTL_MS);
    const hashed = await bcrypt.hash(password, 10);

    let user;
    if (existing && !existing.isVerified) {
      user = await prisma.user.update({
        where: { email },
        data: {
          username: username ?? existing.username,
          password: hashed,
          otpCode: otp,
          otpExpiresAt,
          isVerified: false,
        },
      });
    } else {
      user = await prisma.user.create({
        data: { email, username, password: hashed, otpCode: otp, otpExpiresAt },
      });
    }

    // Respond first (for better UX)
    res.status(201).json({
      message: "User created. OTP sent to your email for verification.",
    });

    // Send OTP email asynchronously
    try {
      await sendOtpEmail(email, otp);
      console.log(`✅ OTP email sent successfully to ${email}`);
    } catch (mailErr) {
      console.error(`❌ Failed to send OTP email to ${email}:`, mailErr);
      await prisma.user.update({
        where: { id: user.id },
        data: { /* optional: emailSendFailed: true */ },
      });
    }
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ---------------- RESEND OTP ----------------
router.post("/resend-otp", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email required" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found" });
    if (user.isVerified)
      return res.status(400).json({ error: "Already verified" });

    const otp = genOtp();
    const otpExpiresAt = new Date(Date.now() + OTP_TTL_MS);

    await prisma.user.update({
      where: { email },
      data: { otpCode: otp, otpExpiresAt },
    });

    res.json({ message: "New OTP sent to your email." });

    await sendOtpEmail(email, otp);
    console.log(`📩 Resent OTP to ${email}`);
  } catch (err) {
    console.error("Resend OTP error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ---------------- VERIFY OTP ----------------
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp)
      return res.status(400).json({ error: "Email and OTP required" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found" });
    if (user.isVerified)
      return res.status(400).json({ error: "User already verified" });
    if (!user.otpCode || !user.otpExpiresAt)
      return res.status(400).json({ error: "No active OTP. Request a new one." });
    if (new Date() > user.otpExpiresAt)
      return res.status(400).json({ error: "OTP expired" });
    if (user.otpCode !== otp)
      return res.status(400).json({ error: "Invalid OTP" });

    await prisma.user.update({
      where: { email },
      data: { isVerified: true, otpCode: null, otpExpiresAt: null },
    });

    res.json({ message: "Email verified successfully!" });
  } catch (err) {
    console.error("Verify OTP error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ---------------- LOGIN ----------------
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found" });
    if (!user.isVerified)
      return res.status(403).json({ error: "Please verify your email first." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    // ✅ Include username in JWT payload
    const token = jwt.sign(
      { userId: user.id, email: user.email, username: user.username },
      process.env.JWT_SECRET || "supersecretkey",
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user.id, email: user.email, username: user.username },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// ---------------- PROFILE (Protected) ----------------
router.get("/profile", verifyToken, async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
  res.json(user);
});

export default router;