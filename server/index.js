import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import admin from "./firebaseAdmin.js";

dotenv.config();

const app = express();

// Enable CORS for all origins (development mode)
app.use(cors({
  origin: true,  // Allow all origins for development
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

// Enable JSON body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// --- Auth routes (handles all /api/auth/* endpoints) ---
import authRoutes from "./routes/auth.js";
app.use("/api/auth", authRoutes);

// --- Start server ---
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
import scrapeRoutes from "./routes/scrape.js";
app.use("/api/scrape", scrapeRoutes);

