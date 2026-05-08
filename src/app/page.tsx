"use client";

import Link from "next/link";
import { NumberTicker } from "@/components/ui/number-ticker";
import { BlurFade } from "@/components/ui/blur-fade";
import { Marquee } from "@/components/ui/marquee";
import { AnimatedList } from "@/components/ui/animated-list";
import { LineShadowText } from "@/components/ui/line-shadow-text";
import { SpinningText } from "@/components/ui/spinning-text";
import {
  IconBolt, IconCash, IconShieldLock, IconChartBar,
  IconUsers, IconEditCircle, IconChevronDown, IconChevronUp, IconArrowRight,
  IconTrendingUp,
} from "@tabler/icons-react";
import { useState, useEffect } from "react";

/* ─── Data ──────────────────────────────────────────────────────────────── */

const featuredCreators = [
  { initial: "RF", name: "RODRIGO FUENTES",  specialty: "ECONOMÍA",          color: "#1a1a2e", earnings: "8.470.000", trend: "+18%", subscribers: 847,  posts: 48, since: "Ene 2025", href: "/rodrigo-fuentes"  },
  { initial: "IC", name: "ISABEL CONTRERAS", specialty: "DERECHO TRIBUTARIO", color: "#1a2e1a", earnings: "6.240.000", trend: "+24%", subscribers: 523,  posts: 31, since: "Feb 2025", href: "/isabel-contreras" },
  { initial: "MS", name: "MARCO SALINAS",    specialty: "ARQUITECTURA",       color: "#2e1a1a", earnings: "2.490.000", trend: "+31%", subscribers: 312,  posts: 24, since: "Mar 2025", href: "/marco-salinas"    },
];

const features = [
  { num: "I",   title: "Editor profesional",   body: "Escribe, formatea y publica contenido largo. Tú controlas qué es libre y qué es exclusivo." },
  { num: "II",  title: "Gestión de audiencia", body: "CRM de tus lectores. Segmenta, comunícate y conoce a quienes realmente pagan." },
  { num: "III", title: "Pagos directos",       body: "Cobra suscripciones mes a mes directo a tu cuenta. 0% de comisión con Plan Pro." },
  { num: "IV",  title: "Analytics real",       body: "Aperturas, retención, ingresos. Los datos que importan para crecer." },
  { num: "V",   title: "Acceso por membresía", body: "Tus suscriptores pagan para leer lo que sólo tú puedes escribir." },
  { num: "VI",  title: "Listo en 15 minutos",  body: "Sin código, sin diseñador. Configuras tu perfil, precio y publicas hoy." },
];

const plans = [
  { name: "Pro",     price: "$39.990", period: "/ mes", note: "0% comisión", cta: "Probar gratis", featured: false, perks: ["Todo del plan Creador", "0% de comisión", "Dominio propio", "API"] },
  { name: "Creador", price: "$15.990", period: "/ mes", note: "5% comisión", cta: "Probar gratis", featured: true,  perks: ["Todo del plan Gratis", "Suscriptores ilimitados", "Analytics", "Soporte"] },
  { name: "Gratis",  price: "$0",      period: "        ", note: "10% comisión", cta: "Abre gratis",   featured: false, perks: ["Sala personalizada", "Publicaciones ilimitadas", "100 suscriptores", "Stripe"] },
];

const faqs = [
  { q: "¿Necesito saber programar?",                        a: "No. Configuras tu sala en 15 minutos, sin código ni diseño." },
  { q: "¿Cómo recibo los pagos?",                           a: "Stripe directo a tu cuenta. Plan Gratis 10% comisión, Plan Pro 0%." },
  { q: "¿Puedo tener contenido gratuito y de pago?",        a: "Sí. Tú decides qué es abierto y qué es exclusivo." },
  { q: "¿Qué pasa si cancelo?",                             a: "Cancelas cuando quieras. Tus datos quedan accesibles." },
  { q: "¿Sala funciona fuera de Chile?",                    a: "Sí. Disponible en toda Latinoamérica." },
];

const liveEvents = [
  { initial: "MC", color: "#1a1a2e", name: "María C.",    creator: "Rodrigo Fuentes",  tag: "ECONOMÍA",    price: "$9.990/mes",  time: "ahora" },
  { initial: "JP", color: "#1a2e1a", name: "Juan P.",     creator: "Isabel Contreras", tag: "DERECHO",     price: "$12.990/mes", time: "1 min" },
  { initial: "AR", color: "#2e1a1a", name: "Ana R.",      creator: "Marco Salinas",    tag: "ARQUITECTURA",price: "$7.990/mes",  time: "3 min" },
  { initial: "CF", color: "#1e2a3e", name: "Carlos F.",   creator: "Lucía Morales",    tag: "FINANZAS",    price: "$8.990/mes",  time: "5 min" },
  { initial: "SV", color: "#2a1e2e", name: "Sofía V.",    creator: "Carlos Venegas",   tag: "MEDICINA",    price: "$14.990/mes", time: "7 min" },
];

const tickerItems = [
  "Rodrigo F. generó $510.000 en su primer trimestre",
  "Isabel C. alcanzó 500 suscriptores pagando",
  "Marco S. publicó su análisis semanal con 312 lectores",
  "Lucía M. lanzó su sala de finanzas hace 30 días",
  "34 creadores activos · 2.418 suscriptores · $180K generados",
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <button className="w-full text-left border-b border-[#E0E0E0] py-5 group" onClick={() => setOpen(!open)}>
      <div className="flex items-center justify-between gap-4">
        <span className="text-[15px] font-semibold text-[#111] group-hover:text-[#B31C1C] transition-colors">{q}</span>
        {open ? <IconChevronUp size={15} className="text-[#B31C1C] shrink-0" /> : <IconChevronDown size={15} className="text-[#767676] shrink-0" />}
      </div>
      {open && <p className="text-[14px] leading-[1.75] text-[#555] mt-3 pr-6">{a}</p>}
    </button>
  );
}

function TopTicker() {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIdx(i => (i + 1) % tickerItems.length);
        setVisible(true);
      }, 400);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const now = new Date();
  const dateStr = now.toLocaleDateString("es-CL", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="bg-[#111] text-white h-8 flex items-center overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 w-full flex items-center justify-between gap-6">
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/40">Sala</span>
          <span className="text-white/20">·</span>
          <span className="text-[9px] uppercase tracking-[0.12em] text-white/40 capitalize">{dateStr}</span>
        </div>
        <div className="flex items-center gap-2 flex-1 min-w-0 justify-end sm:justify-center">
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#B31C1C] shrink-0">EN VIVO</span>
          <div
            className="text-[10px] text-white/70 truncate transition-all duration-400"
            style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(-4px)" }}
          >
            {tickerItems[idx]}
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <Link href="/registro" className="text-[9px] font-bold uppercase tracking-[0.15em] text-white/50 hover:text-white transition-colors">
            Únete →
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────────────────────── */

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-[#111]">

      {/* ── TOP TICKER ──────────────────────────────────────────────────── */}
      <TopTicker />

      {/* ── NAV ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/98 backdrop-blur-sm border-b border-[#111]">
        <div className="max-w-7xl mx-auto px-6 py-0 flex items-stretch justify-between h-14">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 border-r border-[#E0E0E0] pr-6 mr-0">
            <div className="w-6 h-6 bg-[#B31C1C] flex items-center justify-center shrink-0">
              <span className="text-white font-black text-[12px] font-serif">S</span>
            </div>
            <span className="text-[17px] font-black uppercase tracking-[0.04em] text-[#111] font-serif">ALA</span>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-0 flex-1 pl-0">
            {[{ label: "Explorar", href: "/explorar" }, { label: "Para creadores", href: "/para-creadores" }, { label: "Precios", href: "/precios" }].map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="h-full flex items-center px-5 text-[12px] font-medium tracking-[0.04em] text-[#555] hover:text-[#111] hover:bg-[#F8F7F5] border-r border-[#F0F0F0] transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-0">
            <Link href="/entrar" className="h-full flex items-center px-5 text-[12px] font-medium text-[#555] hover:text-[#111] border-l border-[#E0E0E0] transition-colors">
              Iniciar sesión
            </Link>
            <Link
              href="/abrir"
              className="h-full flex items-center px-6 bg-[#B31C1C] text-white text-[12px] font-bold tracking-[0.04em] uppercase hover:bg-[#8E1515] transition-colors"
            >
              Abre tu sala
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO — portada editorial ─────────────────────────────────────── */}
      <section className="border-b border-[#E0E0E0]">
        <div className="max-w-7xl mx-auto px-6 pt-12 pb-0">

          {/* Cabecera de portada */}
          <div className="flex items-end justify-between pb-5 border-b-[3px] border-[#111]">
            <BlurFade delay={0}>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-[#767676] mb-2">Plataforma de conocimiento profesional · Chile y LATAM</p>
                <h1 className="font-serif font-bold text-[clamp(40px,6vw,80px)] leading-[0.88] tracking-[-0.02em]">
                  Tu conocimiento<br />
                  ya tiene{" "}
                  <LineShadowText shadowColor="#B31C1C" className="text-[#111] font-serif">
                    precio.
                  </LineShadowText>
                </h1>
              </div>
            </BlurFade>

            {/* SpinningText badge + edition mark */}
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
                  <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#767676]">Edición N°1 · 2025</p>
                </div>
              </div>
            </BlurFade>
          </div>

          {/* Listado editorial de creadores */}
          <div className="py-0">
            {featuredCreators.map((c, i) => (
              <BlurFade key={c.name} delay={0.1 + i * 0.07}>
                <Link
                  href={c.href}
                  className="group flex items-center gap-0 border-b border-[#EBEBEB] py-5 hover:bg-[#FAFAFA] -mx-6 px-6 transition-all duration-200 relative"
                >
                  {/* Accent izquierdo en hover */}
                  <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#B31C1C] scale-y-0 group-hover:scale-y-100 transition-transform duration-200 origin-center" />

                  {/* Número */}
                  <span className="font-serif text-[13px] text-[#B0B0B0] w-9 shrink-0 font-bold">{String(i + 1).padStart(2, "0")}.</span>

                  {/* Avatar — cuadrado editorial */}
                  <div
                    className="w-9 h-9 flex items-center justify-center shrink-0 mr-5 text-[11px] font-black text-white"
                    style={{ backgroundColor: c.color }}
                  >
                    {c.initial}
                  </div>

                  {/* Nombre + especialidad */}
                  <div className="flex-1 min-w-0">
                    <p className="font-serif font-bold text-[clamp(15px,1.8vw,20px)] tracking-[-0.01em] group-hover:text-[#B31C1C] transition-colors">{c.name}</p>
                    <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#B31C1C] mt-0.5">{c.specialty} · {c.subscribers.toLocaleString()} suscriptores · {c.posts} pub. · desde {c.since}</p>
                  </div>

                  {/* Trend badge */}
                  <div className="hidden sm:flex items-center gap-1 mr-6 shrink-0">
                    <IconTrendingUp size={11} className="text-emerald-600" />
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5">{c.trend}</span>
                  </div>

                  {/* Earnings */}
                  <div className="text-right shrink-0">
                    <p className="font-serif font-bold text-[clamp(20px,2.5vw,36px)] leading-none tracking-[-0.02em] text-[#111]">
                      ${c.earnings}
                    </p>
                    <p className="text-[9px] text-[#B0B0B0] font-medium mt-0.5 uppercase tracking-[0.1em]">pesos / mes</p>
                  </div>

                  <IconArrowRight size={14} className="text-[#C0C0C0] ml-4 shrink-0 group-hover:text-[#B31C1C] transition-colors" />
                </Link>
              </BlurFade>
            ))}
          </div>

          {/* CTA */}
          <BlurFade delay={0.4}>
            <div className="py-8 flex flex-col sm:flex-row items-start sm:items-center gap-6 border-b-[3px] border-[#111]">
              <div className="flex-1">
                <p className="text-[16px] font-semibold text-[#111] leading-[1.5]">
                  Para economistas, abogados, médicos, arquitectos y consultores{" "}
                  <span className="text-[#767676] font-normal">que tienen clientes esperando su conocimiento.</span>
                </p>
                <div className="flex items-center gap-3 mt-3">
                  <div className="w-7 h-7 bg-[#1a1a2e] flex items-center justify-center text-[10px] font-bold text-white shrink-0">RF</div>
                  <p className="text-[12px] text-[#555]">
                    <span className="text-[#B31C1C] font-bold">+$510.000/mes</span> en su primer trimestre —{" "}
                    <span className="font-medium">Rodrigo F., Economista, Santiago</span>
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 shrink-0">
                <Link href="/registro" className="flex items-center gap-2.5 border border-[#DEDEDE] bg-white px-5 py-3 text-[12px] font-semibold text-[#111] hover:border-[#B31C1C] hover:text-[#B31C1C] transition-all">
                  <svg width="15" height="15" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  Continuar con Google
                </Link>
                <Link href="/abrir" className="bg-[#B31C1C] text-white px-5 py-3 text-[12px] font-bold uppercase tracking-[0.04em] hover:bg-[#8E1515] transition-colors">
                  Abre tu sala gratis →
                </Link>
              </div>
            </div>
          </BlurFade>

          {/* Stats bar */}
          <BlurFade delay={0.45}>
            <div className="grid grid-cols-4 divide-x divide-[#EBEBEB] py-5">
              {[
                { value: 34,   pre: "",  suf: "",  label: "Creadores activos" },
                { value: 2418, pre: "",  suf: "+", label: "Suscriptores pagando" },
                { value: 180,  pre: "$", suf: "K", label: "Generados en 2025" },
                { value: 95,   pre: "",  suf: "%", label: "Retención mensual" },
              ].map(({ value, pre, suf, label }) => (
                <div key={label} className="px-5 first:pl-0 last:pr-0 text-center">
                  <p className="font-serif font-bold text-[clamp(18px,2.5vw,32px)] leading-none tracking-[-0.02em] flex items-baseline justify-center gap-0.5">
                    {pre && <span className="text-[#B31C1C] font-serif">{pre}</span>}
                    <NumberTicker value={value} className="text-[#111]" />
                    {suf && <span className="text-[#B31C1C] font-serif">{suf}</span>}
                  </p>
                  <p className="text-[8px] uppercase tracking-[0.18em] text-[#A0A0A0] mt-1.5 font-bold">{label}</p>
                </div>
              ))}
            </div>
          </BlurFade>
        </div>
      </section>

      {/* ── TICKER NEGRO — estilo periódico ──────────────────────────────── */}
      <div className="bg-[#111] border-y border-[#111] py-3 overflow-hidden">
        <Marquee duration={40} pauseOnHover>
          {["ECONOMÍA","DERECHO","MEDICINA","ARQUITECTURA","FINANZAS","EDUCACIÓN","TECNOLOGÍA","MARKETING","CIENCIA POLÍTICA","NUTRICIÓN","PSICOLOGÍA","INGENIERÍA"].map(tag => (
            <div key={tag} className="shrink-0 mx-4">
              <span className="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-white/60 hover:text-white transition-colors cursor-default">
                <span className="w-1 h-1 bg-[#B31C1C] inline-block" />
                {tag}
              </span>
            </div>
          ))}
        </Marquee>
      </div>

      {/* ── LIVE ACTIVITY ───────────────────────────────────────────────── */}
      <section className="border-b border-[#E0E0E0] py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <BlurFade delay={0}>
              <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#B31C1C] mb-4">En este momento</p>
              <h2 className="font-serif font-bold text-[clamp(28px,4vw,52px)] leading-[0.93] tracking-[-0.02em] mb-5">
                Cada minuto,<br />
                alguien descubre<br />
                <span className="text-[#B31C1C]">que su conocimiento</span><br />
                vale.
              </h2>
              <p className="text-[15px] leading-[1.8] text-[#555]">
                Mientras lees esto, profesionales como tú están recibiendo su primer pago en Sala.
              </p>
            </BlurFade>
            <BlurFade delay={0.1}>
              <div className="relative h-[300px] overflow-hidden">
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none" />
                <AnimatedList delay={1600} className="gap-3">
                  {liveEvents.map((ev) => (
                    <div key={ev.name} className="w-full bg-white border border-[#EBEBEB] p-4 flex items-center gap-3 hover:border-[#B31C1C]/30 transition-colors">
                      <div className="w-8 h-8 flex items-center justify-center shrink-0 text-[10px] font-bold text-white" style={{ backgroundColor: ev.color }}>{ev.initial}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-[#111]">
                          {ev.name} <span className="font-normal text-[#555]">se suscribió a</span> <span className="text-[#B31C1C]">{ev.creator}</span>
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[8px] font-bold uppercase tracking-[0.1em] text-[#B31C1C] bg-[#FFF5F5] px-1.5 py-0.5">{ev.tag}</span>
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

      {/* ── FEATURES — índice editorial sin icon boxes ───────────────────── */}
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
                    <span className="font-serif font-bold text-[36px] leading-none text-[#EBEBEB] group-hover:text-[#F5C5C5] transition-colors duration-200 block mb-4">{num}</span>
                    <h3 className="text-[15px] font-bold text-[#111] mb-2 group-hover:text-[#B31C1C] transition-colors duration-200">{title}</h3>
                    <p className="text-[13px] leading-[1.75] text-[#666]">{body}</p>
                  </div>
                </div>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>

      {/* ── PARA QUIENES — split editorial ──────────────────────────────── */}
      <section className="border-b border-[#E0E0E0] py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-0 lg:divide-x divide-[#E0E0E0]">
            <BlurFade delay={0}>
              <div className="lg:pr-16 pb-10 lg:pb-0">
                <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#B31C1C] mb-6">Para quienes tienen algo real</p>
                <h2 className="font-serif font-bold text-[clamp(28px,4vw,52px)] leading-[0.93] tracking-[-0.02em] mb-6">
                  Para quienes tienen<br />
                  algo real que<br />
                  <span className="text-[#B31C1C]">cobrar.</span>
                </h2>
                <p className="text-[15px] leading-[1.8] text-[#555] mb-8 max-w-md">
                  Sala es para el profesional que ha pasado años construyendo expertise y todavía no cobra por compartirlo.
                </p>
                <Link href="/abrir" className="inline-flex items-center gap-2 bg-[#111] text-white px-6 py-3.5 text-[12px] font-bold uppercase tracking-[0.05em] hover:bg-[#B31C1C] transition-colors duration-200">
                  Registrarse gratis <IconArrowRight size={13} />
                </Link>
              </div>
            </BlurFade>

            <div className="lg:pl-16 pt-10 lg:pt-0 space-y-0 divide-y divide-[#EBEBEB]">
              {[
                { icon: "○", title: "Creadores independientes", body: "Publica tu expertise y cobra por el acceso. Sin algoritmos ni redes sociales." },
                { icon: "○", title: "Expertos de industria",    body: "Conecta directo con tu audiencia. Convierte experiencia en ingreso recurrente." },
                { icon: "○", title: "Profesionales de área",    body: "Economistas, abogados, médicos, arquitectos. Tu campo tiene un público que paga." },
              ].map(({ title, body }, i) => (
                <BlurFade key={title} delay={i * 0.08}>
                  <div className="flex items-start gap-5 py-6 group">
                    <div className="w-1 h-1 bg-[#B31C1C] shrink-0 mt-2.5" />
                    <div>
                      <p className="text-[14px] font-bold text-[#111] mb-1.5 group-hover:text-[#B31C1C] transition-colors">{title}</p>
                      <p className="text-[13px] text-[#666] leading-[1.7]">{body}</p>
                    </div>
                  </div>
                </BlurFade>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING ─────────────────────────────────────────────────────── */}
      <section className="border-b border-[#E0E0E0] py-24 bg-[#F8F7F5]">
        <div className="max-w-5xl mx-auto px-6">
          <BlurFade delay={0}>
            <div className="pb-5 border-b-[3px] border-[#111] mb-14 flex items-end justify-between">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#B31C1C] mb-2">Precios</p>
                <h2 className="font-serif font-bold text-[clamp(24px,3.5vw,44px)] tracking-[-0.02em]">Elige el plan para crecer</h2>
              </div>
              <div className="hidden sm:flex items-center gap-2 pb-1">
                <span className="text-[9px] text-[#A0A0A0] uppercase tracking-[0.12em] font-medium">Pagos via</span>
                {[{ bg: "#635BFF", t: "Stripe" }, { bg: "#E5001E", t: "Webpay" }, { bg: "#00B1EA", t: "MP" }].map(({ bg, t }) => (
                  <span key={t} className="inline-flex items-center px-2 py-0.5 text-[9px] font-bold text-white" style={{ backgroundColor: bg }}>{t}</span>
                ))}
              </div>
            </div>
          </BlurFade>

          <div className="grid md:grid-cols-3 gap-0 border border-[#E0E0E0]">
            {plans.map(({ name, price, period, note, cta, featured, perks }, i) => (
              <BlurFade key={name} delay={i * 0.06}>
                <div className={`relative flex flex-col h-full p-8 border-r border-[#E0E0E0] last:border-r-0 ${featured ? "bg-[#B31C1C]" : "bg-white"}`}>
                  {featured && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#111] text-white text-[8px] font-black uppercase tracking-[0.15em] px-3 py-1">
                      Recomendado
                    </span>
                  )}
                  <div className="mb-6">
                    <p className={`text-[9px] font-bold uppercase tracking-[0.18em] mb-3 ${featured ? "text-white/70" : "text-[#A0A0A0]"}`}>{name}</p>
                    <div className="flex items-baseline gap-1 mb-1">
                      <span className={`font-serif font-bold text-[30px] leading-none tracking-[-0.02em] ${featured ? "text-white" : "text-[#111]"}`}>{price}</span>
                      <span className={`text-[11px] ${featured ? "text-white/60" : "text-[#A0A0A0]"}`}>{period}</span>
                    </div>
                    <p className={`text-[10px] font-bold uppercase tracking-[0.1em] mt-1 ${featured ? "text-white/80" : "text-[#B31C1C]"}`}>{note}</p>
                  </div>
                  <div className="space-y-2.5 mb-7 flex-1">
                    {perks.map(p => (
                      <div key={p} className="flex items-center gap-2.5">
                        <div className={`w-1 h-1 shrink-0 ${featured ? "bg-white" : "bg-[#B31C1C]"}`} />
                        <span className={`text-[12px] ${featured ? "text-white/80" : "text-[#555]"}`}>{p}</span>
                      </div>
                    ))}
                  </div>
                  <Link href="/abrir" className={`block text-center py-3 text-[11px] font-bold uppercase tracking-[0.12em] transition-colors ${featured ? "bg-white text-[#B31C1C] hover:bg-white/90" : "border border-[#DEDEDE] text-[#111] hover:border-[#B31C1C] hover:text-[#B31C1C]"}`}>
                    {cta}
                  </Link>
                </div>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────────── */}
      <section className="border-b border-[#E0E0E0] py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-[360px_1fr] gap-16">
            <BlurFade delay={0}>
              <div className="lg:sticky lg:top-28">
                <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#B31C1C] mb-4">Preguntas</p>
                <h2 className="font-serif font-bold text-[clamp(28px,4vw,44px)] leading-[0.93] tracking-[-0.02em]">
                  ¿Tienes<br />preguntas?<br />
                  <span className="text-[#B31C1C]">Tenemos<br />respuestas.</span>
                </h2>
              </div>
            </BlurFade>
            <BlurFade delay={0.1}>
              <div className="border-t border-[#E0E0E0]">
                {faqs.map(({ q, a }) => <FaqItem key={q} q={q} a={a} />)}
              </div>
            </BlurFade>
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ───────────────────────────────────────────────────── */}
      <section className="bg-[#111] py-36 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#B31C1C]/12 rounded-full blur-[100px]" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <BlurFade delay={0}>
            <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-[#B31C1C] mb-8">Empieza hoy</p>
            <h2 className="font-serif font-bold text-[clamp(36px,6vw,76px)] leading-[0.92] tracking-[-0.03em] text-white mb-6">
              ¿Listo para cobrar<br />lo que sabes?
            </h2>
            <p className="text-[16px] text-white/45 max-w-md mx-auto mb-10 leading-[1.8]">
              Únete a los 34 profesionales que ya generan ingresos reales con su conocimiento.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/registro" className="flex items-center gap-3 bg-white text-[#111] px-8 py-4 text-[13px] font-bold hover:bg-[#F8F7F5] transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Continuar con Google
              </Link>
              <Link href="/abrir" className="border border-white/20 text-white px-8 py-4 text-[13px] font-semibold hover:bg-white/5 transition-colors">
                Abre tu sala gratis →
              </Link>
            </div>
            <p className="text-[9px] text-white/20 mt-6 uppercase tracking-[0.15em]">Sin tarjeta · Gratis para empezar</p>
          </BlurFade>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <footer className="bg-[#0A0A0A] border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-[#B31C1C] flex items-center justify-center">
                  <span className="text-white font-bold text-[11px] font-serif">S</span>
                </div>
                <span className="text-[15px] font-bold uppercase tracking-[0.04em] text-white font-serif">ALA</span>
              </div>
              <p className="text-[12px] text-white/35 leading-[1.75] max-w-[160px]">La plataforma que convierte expertos en creadores que cobran.</p>
            </div>
            {[
              { title: "Plataforma",     links: ["Editor", "Analytics", "Pagos", "Membresías"] },
              { title: "Para creadores", links: ["Cómo funciona", "Precios", "Casos de uso", "Blog"] },
              { title: "Explorar",       links: ["Economía", "Derecho", "Medicina", "Arquitectura"] },
              { title: "Empresa",        links: ["Acerca de", "Contacto", "Términos", "Privacidad"] },
            ].map(({ title, links }) => (
              <div key={title}>
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/35 mb-4">{title}</p>
                <div className="space-y-2.5">
                  {links.map(l => <p key={l} className="text-[12px] text-white/25 hover:text-white/60 transition-colors cursor-pointer">{l}</p>)}
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 pt-6 flex items-center justify-between">
            <p className="text-[9px] text-white/20 uppercase tracking-[0.12em]">© 2025 Sala · Nebbuler</p>
            <a href="mailto:hello@nebbuler.com" className="text-[9px] text-white/20 hover:text-white/55 transition-colors uppercase tracking-[0.12em]">hello@nebbuler.com</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
