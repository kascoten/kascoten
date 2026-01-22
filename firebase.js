// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCaNUTiyitKI-4rvjI6NC60RmxcEJA9OCk",
  authDomain: "kascoten1.firebaseapp.com",
  projectId: "kascoten1",
  storageBucket: "kascoten1.firebasestorage.app",
  messagingSenderId: "848423451775",
  appId: "1:848423451775:web:d8cd4f7612fc405269534a",
  measurementId: "G-JVD65Q1F3J"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
// Always show account chooser so users can select an account explicitly
provider.setCustomParameters({ prompt: 'select_account' });
export const db = getFirestore(app);

// Re-export firestore helpers used by your script
export {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  deleteDoc,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  onAuthStateChanged
};