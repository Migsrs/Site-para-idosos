// src/firebase.js
// Lembre de instalar antes: npm install firebase

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD8nF-q4cESYCMAPBoSkY5wH5sakVedudw",
  authDomain: "vinculum-91685.firebaseapp.com",
  projectId: "vinculum-91685",
  storageBucket: "vinculum-91685.firebasestorage.app",
  messagingSenderId: "738135002732",
  appId: "1:738135002732:web:17bd5a99fd8c28a4061249",
  measurementId:"G-J3G20SXQJ9"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Função helper para login com Google
export async function signInWithGoogle() {
  const result = await signInWithPopup(auth, provider);
  return result.user; // retorna só o user (email, displayName, photoURL, etc.)
}
