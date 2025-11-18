// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBSc__uL1eBA5iH-bdkaf84wIRCseE60VE",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "joltq2025.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "joltq2025",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "joltq2025.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "915503308743",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:915503308743:web:32fe4ce32d0ee59fdec3e2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});
