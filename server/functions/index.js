import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import admin from "./firebaseAdmin.js";
import authRoutes from "./routes/auth.js";
import * as functions from "firebase-functions";
import { onRequest } from "firebase-functions/v2/https";




dotenv.config();

const app = express();

// CORS
app.use(cors({ origin: true, credentials: true }));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);

// ---- LOCAL DEVELOPMENT ONLY ----
if (!process.env.FUNCTIONS_EMULATOR) {
    const PORT = process.env.LOCAL_HOST || 3001;
    app.listen(PORT, () => console.log("Local Dev Server:", PORT));
}

// ---- CLOUD FUNCTION EXPORT ----
export const api = onRequest(app);
