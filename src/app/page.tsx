"use client";

import Link from "next/link";
import { NumberTicker } from "@/components/ui/number-ticker";
import { BlurFade } from "@/components/ui/blur-fade";
import { BorderBeam } from "@/components/ui/border-beam";
import { Marquee } from "@/components/ui/marquee";
import {
  IconBolt,
  IconCash,
  IconShieldLock,
  IconChartBar,
  IconUsers,
  IconEditCircle,
  IconStar,
  IconChevronDown,
  IconChevronUp,
} from "@tabler/icons-react";
import { useState } from "react";

/* ─── Data ──────────────────────────────────────────────────────────────── */

const stats = [
  { value: 34, suffix: "", label: "Creadores activos" },
  { value: 2418, suffix: "+", label: "Suscriptores pagando" },
  { value: 180, prefix: "$", suffix: "K", label: "Generados en 2025" },
  { value: 95, suffix: "%", label: "Retención mensual" },
];

const features = [
  { icon: IconEditCircle, title: "Editor profesional", body: "Escribe, formatea y publica contenido de largo aliento. Tú decides qué es gratuito y qué es exclusivo para suscriptores." },
  { icon: IconUsers, title: "Gestión de audiencia", body: "CRM completo de tu base de lectores. Segmenta, comunícate y conoce quiénes son los que realmente pagan." },
  { icon: IconCash, title: "Monetización directa", body: "Cobra suscripciones mensuales directo a tu cuenta. 0% de comisión con Plan Pro. Sin intermediarios." },
  { icon: IconChartBar, title: "Analytics de verdad", body: "Aperturas, retención, ingresos mes a mes. Los datos que importan para crecer tu sala." },
  { icon: IconShieldLock, title: "Contenido exclusivo", body: "Acceso por membresía. Tus suscriptores pagan para leer lo que sólo tú puedes escribir." },
  { icon: IconBolt, title: "Listo en 15 minutos", body: "Sin código. Sin diseñador. Sin agencia. Configuras tu perfil, precio y comienzas a publicar hoy." },
];

const creators = [
  { name: "Rodrigo Fuentes", specialty: "ECONOMÍA", initial: "RF", color: "#1a1a2e", bio: "Análisis semanal del mercado chileno sin el filtro del titular.", price: "$9.990", subscribers: 847, posts: 48, href: "/rodrigo-fuentes" },
  { name: "Isabel Contreras", specialty: "DERECHO TRIBUTARIO", initial: "IC", color: "#1a2e1a", bio: "Lo que el SII no te explica, pero necesitas saber para no pagar de más.", price: "$12.990", subscribers: 523, posts: 31, href: "/isabel-contreras" },
  { name: "Marco Salinas", specialty: "ARQUITECTURA", initial: "MS", color: "#2e1a1a", bio: "Arquitectura latinoamericana que no sale en los libros.", price: "$7.990", subscribers: 312, posts: 24, href: "/marco-salinas" },
];

const userTypes = [
  { avatar: "RF", bg: "#1a1a2e", title: "Creadores independientes", body: "Publica tu expertise y cobra por el acceso. Sin depender de redes sociales ni algoritmos.", icon: "👤" },
  { avatar: "IC", bg: "#1a2e1a", title: "Expertos de industria", body: "Conecta directamente con tu audiencia y convierte tu experiencia en ingresos recurrentes.", icon: "🎓" },
  { avatar: "MS", bg: "#2e2020", title: "Profesionales de área", body: "Economistas, abogados, médicos, arquitectos. Tu campo tiene un público que quiere aprender.", icon: "⚖️" },
];

const plans = [
  { name: "Gratis", price: "$0", period: "para siempre", desc: "Lo esencial para empezar.", cta: "Abre gratis", featured: false, commission: "10% de comisión", features: ["Sala personalizada", "Publicaciones ilimitadas", "Hasta 100 suscriptores", "Pagos via Stripe"] },
  { name: "Creador", price: "$15.990", period: "al mes", desc: "Para creadores que están creciendo.", cta: "Probar gratis", featured: true, commission: "5% de comisión", features: ["Todo del plan Gratis", "Suscriptores ilimitados", "Analytics avanzado", "Soporte prioritario"] },
  { name: "Pro", price: "$39.990", period: "al mes", desc: "Para quienes van en serio.", cta: "Probar gratis", featured: false, commission: "0% de comisión", features: ["Todo del plan Creador", "0% de comisión", "Dominio personalizado", "Acceso API"] },
];

const faqs = [
  { q: "¿Necesito saber programar para abrir mi sala?", a: "No. Sala está diseñado para que cualquier profesional pueda configurar su espacio y comenzar a publicar en menos de 15 minutos, sin código ni diseño." },
  { q: "¿Cómo recibo los pagos de mis suscriptores?", a: "Los pagos se procesan vía Stripe y llegan directamente a tu cuenta bancaria. En Plan Gratis Sala toma un 10%, en Plan Pro el 0%." },
  { q: "¿Puedo tener contenido gratuito y contenido de pago?", a: "Sí. Tú decides qué publicaciones son abiertas al público y cuáles son exclusivas para suscriptores pagos." },
  { q: "¿Qué pasa si quiero cancelar?", a: "Puedes cancelar tu plan en cualquier momento. Tus datos y publicaciones permanecen accesibles." },
  { q: "¿Sala funciona fuera de Chile?", a: "Sí. Sala está disponible en toda Latinoamérica y para creadores de habla hispana en cualquier país." },
];

const tickerItems = [
  "ECONOMÍA", "DERECHO TRIBUTARIO", "MEDICINA", "ARQUITECTURA",
  "FINANZAS PERSONALES", "EDUCACIÓN", "TECNOLOGÍA", "MARKETING",
  "CIENCIA POLÍTICA", "NUTRICIÓN", "PSICOLOGÍA", "INGENIERÍA",
];

/* ─── FAQ Item ──────────────────────────────────────────────────────────── */

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <button
      className="w-full text-left border-b border-white/10 py-5 group"
      onClick={() => setOpen(!open)}
    >
      <div className="flex items-center justify-between gap-4">
        <span className="text-[16px] font-semibold text-white group-hover:text-[#FF6B6B] transition-colors">
          {q}
        </span>
        {open
          ? <IconChevronUp size={18} className="text-[#C41C1C] shrink-0" />
          : <IconChevronDown size={18} className="text-white/40 shrink-0" />
        }
      </div>
      {open && (
        <p className="text-[14px] leading-[1.75] text-white/60 mt-3 pr-8">{a}</p>
      )}
    </button>
  );
}

/* ─── Page ──────────────────────────────────────────────────────────────── */

export default function Home() {
  return (
    <div className="min-h-screen bg-[#080811] text-white font-sans">

      {/* ── NAV ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#080811]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-[22px] font-black uppercase tracking-[-0.02em] text-white">
            SALA
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            {[
              { label: "Explorar", href: "/explorar" },
              { label: "Para creadores", href: "/para-creadores" },
              { label: "Precios", href: "/precios" },
            ].map(({ label, href }) => (
              <Link key={label} href={href} className="text-[13px] font-medium text-white/60 hover:text-white transition-colors uppercase tracking-[0.06em]">
                {label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/entrar" className="text-[13px] font-semibold text-white/70 hover:text-white transition-colors uppercase tracking-[0.06em]">
              Iniciar sesión
            </Link>
            <Link href="/abrir" className="bg-[#C41C1C] text-white px-5 py-2.5 text-[13px] font-bold uppercase tracking-[0.08em] hover:bg-[#E02020] transition-colors rounded-sm">
              Abre tu sala
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-white/10">
        {/* Glow background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#C41C1C]/10 rounded-full blur-[120px]" />
          <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-[#C41C1C]/5 rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-24">
          <div className="grid lg:grid-cols-[1fr_480px] gap-16 items-center">

            {/* LEFT */}
            <div>
              <BlurFade delay={0}>
                <div className="inline-flex items-center gap-2 border border-white/15 bg-white/5 px-4 py-2 rounded-full mb-8">
                  <div className="flex">
                    {["★", "★", "★", "★", "★"].map((s, i) => (
                      <IconStar key={i} size={12} className="text-[#FFAA00] fill-[#FFAA00]" />
                    ))}
                  </div>
                  <span className="text-[12px] font-semibold text-white/80">4.9 de 847 creadores</span>
                </div>
              </BlurFade>

              <BlurFade delay={0.06}>
                <h1 className="font-sans text-[clamp(40px,6vw,76px)] font-black leading-[0.92] tracking-[-0.03em] uppercase mb-6">
                  LA PLATAFORMA<br />
                  QUE CONVIERTE<br />
                  EXPERTOS EN<br />
                  <span className="bg-gradient-to-r from-[#C41C1C] to-[#FF6B6B] bg-clip-text text-transparent">
                    CREADORES<br />
                    QUE COBRAN.
                  </span>
                </h1>
              </BlurFade>

              <BlurFade delay={0.12}>
                <p className="text-[16px] leading-[1.8] text-white/60 max-w-lg mb-8">
                  La plataforma todo-en-uno que une newsletters, membresías y pagos para que economistas, abogados, médicos y consultores publiquen lo que saben — y cobren por ello.
                </p>
              </BlurFade>

              <BlurFade delay={0.18}>
                <div className="flex flex-wrap gap-3 mb-6">
                  <Link
                    href="/registro"
                    className="flex items-center gap-3 bg-white text-[#121212] px-6 py-3.5 text-[14px] font-bold rounded-sm hover:bg-white/90 transition-colors"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Registrarse con Google
                  </Link>
                  <Link
                    href="/registro"
                    className="border border-white/20 bg-white/5 text-white px-6 py-3.5 text-[14px] font-semibold rounded-sm hover:bg-white/10 transition-colors"
                  >
                    Registrarse con email
                  </Link>
                </div>
                <p className="text-[12px] text-white/30 uppercase tracking-[0.08em]">
                  Sin tarjeta de crédito · 0% de comisión para empezar
                </p>
              </BlurFade>
            </div>

            {/* RIGHT — Product mockup */}
            <BlurFade delay={0.25}>
              <div className="relative">
                {/* Main dashboard card */}
                <div className="relative bg-[#0E0E20] border border-white/10 rounded-2xl overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.5)]">
                  <BorderBeam size={400} duration={18} colorFrom="#C41C1C" colorTo="#FF6B6B" />

                  {/* Dashboard header */}
                  <div className="flex items-center gap-2 px-5 py-3 border-b border-white/10">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                      <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                      <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                    </div>
                    <span className="text-[11px] text-white/30 mx-auto">sala.lat/rodrigo-fuentes</span>
                  </div>

                  <div className="p-6">
                    {/* Creator info */}
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-10 h-10 rounded-full bg-[#1a1a2e] flex items-center justify-center">
                        <span className="text-[13px] font-bold text-white">RF</span>
                      </div>
                      <div>
                        <p className="text-[13px] font-bold text-white">Rodrigo Fuentes</p>
                        <p className="text-[10px] text-[#C41C1C] uppercase tracking-[0.1em] font-semibold">Economía</p>
                      </div>
                      <span className="ml-auto text-[10px] bg-[#22a222]/20 text-[#44cc44] px-2.5 py-1 rounded-full font-semibold uppercase tracking-[0.08em]">Activo</span>
                    </div>

                    {/* Earnings */}
                    <div className="bg-[#C41C1C]/10 border border-[#C41C1C]/20 rounded-xl p-4 mb-4">
                      <p className="text-[10px] text-white/50 uppercase tracking-[0.1em] font-semibold mb-1">Ingresos este mes</p>
                      <p className="text-[36px] font-black text-white leading-none tracking-[-0.02em]">$8.470.000</p>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <span className="text-[11px] text-[#44cc44] font-bold">↑ 12%</span>
                        <span className="text-[11px] text-white/40">vs mes anterior</span>
                      </div>
                    </div>

                    {/* Mini chart */}
                    <div className="mb-4">
                      <div className="flex items-end gap-1 h-12">
                        {[35, 48, 42, 60, 55, 70, 65, 80, 72, 90, 85, 100].map((h, i) => (
                          <div
                            key={i}
                            className={`flex-1 rounded-sm ${i === 11 ? "bg-[#C41C1C]" : "bg-white/10"}`}
                            style={{ height: `${h}%` }}
                          />
                        ))}
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-[9px] text-white/20">Ene</span>
                        <span className="text-[9px] text-white/20">Dic</span>
                      </div>
                    </div>

                    {/* Stats row */}
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: "Suscriptores", value: "847" },
                        { label: "Publicaciones", value: "48" },
                      ].map(({ label, value }) => (
                        <div key={label} className="bg-white/5 border border-white/8 rounded-xl p-3">
                          <p className="text-[20px] font-black text-white">{value}</p>
                          <p className="text-[9px] text-white/40 uppercase tracking-[0.1em] font-semibold">{label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Floating notification */}
                <div className="absolute -bottom-4 -left-4 bg-[#0E0E20] border border-white/15 rounded-xl px-4 py-2.5 flex items-center gap-2.5 shadow-xl">
                  <div className="w-7 h-7 rounded-full bg-[#C41C1C]/20 flex items-center justify-center shrink-0">
                    <span className="text-[11px]">🔔</span>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-white">María C. se suscribió</p>
                    <p className="text-[10px] text-white/40">hace 2 min · $9.990/mes</p>
                  </div>
                </div>
              </div>
            </BlurFade>

          </div>
        </div>
      </section>

      {/* ── TRUST STRIP ─────────────────────────────────────────────────── */}
      <div className="border-b border-white/10 py-5">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-white/30 mb-4">
          Confiado por expertos en
        </p>
        <Marquee duration={30} pauseOnHover>
          {tickerItems.map((tag) => (
            <div key={tag} className="shrink-0 mx-4">
              <span className="inline-flex items-center border border-white/10 bg-white/5 px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-[0.12em] text-white/60 hover:text-white hover:border-white/25 transition-colors cursor-default">
                {tag}
              </span>
            </div>
          ))}
        </Marquee>
      </div>

      {/* ── STATS CARD ──────────────────────────────────────────────────── */}
      <section className="py-20 border-b border-white/10">
        <div className="max-w-5xl mx-auto px-6">
          <BlurFade delay={0}>
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10 border border-white/10 bg-[#C41C1C]/5 rounded-2xl overflow-hidden">
              {stats.map(({ value, prefix, suffix, label }, i) => (
                <div key={label} className="px-8 py-10 text-center">
                  <p className="font-black text-[clamp(36px,5vw,60px)] leading-none tracking-[-0.03em] text-white flex items-baseline justify-center gap-0.5">
                    {prefix && <span className="text-[#FF6B6B]">{prefix}</span>}
                    <NumberTicker value={value} className="text-white" />
                    {suffix && <span className="text-[#FF6B6B]">{suffix}</span>}
                  </p>
                  <p className="text-[11px] uppercase tracking-[0.14em] text-white/40 mt-3 font-semibold">{label}</p>
                </div>
              ))}
            </div>
          </BlurFade>
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────────────────────────────── */}
      <section className="py-24 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <BlurFade delay={0}>
            <h2 className="font-sans font-black text-[clamp(32px,5vw,64px)] uppercase tracking-[-0.02em] text-center mb-4">
              TODO LO QUE NECESITAS.<br />
              <span className="text-white/30">UNA PLATAFORMA.</span>
            </h2>
            <p className="text-center text-[15px] text-white/50 max-w-xl mx-auto mb-16">
              Desde el editor hasta los pagos. Sin parchear herramientas ni depender de terceros.
            </p>
          </BlurFade>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map(({ icon: Icon, title, body }, i) => (
              <BlurFade key={title} delay={i * 0.05}>
                <div className="bg-[#0E0E20] border border-white/8 rounded-2xl p-7 group hover:border-[#C41C1C]/40 hover:bg-[#C41C1C]/5 transition-all duration-300">
                  <div className="w-11 h-11 bg-[#C41C1C]/15 border border-[#C41C1C]/25 rounded-xl flex items-center justify-center mb-5 group-hover:bg-[#C41C1C]/25 transition-colors">
                    <Icon size={20} className="text-[#C41C1C]" strokeWidth={1.8} />
                  </div>
                  <h3 className="text-[16px] font-bold text-white mb-2">{title}</h3>
                  <p className="text-[13px] leading-[1.75] text-white/50">{body}</p>
                </div>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOR THOSE BUILDING ──────────────────────────────────────────── */}
      <section className="py-24 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <BlurFade delay={0}>
              <h2 className="font-sans font-black text-[clamp(32px,5vw,60px)] uppercase tracking-[-0.02em] leading-[0.93] mb-6">
                PARA QUIENES<br />
                TIENEN ALGO<br />
                <span className="text-[#C41C1C]">REAL QUE<br />COBRAR</span>
              </h2>
              <p className="text-[15px] leading-[1.8] text-white/50 mb-8 max-w-md">
                Ya seas un creador independiente, un experto de industria o un profesional de área, Sala te da las herramientas para publicar, crecer y cobrar — sin depender de nadie.
              </p>
              <Link href="/abrir" className="inline-block bg-[#C41C1C] text-white px-6 py-3.5 text-[13px] font-bold uppercase tracking-[0.1em] rounded-sm hover:bg-[#E02020] transition-colors">
                Registrarse gratis
              </Link>
            </BlurFade>

            <div className="space-y-4">
              {userTypes.map(({ avatar, bg, title, body, icon }, i) => (
                <BlurFade key={title} delay={i * 0.08}>
                  <div className="bg-[#0E0E20] border border-white/10 rounded-2xl p-5 flex items-center gap-5 group hover:border-[#C41C1C]/30 transition-all duration-300">
                    <div className="flex items-center gap-0 shrink-0">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-[18px] border border-white/10 bg-white/5">
                        {icon}
                      </div>
                      <div className="w-8 h-8 -ml-3 rounded-full bg-[#C41C1C] flex items-center justify-center border-2 border-[#080811]">
                        <span className="text-[10px] font-black text-white">S</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-[14px] font-bold text-white mb-1">{title}</p>
                      <p className="text-[12px] text-white/50 leading-[1.6]">{body}</p>
                    </div>
                  </div>
                </BlurFade>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SALAS DESTACADAS ────────────────────────────────────────────── */}
      <section className="py-24 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <BlurFade delay={0}>
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C41C1C] mb-2">Salas activas</p>
                <h2 className="font-sans font-black text-[clamp(28px,4vw,52px)] uppercase tracking-[-0.02em] leading-tight">
                  IMPULSANDO A LOS MEJORES<br />EXPERTOS DEL MUNDO<br /><span className="text-white/30">HISPANOHABLANTE.</span>
                </h2>
              </div>
              <Link href="/explorar" className="text-[13px] font-semibold text-[#C41C1C] hover:underline shrink-0 hidden md:block">
                Ver todas las salas →
              </Link>
            </div>
          </BlurFade>

          <div className="grid md:grid-cols-3 gap-4">
            {creators.map((c, i) => (
              <BlurFade key={c.name} delay={i * 0.07}>
                <Link href={c.href} className="group block bg-[#0E0E20] border border-white/8 rounded-2xl p-7 hover:border-[#C41C1C]/40 hover:bg-[#C41C1C]/5 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: c.color }}>
                      <span className="font-serif text-[15px] font-bold text-white">{c.initial}</span>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#C41C1C]">{c.specialty}</p>
                      <h3 className="text-[16px] font-bold text-white group-hover:text-[#FF6B6B] transition-colors">{c.name}</h3>
                    </div>
                  </div>
                  <p className="text-[13px] leading-[1.7] text-white/50 mb-5">{c.bio}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-white/8">
                    <div>
                      <p className="text-[18px] font-black text-white">{c.price}<span className="text-[12px] font-normal text-white/40">/mes</span></p>
                      <p className="text-[10px] text-white/30 mt-0.5">{c.subscribers.toLocaleString()} suscriptores</p>
                    </div>
                    <span className="text-[11px] font-bold text-[#C41C1C] uppercase tracking-[0.1em] group-hover:underline">Ver sala →</span>
                  </div>
                </Link>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ─────────────────────────────────────────────────────── */}
      <section className="py-24 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <BlurFade delay={0}>
            <h2 className="font-sans font-black text-[clamp(28px,4vw,52px)] uppercase tracking-[-0.02em] text-center mb-3">
              ELIGE EL PLAN PARA CRECER
            </h2>
            <p className="text-center text-[14px] text-white/40 mb-14">
              Empieza gratis. Escala cuando estés listo.
            </p>
          </BlurFade>

          <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {plans.map(({ name, price, period, desc, cta, featured, commission, features: planFeatures }, i) => (
              <BlurFade key={name} delay={i * 0.07}>
                <div className={`relative rounded-2xl p-7 flex flex-col h-full ${featured ? "bg-[#C41C1C] border border-[#FF4444]/30" : "bg-[#0E0E20] border border-white/10"}`}>
                  {featured && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-white text-[#C41C1C] text-[10px] font-black uppercase tracking-[0.1em] px-3 py-1 rounded-full">
                        Recomendado
                      </span>
                    </div>
                  )}
                  <div className="mb-6">
                    <p className="text-[13px] font-bold text-white/70 uppercase tracking-[0.1em] mb-3">{name}</p>
                    <div className="flex items-baseline gap-1 mb-1">
                      <span className="text-[36px] font-black text-white leading-none">{price}</span>
                      <span className="text-[13px] text-white/50">{period}</span>
                    </div>
                    <p className="text-[12px] text-white/50 mb-1">{desc}</p>
                    <p className="text-[11px] font-semibold text-white/60 uppercase tracking-[0.08em]">{commission}</p>
                  </div>
                  <div className="space-y-2.5 mb-7 flex-1">
                    {planFeatures.map((f) => (
                      <div key={f} className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${featured ? "bg-white" : "bg-[#C41C1C]"}`} />
                        <span className="text-[13px] text-white/70">{f}</span>
                      </div>
                    ))}
                  </div>
                  <Link
                    href="/abrir"
                    className={`block text-center py-3.5 text-[13px] font-bold uppercase tracking-[0.1em] rounded-sm transition-colors ${featured ? "bg-white text-[#C41C1C] hover:bg-white/90" : "border border-white/20 bg-white/5 text-white hover:bg-white/10"}`}
                  >
                    {cta}
                  </Link>
                </div>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────────── */}
      <section className="py-24 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-[400px_1fr] gap-16">
            <BlurFade delay={0}>
              <h2 className="font-sans font-black text-[clamp(32px,4vw,52px)] uppercase tracking-[-0.02em] leading-[0.93] sticky top-28">
                ¿TIENES<br />PREGUNTAS?<br />
                <span className="text-[#C41C1C]">TENEMOS<br />RESPUESTAS.</span>
              </h2>
            </BlurFade>
            <BlurFade delay={0.1}>
              <div className="border-t border-white/10">
                {faqs.map(({ q, a }) => (
                  <FaqItem key={q} q={q} a={a} />
                ))}
              </div>
            </BlurFade>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ───────────────────────────────────────────────────── */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-[#C41C1C]/30 via-[#080811] to-[#080811]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#C41C1C]/15 rounded-full blur-[120px]" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <BlurFade delay={0}>
            <h2 className="font-sans font-black text-[clamp(36px,6vw,80px)] uppercase tracking-[-0.03em] leading-[0.92] mb-6">
              ¿LISTO PARA<br />
              <span className="bg-gradient-to-r from-[#C41C1C] to-[#FF6B6B] bg-clip-text text-transparent">
                COBRAR LO<br />
                QUE SABES?
              </span>
            </h2>
            <p className="text-[16px] text-white/50 max-w-lg mx-auto mb-10">
              Únete a los 34 creadores que ya están generando ingresos reales con su conocimiento.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/registro" className="flex items-center gap-3 bg-white text-[#121212] px-8 py-4 text-[14px] font-bold rounded-sm hover:bg-white/90 transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Registrarse con Google
              </Link>
              <Link href="/registro" className="border border-white/20 bg-white/5 text-white px-8 py-4 text-[14px] font-semibold rounded-sm hover:bg-white/10 transition-colors">
                Registrarse con email
              </Link>
            </div>
            <p className="text-[12px] text-white/25 mt-5 uppercase tracking-[0.1em]">
              Sin tarjeta de crédito · Gratis para empezar
            </p>
          </BlurFade>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/10 bg-[#050508]">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-14">
            <div className="col-span-2 md:col-span-1">
              <p className="text-[22px] font-black uppercase text-white mb-3">SALA</p>
              <p className="text-[12px] text-white/40 leading-[1.7] max-w-[180px]">
                La plataforma que convierte expertos en creadores que cobran.
              </p>
            </div>
            {[
              { title: "Plataforma", links: ["Editor", "Analytics", "Pagos", "Membresías"] },
              { title: "Para creadores", links: ["Cómo funciona", "Precios", "Casos de uso", "Blog"] },
              { title: "Explorar", links: ["Economía", "Derecho", "Medicina", "Arquitectura"] },
              { title: "Empresa", links: ["Acerca de", "Contacto", "Términos", "Privacidad"] },
            ].map(({ title, links }) => (
              <div key={title}>
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/50 mb-4">{title}</p>
                <div className="space-y-2.5">
                  {links.map((l) => (
                    <p key={l} className="text-[13px] text-white/40 hover:text-white transition-colors cursor-pointer">{l}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 pt-8 flex items-center justify-between">
            <p className="text-[11px] text-white/25 uppercase tracking-[0.1em]">© 2025 Sala · Nebbuler</p>
            <a href="mailto:hello@nebbuler.com" className="text-[11px] text-white/25 hover:text-white transition-colors uppercase tracking-[0.1em]">
              hello@nebbuler.com
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
