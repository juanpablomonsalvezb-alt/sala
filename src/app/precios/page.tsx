"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, ChevronDown, ChevronUp } from "lucide-react";

/* ─── Data ──────────────────────────────────────────────────────────────── */

const PLANS = [
  {
    id: "libre",
    name: "Libre",
    tagline: "Para empezar",
    price: 0,
    priceLabel: "$0",
    period: "/mes",
    commission: "10%",
    commissionLabel: "Sala toma el 10% de tus ingresos",
    popular: false,
    cta: "Abrir mi sala gratis",
    ctaHref: "/abrir",
    features: [
      "Hasta 500 suscriptores",
      "Contenido ilimitado",
      "Pagos vía Stripe",
      "Panel de gestión",
      "Página de sala personalizada",
    ],
  },
  {
    id: "creador",
    name: "Creador",
    tagline: "El más popular",
    price: 29,
    priceLabel: "$29 USD",
    period: "/mes",
    commission: "3%",
    commissionLabel: "Sala toma solo el 3%",
    popular: true,
    cta: "Elegir Creador",
    ctaHref: "/abrir?plan=creador",
    features: [
      "Suscriptores ilimitados",
      "Analytics avanzado",
      "Dominio propio (próximamente)",
      "Soporte prioritario",
      "Todo lo del plan Libre",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "Para los que escalan",
    price: 59,
    priceLabel: "$59 USD",
    period: "/mes",
    commission: "0%",
    commissionLabel: "Sala toma 0% — todo es tuyo",
    popular: false,
    cta: "Elegir Pro",
    ctaHref: "/abrir?plan=pro",
    features: [
      "Todo lo del plan Creador",
      "API access",
      "Exportación de datos",
      "White-label (próximamente)",
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

/* ─── Components ────────────────────────────────────────────────────────── */

function PlanCard({
  plan,
  index,
}: {
  plan: (typeof PLANS)[0];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 + index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className={`relative flex flex-col rounded-2xl border p-8 ${
        plan.popular
          ? "border-[#C9A96E] bg-[#111111]"
          : "border-[#1E1E1E] bg-[#0D0D0D]"
      }`}
    >
      {plan.popular && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="rounded-full bg-[#C9A96E] px-4 py-1 text-[11px] font-semibold uppercase tracking-widest text-[#0A0A0A]">
            Más popular
          </span>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <p className="mb-1 font-sans text-xs font-medium uppercase tracking-widest text-[#8A8070]">
          {plan.tagline}
        </p>
        <h3
          className="font-serif text-2xl font-semibold text-[#F5F0E8]"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {plan.name}
        </h3>
      </div>

      {/* Price */}
      <div className="mb-2">
        <div className="flex items-baseline gap-1">
          <span
            className="font-serif text-4xl font-bold text-[#F5F0E8]"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {plan.priceLabel}
          </span>
          <span className="font-sans text-sm text-[#8A8070]">{plan.period}</span>
        </div>
      </div>

      {/* Commission badge */}
      <div className="mb-6">
        <span
          className={`inline-block rounded-full px-3 py-1 font-sans text-xs font-medium ${
            plan.popular
              ? "bg-[#C9A96E]/15 text-[#C9A96E]"
              : "bg-[#1E1E1E] text-[#8A8070]"
          }`}
        >
          {plan.commissionLabel}
        </span>
      </div>

      {/* Features */}
      <ul className="mb-8 flex flex-col gap-3">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-3">
            <Check
              size={15}
              className={`mt-0.5 shrink-0 ${
                plan.popular ? "text-[#C9A96E]" : "text-[#8A8070]"
              }`}
            />
            <span className="font-sans text-sm text-[#F5F0E8]/80">{f}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <div className="mt-auto">
        <a
          href={plan.ctaHref}
          className={`block w-full rounded-xl py-3.5 text-center font-sans text-sm font-semibold transition-all duration-200 ${
            plan.popular
              ? "bg-[#C9A96E] text-[#0A0A0A] hover:bg-[#D4B47A]"
              : "border border-[#1E1E1E] text-[#F5F0E8]/70 hover:border-[#C9A96E]/40 hover:text-[#F5F0E8]"
          }`}
        >
          {plan.cta}
        </a>
      </div>
    </motion.div>
  );
}

function Calculator() {
  const [subscribers, setSubscribers] = useState(100);
  const [pricePerSub, setPricePerSub] = useState(9990);

  const gross = subscribers * pricePerSub;
  const commissionFree = gross; // Plan Pro: 0%

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="mx-auto mt-20 w-full max-w-2xl rounded-2xl border border-[#1E1E1E] bg-[#0D0D0D] p-8"
    >
      <h2
        className="mb-2 font-serif text-2xl font-semibold text-[#F5F0E8]"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        ¿Cuánto ganarías?
      </h2>
      <p className="mb-8 font-sans text-sm text-[#8A8070]">
        Ajusta los valores y ve tu ingreso mensual estimado.
      </p>

      {/* Subscribers */}
      <div className="mb-6">
        <div className="mb-3 flex items-center justify-between">
          <label className="font-sans text-sm font-medium text-[#F5F0E8]/80">
            Número de suscriptores
          </label>
          <span className="font-sans text-sm font-semibold text-[#C9A96E]">
            {subscribers}
          </span>
        </div>
        <div className="flex gap-2">
          {SUBSCRIBER_OPTIONS.map((n) => (
            <button
              key={n}
              onClick={() => setSubscribers(n)}
              className={`flex-1 rounded-lg border py-2.5 font-sans text-sm font-medium transition-all duration-150 ${
                subscribers === n
                  ? "border-[#C9A96E] bg-[#C9A96E]/10 text-[#C9A96E]"
                  : "border-[#1E1E1E] text-[#8A8070] hover:border-[#C9A96E]/30 hover:text-[#F5F0E8]/60"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Price per subscriber */}
      <div className="mb-8">
        <div className="mb-3 flex items-center justify-between">
          <label className="font-sans text-sm font-medium text-[#F5F0E8]/80">
            Precio por suscriptor
          </label>
          <span className="font-sans text-sm font-semibold text-[#C9A96E]">
            ${formatCLP(pricePerSub)} CLP/mes
          </span>
        </div>
        <div className="flex gap-2">
          {PRICE_OPTIONS.map((p) => (
            <button
              key={p}
              onClick={() => setPricePerSub(p)}
              className={`flex-1 rounded-lg border py-2.5 font-sans text-sm font-medium transition-all duration-150 ${
                pricePerSub === p
                  ? "border-[#C9A96E] bg-[#C9A96E]/10 text-[#C9A96E]"
                  : "border-[#1E1E1E] text-[#8A8070] hover:border-[#C9A96E]/30 hover:text-[#F5F0E8]/60"
              }`}
            >
              ${formatCLP(p)}
            </button>
          ))}
        </div>
      </div>

      {/* Result */}
      <div className="rounded-xl bg-[#111111] p-6">
        <p className="mb-1 font-sans text-xs uppercase tracking-widest text-[#8A8070]">
          Tu ingreso estimado
        </p>
        <p
          className="font-serif text-4xl font-bold text-[#C9A96E]"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          ${formatCLP(commissionFree)} CLP
        </p>
        <p className="mt-2 font-sans text-sm text-[#8A8070]">
          Con {subscribers} suscriptores a ${formatCLP(pricePerSub)}/mes · Plan Pro (0% comisión)
        </p>
        <div className="mt-4 border-t border-[#1E1E1E] pt-4">
          <div className="flex justify-between">
            <span className="font-sans text-xs text-[#8A8070]">Plan Libre (10%)</span>
            <span className="font-sans text-xs text-[#F5F0E8]/60">
              ${formatCLP(Math.round(gross * 0.9))} CLP
            </span>
          </div>
          <div className="mt-1.5 flex justify-between">
            <span className="font-sans text-xs text-[#8A8070]">Plan Creador (3%)</span>
            <span className="font-sans text-xs text-[#F5F0E8]/60">
              ${formatCLP(Math.round(gross * 0.97))} CLP
            </span>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

function FAQItem({ item, index }: { item: (typeof FAQ_ITEMS)[0]; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.6 + index * 0.07, ease: [0.16, 1, 0.3, 1] }}
      className="border-b border-[#1E1E1E]"
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-5 text-left"
      >
        <span className="font-sans text-base font-medium text-[#F5F0E8]/90 pr-4">
          {item.q}
        </span>
        {open ? (
          <ChevronUp size={16} className="shrink-0 text-[#C9A96E]" />
        ) : (
          <ChevronDown size={16} className="shrink-0 text-[#8A8070]" />
        )}
      </button>
      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.25 }}
          className="pb-5"
        >
          <p className="font-sans text-sm leading-relaxed text-[#8A8070]">{item.a}</p>
        </motion.div>
      )}
    </motion.div>
  );
}

/* ─── Page ──────────────────────────────────────────────────────────────── */

export default function PreciosPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] px-6 py-24">
      <div className="mx-auto max-w-5xl">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 text-center"
        >
          <div className="mb-4 inline-block">
            <span className="rounded-full border border-[#C9A96E]/30 px-4 py-1.5 font-sans text-xs font-medium uppercase tracking-widest text-[#C9A96E]">
              Planes para creadores
            </span>
          </div>
          <h1
            className="mb-4 font-serif text-4xl font-bold leading-tight text-[#F5F0E8] sm:text-5xl md:text-6xl"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Empieza gratis.
            <br />
            <em>Gana desde el primer día.</em>
          </h1>
          <p className="mx-auto max-w-md font-sans text-base text-[#8A8070] sm:text-lg">
            Sala solo gana cuando tú ganas.
          </p>
        </motion.div>

        {/* Plans grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {PLANS.map((plan, i) => (
            <PlanCard key={plan.id} plan={plan} index={i} />
          ))}
        </div>

        {/* Calculator */}
        <Calculator />

        {/* FAQ */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.55 }}
          className="mx-auto mt-20 max-w-2xl"
        >
          <h2
            className="mb-8 font-serif text-2xl font-semibold text-[#F5F0E8]"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Preguntas frecuentes
          </h2>
          <div>
            {FAQ_ITEMS.map((item, i) => (
              <FAQItem key={i} item={item} index={i} />
            ))}
          </div>
        </motion.section>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="mt-20 text-center"
        >
          <p className="mb-6 font-sans text-sm text-[#8A8070]">
            ¿Listo para abrir tu sala?
          </p>
          <a
            href="/abrir"
            className="inline-block rounded-xl bg-[#C9A96E] px-8 py-4 font-sans text-sm font-semibold text-[#0A0A0A] transition-all duration-200 hover:bg-[#D4B47A] hover:shadow-[0_0_40px_rgba(201,169,110,0.2)]"
          >
            Abrir mi sala gratis →
          </a>
        </motion.div>
      </div>
    </main>
  );
}
