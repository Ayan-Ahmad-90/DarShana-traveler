import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo_key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "darshana-travel.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "darshana-travel",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "darshana-travel.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "000000000000",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:000000000000:web:000000000000"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
