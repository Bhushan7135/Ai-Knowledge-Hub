// firebase.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyAucMpD_1fYz82A7gQHLcOKU7JbD1xQhqM",
  authDomain: "ai-knowledge-hub-9da98.firebaseapp.com",
  projectId: "ai-knowledge-hub-9da98",
  storageBucket: "ai-knowledge-hub-9da98.firebasestorage.app",
  messagingSenderId: "185611692779",
  appId: "1:185611692779:web:b3dde85d60b1aa8733acae",
  measurementId: "G-4MYECBK2EB",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

/* ------------------- CHAT FUNCTIONS ------------------- */

// Fetch all chats
export async function fetchChats() {
  const chatRef = collection(db, "chats");
  const snapshot = await getDocs(chatRef);

  let chats = [];
  snapshot.forEach((docSnap) => {
    chats.push({ id: docSnap.id, ...docSnap.data() });
  });
  return chats;
}

// Create new chat
export async function createChat(userId) {
  const chatRef = await addDoc(collection(db, "chats"), {
    userId,
    title: "New Chat",
    messages: [],
    pinned: false,
    lastMessage: "",
    lastUpdated: serverTimestamp(),
  });
  return chatRef.id;
}

// Add message to chat
export async function addMessageToChat(chatId, message) {
  const chatRef = doc(db, "chats", chatId);
  await updateDoc(chatRef, {
    messages: message ? [...(await getChatMessages(chatId)), message] : [],
    lastMessage: message.text,
    lastUpdated: serverTimestamp(),
  });
}

// Get messages of a chat (helper)
async function getChatMessages(chatId) {
  const chatDoc = doc(db, "chats", chatId);
  const snapshot = await (await getDocs(collection(db, "chats"))).docs.find((d) => d.id === chatId);
  return snapshot?.data()?.messages || [];
}

// Rename chat
export async function renameChat(chatId, newTitle) {
  const chatRef = doc(db, "chats", chatId);
  await updateDoc(chatRef, { title: newTitle, lastUpdated: serverTimestamp() });
}

// Delete chat
export async function deleteChat(chatId) {
  const chatRef = doc(db, "chats", chatId);
  await deleteDoc(chatRef);
}

// Pin/Unpin chat
export async function togglePinChat(chatId, isPinned) {
  const chatRef = doc(db, "chats", chatId);
  await updateDoc(chatRef, { pinned: !isPinned });
}
