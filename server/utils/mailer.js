import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const mailOptions = {
  from: `"JobHub Verification" <${process.env.EMAIL_USER}>`,
  to: "youremail@gmail.com", // send to your normal Gmail
  subject: "Test OTP",
  text: "This is a test message to confirm Gmail setup works.",
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) return console.error(error);
  console.log("✅ Email sent:", info.response);
});