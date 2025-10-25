import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8081;

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
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running at http://192.168.1.182:${PORT}`);
});
