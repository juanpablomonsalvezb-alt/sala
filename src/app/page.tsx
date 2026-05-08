"use client";

import { useState } from "react";

const creators = [
  {
    name: "Rodrigo Fuentes",
    specialty: "ECONOMÍA",
    bio: "Análisis semanal del mercado chileno para entender qué está pasando realmente, sin el filtro del titular.",
    price: "$9.990/mes",
    subscribers: "847 suscriptores",
    href: "/rodrigo-fuentes",
  },
  {
    name: "Isabel Contreras",
    specialty: "DERECHO TRIBUTARIO",
    bio: "Lo que el SII no te explica, pero necesitas saber para no pagar de más. Cada lunes.",
    price: "$12.990/mes",
    subscribers: "523 suscriptores",
    href: "/isabel-contreras",
  },
  {
    name: "Marco Salinas",
    specialty: "ARQUITECTURA",
    bio: "Arquitectura latinoamericana que no sale en los libros de texto. Una mirada desde adentro.",
    price: "$7.990/mes",
    subscribers: "312 suscriptores",
    href: "/marco-salinas",
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
            {["Explorar", "Para creadores", "Precios", "Entrar"].map((item, i) => (
              <span key={item} className="flex items-center gap-1">
                {i > 0 && <span className="text-[#DEDEDE]">·</span>}
                <a href={item === "Precios" ? "/precios" : "#"} className="hover:text-[#121212] transition-colors duration-150">
                  {item}
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

function Hero() {
  return (
    <section className="max-w-3xl mx-auto px-6 pt-16 pb-14 text-center">
      <span className="section-label mb-4 inline-block">CONOCIMIENTO PROFESIONAL</span>
      <h1
        className="font-serif text-[#121212] mb-6 leading-[1.08]"
        style={{ fontSize: "clamp(2.4rem, 5.5vw, 4.2rem)", fontWeight: 800, letterSpacing: "-0.01em" }}
      >
        El lugar donde los profesionales comparten lo que realmente saben.
      </h1>
      <hr className="nyt-rule mb-6" />
      <p className="font-sans text-[18px] text-[#666666] leading-relaxed max-w-xl mx-auto mb-10">
        Economistas, abogados, médicos y consultores publican análisis que no aparecen en los medios. Sus lectores más comprometidos pagan por ello.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
        <a
          href="#explorar"
          className="font-sans text-[13px] font-medium px-6 py-2.5 border border-[#121212] text-[#121212] hover:bg-[#121212] hover:text-white transition-colors duration-150"
        >
          Explorar salas
        </a>
        <a
          href="/abrir"
          className="font-sans text-[13px] font-medium px-6 py-2.5 bg-[#121212] text-white hover:bg-[#333] transition-colors duration-150"
        >
          Abrir la mía →
        </a>
      </div>
      <p className="font-sans text-[12px] text-[#666666] tracking-wide">
        34 creadores · 2.400 suscriptores · $180.000 generados
      </p>
    </section>
  );
}

function FeaturedCreators() {
  return (
    <section id="explorar" className="border-t border-[#DEDEDE] py-14 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-5">
          <span className="section-label mb-3 inline-block">SALAS DESTACADAS</span>
          <hr className="nyt-rule" />
        </div>
        <div className="grid md:grid-cols-3 gap-0 md:divide-x md:divide-[#DEDEDE]">
          {creators.map((c, i) => (
            <article key={c.name} className={`py-6 ${i > 0 ? "md:pl-6" : ""} ${i < creators.length - 1 ? "md:pr-6" : ""} border-b md:border-b-0 border-[#DEDEDE] last:border-b-0`}>
              <span className="section-label mb-2 inline-block" style={{ color: "#C41C1C" }}>{c.specialty}</span>
              <h3 className="font-serif text-[22px] font-bold text-[#121212] mb-2 leading-tight" style={{ letterSpacing: "-0.01em" }}>
                {c.name}
              </h3>
              <p className="font-sans text-[13px] text-[#666666] leading-relaxed mb-4">{c.bio}</p>
              <div className="flex items-center justify-between">
                <span className="font-sans text-[12px] text-[#666666]">
                  {c.price} · {c.subscribers}
                </span>
                <a
                  href={c.href}
                  className="font-sans text-[12px] font-medium text-[#121212] hover:underline underline-offset-2"
                >
                  Ver sala →
                </a>
              </div>
            </article>
          ))}
        </div>
        <hr className="nyt-rule mt-0" />
      </div>
    </section>
  );
}

const steps = [
  { roman: "I.", title: "Abre tu sala", desc: "Configura tu perfil y define tu precio en 15 minutos. Sin código ni diseñador." },
  { roman: "II.", title: "Publica lo que sabes", desc: "Artículos, análisis, reflexiones. Sin algoritmo que dicte qué ni cuándo." },
  { roman: "III.", title: "Cobra mes a mes", desc: "Tus suscriptores pagan directamente a ti. Sin intermediarios innecesarios." },
];

function HowItWorks() {
  return (
    <section className="border-t border-[#DEDEDE] py-14 px-6 bg-[#F7F7F7]">
      <div className="max-w-5xl mx-auto">
        <div className="mb-5">
          <span className="section-label mb-3 inline-block">CÓMO FUNCIONA</span>
          <hr className="nyt-rule" />
        </div>
        <div className="grid md:grid-cols-3 gap-0 md:divide-x md:divide-[#DEDEDE]">
          {steps.map((s, i) => (
            <div key={s.title} className={`py-6 ${i > 0 ? "md:pl-8" : ""} ${i < steps.length - 1 ? "md:pr-8" : ""} border-b md:border-b-0 border-[#DEDEDE] last:border-b-0`}>
              <span className="font-serif text-[32px] font-bold text-[#DEDEDE] leading-none mb-3 block">{s.roman}</span>
              <h3 className="font-serif text-[18px] font-bold text-[#121212] mb-2" style={{ letterSpacing: "-0.01em" }}>{s.title}</h3>
              <p className="font-sans text-[13px] text-[#666666] leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Manifesto() {
  return (
    <section className="border-t border-b border-[#DEDEDE] py-20 px-6 bg-[#F7F7F7] text-center">
      <div className="max-w-2xl mx-auto">
        <p className="font-serif text-[28px] italic text-[#121212] leading-relaxed mb-8" style={{ fontWeight: 400 }}>
          "Durante años regalaste tu conocimiento. Sala existe para que eso cambie."
        </p>
        <a
          href="/abrir"
          className="font-sans text-[13px] font-medium text-[#121212] hover:underline underline-offset-2"
        >
          Abre tu sala →
        </a>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[#DEDEDE] py-8 px-6">
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

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <FeaturedCreators />
        <HowItWorks />
        <Manifesto />
      </main>
      <Footer />
    </>
  );
}
