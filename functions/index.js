// --- clean starter index.js ---
const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");

admin.initializeApp();

const app = express();

app.use(
    cors({
      origin: [
        "http://localhost:8080",
        "https://joltq2025.web.app",
        "https://joltq2025.firebaseapp.com",
      ],
      methods: ["GET", "POST", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
);
// allow pre-flight checks
app.options("*", cors());
app.use(cors());
// app.use(express.json());

app.post("/api/auth/firebase-login", async (req, res) => {
  try {
    const {token} = req.body;
    const decoded = await admin.auth().verifyIdToken(token);
    res.json({user: decoded, message: "Token verified ✅"});
  } catch (err) {
    res.status(401).json({error: err.message});
  }
});

exports.api = functions.https.onRequest(app);
