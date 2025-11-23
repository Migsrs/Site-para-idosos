// src/hooks/useSession.js
import { useState } from "react";
import { LS_KEYS, readLS, writeLS } from "../utils/storage";

export function useSession() {
  const [session, setSession] = useState(() => readLS(LS_KEYS.session, null));
  const save = (s) => {
    setSession(s);
    writeLS(LS_KEYS.session, s);
  };
  const logout = () => save(null);
  return { session, save, logout };
}
