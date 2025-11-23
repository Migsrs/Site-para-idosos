// src/pages/HomePage.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Shield, BadgeCheck, MapPin, Phone } from "lucide-react";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 pb-24 pt-0 md:pb-8">
      <HeroSection />
      <div className="mt-6 md:mt-8">
        <PromoCarousel />
        <QuickTiles />
      </div>
    </div>
  );
}

export function HeroSection() {
  return (
    <div className="relative mb-6 overflow-hidden rounded-3xl">
      <img
        src="img/Cuidados.jpg"
        alt="Cuidador"
        className="h-60 w-full object-cover md:h-72"
      />
      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="max-w-xl rounded-2xl bg-black/40 p-5 text-center text-white shadow-lg backdrop-blur">
          <div className="text-2xl font-bold">Bem-vindo ao Vinculum</div>
          <p className="mt-2 text-sm opacity-90">
            Conectamos famílias a assistentes geriátricos de confiança — no
            domicílio ou por teleassistência.
          </p>
          <Link
            to="/services"
            className="mt-4 inline-flex rounded-full bg-amber-500 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-amber-600"
          >
            Conheça nossos serviços
          </Link>
        </div>
      </div>
    </div>
  );
}

export function PromoCarousel() {
  return (
    <div className="mb-4">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500 to-yellow-500 p-5 text-white shadow">
        <div className="text-sm opacity-90">Cuidados contínuos</div>
        <div className="mt-1 text-2xl font-bold leading-tight">
          Assistência geriátrica com 20% OFF
        </div>
        <div className="mt-2 text-sm opacity-90">
          Somente esta semana • Profissionais verificados
        </div>
      </div>
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
        <div className="rounded-2xl bg-amber-50 p-2 text-amber-600">
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <div className="text-sm font-semibold">{title}</div>
          <div className="text-xs text-gray-500">{subtitle}</div>
        </div>
      </div>
    </div>
  );
}
