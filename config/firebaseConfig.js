// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAylLvgrdmerQFuKgsOFjEG9ylmEQewDbg",
  authDomain: "mobifix-4a6b9.firebaseapp.com",
  projectId: "mobifix-4a6b9",
  storageBucket: "mobifix-4a6b9.firebasestorage.app",
  messagingSenderId: "745305028052",
  appId: "1:745305028052:web:d4c2b451fae0b314c25241",
  measurementId: "G-40BJHYXH0Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };