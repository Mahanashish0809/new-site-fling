import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// ✅ Enable CORS for all origins (add this before routes)
app.use(cors({
  origin: "*",  // allow all origins for testing
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// ✅ Enable JSON body parsing
app.use(express.json());

// --- Example route ---
app.get("/", (req, res) => {
  res.send("Server is reachable ✅");
});

// --- Your existing routes ---
import authRoutes from "./routes/auth.js";
app.use("/api/auth", authRoutes);

// --- Start server ---
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
