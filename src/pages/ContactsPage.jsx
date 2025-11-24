// src/pages/ContactsPage.jsx
import { db, auth, signInWithGoogle } from "./firebaseConfig";
import React, { useState } from "react";
import { LS_KEYS, readLS, writeLS } from "../utils/storage";
import { Button, Card, Input, Textarea } from "../components/ui";
import { Mail } from "lucide-react";

export function Contacts() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    const list = readLS(LS_KEYS.contacts, []);
    writeLS(LS_KEYS.contacts, [
      { id: crypto.randomUUID(), ...form, createdAt: new Date().toISOString() },
      ...list,
    ]);
    setSent(true);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="mx-auto max-w-2xl px-4 pb-28 pt-4 md:pb-8">
      <h2 className="mb-2 text-2xl font-bold">Fale conosco</h2>
      <Card>
        <form onSubmit={onSubmit} className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm text-gray-700">Nome</label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-sm text-gray-700">Email</label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-700">Mensagem</label>
            <Textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            {sent && (
              <span className="text-sm text-emerald-700">
                Mensagem enviada! Responderemos em breve.
              </span>
            )}
            <Button type="submit">
              <Mail className="h-4 w-4 mr-1" /> Enviar
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
