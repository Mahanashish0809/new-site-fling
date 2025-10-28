// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBSc__uL1eBA5iH-bdkaf84wIRCseE60VE",
  authDomain: "joltq2025.firebaseapp.com",
  projectId: "joltq2025",
  storageBucket: "joltq2025.firebasestorage.app",
  messagingSenderId: "915503308743",
  appId: "1:915503308743:web:32fe4ce32d0ee59fdec3e2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
