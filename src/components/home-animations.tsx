"use client";

import Link from "next/link";
import { useState } from "react";
import { NumberTicker } from "@/components/ui/number-ticker";
import { BlurFade } from "@/components/ui/blur-fade";
import { Marquee } from "@/components/ui/marquee";
import { AnimatedList } from "@/components/ui/animated-list";
import { LineShadowText } from "@/components/ui/line-shadow-text";
import { SpinningText } from "@/components/ui/spinning-text";
import { PricingCalculator } from "@/components/PricingCalculator";
import {
  IconArrowRight,
  IconTrendingUp,
  IconChevronDown,
  IconChevronUp,
} from "@tabler/icons-react";

/* ─── Types ─────────────────────────────────────────────────────────────── */

interface Creator {
  initial: string;
  name: string;
  specialty: string;
  color: string;
  earnings: string;
  trend: string;
  subscribers: number;
  posts: number;
  since: string;
  href: string;
}

interface Feature {
  num: string;
  title: string;
  body: string;
}

interface Plan {
  name: string;
  price: string;
  period: string;
  note: string;
  cta: string;
  featured: boolean;
  perks: string[];
}

interface Faq {
  q: string;
  a: string;
}

interface LiveEvent {
  initial: string;
  color: string;
  name: string;
  creator: string;
  tag: string;
  price: string;
  time: string;
}

/* ─── FaqItem (necesita useState) ──────────────────────────────────────── */

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <button
      className="w-full text-left border-b border-[#E0E0E0] py-5 group"
      onClick={() => setOpen(!open)}
    >
      <div className="flex items-center justify-between gap-4">
        <span className="text-[15px] font-semibold text-[#111] group-hover:text-[#B31C1C] transition-colors">
          {q}
        </span>
        {open ? (
          <IconChevronUp size={15} className="text-[#B31C1C] shrink-0" />
        ) : (
          <IconChevronDown size={15} className="text-[#767676] shrink-0" />
        )}
      </div>
      {open && (
        <p className="text-[14px] leading-[1.75] text-[#555] mt-3 pr-6">{a}</p>
      )}
    </button>
  );
}

/* ─── HeroSpinningBadge — Solo el badge con SpinningText ────────────────── */

export function HeroSpinningBadge() {
  return (
    <BlurFade delay={0.15}>
      <div className="hidden md:flex flex-col items-end gap-3">
        <div className="flex items-center justify-center relative w-28 h-28">
          <SpinningText
            radius={4.2}
            duration={12}
            className="text-[10px] font-bold uppercase tracking-widest text-[#B31C1C]"
          >
            {"COBRA · LO · QUE · SABES · "}
          </SpinningText>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 bg-[#B31C1C] flex items-center justify-center">
              <span className="text-white font-black text-[18px]">→</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#767676]">
            Edición N°1 · 2025
          </p>
        </div>
      </div>
    </BlurFade>
  );
}

/* ─── HeroAnimations — Lista de creadores animada ───────────────────────── */

export interface HeroAnimationsProps {
  featuredCreators: Creator[];
}

export function HeroAnimations({ featuredCreators }: HeroAnimationsProps) {
  return (
    <>
      {/* Lista editorial de creadores */}
      {featuredCreators.map((c, i) => (
        <BlurFade key={c.name} delay={0.1 + i * 0.07}>
          <Link
            href={c.href}
            className="group flex items-center gap-0 border-b border-[#EBEBEB] py-5 hover:bg-[#FAFAFA] -mx-6 px-6 transition-all duration-200 relative"
          >
            <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#B31C1C] scale-y-0 group-hover:scale-y-100 transition-transform duration-200 origin-center" />
            <span className="font-serif text-[13px] text-[#B0B0B0] w-9 shrink-0 font-bold">
              {String(i + 1).padStart(2, "0")}.
            </span>
            <div
              className="w-9 h-9 flex items-center justify-center shrink-0 mr-5 text-[11px] font-black text-white"
              style={{ backgroundColor: c.color }}
            >
              {c.initial}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-serif font-bold text-[clamp(15px,1.8vw,20px)] tracking-[-0.01em] group-hover:text-[#B31C1C] transition-colors">
                {c.name}
              </p>
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#B31C1C] mt-0.5">
                {c.specialty} · {c.subscribers.toLocaleString()} suscriptores · {c.posts} pub. · desde {c.since}
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 shrink-0">
              <IconTrendingUp size={11} className="text-emerald-600" />
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5">
                {c.trend}
              </span>
            </div>
            <IconArrowRight
              size={14}
              className="text-[#C0C0C0] ml-4 shrink-0 group-hover:text-[#B31C1C] transition-colors"
            />
          </Link>
        </BlurFade>
      ))}
    </>
  );
}

/* ─── PlatformStats — cifras de la plataforma (sección de creadores) ────── */

export function PlatformStats() {
  return (
    <>
      {/* Stats bar con NumberTicker */}
      <BlurFade delay={0.45}>
        <div className="grid grid-cols-4 divide-x divide-[#EBEBEB] py-5">
          {[
            { value: 34,   pre: "",  suf: "",  label: "Creadores activos" },
            { value: 2418, pre: "",  suf: "+", label: "Suscriptores pagando" },
            { value: 180,  pre: "$", suf: "K", label: "Generados en 2025" },
            { value: 95,   pre: "",  suf: "%", label: "Retención mensual" },
          ].map(({ value, pre, suf, label }) => (
            <div key={label} className="px-5 first:pl-0 last:pr-0 text-center">
              <p className="font-serif font-bold text-[clamp(18px,2.5vw,32px)] leading-[1.2] tracking-[-0.02em] flex items-baseline justify-center gap-0.5">
                {pre && <span className="text-[#B31C1C] font-serif">{pre}</span>}
                <NumberTicker value={value} className="text-[#111]" />
                {suf && <span className="text-[#B31C1C] font-serif">{suf}</span>}
              </p>
              <p className="text-[8px] uppercase tracking-[0.18em] text-[#A0A0A0] mt-1.5 font-bold">
                {label}
              </p>
            </div>
          ))}
        </div>
      </BlurFade>
    </>
  );
}

/* ─── CategoryMarquee ────────────────────────────────────────────────────── */

export function CategoryMarquee() {
  return (
    <div className="bg-[#111] border-y border-[#111] py-3 overflow-hidden">
      <Marquee duration={40} pauseOnHover>
        {[
          "ECONOMÍA","DERECHO","MEDICINA","ARQUITECTURA","FINANZAS",
          "EDUCACIÓN","TECNOLOGÍA","MARKETING","CIENCIA POLÍTICA",
          "NUTRICIÓN","PSICOLOGÍA","INGENIERÍA",
        ].map((tag) => (
          <div key={tag} className="shrink-0 mx-4">
            <span className="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-white/60 hover:text-white transition-colors cursor-default">
              <span className="w-1 h-1 bg-[#B31C1C] inline-block" />
              {tag}
            </span>
          </div>
        ))}
      </Marquee>
    </div>
  );
}

/* ─── LiveActivity — AnimatedList ────────────────────────────────────────── */

export interface LiveActivityProps {
  liveEvents: LiveEvent[];
}

export function LiveActivity({ liveEvents }: LiveActivityProps) {
  return (
    <section className="border-b border-[#E0E0E0] py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <BlurFade delay={0}>
            <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#B31C1C] mb-4">
              En este momento
            </p>
            <h2 className="font-serif font-bold text-[clamp(28px,4vw,52px)] leading-[1.12] tracking-[-0.02em] mb-5">
              Cada minuto,<br />
              alguien descubre<br />
              <span className="text-[#B31C1C]">que su conocimiento</span><br />
              vale.
            </h2>
            <p className="text-[15px] leading-[1.8] text-[#555]">
              Mientras lees esto, profesionales como tú están recibiendo su primer pago en Nebbuler.
            </p>
          </BlurFade>
          <BlurFade delay={0.1}>
            <div className="relative h-[300px] overflow-hidden">
              <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none" />
              <AnimatedList delay={1600} className="gap-3">
                {liveEvents.map((ev) => (
                  <div
                    key={ev.name}
                    className="w-full bg-white border border-[#EBEBEB] p-4 flex items-center gap-3 hover:border-[#B31C1C]/30 transition-colors"
                  >
                    <div
                      className="w-8 h-8 flex items-center justify-center shrink-0 text-[10px] font-bold text-white"
                      style={{ backgroundColor: ev.color }}
                    >
                      {ev.initial}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-[#111]">
                        {ev.name}{" "}
                        <span className="font-normal text-[#555]">se suscribió a</span>{" "}
                        <span className="text-[#B31C1C]">{ev.creator}</span>
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[8px] font-bold uppercase tracking-[0.1em] text-[#B31C1C] bg-[#FFF5F5] px-1.5 py-0.5">
                          {ev.tag}
                        </span>
                        <span className="text-[11px] font-bold text-[#111]">{ev.price}</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-[#B0B0B0] shrink-0">hace {ev.time}</span>
                  </div>
                ))}
              </AnimatedList>
            </div>
          </BlurFade>
        </div>
      </div>
    </section>
  );
}

/* ─── FeaturesSection ────────────────────────────────────────────────────── */

export interface FeaturesSectionProps {
  features: Feature[];
}

export function FeaturesSection({ features }: FeaturesSectionProps) {
  return (
    <section className="border-b border-[#E0E0E0] py-24 bg-[#F8F7F5]">
      <div className="max-w-7xl mx-auto px-6">
        <BlurFade delay={0}>
          <div className="flex items-baseline gap-5 mb-14 pb-5 border-b-[3px] border-[#111]">
            <h2 className="font-serif font-bold text-[clamp(28px,4vw,52px)] leading-tight tracking-[-0.02em]">
              Todo lo que necesitas.
            </h2>
            <p className="font-serif font-bold text-[clamp(28px,4vw,52px)] leading-tight tracking-[-0.02em] text-[#D8D8D8] hidden md:block">
              Una plataforma.
            </p>
          </div>
        </BlurFade>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-0 divide-y md:divide-y-0 border-l border-t border-[#E0E0E0]">
          {features.map(({ num, title, body }, i) => (
            <BlurFade key={title} delay={i * 0.05}>
              <div className="bg-white border-r border-b border-[#E0E0E0] p-8 group hover:bg-[#FFF5F5] transition-colors duration-200">
                <div className="mb-5">
                  <span className="font-serif font-bold text-[36px] leading-none text-[#EBEBEB] group-hover:text-[#F5C5C5] transition-colors duration-200 block mb-4">
                    {num}
                  </span>
                  <h3 className="text-[15px] font-bold text-[#111] mb-2 group-hover:text-[#B31C1C] transition-colors duration-200">
                    {title}
                  </h3>
                  <p className="text-[13px] leading-[1.75] text-[#666]">{body}</p>
                </div>
              </div>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── ParaQuienes ────────────────────────────────────────────────────────── */

export function ParaQuienes() {
  return (
    <section className="border-b border-[#E0E0E0] py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-0 lg:divide-x divide-[#E0E0E0]">
          <BlurFade delay={0}>
            <div className="lg:pr-16 pb-10 lg:pb-0">
              <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#B31C1C] mb-6">
                Para quienes tienen algo real
              </p>
              <h2 className="font-serif font-bold text-[clamp(28px,4vw,52px)] leading-[1.12] tracking-[-0.02em] mb-6">
                Para quienes tienen<br />
                algo real que<br />
                <span className="text-[#B31C1C]">cobrar.</span>
              </h2>
              <p className="text-[15px] leading-[1.8] text-[#555] mb-8 max-w-md">
                Nebbuler es para el profesional que ha pasado años construyendo expertise y todavía no cobra por compartirlo.
              </p>
              <Link
                href="/abrir"
                className="inline-flex items-center gap-2 bg-[#111] text-white px-6 py-3.5 text-[12px] font-bold uppercase tracking-[0.05em] hover:bg-[#B31C1C] transition-colors duration-200"
              >
                Registrarse gratis <IconArrowRight size={13} />
              </Link>
            </div>
          </BlurFade>
          <div className="lg:pl-16 pt-10 lg:pt-0 space-y-0 divide-y divide-[#EBEBEB]">
            {[
              { title: "Creadores independientes", body: "Publica tu expertise y cobra por el acceso. Sin algoritmos ni redes sociales." },
              { title: "Expertos de industria",    body: "Conecta directo con tu audiencia. Convierte experiencia en ingreso recurrente." },
              { title: "Profesionales de área",    body: "Cualquier disciplina. Tu campo tiene un público que paga por entenderlo." },
            ].map(({ title, body }, i) => (
              <BlurFade key={title} delay={i * 0.08}>
                <div className="flex items-start gap-5 py-6 group">
                  <div className="w-1 h-1 bg-[#B31C1C] shrink-0 mt-2.5" />
                  <div>
                    <p className="text-[14px] font-bold text-[#111] mb-1.5 group-hover:text-[#B31C1C] transition-colors">
                      {title}
                    </p>
                    <p className="text-[13px] text-[#666] leading-[1.7]">{body}</p>
                  </div>
                </div>
              </BlurFade>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── PricingSection ─────────────────────────────────────────────────────── */

export interface PricingSectionProps {
  plans: Plan[];
}

export function PricingSection({ plans }: PricingSectionProps) {
  /* Tomar solo el plan featured para la columna izquierda */
  const featuredPlan = plans.find((p) => p.featured) ?? plans[0];

  return (
    <section className="border-b border-[#E0E0E0] py-24 bg-[#F8F7F5]">
      <div className="max-w-5xl mx-auto px-6">
        {/* Label de sección */}
        <BlurFade delay={0}>
          <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#999] mb-10 text-center">
            Precio · 0% comisión · tarifa fija mensual
          </p>
        </BlurFade>

        <div className="grid md:grid-cols-2 gap-10 items-start">
          {/* Columna izquierda: card del plan */}
          {featuredPlan && (
            <BlurFade delay={0.04}>
              <div className="relative flex flex-col h-full p-10 border border-[#E0E0E0] bg-[#B31C1C]">
                <span className="absolute -top-3 left-8 bg-[#111] text-white text-[8px] font-black uppercase tracking-[0.15em] px-3 py-1">
                  Recomendado
                </span>
                <div className="mb-6">
                  <p className="text-[9px] font-bold uppercase tracking-[0.18em] mb-3 text-white/70">
                    {featuredPlan.name}
                  </p>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="font-serif font-bold text-[36px] leading-[1.2] tracking-[-0.02em] text-white">
                      {featuredPlan.price}
                    </span>
                    <span className="text-[11px] text-white/60">{featuredPlan.period}</span>
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.1em] mt-1 text-white/80">
                    {featuredPlan.note}
                  </p>
                </div>
                <div className="space-y-2.5 mb-7 flex-1">
                  {featuredPlan.perks.map((p) => (
                    <div key={p} className="flex items-center gap-2.5">
                      <div className="w-1 h-1 shrink-0 bg-white" />
                      <span className="text-[12px] text-white/80">{p}</span>
                    </div>
                  ))}
                </div>
                <Link
                  href="/abrir"
                  className="block text-center py-3 text-[11px] font-bold uppercase tracking-[0.12em] transition-colors bg-white text-[#B31C1C] hover:bg-white/90"
                >
                  {featuredPlan.cta}
                </Link>
              </div>
            </BlurFade>
          )}

          {/* Columna derecha: calculadora interactiva */}
          <BlurFade delay={0.1}>
            <PricingCalculator />
          </BlurFade>
        </div>
      </div>
    </section>
  );
}

/* ─── FaqSection ─────────────────────────────────────────────────────────── */

export interface FaqSectionProps {
  faqs: Faq[];
}

export function FaqSection({ faqs }: FaqSectionProps) {
  return (
    <section className="border-b border-[#E0E0E0] py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-[360px_1fr] gap-16">
          <BlurFade delay={0}>
            <div className="lg:sticky lg:top-28">
              <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#B31C1C] mb-4">
                Preguntas
              </p>
              <h2 className="font-serif font-bold text-[clamp(28px,4vw,44px)] leading-[1.12] tracking-[-0.02em]">
                ¿Tienes<br />preguntas?<br />
                <span className="text-[#B31C1C]">Tenemos<br />respuestas.</span>
              </h2>
            </div>
          </BlurFade>
          <BlurFade delay={0.1}>
            <div className="border-t border-[#E0E0E0]">
              {faqs.map(({ q, a }) => (
                <FaqItem key={q} q={q} a={a} />
              ))}
            </div>
          </BlurFade>
        </div>
      </div>
    </section>
  );
}

/* ─── CtaFinalAnimated ───────────────────────────────────────────────────── */

export function CtaFinalAnimated() {
  return (
    <BlurFade delay={0}>
      <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-[#B31C1C] mb-8">
        Para creadores
      </p>
      <h2 className="font-serif font-bold text-[clamp(36px,6vw,76px)] leading-[1.32] tracking-[-0.03em] text-white mb-6">
        ¿Eres un profesional con<br />algo que enseñar?
      </h2>
      <p className="text-[16px] text-white/45 max-w-md mx-auto mb-10 leading-[1.8]">
        Abre tu espacio en Nebbuler. 0% de comisión. Tu conocimiento, tu precio.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          href="/abrir"
          className="bg-white text-[#111] px-8 py-4 text-[13px] font-bold hover:bg-[#F8F7F5] transition-colors"
        >
          Abre tu espacio
        </Link>
      </div>
    </BlurFade>
  );
}
