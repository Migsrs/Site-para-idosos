// src/pages/AuthPages.jsx
import { db, auth, signInWithGoogle } from "./firebaseConfig";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LS_KEYS, readLS, writeLS } from "../utils/storage";
import { Button, Card, Input, Textarea } from "../components/ui";
import { signInWithGoogle } from "../firebase";

// ---------- LOGIN ----------
export function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const users = readLS(LS_KEYS.users, []);
    const user = users.find((u) => u.email === email && u.password === password);
    if (!user) return setError("Credenciais inválidas.");
    onLogin({ email: user.email, name: user.name, role: user.role });
    navigate("/services");
  };

  const handleGoogleLogin = async () => {
    try {
      const fbUser = await signInWithGoogle();
      if (!fbUser?.email) {
        alert("Não foi possível obter o email da sua conta Google.");
        return;
      }

      const users = readLS(LS_KEYS.users, []);
      const existing = users.find((u) => u.email === fbUser.email);

      if (existing) {
        // Já tem cadastro -> entra direto
        onLogin({
          email: existing.email,
          name: existing.name || fbUser.displayName || existing.email,
          role: existing.role,
        });
        navigate("/services");
        return;
      }

      // Novo usuário Google -> salva dados pendentes e manda completar cadastro
      writeLS(LS_KEYS.googlePending, {
        email: fbUser.email,
        name: fbUser.displayName || "",
        avatar: fbUser.photoURL || "",
      });

      navigate("/complete-profile-google");
    } catch (err) {
      console.error(err);
      alert("Erro ao entrar com Google. Verifique a configuração do Firebase.");
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 pb-24 pt-6 md:pb-8">
      <h2 className="mb-2 text-2xl font-bold">Entrar</h2>
      <Card>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-sm text-gray-700">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-sm text-gray-700">Senha</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-sm text-amber-600">{error}</p>}
          <Button className="w-full">Entrar</Button>
          <div className="text-center text-sm text-gray-600">
            Não tem conta?{" "}
            <Link className="text-amber-700 underline" to="/register">
              Cadastre-se
            </Link>
          </div>
        </form>

        {/* Separador */}
        <div className="mt-4">
          <div className="relative my-3">
            <div className="border-t border-gray-200" />
            <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-xs text-gray-400">
              ou
            </span>
          </div>

          {/* Botão Google */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 flex items-center justify-center gap-2"
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt=""
              className="h-5 w-5"
            />
            Entrar com Google
          </button>
        </div>
      </Card>
    </div>
  );
}

// ---------- CADASTRO NORMAL (EMAIL + SENHA) ----------
export function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "client",
    dob: "",
    city: "",
    bio: "",
    avatar: "",
    specialties: "",
    yearsExp: "",
    certifications: "",
    careNeeds: "",
    caregiverContact: "",
  });
  const [error, setError] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    const users = readLS(LS_KEYS.users, []);
    if (users.some((u) => u.email === form.email))
      return setError("Email já cadastrado.");
    const newUsers = [...users, form];
    writeLS(LS_KEYS.users, newUsers);
    alert("Cadastro realizado! Faça login.");
    navigate("/login");
  };

  return (
    <div className="mx-auto max-w-md px-4 pb-24 pt-6 md:pb-8">
      <h2 className="mb-2 text-2xl font-bold">Criar conta</h2>
      <Card>
        <form onSubmit={onSubmit} className="space-y-4">
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

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm text-gray-700">Senha</label>
              <Input
                type="password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="text-sm text-gray-700">Perfil</label>
              <div className="mt-2 flex gap-3">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="radio"
                    name="role"
                    value="client"
                    checked={form.role === "client"}
                    onChange={() => setForm({ ...form, role: "client" })}
                  />
                  Cliente
                </label>
                <label className="inline-flex items-center gap-2">
                  <input
                    type="radio"
                    name="role"
                    value="provider"
                    checked={form.role === "provider"}
                    onChange={() => setForm({ ...form, role: "provider" })}
                  />
                  Prestador
                </label>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm text-gray-700">Data de nascimento</label>
              <Input
                type="date"
                value={form.dob}
                onChange={(e) => setForm({ ...form, dob: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm text-gray-700">Cidade</label>
              <Input
                placeholder="Cidade - UF"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
            </div>
          </div>

          {form.role === "provider" ? (
            <div className="grid gap-4 md:grid-cols-3">
              <div className="md:col-span-3">
                <label className="text-sm text-gray-700">Especialidades</label>
                <Input
                  placeholder="ex.: medicação, prevenção de quedas, demência leve"
                  value={form.specialties}
                  onChange={(e) =>
                    setForm({ ...form, specialties: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-sm text-gray-700">
                  Anos de experiência
                </label>
                <Input
                  type="number"
                  min="0"
                  value={form.yearsExp}
                  onChange={(e) =>
                    setForm({ ...form, yearsExp: e.target.value })
                  }
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm text-gray-700">Certificações</label>
                <Input
                  placeholder="ex.: COREN 12345, Primeiros Socorros"
                  value={form.certifications}
                  onChange={(e) =>
                    setForm({ ...form, certifications: e.target.value })
                  }
                />
              </div>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm text-gray-700">Necessidades</label>
                <Input
                  placeholder="ex.: ajuda com medicação, mobilidade"
                  value={form.careNeeds}
                  onChange={(e) =>
                    setForm({ ...form, careNeeds: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-sm text-gray-700">
                  Cuidador principal (contato)
                </label>
                <Input
                  placeholder="Nome e telefone"
                  value={form.caregiverContact}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      caregiverContact: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-sm text-gray-700">Biografia</label>
            <Textarea
              placeholder="Fale um pouco sobre você…"
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
            />
          </div>

          {error && <p className="text-sm text-amber-600">{error}</p>}
          <Button className="w-full">Cadastrar</Button>
        </form>
      </Card>
    </div>
  );
}

// ---------- COMPLETAR PERFIL APÓS GOOGLE ----------
export function CompleteGoogleProfile({ onProfileSaved }) {
  const navigate = useNavigate();
  const [pending] = useState(() => readLS(LS_KEYS.googlePending, null));
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: pending?.name || "",
    email: pending?.email || "",
    role: "client",
    dob: "",
    city: "",
    bio: "",
    avatar: pending?.avatar || "",
    specialties: "",
    yearsExp: "",
    certifications: "",
    careNeeds: "",
    caregiverContact: "",
  });

  useEffect(() => {
    if (!pending) {
      // Se não tem dados pendentes, volta para login
      navigate("/login", { replace: true });
    }
  }, [pending, navigate]);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!pending?.email) {
      setError("Sessão com Google expirada. Entre novamente.");
      return;
    }

    const users = readLS(LS_KEYS.users, []);
    if (users.some((u) => u.email === pending.email)) {
      setError("Este email já possui cadastro. Use a tela de login.");
      return;
    }

    const newUser = {
      ...form,
      email: pending.email,
      name: form.name || pending.name || pending.email,
      avatar: pending.avatar,
      authProvider: "google",
    };

    writeLS(LS_KEYS.users, [...users, newUser]);
    localStorage.removeItem(LS_KEYS.googlePending);

    onProfileSaved?.({
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
    });

    alert("Cadastro concluído com sucesso!");
    navigate("/services");
  };

  return (
    <div className="mx-auto max-w-md px-4 pb-24 pt-6 md:pb-8">
      <h2 className="mb-2 text-2xl font-bold">Complete seu cadastro</h2>
      <p className="mb-4 text-sm text-gray-600">
        Usamos seu email do Google. Agora só precisamos de alguns dados para
        personalizar sua experiência no Vinculum.
      </p>
      <Card>
        <form onSubmit={onSubmit} className="space-y-4">
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
              <label className="text-sm text-gray-700">Email (Google)</label>
              <Input
                type="email"
                value={form.email}
                disabled
                className="bg-gray-50 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-700">Perfil</label>
            <div className="mt-2 flex gap-3">
              <label className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="role"
                  value="client"
                  checked={form.role === "client"}
                  onChange={() => setForm({ ...form, role: "client" })}
                />
                Cliente
              </label>
              <label className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="role"
                  value="provider"
                  checked={form.role === "provider"}
                  onChange={() => setForm({ ...form, role: "provider" })}
                />
                Prestador
              </label>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm text-gray-700">Data de nascimento</label>
              <Input
                type="date"
                value={form.dob}
                onChange={(e) => setForm({ ...form, dob: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm text-gray-700">Cidade</label>
              <Input
                placeholder="Cidade - UF"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
            </div>
          </div>

          {form.role === "provider" ? (
            <div className="grid gap-4 md:grid-cols-3">
              <div className="md:col-span-3">
                <label className="text-sm text-gray-700">Especialidades</label>
                <Input
                  placeholder="ex.: medicação, prevenção de quedas, demência leve"
                  value={form.specialties}
                  onChange={(e) =>
                    setForm({ ...form, specialties: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-sm text-gray-700">
                  Anos de experiência
                </label>
                <Input
                  type="number"
                  min="0"
                  value={form.yearsExp}
                  onChange={(e) =>
                    setForm({ ...form, yearsExp: e.target.value })
                  }
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm text-gray-700">Certificações</label>
                <Input
                  placeholder="ex.: COREN 12345, Primeiros Socorros"
                  value={form.certifications}
                  onChange={(e) =>
                    setForm({ ...form, certifications: e.target.value })
                  }
                />
              </div>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm text-gray-700">Necessidades</label>
                <Input
                  placeholder="ex.: ajuda com medicação, mobilidade"
                  value={form.careNeeds}
                  onChange={(e) =>
                    setForm({ ...form, careNeeds: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-sm text-gray-700">
                  Cuidador principal (contato)
                </label>
                <Input
                  placeholder="Nome e telefone"
                  value={form.caregiverContact}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      caregiverContact: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-sm text-gray-700">Biografia</label>
            <Textarea
              placeholder="Fale um pouco sobre você…"
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
            />
          </div>

          {error && <p className="text-sm text-amber-600">{error}</p>}
          <Button className="w-full">Concluir cadastro</Button>
        </form>
      </Card>
    </div>
  );
}
