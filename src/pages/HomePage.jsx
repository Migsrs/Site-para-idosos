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
        <AboutSection/>
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
  const promotions = [
    {
      id: 1,
      label: "Promoção de lançamento",
      title: "Primeira diária com 20% OFF",
      description: "Para novos clientes cadastrados neste mês.",
    },
    {
      id: 2,
      label: "Pacote semanal",
      title: "7 dias com 1 dia grátis",
      description: "Ideal para famílias que precisam de apoio contínuo.",
    },
    {
      id: 3,
      label: "Teleatendimento",
      title: "Avaliação remota com 30% OFF",
      description: "Primeira consulta on-line com desconto especial.",
    },
    {
      id: 4,
      label: "Programa cuidador família",
      title: "Treinamento para familiares",
      description: "Aprenda boas práticas para cuidar de idosos em casa.",
    },
  ];

  const [active, setActive] = useState(0);

  // ---- auto avanço a cada 6s ----
  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % promotions.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [promotions.length]);

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

  const current = promotions[active];

  return (
    <div className="mb-4 sm:mb-6">
      <div
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500 to-yellow-500 p-5 text-white shadow"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="text-sm opacity-90">{current.label}</div>
        <div className="mt-1 text-2xl font-bold leading-tight">
          {current.title}
        </div>
        <div className="mt-2 text-sm opacity-90">{current.description}</div>

        {/* bolinhas de navegação */}
        <div className="pointer-events-auto absolute bottom-3 right-4 flex gap-1.5">
          {promotions.map((promo, index) => (
            <button
              key={promo.id}
              type="button"
              onClick={() => setActive(index)}
              className={`h-2.5 w-2.5 rounded-full transition ${
                index === active
                  ? "bg-white"
                  : "bg-white/50 hover:bg-white/80"
              }`}
              aria-label={`Ir para promoção ${index + 1}`}
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

// =================== SOBRE NÓS ===================
function AboutSection() {
  return (
    <section className="mt-6 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-gray-200 sm:p-6">
      <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">
        Sobre o Vinculum
      </h2>

      <p className="mt-2 text-sm leading-relaxed text-gray-700">
        O Vinculum nasceu da vivência pessoal dos integrantes do projeto com
        familiares idosos que precisavam de apoio no dia a dia. Em diferentes
        momentos, percebemos a dificuldade das famílias em encontrar
        cuidadores de confiança, com informações claras sobre experiência,
        disponibilidade e avaliações de outros familiares.
      </p>

      <p className="mt-2 text-sm leading-relaxed text-gray-700">
        A nossa motivação é usar tecnologia para aproximar pessoas: de um lado,
        famílias que precisam de cuidado gerontológico seguro e acolhedor; do
        outro, profissionais qualificados que muitas vezes não têm visibilidade
        ou uma forma simples de apresentar seus serviços.
      </p>

      <p className="mt-2 text-sm leading-relaxed text-gray-700">
        O projeto começou como um MVP acadêmico, inspirado em plataformas como
        o iFood, mas adaptado ao contexto da saúde. A ideia é oferecer uma
        interface simples, avaliações transparentes e um fluxo de cadastro
        acessível tanto para cuidadores quanto para familiares, servindo como
        um primeiro passo para um sistema completo de gestão de cuidados para
        idosos.
      </p>
    </section>
  );
}
