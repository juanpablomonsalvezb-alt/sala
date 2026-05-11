"use client";

import Link from "next/link";
import { useState } from "react";
import { NumberTicker } from "@/components/ui/number-ticker";
import { BlurFade } from "@/components/ui/blur-fade";
import { Marquee } from "@/components/ui/marquee";
import { AnimatedList } from "@/components/ui/animated-list";
import { LineShadowText } from "@/components/ui/line-shadow-text";
import { SpinningText } from "@/components/ui/spinning-text";
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

/* ─── HeroCta — BlurFade sobre el bloque de CTA + stats ─────────────────── */

export function HeroCta() {
  return (
    <>
      <BlurFade delay={0.4}>
        <div className="py-8 flex flex-col sm:flex-row items-start sm:items-center gap-6 border-b-[3px] border-[#111]">
          <div className="flex-1">
            <p className="text-[16px] font-semibold text-[#111] leading-[1.5]">
              Para profesionales{" "}
              <span className="text-[#767676] font-normal">
                que tienen clientes esperando su conocimiento.
              </span>
            </p>
            <div className="flex items-center gap-3 mt-3">
              <div className="w-7 h-7 bg-[#1a1a2e] flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                RF
              </div>
              <p className="text-[12px] text-[#555]">
                <span className="text-[#B31C1C] font-bold">+$510.000/mes</span> en su primer trimestre —{" "}
                <span className="font-medium">Rodrigo F., Economista, Santiago</span>
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link
              href="/registro"
              className="flex items-center gap-2.5 border border-[#DEDEDE] bg-white px-5 py-3 text-[12px] font-semibold text-[#111] hover:border-[#B31C1C] hover:text-[#B31C1C] transition-all"
            >
              <svg width="15" height="15" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continuar con Google
            </Link>
            <Link
              href="/abrir"
              className="bg-[#B31C1C] text-white px-5 py-3 text-[12px] font-bold uppercase tracking-[0.04em] hover:bg-[#8E1515] transition-colors"
            >
              Abre tu espacio gratis →
            </Link>
          </div>
        </div>
      </BlurFade>

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
  return (
    <section className="border-b border-[#E0E0E0] py-24 bg-[#F8F7F5]">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-0 border border-[#E0E0E0]">
          {plans.map(({ name, price, period, note, cta, featured, perks }, i) => (
            <BlurFade key={name} delay={i * 0.06}>
              <div
                className={`relative flex flex-col h-full p-8 border-r border-[#E0E0E0] last:border-r-0 ${
                  featured ? "bg-[#B31C1C]" : "bg-white"
                }`}
              >
                {featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#111] text-white text-[8px] font-black uppercase tracking-[0.15em] px-3 py-1">
                    Recomendado
                  </span>
                )}
                <div className="mb-6">
                  <p
                    className={`text-[9px] font-bold uppercase tracking-[0.18em] mb-3 ${
                      featured ? "text-white/70" : "text-[#A0A0A0]"
                    }`}
                  >
                    {name}
                  </p>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span
                      className={`font-serif font-bold text-[30px] leading-[1.2] tracking-[-0.02em] ${
                        featured ? "text-white" : "text-[#111]"
                      }`}
                    >
                      {price}
                    </span>
                    <span
                      className={`text-[11px] ${featured ? "text-white/60" : "text-[#A0A0A0]"}`}
                    >
                      {period}
                    </span>
                  </div>
                  <p
                    className={`text-[10px] font-bold uppercase tracking-[0.1em] mt-1 ${
                      featured ? "text-white/80" : "text-[#B31C1C]"
                    }`}
                  >
                    {note}
                  </p>
                </div>
                <div className="space-y-2.5 mb-7 flex-1">
                  {perks.map((p) => (
                    <div key={p} className="flex items-center gap-2.5">
                      <div
                        className={`w-1 h-1 shrink-0 ${featured ? "bg-white" : "bg-[#B31C1C]"}`}
                      />
                      <span
                        className={`text-[12px] ${featured ? "text-white/80" : "text-[#555]"}`}
                      >
                        {p}
                      </span>
                    </div>
                  ))}
                </div>
                <Link
                  href="/abrir"
                  className={`block text-center py-3 text-[11px] font-bold uppercase tracking-[0.12em] transition-colors ${
                    featured
                      ? "bg-white text-[#B31C1C] hover:bg-white/90"
                      : "border border-[#DEDEDE] text-[#111] hover:border-[#B31C1C] hover:text-[#B31C1C]"
                  }`}
                >
                  {cta}
                </Link>
              </div>
            </BlurFade>
          ))}
        </div>

        {/* Tabla proyectada */}
        <BlurFade delay={0.2}>
          <div className="mt-14 border-t border-white/10 pt-10">
            <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#B0B0B0] mb-6 text-center">
              Ingreso mensual estimado · $29.990 tarifa fija · precio promedio $14.990/mes por suscriptor
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="pb-3 text-[9px] font-bold uppercase tracking-[0.2em] text-[#888] pr-8">Suscriptores</th>
                    <th className="pb-3 text-[9px] font-bold uppercase tracking-[0.2em] text-[#888] pr-8">Ingreso bruto</th>
                    <th className="pb-3 text-[9px] font-bold uppercase tracking-[0.2em] text-[#888] pr-8">Tarifa Nebbuler</th>
                    <th className="pb-3 text-[9px] font-bold uppercase tracking-[0.2em] text-[#C41C1C]">Ingreso neto</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { subs: 50,   gross: 749500,   net: 719510 },
                    { subs: 100,  gross: 1499000,  net: 1469010 },
                    { subs: 200,  gross: 2998000,  net: 2968010 },
                    { subs: 500,  gross: 7495000,  net: 7465010 },
                    { subs: 1000, gross: 14990000, net: 14960010 },
                  ].map(({ subs, gross, net }) => (
                    <tr key={subs} className="border-b border-white/5 group">
                      <td className="py-3 font-serif font-bold text-[16px] text-white pr-8">
                        {subs.toLocaleString('es-CL')}
                      </td>
                      <td className="py-3 font-sans text-[13px] text-[#888] pr-8">
                        ${gross.toLocaleString('es-CL')}
                      </td>
                      <td className="py-3 font-sans text-[13px] text-[#666] pr-8">
                        $29.990
                      </td>
                      <td className="py-3 font-serif font-bold text-[16px] text-[#C41C1C]">
                        ${net.toLocaleString('es-CL')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[10px] text-[#666] mt-4 text-center">
              Estimación basada en precio promedio. Tu ingreso real depende del precio que tú elijas.{' '}
              <Link href="/para-creadores" className="text-[#C41C1C] underline underline-offset-2">
                Usa la calculadora →
              </Link>
            </p>
          </div>
        </BlurFade>

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
        Empieza hoy
      </p>
      <h2 className="font-serif font-bold text-[clamp(36px,6vw,76px)] leading-[1.32] tracking-[-0.03em] text-white mb-6">
        ¿Listo para cobrar<br />lo que sabes?
      </h2>
      <p className="text-[16px] text-white/45 max-w-md mx-auto mb-10 leading-[1.8]">
        Únete a los 34 profesionales que ya generan ingresos reales con su conocimiento.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          href="/registro"
          className="flex items-center gap-3 bg-white text-[#111] px-8 py-4 text-[13px] font-bold hover:bg-[#F8F7F5] transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continuar con Google
        </Link>
        <Link
          href="/abrir"
          className="border border-white/20 text-white px-8 py-4 text-[13px] font-semibold hover:bg-white/5 transition-colors"
        >
          Abre tu espacio gratis →
        </Link>
      </div>
      <p className="text-[9px] text-white/20 mt-6 uppercase tracking-[0.15em]">
        Sin tarjeta · Gratis para empezar
      </p>
    </BlurFade>
  );
}
