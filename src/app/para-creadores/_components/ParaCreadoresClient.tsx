"use client";

import { useState } from "react";
import Link from "next/link";
import Nav from "@/components/nav";

/* ─── Data ───────────────────────────────────────────────────────────────── */

const HOW_IT_WORKS = [
  {
    roman: "I.",
    title: "Abre tu espacio",
    body: "Configuras tu perfil, el nombre de tu espacio y tu precio en menos de 15 minutos. Sin código. Sin diseñador. Sin contrato.",
  },
  {
    roman: "II.",
    title: "Publica lo que sabes",
    body: "Artículos, análisis, reflexiones. Tú decides qué es gratuito para atraer nuevos lectores y qué es exclusivo para quienes pagan.",
  },
  {
    roman: "III.",
    title: "Cobra mes a mes",
    body: "Tus suscriptores pagan cada mes de forma automática. Tú recibes el dinero directo. Nebbuler cobra solo cuando tú ganas.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "Nebbuler me hizo entender que mis análisis macroeconómicos tenían un precio real. En tres meses pasé de escribir gratis a generar un ingreso mensual estable.",
    name: "Camila Rojas",
    specialty: "Economista · Santiago",
    income: "$1.200.000 CLP/mes",
  },
  {
    quote:
      "Tenía 4.000 seguidores en LinkedIn que leían todo lo que publicaba pero yo no cobraba nada. Nebbuler cambió esa ecuación en quince minutos.",
    name: "Felipe Vargas",
    specialty: "Abogado tributarista · Bogotá",
    income: "$890.000 CLP/mes",
  },
  {
    quote:
      "Lo que publico en Nebbuler es lo que no puedo decir en medios tradicionales. Mis lectores pagan precisamente por eso: la versión sin filtros.",
    name: "Valentina Ibáñez",
    specialty: "Periodista · Ciudad de México",
    income: "$1.500.000 CLP/mes",
  },
];

function formatCLP(n: number) {
  return n.toLocaleString("es-CL");
}

/* ─── Calculator ─────────────────────────────────────────────────────────── */

const SUBS_OPTIONS = [50, 100, 200, 500];
const PRICE_OPTIONS = [4990, 7990, 9990, 14990];

function IncomesCalculator() {
  const [subs, setSubs] = useState(100);
  const [price, setPrice] = useState(9990);
  const result = subs * price;

  return (
    <section className="border-t border-[#DEDEDE] py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <span className="section-label mb-3 inline-block">CALCULADORA</span>
          <hr className="nyt-rule" />
        </div>
        <h2 className="font-serif text-[36px] font-bold text-[#121212] tracking-[-0.01em] mb-2">
          ¿Cuánto podrías ganar?
        </h2>
        <p className="font-sans text-[15px] text-[#666] mb-10">
          Selecciona el número de suscriptores y tu precio mensual.
        </p>

        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <label className="font-sans text-[11px] font-semibold uppercase tracking-[0.1em] text-[#121212]">
                  Suscriptores
                </label>
                <span className="font-serif text-[22px] font-bold text-[#121212]">{subs}</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {SUBS_OPTIONS.map((n) => (
                  <button
                    key={n}
                    onClick={() => setSubs(n)}
                    className={`py-2.5 font-sans text-[13px] font-medium border transition-colors duration-150 ${
                      subs === n
                        ? "border-[#121212] bg-[#121212] text-white"
                        : "border-[#DEDEDE] text-[#666] hover:border-[#121212] hover:text-[#121212]"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="font-sans text-[11px] font-semibold uppercase tracking-[0.1em] text-[#121212]">
                  Precio/mes
                </label>
                <span className="font-serif text-[22px] font-bold text-[#121212]">
                  ${formatCLP(price)} CLP
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {PRICE_OPTIONS.map((p) => (
                  <button
                    key={p}
                    onClick={() => setPrice(p)}
                    className={`py-2.5 font-sans text-[13px] font-medium border transition-colors duration-150 ${
                      price === p
                        ? "border-[#121212] bg-[#121212] text-white"
                        : "border-[#DEDEDE] text-[#666] hover:border-[#121212] hover:text-[#121212]"
                    }`}
                  >
                    ${formatCLP(p)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-[#F7F7F7] border border-[#DEDEDE] p-8 flex flex-col justify-center">
            <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.12em] text-[#C41C1C] mb-3">
              Tu ingreso mensual estimado
            </p>
            <p className="font-serif text-[56px] font-bold text-[#121212] leading-[1.2] tracking-[-0.02em] mb-1">
              ${formatCLP(result)}
            </p>
            <p className="font-sans text-[12px] text-[#888] mb-5">
              CLP · con {subs} suscriptores a ${formatCLP(price)}/mes
            </p>
            <hr className="nyt-rule mb-5" />
            <p className="font-sans text-[13px] text-[#555]">
              En Nebbuler pagas <strong className="text-[#121212]">$29.990 CLP/mes fijo</strong> y te quedas con el 100%.
              <br />
              <span className="text-[#888] text-[12px]">Sin comisiones, sin sorpresas.</span>
            </p>
            <p className="font-sans text-[13px] text-[#555] mt-3">
              Con Substack (10% comisión) → recibirías <strong className="text-[#121212]">${formatCLP(Math.round(result * 0.9))} CLP</strong> en lugar de ${formatCLP(result)}.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default function ParaCreadoresPage() {
  return (
    <div className="min-h-screen bg-white">
      <Nav />

      {/* Hero */}
      <section className="border-b border-[#DEDEDE] py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="section-label mb-4">PARA CREADORES</p>
          <hr className="nyt-rule mb-10" />
          <h1 className="font-serif text-[56px] md:text-[72px] font-bold text-[#121212] leading-[1.0] tracking-[-0.02em] mb-8 max-w-4xl">
            Tienes conocimiento que vale.
            <br />
            <em className="not-italic text-[#C41C1C]">Nebbuler te ayuda a cobrarlo.</em>
          </h1>
          <p className="font-sans text-[18px] text-[#555] leading-relaxed max-w-xl mb-10">
            Miles de profesionales en América Latina comparten lo que saben gratis.
            Nebbuler existe para cambiar esa ecuación.
          </p>
          <Link
            href="/abrir"
            className="inline-block font-sans text-[13px] font-medium px-10 py-4 bg-[#121212] text-white hover:bg-[#C41C1C] transition-colors duration-150"
          >
            Abrir mi sala gratis →
          </Link>
        </div>
      </section>

      {/* El problema */}
      <section className="border-b border-[#DEDEDE] py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <span className="section-label mb-3 inline-block">EL PROBLEMA</span>
            <hr className="nyt-rule" />
          </div>
          <div className="max-w-[680px]">
            <p className="font-sans text-[18px] text-[#121212] leading-[1.8] mb-5">
              Llevas años publicando análisis en LinkedIn. Escribes hilos que se
              comparten. Mandas correos a tus contactos. Todo gratis.
            </p>
            <p className="font-sans text-[18px] text-[#121212] leading-[1.8] mb-5">
              Mientras tanto, tus lectores más comprometidos pagarían por más
              profundidad, más contexto, más de ti. Lo que publicas gratis en
              redes es apenas el 20% de lo que realmente sabes. El otro 80%
              se queda contigo porque no tienes dónde publicarlo cobrando.
            </p>
            <p className="font-sans text-[18px] text-[#121212] leading-[1.8]">
              El problema no es tu contenido. El problema es que nunca tuviste
              una infraestructura para cobrarlo. Eso es exactamente lo que hace Nebbuler.
            </p>
          </div>
        </div>
      </section>

      {/* Stat negra */}
      <section className="border-b border-[#DEDEDE] py-16 px-6 bg-[#121212]">
        <div className="max-w-5xl mx-auto">
          <p className="font-serif text-[52px] md:text-[72px] font-bold text-white leading-[1.0] tracking-[-0.02em] mb-6">
            500.000 profesionales en Chile
            <br />
            publican gratis cada semana.
          </p>
          <p className="font-sans text-[16px] text-[#888] max-w-lg">
            La mayoría tiene un conocimiento que vale cientos de miles de pesos al mes.
            Nebbuler es la infraestructura para cobrar por él.
          </p>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="border-b border-[#DEDEDE] py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10">
            <span className="section-label mb-3 inline-block">CÓMO FUNCIONA</span>
            <hr className="nyt-rule" />
          </div>
          <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#DEDEDE]">
            {HOW_IT_WORKS.map((step, i) => (
              <div
                key={step.roman}
                className={`py-6 md:py-0 ${i > 0 ? "md:pl-10" : ""} ${i < HOW_IT_WORKS.length - 1 ? "md:pr-10" : ""}`}
              >
                <p className="font-serif text-[40px] font-bold text-[#DEDEDE] leading-[1.2] mb-4">
                  {step.roman}
                </p>
                <h3 className="font-serif text-[20px] font-bold text-[#121212] mb-3">
                  {step.title}
                </h3>
                <p className="font-sans text-[14px] leading-[1.7] text-[#555]">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Calculadora */}
      <IncomesCalculator />

      {/* Testimonios */}
      <section className="border-t border-[#DEDEDE] py-16 px-6 bg-[#F7F7F7]">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <span className="section-label mb-3 inline-block">CREADORES QUE YA ESTÁN EN NEBBULER</span>
            <hr className="nyt-rule" />
          </div>
          <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#DEDEDE]">
            {TESTIMONIALS.map((t, i) => (
              <article
                key={t.name}
                className={`py-6 md:py-0 ${i > 0 ? "md:pl-6" : ""} ${i < TESTIMONIALS.length - 1 ? "md:pr-6" : ""}`}
              >
                <p className="font-serif text-[16px] italic text-[#121212] leading-relaxed mb-5">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <hr className="nyt-rule mb-4" />
                <p className="font-sans text-[12px] font-semibold text-[#121212] mb-0.5">
                  {t.name}
                </p>
                <p className="font-sans text-[11px] text-[#666] mb-1">
                  {t.specialty}
                </p>
                <p className="font-sans text-[11px] font-semibold text-[#C41C1C] uppercase tracking-[0.08em]">
                  {t.income}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="border-t border-[#DEDEDE] py-24 px-6 text-center bg-[#F7F7F7]">
        <div className="max-w-xl mx-auto">
          <h2 className="font-serif text-[40px] font-bold italic text-[#121212] leading-[1.5] tracking-[-0.01em] mb-3">
            Durante años regalaste
            <br />
            tu conocimiento.
          </h2>
          <p className="font-serif text-[24px] text-[#C41C1C] font-bold mb-10">
            Nebbuler existe para que eso cambie.
          </p>
          <Link
            href="/abrir"
            className="inline-block font-sans text-[14px] font-medium px-12 py-5 bg-[#121212] text-white hover:bg-[#C41C1C] transition-colors duration-150"
          >
            Abrir mi sala hoy →
          </Link>
          <p className="font-sans text-[12px] text-[#888] mt-4">
            Gratis para empezar · Sin tarjeta de crédito
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#DEDEDE] py-6 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="font-sans text-[11px] uppercase tracking-[0.1em] text-[#888]">
            NEBBULER · CHILE · 2026
          </span>
          <a href="mailto:hello@nebbuler.com" className="font-sans text-[11px] text-[#888] hover:text-[#121212] transition-colors">
            hello@nebbuler.com
          </a>
        </div>
      </footer>
    </div>
  );
}
