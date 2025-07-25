// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your Firebase Config (from Project Settings -> SDK Setup)
const firebaseConfig = {
    apiKey: "AIzaSyAucMpD_1fYz82A7gQHLcOKU7JbD1xQhqM",
    authDomain: "ai-knowledge-hub-9da98.firebaseapp.com",
    projectId: "ai-knowledge-hub-9da98",
    storageBucket: "ai-knowledge-hub-9da98.appspot.com",
    messagingSenderId: "185611692779",
    appId: "1:185611692779:web:b3dde85d60b1aa8733acae",
    measurementId: "G-4MYECBK2EB"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
