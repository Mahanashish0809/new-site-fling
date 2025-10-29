import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import admin from "firebase-admin";

dotenv.config();

const app = express();

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
admin.initializeApp({
  credential: admin.credential.cert({
    ...serviceAccount,
    private_key: serviceAccount.private_key.replace(/\\n/g, '\n')
  }),
}); 

// ✅ Enable CORS for all origins (add this before routes)
app.use(cors({
  origin: [
    "https://joltq2025.web.app",        // your Firebase Hosting domain
    "https://joltq2025.firebaseapp.com",// Firebase default domain
    "http://localhost:8080"            // local dev
  ],  // allow all origins for testing
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// ✅ Enable JSON body parsing
app.use(express.json());

// --- Example route ---
app.post("/api/auth/firebase-login", async (req, res) => {
  try {
    const { token } = req.body;
    const decoded = await admin.auth().verifyIdToken(token);
    res.json({ user: decoded, message: "Token verified" });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

// --- Your existing routes ---
import authRoutes from "./routes/auth.js";
app.use("/api/auth", authRoutes);

// --- Start server ---
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
