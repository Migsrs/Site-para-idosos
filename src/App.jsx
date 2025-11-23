// src/App.jsx
import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { PageLayout } from "./components/layout";

import HomePage from "./pages/HomePage";
import {
  Login,
  Register,
  CompleteGoogleProfile,
} from "./pages/AuthPages";
import {
  Services,
  AddService,
  EditService,
} from "./pages/ServicesPages";
import { Contacts } from "./pages/ContactsPage";
import {
  Account,
  ProfilePage,
  PublicProfile,
} from "./pages/ProfilePages";

import { LS_KEYS, readLS, writeLS } from "./utils/storage";
import { seedServices } from "./utils/seeds";

// ---------------------- Hook de sessão ----------------------
function useSession() {
  const [session, setSession] = useState(() =>
    readLS(LS_KEYS.session, null)
  );

  const save = (s) => {
    setSession(s);
    writeLS(LS_KEYS.session, s);
  };

  const logout = () => save(null);

  return { session, save, logout };
}

// ---------------------- Rota privada ------------------------
function PrivateRoute({ children, role, session }) {
  if (!session) return <Navigate to="/login" replace />;
  if (role && session.role !== role) {
    return <Navigate to="/services" replace />;
  }
  return children;
}

// ---------------------- App principal -----------------------
function App() {
  const { session, save, logout } = useSession();

  // Seeds iniciais de serviços e usuários demo
  useEffect(() => {
    const svc = readLS(LS_KEYS.services, null);
    if (!svc) writeLS(LS_KEYS.services, seedServices);

    const users = readLS(LS_KEYS.users, []);
    if (users.length === 0) {
      writeLS(LS_KEYS.users, [
        {
          name: "Ana Souza",
          email: "ana@nurse.com",
          password: "123",
          role: "provider",
          city: "São Paulo - SP",
          specialties: "Cuidados gerais, prevenção de quedas, medicação",
          yearsExp: 8,
          certifications: "COREN 123456, Primeiros Socorros",
          bio: "Cuidadora com experiência em idosos frágeis e pós-operatório.",
        },
        {
          name: "Carlos Ferreira",
          email: "carlos@onco.com",
          password: "123",
          role: "provider",
          city: "Campinas - SP",
          specialties: "Demência leve, rotina de medicação",
          yearsExp: 5,
          certifications: "Enfermagem, Suporte Básico de Vida",
          bio: "Focado em promover autonomia e segurança no dia a dia.",
        },
        {
          name: "Paciente Demo",
          email: "paciente@demo.com",
          password: "123",
          role: "client",
          city: "Rio de Janeiro - RJ",
          careNeeds: "Ajuda com mobilidade e medicação",
          caregiverContact: "Maria (filha) - (21) 99999-0000",
          bio: "Perfil de demonstração para testes da plataforma Vinculum.",
        },
      ]);
    }
  }, []);

  return (
    <BrowserRouter>
      <PageLayout session={session} onLogout={logout}>
        <Routes>
          {/* Home */}
          <Route path="/" element={<HomePage />} />

          {/* Autenticação */}
          <Route path="/login" element={<Login onLogin={save} />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/complete-profile-google"
            element={<CompleteGoogleProfile onProfileSaved={save} />}
          />

          {/* Serviços */}
          <Route
            path="/services"
            element={<Services session={session} />}
          />
          <Route
            path="/add-service"
            element={
              <PrivateRoute role="provider" session={session}>
                <AddService session={session} />
              </PrivateRoute>
            }
          />
          <Route
            path="/edit-service/:id"
            element={
              <PrivateRoute role="provider" session={session}>
                <EditService session={session} />
              </PrivateRoute>
            }
          />

          {/* Contato geral */}
          <Route path="/contacts" element={<Contacts />} />

          {/* Área logada / perfil próprio */}
          <Route
            path="/account"
            element={
              <PrivateRoute session={session}>
                <Account session={session} onLogout={logout} />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute session={session}>
                <ProfilePage session={session} />
              </PrivateRoute>
            }
          />

          {/* Perfil público do prestador (AGORA com session passada) */}
          <Route
            path="/p/:slug"
            element={<PublicProfile session={session} />}
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </PageLayout>
    </BrowserRouter>
  );
}

export default App;
