const nodemailer = require("nodemailer");
const dotenv = require("dotenv");


dotenv.config();
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.sendMail(
  {
    from: `"JobHub Verification" <${process.env.EMAIL_USER}>`,
    to: "youremail@gmail.com", // replace with your actual Gmail
    subject: "OTP Test",
    text: "Testing Gmail SMTP connection from NodeMailer",
  },
  (err, info) => {
    if (err) return console.error("❌ Email send failed:", err);
    console.log("✅ Email sent:", info.response);
  }
);