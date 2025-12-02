import admin from "firebase-admin";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

let serviceAccount;

// Try parsing JSON from env var if provided (useful for CI / hosting envs)
if (process.env.FIRE_SERVICE_ACCOUNT) {
  try {
    serviceAccount = JSON.parse(process.env.FIRE_SERVICE_ACCOUNT);
    if (serviceAccount && serviceAccount.private_key) {
      // replace key//
      serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");
    }
  } catch (err) {
    console.error("Failed to parse FIRE_SERVICE_ACCOUNT environment variable:", err);
  }
}

// Fallback: try reading a file path provided by env var
if (!serviceAccount && process.env.FIRE_SERVICE_ACCOUNT_PATH) {
  try {
    const p = path.resolve(process.cwd(), process.env.FIRE_SERVICE_ACCOUNT_PATH);
    const raw = fs.readFileSync(p, "utf8");
    serviceAccount = JSON.parse(raw);
  } catch (err) {
    console.error("Failed to read service account file at FIRE_SERVICE_ACCOUNT_PATH:", err);
  }
}

// Initialize admin only once and prefer explicit serviceAccount. If none found,
// allow firebase-admin to fallback to GOOGLE_APPLICATION_CREDENTIALS if set.
if (!admin.apps.length) {
  if (serviceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("Firebase Admin initialized using service account.");
  } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    admin.initializeApp();
    console.log("Firebase Admin initialized using GOOGLE_APPLICATION_CREDENTIALS.");
  } else {
    console.warn(
      "Firebase Admin not initialized: no service account found. Set FIRE_SERVICE_ACCOUNT or GOOGLE_APPLICATION_CREDENTIALS."
    );
  }
}

export default admin;
