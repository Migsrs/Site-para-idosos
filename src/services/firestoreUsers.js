// src/services/firestoreUsers.js
import { db } from "../firebase";
import {
  collection,
  doc,
  setDoc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";

const USERS_COLLECTION = "users";

/**
 * Salva/atualiza o perfil do usuário na coleção "users".
 * Ideal chamar logo após o cadastro (email/senha) ou login com Google.
 *
 * @param {object} user  Objeto do Firebase Auth (cred.user) OU algo com { uid, email, displayName }
 * @param {object} extra Campos extras do formulário (role, cidade, bio, etc.)
 */
export async function saveUserProfile(user = {}, extra = {}) {
  const uid = user.uid ?? extra.uid;
  const email = user.email ?? extra.email;

  if (!uid) {
    throw new Error("saveUserProfile: uid não informado.");
  }
  if (!email) {
    throw new Error("saveUserProfile: email não informado.");
  }

  // Referência: /users/{uid}
  const usersRef = collection(db, USERS_COLLECTION);
  const ref = doc(usersRef, uid);

  const now = serverTimestamp();

  const payload = {
    uid,
    email,
    name: user.displayName ?? extra.name ?? "",
    role: extra.role ?? "client",
    city: extra.city ?? "",
    birthDate: extra.birthDate ?? null,
    needs: extra.needs ?? "",
    mainCaregiver: extra.mainCaregiver ?? "",
    bio: extra.bio ?? "",
    createdAt: extra.createdAt ?? now,
    updatedAt: now,
  };

  // merge:true garante que você pode chamar de novo e só atualizar campos
  await setDoc(ref, payload, { merge: true });
}

/**
 * Lista todos os usuários da coleção "users".
 * Use apenas em telas de administração ou para fins acadêmicos.
 */
export async function listAllUsers() {
  const usersRef = collection(db, USERS_COLLECTION);
  const snap = await getDocs(usersRef);

  return snap.docs.map((d) => ({
    id: d.id, // mesmo que uid
    ...d.data(),
  }));
}
