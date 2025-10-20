import "./index.css";
import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut,
  Plus,
  Stethoscope,
  UserPlus,
  LogIn,
  Search,
  Heart,
  Menu,
  Phone,
  Mail,
  MapPin,
  Shield,
  BadgeCheck,
  Home,
  User,
  MessageCircle,
  Star,
} from "lucide-react";

/* =================== Home Page =================== */
function HomePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 pb-24 pt-0 md:pb-8">
      <HeroSection />
      <div className="-mt-6">
        <SearchBar />
        <CategoryChips />
        <PromoCarousel />
        <QuickTiles />
      </div>
    </div>
  );
}

/*
  Vinculum — MVP estilo iFood para contratação de assistentes oncológicos
  Visual mobile-first e amigável
*/

// =================== Utilidades LocalStorage ===================
const LS_KEYS = {
  users: "vinculum_users",
  session: "vinculum_session",
  services: "vinculum_services",
  contacts: "vinculum_contacts",
};

function readLS(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
function writeLS(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// =================== Seeds ===================
const seedServices = [
  {
    id: crypto.randomUUID(),
    title: "Acompanhamento Domiciliar",
    description:
      "Cuidados diários, medicação, orientação à família e acompanhamento de consultas.",
    hourlyPrice: 120,
    remote: false,
    location: "São Paulo - SP",
    tags: ["Domicílio", "Cuidados", "Acompanhamento"],
    ownerEmail: "ana@nurse.com",
    ownerName: "Ana Souza",
    rating: 4.9,
    cover: "https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: crypto.randomUUID(),
    title: "Teleassistência em Quimioterapia",
    description:
      "Monitoramento remoto de sintomas, orientação sobre efeitos colaterais e triagem.",
    hourlyPrice: 90,
    remote: true,
    location: "Remoto",
    tags: ["Teleassistência", "Quimioterapia", "Monitoramento"],
    ownerEmail: "carlos@onco.com",
    ownerName: "Carlos Ferreira",
    rating: 4.7,
    cover: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=1200&auto=format&fit=crop",
  },
];

// =================== Sessão ===================
function useSession() {
  const [session, setSession] = useState(() => readLS(LS_KEYS.session, null));
  const save = (s) => {
    setSession(s);
    writeLS(LS_KEYS.session, s);
  };
  const logout = () => save(null);
  return { session, save, logout };
}

// =================== UI Básica ===================
function Button({ as: As = "button", className = "", children, ...props }) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2 shadow-sm transition hover:shadow-md active:scale-[.99] disabled:opacity-60 bg-amber-600 text-white";
  return (
    <As className={`${base} ${className}`} {...props}>
      {children}
    </As>
  );
}
function GhostButton({ as: As = "button", className = "", children, ...props }) {
  const base =
    "inline-flex items-center gap-2 rounded-2xl px-3 py-2 transition hover:bg-gray-100 text-gray-800";
  return (
    <As className={`${base} ${className}`} {...props}>
      {children}
    </As>
  );
}
function Input({ className = "", ...props }) {
  const base =
    "w-full rounded-full border border-gray-300 bg-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500/20";
  return <input className={`${base} ${className}`} {...props} />;
}
function Textarea({ className = "", ...props }) {
  const base =
    "w-full rounded-2xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500/20 min-h-[120px]";
  return <textarea className={`${base} ${className}`} {...props} />;
}
function Card({ className = "", children }) {
  return (
    <div className={`rounded-3xl border border-gray-200 bg-white p-5 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

// =================== Profile Menu (com animação) ===================
function ProfileMenu({ session, onLogout }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout?.();
    localStorage.removeItem("vinculum_session");
    navigate("/login");
    setOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".profile-menu")) setOpen(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="relative profile-menu">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-2xl bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition"
      >
        <User className="h-4 w-4 text-amber-600" />
        {session.name?.split(" ")[0] || session.email}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -5 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-52 rounded-2xl border border-gray-200 bg-white py-2 shadow-xl z-50 origin-top-right"
          >
            <div className="px-4 pb-2 text-xs text-gray-500 border-b border-gray-100">
              Logado como<br />
              <span className="text-gray-800 font-medium">{session.name || session.email}</span>
            </div>

            <Link
              to="/account"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 transition"
            >
              <User className="h-4 w-4 text-amber-600" /> Minha conta
            </Link>

            <button
              onClick={() => alert("Em breve: configurações")}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 transition"
            >
              <SettingsIcon className="h-4 w-4 text-amber-600" /> Configurações
            </button>

            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
            >
              <LogOut className="h-4 w-4" /> Sair
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SettingsIcon(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3"></circle>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06A1.65 1.65 0 0 0 15 19.4a1.65 1.65 0 0 0-1.5.9l-.1.17a2 2 0 0 1-3.8 0l-.1-.17a1.65 1.65 0 0 0-1.5-.9 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-.9-1.5l-.17-.1a2 2 0 0 1 0-3.8l.17-.1A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1.5-.9l.1-.17a2 2 0 0 1 3.8 0l.1.17a1.65 1.65 0 0 0 1.5.9 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9c.36.26.6.67.9 1.5l.17.1a2 2 0 0 1 0 3.8l-.17.1a1.65 1.65 0 0 0-.9 1.5z"></path>
    </svg>
  );
}

// =================== AppBar ===================
function AppBar({ session }) {
  return (
    <div className="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <Heart className="h-6 w-6 text-amber-600" />
          <div className="leading-tight">
            <div className="text-xs text-gray-500">Localização</div>
            <div className="flex items-center gap-1 text-sm font-semibold">
              <MapPin className="h-4 w-4" /> {session?.city || "Brasil"}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {session ? (
            <ProfileMenu session={session} onLogout={() => window.dispatchEvent(new Event("logout"))} />
          ) : (
            <Link to="/login"><GhostButton><LogIn className="h-4 w-4"/> Entrar</GhostButton></Link>
          )}
        </div>
      </div>
    </div>
  );
}

function BottomTabs({ session }) {
  const loc = useLocation();
  const is = (p) => loc.pathname.startsWith(p);
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 backdrop-blur md:hidden">
      <div className="mx-auto grid max-w-5xl grid-cols-3 px-2 py-2 text-xs">
        <TabLink to="/services" label="Início" icon={Home} active={is("/services") || loc.pathname === "/"} />
        <TabLink to="/contacts" label="Contatos" icon={MessageCircle} active={is("/contacts")} />
        <TabLink to={session ? "/account" : "/login"} label={session ? "Conta" : "Entrar"} icon={User} active={is("/account") || is("/login")} />
      </div>
    </nav>
  );
}
function TabLink({ to, label, icon: Icon, active }) {
  return (
    <Link to={to} className={`flex flex-col items-center rounded-xl px-3 py-1 ${active ? "text-amber-600" : "text-gray-600"}`}>
      <Icon className="h-6 w-6" />
      <span className="mt-1">{label}</span>
    </Link>
  );
}

// =================== Páginas ===================
function HeroSection() {
  return (
    <div className="relative mb-6 overflow-hidden rounded-3xl">
      <img src="img/cuidador.jpg" alt="Cuidados" className="h-60 w-full object-cover md:h-72"/>
      <div className="absolute inset-0 bg-black/40"/>
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="max-w-xl rounded-2xl bg-black/40 p-5 text-center text-white shadow-lg backdrop-blur">
          <div className="text-2xl font-bold">Bem-vindo ao Vinculum</div>
          <p className="mt-2 text-sm opacity-90">Conectamos famílias a assistentes oncológicos de confiança — no domicílio ou por teleassistência.</p>
          <Link to="/services" className="mt-4 inline-flex rounded-full bg-amber-500 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-amber-600">Conheça nossos serviços</Link>
        </div>
      </div>
    </div>
  );
}

function SearchBar({ value, onChange }) {
  return (
    <div className="mb-4">
      <div className="relative">
        <Input className="pl-11" placeholder="Buscar serviços, tags, cidade…" value={value} onChange={onChange} />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
      </div>
    </div>
  );
}

function PromoCarousel() {
  return (
    <div className="mb-4">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500 to-yellow-500 p-5 text-white shadow">
        <div className="text-sm opacity-90">Descontos de lançamento</div>
        <div className="mt-1 text-2xl font-bold leading-tight">Assistência oncológica com 20% OFF</div>
        <div className="mt-2 text-sm opacity-90">Somente esta semana • Profissionais verificados</div>
      </div>
    </div>
  );
}

function CategoryChips() {
  const chips = ["Domicílio", "Teleassistência", "Quimioterapia", "Cuidados", "Paliativo", "Orientação"];
  return (
    <div className="no-scrollbar mb-4 flex gap-2 overflow-x-auto pb-1">
      {chips.map((c) => (
        <button key={c} className="whitespace-nowrap rounded-full border border-gray-200 bg-white px-4 py-2 text-sm shadow-sm">{c}</button>
      ))}
    </div>
  );
}

function QuickTiles() {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      <Tile icon={Shield} title="Verificados" subtitle="+ qualidade" />
      <Tile icon={BadgeCheck} title="Bem avaliados" subtitle="> 4.5" />
      <Tile icon={MapPin} title="Perto de você" subtitle="local" />
      <Tile icon={Phone} title="Teleatendimento" subtitle="remoto" />
    </div>
  );
}
function Tile({ icon: Icon, title, subtitle }) {
  return (
    <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-gray-200">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-amber-50 p-2 text-amber-600"><Icon className="h-6 w-6"/></div>
        <div>
          <div className="text-sm font-semibold">{title}</div>
          <div className="text-xs text-gray-500">{subtitle}</div>
        </div>
      </div>
    </div>
  );
}

// ---------- Auth ----------
function Login({ onLogin }) {
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

  return (
    <div className="mx-auto max-w-md px-4 pb-24 pt-6 md:pb-8">
      <h2 className="mb-2 text-2xl font-bold">Entrar</h2>
      <Card>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-sm text-gray-700">Email</label>
            <Input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required/>
          </div>
          <div>
            <label className="text-sm text-gray-700">Senha</label>
            <Input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required/>
          </div>
          {error && <p className="text-sm text-amber-600">{error}</p>}
          <Button className="w-full">Entrar</Button>
          <div className="text-center text-sm text-gray-600">Não tem conta? <Link className="text-amber-700 underline" to="/register">Cadastre-se</Link></div>
        </form>
      </Card>
    </div>
  );
}

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "client" });
  const [error, setError] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    const users = readLS(LS_KEYS.users, []);
    if (users.some((u) => u.email === form.email)) return setError("Email já cadastrado.");
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
          <div>
            <label className="text-sm text-gray-700">Nome</label>
            <Input value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} required/>
          </div>
          <div>
            <label className="text-sm text-gray-700">Email</label>
            <Input type="email" value={form.email} onChange={(e)=>setForm({...form, email:e.target.value})} required/>
          </div>
          <div>
            <label className="text-sm text-gray-700">Senha</label>
            <Input type="password" value={form.password} onChange={(e)=>setForm({...form, password:e.target.value})} required/>
          </div>
          <div>
            <label className="text-sm text-gray-700">Perfil</label>
            <div className="mt-2 flex gap-3">
              <label className="inline-flex items-center gap-2">
                <input type="radio" name="role" value="client" checked={form.role==="client"} onChange={()=>setForm({...form, role:"client"})} />
                Cliente
              </label>
              <label className="inline-flex items-center gap-2">
                <input type="radio" name="role" value="provider" checked={form.role==="provider"} onChange={()=>setForm({...form, role:"provider"})} />
                Prestador
              </label>
            </div>
          </div>
          {error && <p className="text-sm text-amber-600">{error}</p>}
          <Button className="w-full">Cadastrar</Button>
        </form>
      </Card>
    </div>
  );
}

// ---------- Serviços ----------
function Services({ session }) {
  const [query, setQuery] = useState("");
  const [services, setServices] = useState(() => readLS(LS_KEYS.services, null) ?? seedServices);

  useEffect(() => {
    const current = readLS(LS_KEYS.services, null);
    if (!current) writeLS(LS_KEYS.services, services);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return services;
    return services.filter((s) =>
      [s.title, s.description, s.location, ...(s.tags || [])].join(" ").toLowerCase().includes(q)
    );
  }, [query, services]);

  const isProvider = session?.role === "provider";

  return (
    <div className="mx-auto max-w-5xl px-4 pb-28 pt-4 md:pb-8">
      <SearchBar value={query} onChange={(e)=>setQuery(e.target.value)} />
      <PromoCarousel/>

      {filtered.length === 0 ? (
        <Card>
          <p className="text-gray-600">Nenhum serviço encontrado para sua busca.</p>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((s) => (
            <ServiceCard key={s.id} service={s} />
          ))}
        </div>
      )}

      {isProvider && (
        <Link to="/add-service" className="fixed bottom-20 right-4 md:right-8">
          <button className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-600 text-white shadow-lg transition hover:scale-105">
            <Plus className="h-7 w-7" />
          </button>
        </Link>
      )}
    </div>
  );
}

function ServiceCard({ service }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
      {service.cover && (
        <div className="h-36 w-full bg-gray-100 md:h-44" style={{backgroundImage:`url(${service.cover})`, backgroundSize:"cover", backgroundPosition:"center"}}/>
      )}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold leading-tight">{service.title}</h3>
            <div className="mt-1 text-sm text-gray-600">por {service.ownerName}</div>
          </div>
          <div className="rounded-xl bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-700">R$ {service.hourlyPrice}/h</div>
        </div>
        <p className="mt-3 line-clamp-3 text-gray-700">{service.description}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-gray-600">
          {service.remote ? (
            <span className="rounded-xl bg-gray-100 px-2 py-1">Remoto</span>
          ) : (
            <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4"/> {service.location}</span>
          )}
          {service.tags?.slice(0,3).map((t) => (
            <span key={t} className="rounded-xl bg-gray-100 px-2 py-1">#{t}</span>
          ))}
          <span className="ml-auto inline-flex items-center gap-1 text-amber-600"><Star className="h-4 w-4"/>{service.rating?.toFixed(1) ?? "-"}</span>
        </div>
        <div className="mt-4">
          <Link to="/contacts"><Button className="w-full">Entrar em contato</Button></Link>
        </div>
      </div>
    </div>
  );
}

// ---------- Adicionar serviço ----------
function AddService({ session }) {
  const navigate = useNavigate();
  const isProvider = session?.role === "provider";
  const [form, setForm] = useState({
    title: "",
    description: "",
    hourlyPrice: "",
    remote: false,
    location: "",
    tags: "",
    cover: "",
  });

  useEffect(() => { if (!isProvider) navigate("/services"); }, [isProvider, navigate]);

  const onSubmit = (e) => {
    e.preventDefault();
    const list = readLS(LS_KEYS.services, seedServices);
    const payload = {
      id: crypto.randomUUID(),
      title: form.title.trim(),
      description: form.description.trim(),
      hourlyPrice: Number(form.hourlyPrice || 0),
      remote: !!form.remote,
      location: form.remote ? "Remoto" : form.location.trim(),
      tags: form.tags.split(",").map((t)=>t.trim()).filter(Boolean),
      ownerEmail: session?.email,
      ownerName: session?.name || session?.email,
      rating: 5,
      cover: form.cover.trim(),
    };
    writeLS(LS_KEYS.services, [payload, ...list]);
    alert("Serviço adicionado!");
    navigate("/services");
  };

  return (
    <div className="mx-auto max-w-2xl px-4 pb-24 pt-4 md:pb-8">
      <h2 className="mb-2 text-2xl font-bold">Adicionar serviço</h2>
      <Card>
        <form onSubmit={onSubmit} className="grid gap-4">
          <div>
            <label className="text-sm text-gray-700">Título</label>
            <Input value={form.title} onChange={(e)=>setForm({...form, title:e.target.value})} required/>
          </div>
          <div>
            <label className="text-sm text-gray-700">Descrição</label>
            <Textarea value={form.description} onChange={(e)=>setForm({...form, description:e.target.value})} required/>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm text-gray-700">Preço por hora (R$)</label>
              <Input type="number" min="0" step="1" value={form.hourlyPrice} onChange={(e)=>setForm({...form, hourlyPrice:e.target.value})} required/>
            </div>
            <div className="flex items-end gap-2">
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" checked={form.remote} onChange={(e)=>setForm({...form, remote:e.target.checked})}/>
                Atuação remota
              </label>
            </div>
          </div>
          {!form.remote && (
            <div>
              <label className="text-sm text-gray-700">Localização</label>
              <Input placeholder="Cidade - UF" value={form.location} onChange={(e)=>setForm({...form, location:e.target.value})}/>
            </div>
          )}
          <div>
            <label className="text-sm text-gray-700">Tags (separadas por vírgula)</label>
            <Input placeholder="ex.: quimioterapia, cuidados, domiciliar" value={form.tags} onChange={(e)=>setForm({...form, tags:e.target.value})}/>
          </div>
          <div>
            <label className="text-sm text-gray-700">Imagem de capa (URL opcional)</label>
            <Input placeholder="https://..." value={form.cover} onChange={(e)=>setForm({...form, cover:e.target.value})}/>
          </div>
          <div className="flex justify-end">
            <Button type="submit"><Plus className="h-4 w-4"/> Publicar</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

// ---------- Contatos ----------
function Contacts() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const onSubmit = (e) => {
    e.preventDefault();
    const list = readLS(LS_KEYS.contacts, []);
    writeLS(LS_KEYS.contacts, [...list, { id: crypto.randomUUID(), ...form, createdAt: new Date().toISOString() }]);
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
              <Input value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} required/>
            </div>
            <div>
              <label className="text-sm text-gray-700">Email</label>
              <Input type="email" value={form.email} onChange={(e)=>setForm({...form, email:e.target.value})} required/>
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-700">Mensagem</label>
            <Textarea value={form.message} onChange={(e)=>setForm({...form, message:e.target.value})} required/>
          </div>
          <div className="flex items-center justify-between">
            {sent && <span className="text-sm text-emerald-700">Mensagem enviada! Responderemos em breve.</span>}
            <Button type="submit"><Mail className="h-4 w-4"/> Enviar</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

// ---------- Conta (simples) ----------
function Account({ session, onLogout }) {
  if (!session) return <Navigate to="/login" replace/>;
  return (
    <div className="mx-auto max-w-2xl px-4 pb-28 pt-4 md:pb-8">
      <h2 className="mb-2 text-2xl font-bold">Minha conta</h2>
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-500">Logado como</div>
            <div className="text-lg font-semibold">{session.name || session.email}</div>
            <div className="text-sm text-gray-600">Perfil: {session.role === 'provider' ? 'Prestador' : 'Cliente'}</div>
          </div>
          <Button onClick={onLogout} className="bg-gray-900">Sair</Button>
        </div>
      </Card>
    </div>
  );
}

// ---------- Layout ----------
function PageLayout({ session, onLogout, children }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 pb-16 md:pb-0">
      <AppBar session={session} />

      {/* Botão de voltar para a página principal */}
      <Link
        to="/"
        className="fixed top-4 left-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-amber-600 text-white shadow-lg transition hover:scale-110 hover:bg-amber-700"
      >
        <Home className="h-5 w-5" />
      </Link>

      <main>{children}</main>
      <BottomTabs session={session} />
      <footer className="hidden border-t border-gray-200 bg-white md:block">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-amber-600" /> Vinculum © {new Date().getFullYear()}
          </div>
          <div>Este é um MVP de demonstração. Não substitui orientação médica.</div>
        </div>
      </footer>
    </div>
  );
}


function PrivateRoute({ children, role, session }) {
  if (!session) return <Navigate to="/login" replace/>;
  if (role && session.role !== role) return <Navigate to="/services" replace/>;
  return children;
}

function App() {
  const { session, save, logout } = useSession();

  useEffect(() => {
    const svc = readLS(LS_KEYS.services, null);
    if (!svc) writeLS(LS_KEYS.services, seedServices);
    const users = readLS(LS_KEYS.users, []);
    if (users.length === 0) {
      writeLS(LS_KEYS.users, [
        { name: "Ana Souza", email: "ana@nurse.com", password: "123", role: "provider" },
        { name: "Carlos Ferreira", email: "carlos@onco.com", password: "123", role: "provider" },
        { name: "Paciente Demo", email: "paciente@demo.com", password: "123", role: "client" },
      ]);
    }
  }, []);

  return (
    <BrowserRouter>
      <PageLayout session={session} onLogout={logout}>
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/login" element={<Login onLogin={save} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/services" element={<Services session={session}/>} />
          <Route path="/add-service" element={
            <PrivateRoute role="provider" session={session}>
              <AddService session={session} />
            </PrivateRoute>
          } />
          <Route path="/contacts" element={<Contacts/>} />
          <Route path="/account" element={<Account session={session} onLogout={logout}/>} />
          <Route path="*" element={<Navigate to="/" replace/>} />
        </Routes>
      </PageLayout>
    </BrowserRouter>
  );
}

// Tailwind base (fonte)
const style = document.createElement("style");
style.innerHTML = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  :root { font-family: Inter, ui-sans-serif, system-ui, -apple-system; }
  body { margin: 0; color: #0f172a; }
  .no-scrollbar::-webkit-scrollbar { display: none; }
  .line-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
`;
document.head.appendChild(style);

const root = createRoot(document.getElementById("root"));
root.render(<App />);
