"use client";

import { useState } from "react";

const categories = [
  "Todos",
  "Economía",
  "Derecho",
  "Salud",
  "Arquitectura",
  "Tecnología",
] as const;

type Category = (typeof categories)[number];

const creators = [
  {
    id: "rodrigo-fuentes",
    name: "Rodrigo Fuentes",
    specialty: "ECONOMÍA",
    category: "Economía",
    bio: "Análisis semanal del mercado chileno para entender qué está pasando realmente, sin el filtro del titular. Rodrigo lleva 14 años siguiendo de cerca las decisiones del Banco Central, el IPC y los ciclos de inversión. Lo que escribe aquí no aparece en La Tercera.",
    bioShort: "Análisis semanal del mercado chileno, sin el filtro del titular.",
    price: "$9.990/mes",
    subscribers: 847,
    featured: true,
    href: "/rodrigo-fuentes",
  },
  {
    id: "isabel-contreras",
    name: "Isabel Contreras",
    specialty: "DERECHO TRIBUTARIO",
    category: "Derecho",
    bio: "Lo que el SII no te explica, pero necesitas saber para no pagar de más.",
    bioShort: "Lo que el SII no te explica. Cada lunes.",
    price: "$12.990/mes",
    subscribers: 523,
    featured: false,
    href: "/isabel-contreras",
  },
  {
    id: "marco-salinas",
    name: "Marco Salinas",
    specialty: "ARQUITECTURA",
    category: "Arquitectura",
    bio: "Arquitectura latinoamericana que no sale en los libros de texto.",
    bioShort: "Arquitectura latinoamericana, una mirada desde adentro.",
    price: "$7.990/mes",
    subscribers: 312,
    featured: false,
    href: "/marco-salinas",
  },
  {
    id: "carmen-vidal",
    name: "Carmen Vidal",
    specialty: "MEDICINA INTERNA",
    category: "Salud",
    bio: "Medicina basada en evidencia, sin filtro. Lo que la ciencia dice y los titulares distorsionan.",
    bioShort: "Medicina basada en evidencia, sin filtro editorial.",
    price: "$9.990/mes",
    subscribers: 198,
    featured: false,
    href: "/carmen-vidal",
  },
  {
    id: "felipe-mora",
    name: "Felipe Mora",
    specialty: "FINANZAS",
    category: "Economía",
    bio: "Mercados emergentes LATAM: lo que los analistas de Wall Street no entienden desde sus oficinas en Nueva York.",
    bioShort: "Mercados emergentes LATAM con perspectiva local.",
    price: "$14.990/mes",
    subscribers: 421,
    featured: true,
    href: "/felipe-mora",
  },
  {
    id: "ana-torres",
    name: "Ana Torres",
    specialty: "PSICOLOGÍA CLÍNICA",
    category: "Salud",
    bio: "Salud mental para profesionales que no tienen tiempo para el burnout.",
    bioShort: "Salud mental para profesionales bajo presión.",
    price: "$6.990/mes",
    subscribers: 267,
    featured: false,
    href: "/ana-torres",
  },
  {
    id: "diego-ramirez",
    name: "Diego Ramírez",
    specialty: "MINERÍA & RECURSOS",
    category: "Tecnología",
    bio: "El litio que Chile no aprovecha: análisis técnico y político de la industria que define nuestro siglo.",
    bioShort: "El litio que Chile no aprovecha. Análisis técnico y político.",
    price: "$11.990/mes",
    subscribers: 189,
    featured: false,
    href: "/diego-ramirez",
  },
  {
    id: "valentina-cruz",
    name: "Valentina Cruz",
    specialty: "PERIODISMO DE DATOS",
    category: "Tecnología",
    bio: "Los números que los medios no publican. Datos públicos analizados sin agenda.",
    bioShort: "Los números que los medios no publican.",
    price: "$8.990/mes",
    subscribers: 334,
    featured: false,
    href: "/valentina-cruz",
  },
];

function Nav() {
  return (
    <header>
      <div className="h-[3px] bg-[#C41C1C] w-full" />
      <div className="border-b border-[#DEDEDE] py-4 px-6">
        <div className="max-w-5xl mx-auto flex flex-col items-center gap-3">
          <a
            href="/"
            className="font-serif text-[38px] font-bold tracking-tight text-[#121212] leading-none"
            style={{ letterSpacing: "-0.01em" }}
          >
            SALA
          </a>
          <hr className="nyt-rule w-full" />
          <nav className="flex items-center gap-1 text-[12px] font-sans text-[#666666]">
            {[
              { label: "Explorar", href: "/explorar", active: true },
              { label: "Para creadores", href: "/abrir", active: false },
              { label: "Precios", href: "/precios", active: false },
              { label: "Entrar", href: "#", active: false },
            ].map((item, i) => (
              <span key={item.label} className="flex items-center gap-1">
                {i > 0 && <span className="text-[#DEDEDE]">·</span>}
                <a
                  href={item.href}
                  className={`transition-colors duration-150 ${
                    item.active
                      ? "text-[#121212] font-semibold"
                      : "hover:text-[#121212]"
                  }`}
                >
                  {item.label}
                </a>
              </span>
            ))}
          </nav>
        </div>
      </div>
      <hr className="nyt-rule" />
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[#DEDEDE] py-8 px-6 mt-16">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <span className="font-sans text-[11px] font-semibold uppercase tracking-widest text-[#666666]">
          SALA · CHILE · 2025
        </span>
        <a
          href="mailto:hello@sala.lat"
          className="font-sans text-[12px] text-[#666666] hover:text-[#121212] transition-colors duration-150"
        >
          hello@sala.lat
        </a>
      </div>
    </footer>
  );
}

interface CreatorCardFeaturedProps {
  creator: (typeof creators)[number];
}

function CreatorCardFeatured({ creator }: CreatorCardFeaturedProps) {
  return (
    <article className="py-8 pr-8 border-r border-[#DEDEDE]">
      <span
        className="font-sans text-[11px] font-semibold uppercase tracking-widest mb-3 block"
        style={{ color: "#C41C1C" }}
      >
        {creator.specialty}
      </span>
      <h2
        className="font-serif text-[28px] font-bold text-[#121212] mb-3 leading-[1.1]"
        style={{ letterSpacing: "-0.01em" }}
      >
        {creator.name}
      </h2>
      <p className="font-sans text-[14px] text-[#666666] leading-relaxed mb-5 line-clamp-3">
        {creator.bio}
      </p>
      <div className="flex items-center justify-between border-t border-[#DEDEDE] pt-4">
        <div>
          <span className="font-sans text-[13px] font-semibold text-[#121212] block">
            {creator.price}
          </span>
          <span className="font-sans text-[11px] text-[#666666]">
            {creator.subscribers.toLocaleString("es-CL")} suscriptores
          </span>
        </div>
        <a
          href={creator.href}
          className="font-sans text-[12px] font-medium text-[#121212] hover:text-[#C41C1C] transition-colors duration-150"
        >
          Ver sala →
        </a>
      </div>
    </article>
  );
}

interface CreatorCardProps {
  creator: (typeof creators)[number];
  showBorder?: boolean;
}

function CreatorCard({ creator, showBorder = true }: CreatorCardProps) {
  return (
    <article
      className={`py-5 ${showBorder ? "border-b border-[#DEDEDE]" : ""}`}
    >
      <span
        className="font-sans text-[10px] font-semibold uppercase tracking-widest mb-1.5 block"
        style={{ color: "#C41C1C" }}
      >
        {creator.specialty}
      </span>
      <h3
        className="font-serif text-[20px] font-bold text-[#121212] mb-1.5 leading-tight"
        style={{ letterSpacing: "-0.01em" }}
      >
        {creator.name}
      </h3>
      <p className="font-sans text-[13px] text-[#666666] leading-relaxed mb-3 line-clamp-1">
        {creator.bioShort}
      </p>
      <div className="flex items-center justify-between">
        <span className="font-sans text-[12px] text-[#666666]">
          {creator.price} ·{" "}
          {creator.subscribers.toLocaleString("es-CL")} subs
        </span>
        <a
          href={creator.href}
          className="font-sans text-[11px] font-medium text-[#121212] hover:text-[#C41C1C] transition-colors duration-150"
        >
          Ver sala →
        </a>
      </div>
    </article>
  );
}

export default function ExplorarPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("Todos");

  const filtered =
    activeCategory === "Todos"
      ? creators
      : creators.filter((c) => c.category === activeCategory);

  const featured = filtered.filter((c) => c.featured);
  const rest = filtered.filter((c) => !c.featured);

  return (
    <>
      <Nav />
      <main className="px-6 pb-8">
        {/* Filtros */}
        <div className="max-w-5xl mx-auto pt-8 pb-6">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-sans text-[12px] text-[#666666] mr-1">
              Mostrar:
            </span>
            {categories.map((cat) => {
              const isActive = cat === activeCategory;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`font-sans text-[11px] uppercase tracking-widest px-3 py-1 border transition-colors duration-150 cursor-pointer ${
                    isActive
                      ? "bg-[#121212] text-white border-[#121212]"
                      : "bg-white text-[#666666] border-[#DEDEDE] hover:border-[#121212] hover:text-[#121212]"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
          <hr className="nyt-rule mt-5" />
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Sección destacados */}
          {featured.length > 0 && (
            <>
              <div className="mb-4">
                <span className="section-label mb-3 inline-block">
                  SALAS DESTACADAS
                </span>
              </div>
              <div
                className={`grid gap-0 mb-0 ${
                  featured.length === 1
                    ? "grid-cols-1 max-w-xl"
                    : featured.length === 2
                    ? "md:grid-cols-2"
                    : "md:grid-cols-3"
                }`}
              >
                {featured.map((c, i) => (
                  <div key={c.id} className={i > 0 ? "pl-8" : ""}>
                    <CreatorCardFeatured creator={c} />
                  </div>
                ))}
              </div>
              <hr className="nyt-rule mb-0 mt-0" />
            </>
          )}

          {/* Sección resto */}
          {rest.length > 0 && (
            <div className="mt-8">
              <div className="mb-4">
                <span className="section-label mb-3 inline-block">
                  {activeCategory === "Todos"
                    ? "TODAS LAS SALAS"
                    : activeCategory.toUpperCase()}
                </span>
                <hr className="nyt-rule" />
              </div>
              <div className="grid md:grid-cols-2 gap-0 md:divide-x md:divide-[#DEDEDE]">
                {/* columna izquierda */}
                <div className="pr-0 md:pr-8">
                  {rest
                    .filter((_, i) => i % 2 === 0)
                    .map((c, i, arr) => (
                      <CreatorCard
                        key={c.id}
                        creator={c}
                        showBorder={i < arr.length - 1}
                      />
                    ))}
                </div>
                {/* columna derecha */}
                <div className="pl-0 md:pl-8 border-t md:border-t-0 border-[#DEDEDE]">
                  {rest
                    .filter((_, i) => i % 2 === 1)
                    .map((c, i, arr) => (
                      <CreatorCard
                        key={c.id}
                        creator={c}
                        showBorder={i < arr.length - 1}
                      />
                    ))}
                </div>
              </div>
              <hr className="nyt-rule mt-4" />
            </div>
          )}

          {/* Estado vacío */}
          {filtered.length === 0 && (
            <div className="py-20 text-center">
              <p className="font-serif text-[22px] text-[#666666] italic">
                No hay salas en esta categoría todavía.
              </p>
            </div>
          )}

          {/* CTA inferior */}
          <div className="py-14 text-center bg-[#F7F7F7] border border-[#DEDEDE] mt-10 px-8">
            <span className="section-label mb-4 inline-block">
              PARA CREADORES
            </span>
            <p
              className="font-serif text-[#121212] mb-6 leading-[1.1]"
              style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 700 }}
            >
              ¿Tienes algo que enseñar?
              <br />
              Abre tu sala.
            </p>
            <p className="font-sans text-[14px] text-[#666666] max-w-sm mx-auto mb-8 leading-relaxed">
              En 15 minutos configuras tu perfil, defines tu precio y empiezas a
              publicar. Sin código. Sin diseñador.
            </p>
            <a
              href="/abrir"
              className="font-sans text-[13px] font-medium px-8 py-3 bg-[#121212] text-white hover:bg-[#333] transition-colors duration-150 inline-block"
            >
              Abrir la mía →
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
