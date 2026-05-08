"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

const PLANS = [
  {
    id: "libre",
    name: "Libre",
    price: "$0",
    period: "/mes",
    commission: "10% de comisión",
    highlight: false,
    cta: "Abrir mi sala gratis",
    ctaHref: "/abrir",
    features: [
      "Hasta 500 suscriptores",
      "Contenido ilimitado",
      "Pagos vía Stripe",
      "Panel de gestión",
    ],
  },
  {
    id: "creador",
    name: "Creador",
    price: "$29 USD",
    period: "/mes",
    commission: "3% de comisión",
    highlight: true,
    cta: "Elegir Creador",
    ctaHref: "/abrir?plan=creador",
    features: [
      "Suscriptores ilimitados",
      "Analytics avanzado",
      "Soporte prioritario",
      "Todo lo del plan Libre",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "$59 USD",
    period: "/mes",
    commission: "0% de comisión",
    highlight: false,
    cta: "Elegir Pro",
    ctaHref: "/abrir?plan=pro",
    features: [
      "Todo lo del plan Creador",
      "Acceso a API",
      "White-label (próximo)",
      "SLA prioritario",
    ],
  },
];

const SUBSCRIBER_OPTIONS = [50, 100, 200, 500];
const PRICE_OPTIONS = [5000, 9990, 14990];

function formatCLP(n: number) {
  return n.toLocaleString("es-CL");
}

const FAQ_ITEMS = [
  {
    q: "¿Cuándo me pagan?",
    a: "Cada mes, directo a tu cuenta bancaria o Stripe. Sin demoras ni retenciones.",
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
];

function PricingNav() {
  return (
    <header>
      <div className="h-[3px] bg-[#C41C1C] w-full" />
      <div className="border-b border-[#DEDEDE] py-3 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <a href="/" className="font-serif text-[22px] font-bold text-[#121212] leading-none" style={{ letterSpacing: "-0.01em" }}>
            SALA
          </a>
          <a
            href="/abrir"
            className="font-sans text-[12px] font-medium px-4 py-1.5 bg-[#121212] text-white hover:bg-[#333] transition-colors duration-150"
          >
            Abrir mi sala
          </a>
        </div>
      </div>
    </header>
  );
}

function PlansGrid() {
  return (
    <section className="py-14 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-5">
          <span className="section-label mb-3 inline-block">PLANES</span>
          <hr className="nyt-rule" />
        </div>
        <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#DEDEDE] border border-[#DEDEDE]">
          {PLANS.map((plan) => (
            <div key={plan.id} className={`p-8 flex flex-col ${plan.highlight ? "bg-[#F7F7F7]" : "bg-white"}`}>
              {plan.highlight && (
                <span className="section-label mb-3 inline-block">MÁS ELEGIDO</span>
              )}
              <h3 className="font-serif text-[24px] font-bold text-[#121212] mb-1" style={{ letterSpacing: "-0.01em" }}>
                {plan.name}
              </h3>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="font-serif text-[36px] font-bold text-[#121212]" style={{ letterSpacing: "-0.02em" }}>
                  {plan.price}
                </span>
                <span className="font-sans text-[13px] text-[#666666]">{plan.period}</span>
              </div>
              <p className="font-sans text-[12px] text-[#C41C1C] font-semibold tracking-wide uppercase mb-6">
                {plan.commission}
              </p>
              <hr className="nyt-rule mb-6" />
              <ul className="flex-1 space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <span className="font-serif text-[#121212] leading-none mt-0.5">—</span>
                    <span className="font-sans text-[13px] text-[#121212] leading-snug">{f}</span>
                  </li>
                ))}
              </ul>
              <a
                href={plan.ctaHref}
                className={`font-sans text-[13px] font-medium py-2.5 text-center transition-colors duration-150 ${
                  plan.highlight
                    ? "bg-[#121212] text-white hover:bg-[#333]"
                    : "border border-[#121212] text-[#121212] hover:bg-[#121212] hover:text-white"
                }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Calculator() {
  const [subscribers, setSubscribers] = useState(100);
  const [pricePerSub, setPricePerSub] = useState(9990);
  const gross = subscribers * pricePerSub;

  return (
    <section className="border-t border-[#DEDEDE] py-14 px-6 bg-[#F7F7F7]">
      <div className="max-w-3xl mx-auto">
        <div className="mb-5">
          <span className="section-label mb-3 inline-block">CALCULADORA DE INGRESOS</span>
          <hr className="nyt-rule" />
        </div>
        <h2 className="font-serif text-[28px] font-bold text-[#121212] mb-2" style={{ letterSpacing: "-0.01em" }}>
          ¿Cuánto podrías ganar?
        </h2>
        <p className="font-sans text-[14px] text-[#666666] mb-10">
          Ajusta los valores y ve tu ingreso mensual estimado con cada plan.
        </p>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <label className="font-sans text-[13px] font-semibold text-[#121212] uppercase tracking-wide">
              Suscriptores
            </label>
            <span className="font-serif text-[20px] font-bold text-[#121212]">{subscribers}</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {SUBSCRIBER_OPTIONS.map((n) => (
              <button
                key={n}
                onClick={() => setSubscribers(n)}
                className={`py-2 font-sans text-[13px] font-medium border transition-colors duration-150 ${
                  subscribers === n
                    ? "border-[#121212] bg-[#121212] text-white"
                    : "border-[#DEDEDE] text-[#666666] hover:border-[#121212] hover:text-[#121212]"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-10">
          <div className="flex items-center justify-between mb-3">
            <label className="font-sans text-[13px] font-semibold text-[#121212] uppercase tracking-wide">
              Precio por suscriptor
            </label>
            <span className="font-serif text-[20px] font-bold text-[#121212]">
              ${formatCLP(pricePerSub)} CLP
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {PRICE_OPTIONS.map((p) => (
              <button
                key={p}
                onClick={() => setPricePerSub(p)}
                className={`py-2 font-sans text-[13px] font-medium border transition-colors duration-150 ${
                  pricePerSub === p
                    ? "border-[#121212] bg-[#121212] text-white"
                    : "border-[#DEDEDE] text-[#666666] hover:border-[#121212] hover:text-[#121212]"
                }`}
              >
                ${formatCLP(p)}
              </button>
            ))}
          </div>
        </div>

        <div className="border border-[#DEDEDE] bg-white p-8">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-widest text-[#666666] mb-2">
            Tu ingreso estimado
          </p>
          <p className="font-serif text-[48px] font-bold text-[#121212] leading-none mb-1" style={{ letterSpacing: "-0.02em" }}>
            ${formatCLP(gross)}
          </p>
          <p className="font-sans text-[12px] text-[#666666] mb-6">
            CLP al mes · con {subscribers} suscriptores a ${formatCLP(pricePerSub)}
          </p>
          <hr className="nyt-rule mb-5" />
          <div className="space-y-3">
            {[
              { label: "Plan Libre (10% comisión)", value: Math.round(gross * 0.9) },
              { label: "Plan Creador (3% comisión)", value: Math.round(gross * 0.97) },
              { label: "Plan Pro (0% comisión)", value: gross },
            ].map((row) => (
              <div key={row.label} className="flex justify-between">
                <span className="font-sans text-[12px] text-[#666666]">{row.label}</span>
                <span className="font-sans text-[12px] font-semibold text-[#121212]">
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

function FAQItem({ item, index }: { item: (typeof FAQ_ITEMS)[0]; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#DEDEDE] last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-4 text-left gap-4"
      >
        <span className="font-serif text-[16px] font-bold text-[#121212]" style={{ letterSpacing: "-0.01em" }}>
          {item.q}
        </span>
        {open
          ? <ChevronUp size={14} className="shrink-0 text-[#C41C1C]" />
          : <ChevronDown size={14} className="shrink-0 text-[#666666]" />
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
            <p className="font-sans text-[13px] text-[#666666] leading-relaxed pb-5">
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
    <section className="border-t border-[#DEDEDE] py-14 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-5">
          <span className="section-label mb-3 inline-block">PREGUNTAS FRECUENTES</span>
          <hr className="nyt-rule" />
        </div>
        <div className="border border-[#DEDEDE] bg-white px-8">
          {FAQ_ITEMS.map((item, i) => (
            <FAQItem key={i} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingFooter() {
  return (
    <footer className="border-t border-[#DEDEDE] py-6 px-6">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <span className="font-sans text-[11px] font-semibold uppercase tracking-widest text-[#666666]">
          SALA · CHILE · 2025
        </span>
        <a href="mailto:hello@sala.lat" className="font-sans text-[12px] text-[#666666] hover:text-[#121212] transition-colors duration-150">
          hello@sala.lat
        </a>
      </div>
    </footer>
  );
}

export default function PreciosPage() {
  return (
    <main className="min-h-screen bg-white">
      <PricingNav />
      <PlansGrid />
      <Calculator />
      <FAQ />
      <div className="border-t border-[#DEDEDE] py-14 px-6 text-center">
        <p className="font-sans text-[13px] text-[#666666] mb-5">¿Listo para abrir tu sala?</p>
        <a
          href="/abrir"
          className="font-sans text-[13px] font-medium px-8 py-3 bg-[#121212] text-white hover:bg-[#333] transition-colors duration-150 inline-block"
        >
          Abrir mi sala gratis →
        </a>
      </div>
      <PricingFooter />
    </main>
  );
}
