// src/firebaseConfig.ts
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBMzDSl5VAtGW57IX_LLtrpc_CPGRQTa9k",
  authDomain: "lostandnotfound-122b2.firebaseapp.com",
  projectId: "lostandnotfound-122b2",
  storageBucket: "lostandnotfound-122b2.firebasestorage.app",
  messagingSenderId: "52202469688",
  appId: "1:52202469688:web:ab744a239765e80519a9cd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
