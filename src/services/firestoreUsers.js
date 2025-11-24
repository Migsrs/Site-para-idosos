// src/services/firestoreUsers.js
import {
  collection,
  doc,
  setDoc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

/**
 * Salva/atualiza o perfil do usuário na coleção "users".
 * Ideal chamar logo após o cadastro ou login (Google).
 *
 * @param {object} user - objeto do Firebase Auth OU do seu formulário
 * @param {object} extra - campos extras (role, cidade, bio, etc.)
 */
export async function saveUserProfile(user, extra = {}) {
  const uid = user.uid || extra.uid;

  if (!uid) {
    throw new Error("saveUserProfile: uid não informado.");
  }

  const usersRef = collection(db, "users");
  const ref = doc(usersRef, uid);

  const payload = {
    uid,
    email: user.email,
    name: user.displayName || extra.name || "",
    role: extra.role || "client",
    city: extra.city || "",
    birthDate: extra.birthDate || null,
    needs: extra.needs || "",
    mainCaregiver: extra.mainCaregiver || "",
    bio: extra.bio || "",
    updatedAt: serverTimestamp(),
    createdAt: extra.createdAt || serverTimestamp(),
  };

  await setDoc(ref, payload, { merge: true });
}

/**
 * Lista todos os usuários (email, nome, role, etc.).
 * Use isso apenas em telas "admin" ou para fins acadêmicos.
 */
export async function listAllUsers() {
  const usersRef = collection(db, "users");
  const snap = await getDocs(usersRef);

  return snap.docs.map((d) => ({
    id: d.id, // igual ao uid
    ...d.data(),
  }));
}
