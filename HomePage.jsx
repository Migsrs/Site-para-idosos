import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Shield, BadgeCheck, MapPin, Phone } from "lucide-react";

// =================== PÁGINA PRINCIPAL ===================
export default function HomePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 pb-24 pt-0 md:pb-8">
      <HeroSection />
      <div className="mt-6">
        <PromoCarousel />
        <QuickTiles />
      </div>
    </div>
  );
}

// =================== HERO (TOPO) ===================
function HeroSection() {
  return (
    <div className="relative mb-6 overflow-hidden rounded-3xl">
      <img
        src="img/Cuidados.jpg"
        alt="Cuidados com idosos"
        className="h-60 w-full object-cover md:h-72"
      />
      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="max-w-xl rounded-2xl bg-black/40 p-5 text-center text-white shadow-lg backdrop-blur">
          <div className="text-2xl font-bold">Bem-vindo ao Vinculum</div>
          <p className="mt-2 text-sm opacity-90">
            Conectamos famílias a cuidadores geriátricos de confiança — no
            domicílio ou por acompanhamento remoto.
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

// =================== CARROSSEL DE PROMOÇÕES ===================
export function PromoCarousel() {
  const promos = [
    {
      label: "Promoção de lançamento",
      title: "Primeira diária com 20% OFF",
      subtitle: "Para novos clientes cadastrados neste mês.",
    },
    {
      label: "Cuidado contínuo",
      title: "Pacote semanal com desconto",
      subtitle: "Contrate 5 dias de acompanhamento e ganhe o 6º com 50% OFF.",
    },
    {
      label: "Atendimento remoto",
      title: "Teleacompanhamento especial",
      subtitle:
        "Monitoramento remoto para idosos independentes com preço reduzido.",
    },
    {
      label: "Famílias recorrentes",
      title: "Programa de fidelidade Vinculum",
      subtitle:
        "Famílias que utilizam o serviço todo mês ganham descontos progressivos.",
    },
  ];

  const [index, setIndex] = useState(0);

  // Troca automática de promoção a cada 6 segundos
  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % promos.length);
    }, 6000);
    return () => clearInterval(id);
  }, [promos.length]);

  const current = promos[index];

  return (
    <div className="mb-4">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500 to-yellow-500 p-5 text-white shadow">
        <div className="text-sm opacity-90">{current.label}</div>
        <div className="mt-1 text-2xl font-bold leading-tight">
          {current.title}
        </div>
        <div className="mt-2 text-sm opacity-90">{current.subtitle}</div>

        {/* bolinhas de indicação / controle */}
        <div className="mt-4 flex items-center justify-end gap-1">
          {promos.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              className={`h-2.5 w-2.5 rounded-full transition ${
                i === index ? "bg-white" : "bg-white/40"
              }`}
              aria-label={`Ir para promoção ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// =================== QUADRADINHOS RÁPIDOS ===================
function QuickTiles() {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      <Tile icon={Shield} title="Verificados" subtitle="+ qualidade" />
      <Tile icon={BadgeCheck} title="Bem avaliados" subtitle="> 4.5" />
      <Tile icon={MapPin} title="Perto de você" subtitle="atendimento local" />
      <Tile icon={Phone} title="Teleatendimento" subtitle="modo remoto" />
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
