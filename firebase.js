// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCaNUTiyitKI-4rvjI6NC60RmxcEJA9OCk",
  authDomain: "kascoten1.firebaseapp.com",
  projectId: "kascoten1",
  storageBucket: "kascoten1.firebasestorage.app",
  messagingSenderId: "848423451775",
  appId: "1:848423451775:web:d8cd4f7612fc405269534a",
  measurementId: "G-JVD65Q1F3J"
};
//
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);