import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

// Your web app's Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Conditional Analytics Initialization
let analytics = null;
export const initAnalytics = () => {
  if (typeof window !== 'undefined' && !analytics) {
    const consent = localStorage.getItem('luqmango_cookie_consent');
    if (consent === 'true') {
      import('firebase/analytics').then(({ getAnalytics }) => {
        analytics = getAnalytics(app);
      });
    }
  }
  return analytics;
};

// Initialize Cloud Firestore
export const db = getFirestore(app);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Firebase Storage
export const storage = getStorage(app);

// Initialize Firebase Functions with explicit region
export const functions = getFunctions(app, 'us-central1');

// Debug Logger for environment verification
if (typeof window !== 'undefined') {
  console.log(`[LuqmanGo] Running in ${import.meta.env.MODE} mode`);
  if (import.meta.env.MODE === 'development') {
    const host = window.location.hostname;
    connectFunctionsEmulator(functions, host, 5001);
    console.log(`[LuqmanGo] Connected to local Functions Emulator at ${host}:5001`);
  }
}
