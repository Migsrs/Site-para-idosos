import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Shield, BadgeCheck, MapPin, Phone } from "lucide-react";

// =================== PÁGINA PRINCIPAL ===================
export default function HomePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 pb-24 pt-0 md:pb-8">
      <HeroSection />
      <div className="mt-4 sm:mt-6">
        <PromoCarousel />
        <QuickTiles />
      </div>
    </div>
  );
}


// =================== HERO (TOPO) ===================
function HeroSection() {
  return (
    <div className="relative mb-4 overflow-hidden rounded-3xl sm:mb-6">
      <img
        src="/img/Cuidados.jpg"
        alt="Cuidados com idosos"
        className="h-56 w-full object-cover sm:h-60 md:h-72"
      />

      <div className="absolute inset-0 bg-black/40" />

      <div className="absolute inset-0 flex items-center justify-center p-3 sm:p-4">
        <div className="max-w-md rounded-2xl bg-black/45 p-4 text-center text-white shadow-lg backdrop-blur-sm sm:max-w-xl sm:p-5">
          <div className="text-xl font-bold sm:text-2xl">
            Bem-vindo ao Vinculum
          </div>

          <p className="mt-2 text-xs leading-relaxed opacity-90 sm:text-sm">
            Conectamos famílias a cuidadores geriátricos de confiança — no
            domicílio ou por acompanhamento remoto.
          </p>

          <Link
            to="/services"
            className="mt-4 inline-flex rounded-full bg-amber-500 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-amber-600 sm:px-5 sm:text-sm"
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

  // ---- suporte a swipe no mobile ----
  const touchStartX = useRef(null);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current == null) return;
    const diffX = e.changedTouches[0].clientX - touchStartX.current;

    // se arrastar mais de 40px pra um lado, troca o slide
    if (Math.abs(diffX) > 40) {
      if (diffX < 0) {
        // arrastou para a esquerda -> próxima promoção
        setActive((prev) => (prev + 1) % promotions.length);
      } else {
        // arrastou para a direita -> promoção anterior
        setActive((prev) =>
          prev === 0 ? promotions.length - 1 : prev - 1
        );
      }
    }

    touchStartX.current = null;
  };
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
        <div className="min-w-0">
          {/* título ligeiramente menor e quebrando linha no mobile */}
          <div className="break-words text-[13px] font-semibold leading-snug sm:text-sm">
            {title}
          </div>
          <div className="text-xs text-gray-500">{subtitle}</div>
        </div>
      </div>
    </div>
  );
}

