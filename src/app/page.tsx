"use client";

import Link from "next/link";
import Nav from "@/components/nav";

const creators = [
  {
    name: "Rodrigo Fuentes",
    specialty: "ECONOMÍA",
    initial: "RF",
    bio: "Análisis semanal del mercado chileno para entender qué está pasando realmente, sin el filtro del titular.",
    price: "$9.990",
    subscribers: 847,
    href: "/rodrigo-fuentes",
    color: "#1a1a2e",
  },
  {
    name: "Isabel Contreras",
    specialty: "DERECHO TRIBUTARIO",
    initial: "IC",
    bio: "Lo que el SII no te explica, pero necesitas saber para no pagar de más.",
    price: "$12.990",
    subscribers: 523,
    href: "/isabel-contreras",
    color: "#1a2e1a",
  },
  {
    name: "Marco Salinas",
    specialty: "ARQUITECTURA",
    initial: "MS",
    bio: "Arquitectura latinoamericana que no sale en los libros. Una mirada desde adentro.",
    price: "$7.990",
    subscribers: 312,
    href: "/marco-salinas",
    color: "#2e1a1a",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans text-[#121212]">

      <Nav />

      {/* HERO — tipografía como elemento visual */}
      <section className="border-b border-[#DEDEDE]">
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
          <div className="max-w-4xl">
            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#C41C1C] mb-6">
              Plataforma de conocimiento profesional
            </p>
            <h1 className="font-serif text-[52px] md:text-[72px] lg:text-[88px] font-bold leading-[1.0] tracking-[-0.02em] text-[#121212] mb-8">
              El lugar donde
              <br />
              tu conocimiento
              <br />
              <em className="not-italic text-[#C41C1C]">encuentra su valor.</em>
            </h1>
            <div className="h-px bg-[#DEDEDE] mb-8" />
            <div className="flex flex-col md:flex-row md:items-end gap-8">
              <p className="text-[18px] leading-[1.6] text-[#444] max-w-xl">
                Economistas, abogados, médicos y consultores publican lo que saben.
                Sus mejores lectores pagan por ello. Sin algoritmo. Sin intermediario.
              </p>
              <div className="flex flex-col gap-3 md:ml-auto shrink-0">
                <Link
                  href="/explorar"
                  className="border border-[#121212] px-6 py-3 text-[13px] font-medium text-center hover:bg-[#121212] hover:text-white transition-colors"
                >
                  Explorar salas →
                </Link>
                <Link
                  href="/abrir"
                  className="bg-[#121212] text-white px-6 py-3 text-[13px] font-medium text-center hover:bg-[#C41C1C] transition-colors"
                >
                  Abre la tuya →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS — números grandes, Bloomberg-style */}
      <section className="border-b border-[#DEDEDE] bg-[#121212] text-white">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-3 divide-x divide-[#333]">
            {[
              { number: "34", label: "Creadores activos" },
              { number: "2.418", label: "Suscriptores pagando" },
              { number: "$180K", label: "Generados en 2025" },
            ].map(({ number, label }) => (
              <div key={label} className="px-8 first:pl-0 last:pr-0">
                <p className="font-serif text-[52px] md:text-[72px] font-bold leading-none tracking-[-0.03em] text-white">
                  {number}
                </p>
                <p className="text-[12px] uppercase tracking-[0.1em] text-[#888] mt-3">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SALAS DESTACADAS */}
      <section className="border-b border-[#DEDEDE]">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex items-center gap-4 mb-8">
            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#C41C1C]">
              Salas destacadas
            </p>
            <div className="flex-1 h-px bg-[#DEDEDE]" />
            <Link href="/explorar" className="text-[11px] text-[#666] hover:text-[#121212] uppercase tracking-[0.08em]">
              Ver todas →
            </Link>
          </div>

          <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#DEDEDE]">
            {creators.map((c, i) => (
              <Link key={c.name} href={c.href} className="group block md:px-8 first:md:pl-0 last:md:pr-0 py-6 md:py-0">
                {/* Avatar grande con iniciales */}
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
                  style={{ backgroundColor: c.color }}
                >
                  <span className="font-serif text-[20px] font-bold text-white">{c.initial}</span>
                </div>

                <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#C41C1C] mb-2">
                  {c.specialty}
                </p>

                <h3 className="font-serif text-[22px] font-bold leading-tight tracking-[-0.01em] text-[#121212] mb-3 group-hover:text-[#C41C1C] transition-colors">
                  {c.name}
                </h3>

                <p className="text-[14px] leading-[1.6] text-[#555] mb-5">
                  {c.bio}
                </p>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[15px] font-bold text-[#121212]">{c.price}<span className="text-[12px] font-normal text-[#888]">/mes</span></p>
                    <p className="text-[11px] text-[#888]">{c.subscribers.toLocaleString()} suscriptores</p>
                  </div>
                  <span className="text-[12px] text-[#C41C1C] font-medium group-hover:underline">
                    Ver sala →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* MOMENTO DRAMÁTICO — cita a pantalla completa */}
      <section className="border-b border-[#DEDEDE] bg-[#F7F7F7]">
        <div className="max-w-4xl mx-auto px-6 py-20 md:py-32 text-center">
          <p className="font-serif text-[32px] md:text-[48px] lg:text-[56px] font-bold leading-[1.15] tracking-[-0.02em] text-[#121212] italic">
            &ldquo;Durante años regalaste tu conocimiento.
            <br />
            Sala existe para que eso cambie.&rdquo;
          </p>
          <div className="h-px bg-[#DEDEDE] mt-12 mb-8 max-w-xs mx-auto" />
          <Link
            href="/abrir"
            className="inline-block bg-[#C41C1C] text-white px-8 py-4 text-[13px] font-medium hover:bg-[#121212] transition-colors"
          >
            Abre tu sala hoy →
          </Link>
          <p className="text-[12px] text-[#888] mt-4">Gratis para empezar · Sin tarjeta de crédito</p>
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section className="border-b border-[#DEDEDE]">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <div className="flex items-center gap-4 mb-10">
            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#C41C1C]">Cómo funciona</p>
            <div className="flex-1 h-px bg-[#DEDEDE]" />
          </div>

          <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#DEDEDE]">
            {[
              {
                num: "I.",
                title: "Abre tu sala",
                body: "Configuras tu perfil y precio en 15 minutos. Sin código. Sin diseñador.",
              },
              {
                num: "II.",
                title: "Publica lo que sabes",
                body: "Artículos, análisis, reflexiones. Tú decides qué es gratuito y qué es exclusivo.",
              },
              {
                num: "III.",
                title: "Cobra mes a mes",
                body: "Tus suscriptores pagan. Tú recibes el dinero directo. Sala cobra solo cuando ganas.",
              },
            ].map(({ num, title, body }) => (
              <div key={num} className="md:px-10 first:md:pl-0 last:md:pr-0 py-6 md:py-0">
                <p className="font-serif text-[40px] font-bold text-[#DEDEDE] leading-none mb-4">{num}</p>
                <h3 className="font-serif text-[20px] font-bold text-[#121212] mb-3">{title}</h3>
                <p className="text-[14px] leading-[1.7] text-[#555]">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#DEDEDE]">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <p className="text-[11px] uppercase tracking-[0.1em] text-[#888]">
            SALA · CHILE · 2025
          </p>
          <a href="mailto:hello@sala.lat" className="text-[11px] text-[#888] hover:text-[#121212] transition-colors">
            hello@sala.lat
          </a>
        </div>
      </footer>

    </div>
  );
}
