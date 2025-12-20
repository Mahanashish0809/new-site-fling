import dotenv from "dotenv";
dotenv.config(); // Must be called BEFORE importing modules that use env vars

import express from "express";
import cors from "cors";
import admin from "./firebaseAdmin.js";
import authRoutes from "./routes/auth.js";
import * as functions from "firebase-functions";
import { onRequest } from "firebase-functions/v2/https";
import scrapeRoutes from "./routes/scrape.js";
import jobsRoutes from "./routes/jobs.js";

const app = express();

// CORS
app.use(cors({ origin: true, credentials: true }));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/scrape", scrapeRoutes);
app.use("/api/jobs", jobsRoutes);

// ---- LOCAL DEVELOPMENT ONLY ----
if (!process.env.FUNCTIONS_EMULATOR) {
    const PORT = process.env.LOCAL_HOST || 3001;
    app.listen(PORT, () => console.log("Local Dev Server:", PORT));
}

// ---- CLOUD FUNCTION EXPORT ----
export const api = onRequest(app);
