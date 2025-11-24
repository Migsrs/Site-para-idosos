// src/firebaseConfig.js (por exemplo)
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD8nF-q4cESYCMAPBoSkY5wH5sakVedudw",
  authDomain: "vinculum-91685.firebaseapp.com",
  projectId: "vinculum-91685",
  storageBucket: "vinculum-91685.firebasestorage.app",
  messagingSenderId: "738135002732",
  appId: "1:738135002732:web:17bd5a99fd8c28a4061249",
  measurementId: "G-J3G20SXQJ9"
};

// ---- Inicializa Firebase (app raiz) ----
const app = initializeApp(firebaseConfig);

// ---- Auth (login / logout) ----
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// ---- Firestore (banco de dados) ----
export const db = getFirestore(app);

// ---- Helper para login com Google ----
export async function signInWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user; // email, displayName, photoURL, uid, etc.
}
