"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronDown, ChevronUp } from "lucide-react";

/* ─── Data ──────────────────────────────────────────────────────────────── */

const PLANS = [
  {
    id: "libre",
    name: "Libre",
    price: "$0",
    period: "/mes",
    commission: "Sala toma 10%",
    popular: false,
    cta: "Abrir mi sala gratis",
    ctaHref: "/abrir",
    features: [
      "Hasta 500 suscriptores",
      "Contenido ilimitado",
      "Stripe incluido",
      "Panel de gestión",
    ],
  },
  {
    id: "creador",
    name: "Creador",
    price: "$29 USD",
    period: "/mes",
    commission: "Sala toma 3%",
    popular: true,
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
    commission: "Sala toma 0%",
    popular: false,
    cta: "Elegir Pro",
    ctaHref: "/abrir?plan=pro",
    features: [
      "Todo lo del plan Creador",
      "API access",
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

/* ─── PlanCard ──────────────────────────────────────────────────────────── */

function PlanCard({
  plan,
  index,
}: {
  plan: (typeof PLANS)[0];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 + index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className={`relative flex flex-col rounded-xl border p-6 bg-white ${
        plan.popular ? "border-[#0066FF]" : "border-[#E5E7EB]"
      }`}
    >
      {/* Popular badge */}
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="rounded-full bg-[#0066FF] px-3 py-0.5 font-[var(--font-inter),Inter,sans-serif] text-[11px] font-[600] text-white">
            Más popular
          </span>
        </div>
      )}

      {/* Header */}
      <div className="mb-5">
        <h3 className="font-[var(--font-inter),Inter,sans-serif] text-lg font-[700] tracking-tight text-[#0A0A0A]">
          {plan.name}
        </h3>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="font-[var(--font-inter),Inter,sans-serif] text-3xl font-[800] tracking-tight text-[#0A0A0A]">
            {plan.price}
          </span>
          <span className="font-[var(--font-inter),Inter,sans-serif] text-sm text-[#6B7280]">
            {plan.period}
          </span>
        </div>
        <span className="mt-2 inline-block font-[var(--font-inter),Inter,sans-serif] text-xs text-[#6B7280]">
          {plan.commission}
        </span>
      </div>

      {/* Features */}
      <ul className="mb-6 flex flex-col gap-2.5 flex-1">
        {plan.features.map((f) => (
          <li key={f} className="flex items-center gap-2.5">
            <Check
              size={14}
              className={plan.popular ? "text-[#0066FF] shrink-0" : "text-[#6B7280] shrink-0"}
            />
            <span className="font-[var(--font-inter),Inter,sans-serif] text-sm text-[#0A0A0A]">
              {f}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <a
        href={plan.ctaHref}
        className={`block w-full rounded-lg py-2.5 text-center font-[var(--font-inter),Inter,sans-serif] text-sm font-[600] transition-all duration-150 active:scale-[0.98] ${
          plan.popular
            ? "bg-[#0066FF] text-white hover:bg-[#0052CC]"
            : "border border-[#E5E7EB] bg-[#F8F8F8] text-[#0A0A0A] hover:border-[#0A0A0A]"
        }`}
      >
        {plan.cta}
      </a>
    </motion.div>
  );
}

/* ─── Calculator ────────────────────────────────────────────────────────── */

function Calculator() {
  const [subscribers, setSubscribers] = useState(100);
  const [pricePerSub, setPricePerSub] = useState(9990);

  const gross = subscribers * pricePerSub;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="mx-auto mt-16 w-full max-w-2xl rounded-xl border border-[#E5E7EB] bg-white p-8"
    >
      <h2 className="mb-1 font-[var(--font-inter),Inter,sans-serif] text-xl font-[700] tracking-tight text-[#0A0A0A]">
        ¿Cuánto podrías ganar?
      </h2>
      <p className="mb-8 font-[var(--font-inter),Inter,sans-serif] text-sm text-[#6B7280]">
        Ajusta los valores y ve tu ingreso mensual estimado.
      </p>

      {/* Suscriptores */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <label className="font-[var(--font-inter),Inter,sans-serif] text-sm font-[500] text-[#0A0A0A]">
            Número de suscriptores
          </label>
          <span className="font-[var(--font-inter),Inter,sans-serif] text-sm font-[700] text-[#0066FF]">
            {subscribers}
          </span>
        </div>
        <div className="flex gap-2">
          {SUBSCRIBER_OPTIONS.map((n) => (
            <button
              key={n}
              onClick={() => setSubscribers(n)}
              className={`flex-1 rounded-lg border py-2 font-[var(--font-inter),Inter,sans-serif] text-sm font-[500] transition-all duration-150 ${
                subscribers === n
                  ? "border-[#0066FF] bg-[#EEF4FF] text-[#0066FF]"
                  : "border-[#E5E7EB] text-[#6B7280] hover:border-[#0A0A0A] hover:text-[#0A0A0A]"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Precio por suscriptor */}
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between">
          <label className="font-[var(--font-inter),Inter,sans-serif] text-sm font-[500] text-[#0A0A0A]">
            Precio por suscriptor
          </label>
          <span className="font-[var(--font-inter),Inter,sans-serif] text-sm font-[700] text-[#0066FF]">
            ${formatCLP(pricePerSub)} CLP/mes
          </span>
        </div>
        <div className="flex gap-2">
          {PRICE_OPTIONS.map((p) => (
            <button
              key={p}
              onClick={() => setPricePerSub(p)}
              className={`flex-1 rounded-lg border py-2 font-[var(--font-inter),Inter,sans-serif] text-sm font-[500] transition-all duration-150 ${
                pricePerSub === p
                  ? "border-[#0066FF] bg-[#EEF4FF] text-[#0066FF]"
                  : "border-[#E5E7EB] text-[#6B7280] hover:border-[#0A0A0A] hover:text-[#0A0A0A]"
              }`}
            >
              ${formatCLP(p)}
            </button>
          ))}
        </div>
      </div>

      {/* Resultado */}
      <div className="rounded-lg border border-[#E5E7EB] bg-[#F8F8F8] p-5">
        <p className="mb-0.5 font-[var(--font-inter),Inter,sans-serif] text-xs font-[600] uppercase tracking-widest text-[#6B7280]">
          Tu ingreso estimado
        </p>
        <p className="font-[var(--font-inter),Inter,sans-serif] text-3xl font-[800] tracking-tight text-[#0066FF]">
          ${formatCLP(gross)} CLP
        </p>
        <p className="mt-1 font-[var(--font-inter),Inter,sans-serif] text-xs text-[#6B7280]">
          Con {subscribers} suscriptores a ${formatCLP(pricePerSub)}/mes · Plan Pro (0%)
        </p>
        <div className="mt-4 border-t border-[#E5E7EB] pt-4 flex flex-col gap-1.5">
          <div className="flex justify-between">
            <span className="font-[var(--font-inter),Inter,sans-serif] text-xs text-[#6B7280]">Plan Libre (10%)</span>
            <span className="font-[var(--font-inter),Inter,sans-serif] text-xs font-[500] text-[#0A0A0A]">
              ${formatCLP(Math.round(gross * 0.9))} CLP
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-[var(--font-inter),Inter,sans-serif] text-xs text-[#6B7280]">Plan Creador (3%)</span>
            <span className="font-[var(--font-inter),Inter,sans-serif] text-xs font-[500] text-[#0A0A0A]">
              ${formatCLP(Math.round(gross * 0.97))} CLP
            </span>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

/* ─── FAQItem ────────────────────────────────────────────────────────────── */

function FAQItem({ item, index }: { item: (typeof FAQ_ITEMS)[0]; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.55 + index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className="border-b border-[#E5E7EB] last:border-0"
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-4 text-left"
      >
        <span className="font-[var(--font-inter),Inter,sans-serif] text-sm font-[500] text-[#0A0A0A] pr-4">
          {item.q}
        </span>
        {open ? (
          <ChevronUp size={15} className="shrink-0 text-[#0066FF]" />
        ) : (
          <ChevronDown size={15} className="shrink-0 text-[#6B7280]" />
        )}
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
            <p className="pb-4 font-[var(--font-inter),Inter,sans-serif] text-sm text-[#6B7280] leading-relaxed">
              {item.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Page ──────────────────────────────────────────────────────────────── */

export default function PreciosPage() {
  return (
    <main className="min-h-screen bg-[#F8F8F8] px-6 py-20">

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#E5E7EB] bg-[#F8F8F8]/90 backdrop-blur-md">
        <div className="mx-auto flex h-12 max-w-5xl items-center justify-between px-6">
          <a href="/" className="font-[var(--font-inter),Inter,sans-serif] text-sm font-[700] tracking-tight text-[#0A0A0A]">
            Sala
          </a>
          <a
            href="/abrir"
            className="rounded-md bg-[#0066FF] px-3 py-1.5 font-[var(--font-inter),Inter,sans-serif] text-xs font-[600] text-white transition-colors hover:bg-[#0052CC]"
          >
            Abrir mi sala
          </a>
        </div>
      </nav>

      <div className="mx-auto max-w-5xl pt-8">

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-14 text-center"
        >
          <h1 className="mb-3 font-[var(--font-inter),Inter,sans-serif] text-4xl font-[800] leading-tight tracking-tight text-[#0A0A0A] sm:text-5xl">
            Empieza gratis.{" "}
            <span className="text-[#0066FF]">Gana desde el primer día.</span>
          </h1>
          <p className="mx-auto max-w-sm font-[var(--font-inter),Inter,sans-serif] text-base text-[#6B7280]">
            Sala solo gana cuando tú ganas.
          </p>
        </motion.div>

        {/* Plans */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
          transition={{ duration: 0.4, delay: 0.5 }}
          className="mx-auto mt-16 max-w-2xl"
        >
          <h2 className="mb-6 font-[var(--font-inter),Inter,sans-serif] text-xl font-[700] tracking-tight text-[#0A0A0A]">
            Preguntas frecuentes
          </h2>
          <div className="rounded-xl border border-[#E5E7EB] bg-white px-6">
            {FAQ_ITEMS.map((item, i) => (
              <FAQItem key={i} item={item} index={i} />
            ))}
          </div>
        </motion.section>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.85 }}
          className="mt-16 text-center"
        >
          <p className="mb-4 font-[var(--font-inter),Inter,sans-serif] text-sm text-[#6B7280]">
            ¿Listo para abrir tu sala?
          </p>
          <a
            href="/abrir"
            className="inline-block rounded-lg bg-[#0066FF] px-7 py-3 font-[var(--font-inter),Inter,sans-serif] text-sm font-[600] text-white transition-all hover:bg-[#0052CC] active:scale-[0.98]"
          >
            Abrir mi sala gratis →
          </a>
        </motion.div>
      </div>
    </main>
  );
}
