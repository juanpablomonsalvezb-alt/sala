"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import Nav from "@/components/nav";

/* ─── Data ───────────────────────────────────────────────────────────────── */

const PLANS = [
  {
    id: "libre",
    name: "Libre",
    price: "$0",
    period: "/mes",
    commission: "10%",
    commissionLabel: "de comisión",
    highlight: false,
    cta: "Abrir mi sala gratis",
    ctaHref: "/abrir",
    features: [
      { label: "Hasta 500 suscriptores", included: true },
      { label: "Contenido ilimitado", included: true },
      { label: "Pagos vía Stripe", included: true },
      { label: "Panel de gestión", included: true },
      { label: "Analytics avanzado", included: false },
      { label: "Soporte prioritario", included: false },
      { label: "Acceso a API", included: false },
    ],
  },
  {
    id: "creador",
    name: "Creador",
    price: "$29 USD",
    period: "/mes",
    commission: "3%",
    commissionLabel: "de comisión",
    highlight: true,
    cta: "Elegir Creador",
    ctaHref: "/abrir?plan=creador",
    features: [
      { label: "Suscriptores ilimitados", included: true },
      { label: "Contenido ilimitado", included: true },
      { label: "Pagos vía Stripe", included: true },
      { label: "Panel de gestión", included: true },
      { label: "Analytics avanzado", included: true },
      { label: "Soporte prioritario", included: true },
      { label: "Acceso a API", included: false },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "$59 USD",
    period: "/mes",
    commission: "0%",
    commissionLabel: "de comisión",
    highlight: false,
    cta: "Elegir Pro",
    ctaHref: "/abrir?plan=pro",
    features: [
      { label: "Suscriptores ilimitados", included: true },
      { label: "Contenido ilimitado", included: true },
      { label: "Pagos vía Stripe", included: true },
      { label: "Panel de gestión", included: true },
      { label: "Analytics avanzado", included: true },
      { label: "Soporte prioritario", included: true },
      { label: "Acceso a API", included: true },
    ],
  },
];

const SUBSCRIBER_OPTIONS = [50, 100, 200, 500];
const PRICE_OPTIONS = [4990, 7990, 9990, 14990];

const FAQ_ITEMS = [
  {
    q: "¿Cuándo me pagan?",
    a: "Cada mes, directo a tu cuenta bancaria o Stripe. Sin demoras ni retenciones artificiales.",
  },
  {
    q: "¿Puedo cancelar?",
    a: "Sí, cuando quieras y sin penalización. Tu sala seguirá activa hasta el fin del período pagado.",
  },
  {
    q: "¿Mis suscriptores me pertenecen?",
    a: "Siempre. Tus suscriptores son tuyos: puedes exportar la lista completa en cualquier momento.",
  },
  {
    q: "¿Qué pasa si quiero cambiar de plan?",
    a: "Cambias cuando quieras, el ajuste se aplica de inmediato. Sin procesos complicados.",
  },
  {
    q: "¿Aceptan tarjetas chilenas?",
    a: "Sí. Procesamos pagos vía Stripe con tarjetas de débito y crédito emitidas en Chile y el resto del mundo.",
  },
  {
    q: "¿Cómo funciona la comisión?",
    a: "La comisión se descuenta automáticamente de cada cobro. Nunca pagas por adelantado: Sala gana cuando tú ganas.",
  },
];

function formatCLP(n: number) {
  return n.toLocaleString("es-CL");
}

/* ─── Plans Grid ─────────────────────────────────────────────────────────── */

function PlansGrid() {
  return (
    <section className="border-b border-[#DEDEDE] py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <span className="section-label mb-3 inline-block">PLANES</span>
          <hr className="nyt-rule" />
        </div>

        {/* Grid con reglas verticales, sin bordes redondeados */}
        <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#DEDEDE] border-t border-b border-[#DEDEDE]">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`px-8 py-10 flex flex-col relative ${
                plan.highlight ? "bg-[#F7F7F7]" : "bg-white"
              }`}
            >
              {plan.highlight && (
                <div className="absolute top-0 left-8 right-8">
                  <div className="inline-flex items-center gap-2 bg-[#C41C1C] px-3 py-1">
                    <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.1em] text-white">
                      MÁS POPULAR
                    </span>
                  </div>
                </div>
              )}

              <div className={plan.highlight ? "pt-6" : ""}>
                <h3 className="font-serif text-[28px] font-bold text-[#121212] mb-1 tracking-[-0.01em]">
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="font-serif text-[42px] font-bold text-[#121212] tracking-[-0.02em] leading-none">
                    {plan.price}
                  </span>
                  <span className="font-sans text-[13px] text-[#666]">{plan.period}</span>
                </div>
                <p className="font-sans text-[12px] text-[#C41C1C] font-semibold uppercase tracking-[0.08em] mb-6">
                  {plan.commission} {plan.commissionLabel}
                </p>

                <hr className="nyt-rule mb-6" />

                <ul className="flex-1 space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f.label} className="flex items-start gap-3">
                      <span
                        className={`font-sans text-[13px] font-bold leading-none mt-0.5 shrink-0 ${
                          f.included ? "text-[#121212]" : "text-[#DEDEDE]"
                        }`}
                      >
                        {f.included ? "✓" : "✗"}
                      </span>
                      <span
                        className={`font-sans text-[13px] leading-snug ${
                          f.included ? "text-[#121212]" : "text-[#AAAAAA]"
                        }`}
                      >
                        {f.label}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.ctaHref}
                  className={`block font-sans text-[13px] font-medium py-3 text-center transition-colors duration-150 ${
                    plan.highlight
                      ? "bg-[#121212] text-white hover:bg-[#C41C1C]"
                      : "border border-[#121212] text-[#121212] hover:bg-[#121212] hover:text-white"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Calculator ─────────────────────────────────────────────────────────── */

function Calculator() {
  const [subscribers, setSubscribers] = useState(100);
  const [pricePerSub, setPricePerSub] = useState(9990);
  const gross = subscribers * pricePerSub;

  return (
    <section className="border-b border-[#DEDEDE] py-16 px-6 bg-[#F7F7F7]">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <span className="section-label mb-3 inline-block">CALCULADORA DE INGRESOS</span>
          <hr className="nyt-rule" />
        </div>

        <h2 className="font-serif text-[36px] font-bold text-[#121212] mb-2 tracking-[-0.01em]">
          ¿Cuánto podrías ganar?
        </h2>
        <p className="font-sans text-[15px] text-[#666] mb-10">
          Ajusta los valores y ve tu ingreso mensual estimado con cada plan.
        </p>

        {/* Suscriptores */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <label className="font-sans text-[11px] font-semibold text-[#121212] uppercase tracking-[0.1em]">
              N° de suscriptores
            </label>
            <span className="font-serif text-[22px] font-bold text-[#121212]">{subscribers}</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {SUBSCRIBER_OPTIONS.map((n) => (
              <button
                key={n}
                onClick={() => setSubscribers(n)}
                className={`py-2.5 font-sans text-[13px] font-medium border transition-colors duration-150 ${
                  subscribers === n
                    ? "border-[#121212] bg-[#121212] text-white"
                    : "border-[#DEDEDE] bg-white text-[#666] hover:border-[#121212] hover:text-[#121212]"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Precio */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-3">
            <label className="font-sans text-[11px] font-semibold text-[#121212] uppercase tracking-[0.1em]">
              Precio por suscriptor
            </label>
            <span className="font-serif text-[22px] font-bold text-[#121212]">
              ${formatCLP(pricePerSub)} CLP
            </span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {PRICE_OPTIONS.map((p) => (
              <button
                key={p}
                onClick={() => setPricePerSub(p)}
                className={`py-2.5 font-sans text-[13px] font-medium border transition-colors duration-150 ${
                  pricePerSub === p
                    ? "border-[#121212] bg-[#121212] text-white"
                    : "border-[#DEDEDE] bg-white text-[#666] hover:border-[#121212] hover:text-[#121212]"
                }`}
              >
                ${formatCLP(p)}
              </button>
            ))}
          </div>
        </div>

        {/* Resultado */}
        <div className="bg-white border border-[#DEDEDE] p-8">
          <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.12em] text-[#C41C1C] mb-3">
            Con {subscribers} suscriptores a ${formatCLP(pricePerSub)}/mes
          </p>
          <p className="font-serif text-[52px] font-bold text-[#121212] leading-none tracking-[-0.02em] mb-1">
            ${formatCLP(gross)}
          </p>
          <p className="font-sans text-[12px] text-[#888] mb-6">
            CLP al mes · ingreso bruto
          </p>
          <hr className="nyt-rule mb-5" />
          <div className="space-y-3">
            {[
              { label: "Plan Libre", sublabel: "10% comisión", value: Math.round(gross * 0.9) },
              { label: "Plan Creador", sublabel: "3% comisión", value: Math.round(gross * 0.97) },
              { label: "Plan Pro", sublabel: "0% comisión", value: gross },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between">
                <div>
                  <span className="font-sans text-[13px] text-[#121212] font-medium">{row.label}</span>
                  <span className="font-sans text-[11px] text-[#888] ml-2">({row.sublabel})</span>
                </div>
                <span className="font-serif text-[16px] font-bold text-[#121212]">
                  ${formatCLP(row.value)} CLP
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── FAQ ────────────────────────────────────────────────────────────────── */

function FAQItem({ item }: { item: (typeof FAQ_ITEMS)[0] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#DEDEDE] last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-5 text-left gap-6"
      >
        <span className="font-serif text-[17px] font-bold text-[#121212] tracking-[-0.01em]">
          {item.q}
        </span>
        {open
          ? <ChevronUp size={14} className="shrink-0 text-[#C41C1C]" />
          : <ChevronDown size={14} className="shrink-0 text-[#666]" />
        }
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="font-sans text-[14px] text-[#666] leading-relaxed pb-5">
              {item.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FAQ() {
  return (
    <section className="border-b border-[#DEDEDE] py-16 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <span className="section-label mb-3 inline-block">PREGUNTAS FRECUENTES</span>
          <hr className="nyt-rule" />
        </div>
        <div className="bg-white border border-[#DEDEDE] px-8">
          {FAQ_ITEMS.map((item, i) => (
            <FAQItem key={i} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default function PreciosPage() {
  return (
    <div className="min-h-screen bg-white">
      <Nav />

      {/* Hero */}
      <section className="border-b border-[#DEDEDE] py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="section-label mb-4">PRECIOS</p>
          <hr className="nyt-rule mb-8" />
          <h1 className="font-serif text-[52px] md:text-[64px] font-bold text-[#121212] leading-[1.0] tracking-[-0.02em] mb-4">
            Empieza gratis.
            <br />
            Gana desde el primer día.
          </h1>
          <p className="font-sans text-[18px] text-[#555] max-w-lg">
            Sala solo gana cuando tú ganas. Sin cuotas fijas que te ahoguen cuando empiezas.
          </p>
        </div>
      </section>

      <PlansGrid />
      <Calculator />
      <FAQ />

      {/* CTA final */}
      <section className="border-b border-[#DEDEDE] py-16 px-6 text-center bg-[#F7F7F7]">
        <div className="max-w-xl mx-auto">
          <h2 className="font-serif text-[32px] font-bold text-[#121212] italic mb-4 tracking-[-0.01em]">
            ¿Listo para abrir tu sala?
          </h2>
          <p className="font-sans text-[14px] text-[#666] mb-6">
            Gratis para empezar · Sin tarjeta de crédito · 15 minutos para configurar
          </p>
          <Link
            href="/abrir"
            className="inline-block font-sans text-[13px] font-medium px-10 py-4 bg-[#121212] text-white hover:bg-[#C41C1C] transition-colors duration-150"
          >
            Abrir mi sala gratis →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#DEDEDE] py-6 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="font-sans text-[11px] uppercase tracking-[0.1em] text-[#888]">
            SALA · CHILE · 2025
          </span>
          <a href="mailto:hello@sala.lat" className="font-sans text-[11px] text-[#888] hover:text-[#121212] transition-colors">
            hello@sala.lat
          </a>
        </div>
      </footer>
    </div>
  );
}
