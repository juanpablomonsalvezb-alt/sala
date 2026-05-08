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
  IconArrowRight,
} from "@tabler/icons-react";
import { useState } from "react";

/* ─── Paleta ─────────────────────────────────────────────────────────────
   Blanco #FFFFFF · Crema #F8F7F5 · Tinta #111111 · Crimson #B31C1C
   Muted #555 · Borde #E5E5E5 · Sombra sutil
─────────────────────────────────────────────────────────────────────── */

const stats = [
  { value: 34,   pre: "",  suf: "",  label: "Creadores activos" },
  { value: 2418, pre: "",  suf: "+", label: "Suscriptores pagando" },
  { value: 180,  pre: "$", suf: "K", label: "Generados en 2025" },
  { value: 95,   pre: "",  suf: "%", label: "Retención mensual" },
];

const features = [
  { icon: IconEditCircle, title: "Editor profesional",     body: "Escribe, formatea y publica contenido de largo aliento. Tú decides qué es libre y qué es exclusivo." },
  { icon: IconUsers,      title: "Gestión de audiencia",   body: "CRM completo de tus lectores. Segmenta, comunícate y conoce a quienes realmente pagan." },
  { icon: IconCash,       title: "Pagos directos",         body: "Cobra suscripciones mes a mes directo a tu cuenta. 0% de comisión con Plan Pro." },
  { icon: IconChartBar,   title: "Analytics real",         body: "Aperturas, retención, ingresos. Los datos que importan para crecer tu sala." },
  { icon: IconShieldLock, title: "Acceso por membresía",   body: "Tus suscriptores pagan para leer lo que sólo tú puedes escribir. Sin filtros externos." },
  { icon: IconBolt,       title: "Listo en 15 minutos",    body: "Sin código, sin diseñador. Configuras tu perfil, fijas tu precio y publicas hoy." },
];

const creators = [
  { name: "Rodrigo Fuentes",  specialty: "ECONOMÍA",          initial: "RF", color: "#1a1a2e", bio: "Análisis semanal del mercado chileno sin el filtro del titular.",               price: "$9.990",  subscribers: 847, posts: 48, href: "/rodrigo-fuentes"  },
  { name: "Isabel Contreras", specialty: "DERECHO TRIBUTARIO", initial: "IC", color: "#1a2e1a", bio: "Lo que el SII no te explica, pero necesitas saber para no pagar de más.",        price: "$12.990", subscribers: 523, posts: 31, href: "/isabel-contreras" },
  { name: "Marco Salinas",    specialty: "ARQUITECTURA",       initial: "MS", color: "#2e1a1a", bio: "Arquitectura latinoamericana que no sale en los libros.",                        price: "$7.990",  subscribers: 312, posts: 24, href: "/marco-salinas"    },
];

const plans = [
  { name: "Gratis",   price: "$0",       period: "para siempre", desc: "Lo esencial para empezar.",            cta: "Abre gratis",   featured: false, note: "10% de comisión",  perks: ["Sala personalizada", "Publicaciones ilimitadas", "Hasta 100 suscriptores", "Pagos via Stripe"] },
  { name: "Creador",  price: "$15.990",  period: "al mes",       desc: "Para creadores en crecimiento.",        cta: "Probar gratis", featured: true,  note: "5% de comisión",   perks: ["Todo del plan Gratis", "Suscriptores ilimitados", "Analytics avanzado", "Soporte prioritario"] },
  { name: "Pro",      price: "$39.990",  period: "al mes",       desc: "Para quienes van en serio.",            cta: "Probar gratis", featured: false, note: "0% de comisión",   perks: ["Todo del plan Creador", "0% de comisión", "Dominio personalizado", "Acceso API"] },
];

const faqs = [
  { q: "¿Necesito saber programar para abrir mi sala?",          a: "No. Sala está diseñado para que cualquier profesional configure su espacio y empiece a publicar en 15 minutos, sin código ni diseño." },
  { q: "¿Cómo recibo los pagos de mis suscriptores?",            a: "Los pagos se procesan vía Stripe y llegan directamente a tu cuenta. En Plan Gratis Sala toma un 10%; en Plan Pro el 0%." },
  { q: "¿Puedo tener contenido gratuito y de pago a la vez?",    a: "Sí. Tú decides qué publicaciones son abiertas al público y cuáles son exclusivas para suscriptores." },
  { q: "¿Qué pasa si quiero cancelar?",                          a: "Puedes cancelar en cualquier momento. Tus datos y publicaciones permanecen accesibles." },
  { q: "¿Sala funciona fuera de Chile?",                         a: "Sí. Disponible en toda Latinoamérica y para creadores de habla hispana en cualquier país." },
];

const tickerTags = ["ECONOMÍA","DERECHO","MEDICINA","ARQUITECTURA","FINANZAS","EDUCACIÓN","TECNOLOGÍA","MARKETING","CIENCIA POLÍTICA","NUTRICIÓN","PSICOLOGÍA","INGENIERÍA"];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <button className="w-full text-left border-b border-[#E5E5E5] py-5 group" onClick={() => setOpen(!open)}>
      <div className="flex items-center justify-between gap-4">
        <span className="text-[15px] font-semibold text-[#111] group-hover:text-[#B31C1C] transition-colors">{q}</span>
        {open
          ? <IconChevronUp  size={16} className="text-[#B31C1C] shrink-0" />
          : <IconChevronDown size={16} className="text-[#BBB] shrink-0" />}
      </div>
      {open && <p className="text-[14px] leading-[1.75] text-[#666] mt-3 pr-6">{a}</p>}
    </button>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-[#111] font-sans">

      {/* ══ NAV ════════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#E8E8E8]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-[20px] font-black uppercase tracking-[-0.01em] text-[#111]">
            SALA
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            {[
              { label: "Explorar",        href: "/explorar" },
              { label: "Para creadores",  href: "/para-creadores" },
              { label: "Precios",         href: "/precios" },
            ].map(({ label, href }) => (
              <Link key={label} href={href} className="text-[13px] font-medium text-[#666] hover:text-[#111] transition-colors">
                {label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/entrar"  className="text-[13px] font-medium text-[#666] hover:text-[#111] transition-colors">Iniciar sesión</Link>
            <Link href="/abrir"   className="bg-[#B31C1C] text-white px-5 py-2.5 text-[13px] font-bold rounded-sm hover:bg-[#8E1515] transition-colors">
              Abre tu sala
            </Link>
          </div>
        </div>
      </header>

      {/* ══ HERO ═══════════════════════════════════════════════════════════ */}
      <section className="border-b border-[#E8E8E8] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 pt-20 pb-24">
          <div className="grid lg:grid-cols-[1fr_500px] gap-16 items-center">

            {/* LEFT */}
            <div>
              <BlurFade delay={0}>
                <div className="inline-flex items-center gap-2 border border-[#E8E8E8] bg-[#F8F7F5] px-4 py-2 rounded-full mb-8">
                  <div className="flex">
                    {[0,1,2,3,4].map(i => <IconStar key={i} size={11} className="text-[#F59E0B] fill-[#F59E0B]" />)}
                  </div>
                  <span className="text-[12px] font-semibold text-[#555]">4.9 de 847 creadores</span>
                </div>
              </BlurFade>

              <BlurFade delay={0.06}>
                <h1 className="font-sans text-[clamp(40px,5.5vw,72px)] font-black leading-[0.93] tracking-[-0.03em] mb-6">
                  La plataforma que<br />
                  convierte expertos<br />
                  en{" "}
                  <span className="relative inline-block">
                    <span className="relative z-10 text-[#B31C1C]">creadores</span>
                    <span className="absolute bottom-1 left-0 w-full h-[6px] bg-[#B31C1C]/15 -z-0" />
                  </span>
                  {" "}que<br />cobran.
                </h1>
              </BlurFade>

              <BlurFade delay={0.12}>
                <p className="text-[17px] leading-[1.8] text-[#555] max-w-lg mb-8">
                  La plataforma todo-en-uno para que economistas, abogados, médicos y consultores publiquen lo que saben — y cobren por ello directamente.
                </p>
              </BlurFade>

              <BlurFade delay={0.18}>
                <div className="flex flex-wrap gap-3 mb-5">
                  <Link href="/registro" className="flex items-center gap-3 border border-[#E0E0E0] bg-white px-6 py-3.5 text-[14px] font-semibold text-[#111] rounded-sm hover:border-[#B31C1C] hover:text-[#B31C1C] transition-all shadow-sm">
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continuar con Google
                  </Link>
                  <Link href="/abrir" className="bg-[#B31C1C] text-white px-6 py-3.5 text-[14px] font-bold rounded-sm hover:bg-[#8E1515] transition-colors shadow-sm">
                    Abre tu sala gratis →
                  </Link>
                </div>
                <p className="text-[12px] text-[#AAA] uppercase tracking-[0.08em]">Sin tarjeta · 0% de comisión para empezar</p>
              </BlurFade>
            </div>

            {/* RIGHT — product mockup en blanco */}
            <BlurFade delay={0.24}>
              <div className="relative">
                <div className="relative bg-white border border-[#E5E5E5] rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
                  <BorderBeam size={400} duration={20} colorFrom="#B31C1C" colorTo="#FF8080" />

                  {/* Browser chrome */}
                  <div className="flex items-center gap-2 px-5 py-3 border-b border-[#F0F0F0] bg-[#FAFAFA]">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
                    </div>
                    <div className="flex-1 bg-white border border-[#E8E8E8] rounded-md px-3 py-1 mx-4">
                      <span className="text-[11px] text-[#999]">sala.lat/rodrigo-fuentes</span>
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Creator header */}
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-10 h-10 rounded-full bg-[#1a1a2e] flex items-center justify-center shrink-0">
                        <span className="text-[13px] font-bold text-white">RF</span>
                      </div>
                      <div>
                        <p className="text-[13px] font-bold text-[#111]">Rodrigo Fuentes</p>
                        <p className="text-[10px] font-bold text-[#B31C1C] uppercase tracking-[0.1em]">Economía</p>
                      </div>
                      <span className="ml-auto text-[10px] bg-[#DCFCE7] text-[#166534] px-2.5 py-1 rounded-full font-semibold uppercase tracking-[0.06em]">Activo</span>
                    </div>

                    {/* Earnings */}
                    <div className="bg-[#FFF5F5] border border-[#FFD5D5] rounded-xl p-4 mb-4">
                      <p className="text-[10px] text-[#999] uppercase tracking-[0.12em] font-bold mb-1">Ingresos este mes</p>
                      <p className="text-[34px] font-black text-[#111] leading-none tracking-[-0.02em]">$8.470.000</p>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <span className="text-[11px] text-[#166534] font-bold bg-[#DCFCE7] px-1.5 py-0.5 rounded">↑ 12%</span>
                        <span className="text-[11px] text-[#999]">vs mes anterior</span>
                      </div>
                    </div>

                    {/* Bar chart */}
                    <div className="mb-4">
                      <div className="flex items-end gap-1.5 h-14">
                        {[35,48,42,60,55,70,65,80,72,90,85,100].map((h, i) => (
                          <div key={i} className={`flex-1 rounded-sm ${i === 11 ? "bg-[#B31C1C]" : "bg-[#F0F0F0]"}`} style={{ height: `${h}%` }} />
                        ))}
                      </div>
                      <div className="flex justify-between mt-1.5">
                        <span className="text-[9px] text-[#CCC] font-medium">Ene</span>
                        <span className="text-[9px] text-[#CCC] font-medium">Dic</span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3">
                      {[{ label: "Suscriptores", value: "847" }, { label: "Publicaciones", value: "48" }].map(({ label, value }) => (
                        <div key={label} className="bg-[#F8F7F5] border border-[#EEEEEE] rounded-xl p-3">
                          <p className="text-[20px] font-black text-[#111]">{value}</p>
                          <p className="text-[9px] text-[#999] uppercase tracking-[0.1em] font-bold mt-0.5">{label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Notification */}
                <div className="absolute -bottom-4 -left-5 bg-white border border-[#E8E8E8] rounded-xl px-4 py-2.5 flex items-center gap-2.5 shadow-[0_8px_24px_rgba(0,0,0,0.1)]">
                  <div className="w-7 h-7 rounded-full bg-[#B31C1C]/10 flex items-center justify-center shrink-0">
                    <span className="text-[11px]">🔔</span>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-[#111]">María C. se suscribió</p>
                    <p className="text-[10px] text-[#999]">hace 2 min · $9.990/mes</p>
                  </div>
                </div>
              </div>
            </BlurFade>
          </div>
        </div>
      </section>

      {/* ══ TRUST MARQUEE ══════════════════════════════════════════════════ */}
      <div className="border-b border-[#E8E8E8] py-4 overflow-hidden bg-[#F8F7F5]">
        <p className="text-center text-[10px] font-bold uppercase tracking-[0.2em] text-[#BBB] mb-3">Confiado por expertos en</p>
        <Marquee duration={35} pauseOnHover>
          {tickerTags.map(tag => (
            <div key={tag} className="shrink-0 mx-3">
              <span className="inline-flex items-center border border-[#E0E0E0] bg-white px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-[0.1em] text-[#555] hover:border-[#B31C1C] hover:text-[#B31C1C] transition-colors cursor-default">
                {tag}
              </span>
            </div>
          ))}
        </Marquee>
      </div>

      {/* ══ STATS ══════════════════════════════════════════════════════════ */}
      <section className="border-b border-[#E8E8E8] py-20">
        <div className="max-w-5xl mx-auto px-6">
          <BlurFade delay={0}>
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-[#E8E8E8] border border-[#E8E8E8] rounded-2xl overflow-hidden shadow-sm">
              {stats.map(({ value, pre, suf, label }, i) => (
                <div key={label} className="px-8 py-10 text-center bg-white hover:bg-[#FFF5F5] transition-colors duration-300">
                  <p className="font-black text-[clamp(32px,5vw,56px)] leading-none tracking-[-0.03em] flex items-baseline justify-center gap-0.5">
                    {pre  && <span className="text-[#B31C1C]">{pre}</span>}
                    <NumberTicker value={value} className="text-[#111]" />
                    {suf  && <span className="text-[#B31C1C]">{suf}</span>}
                  </p>
                  <p className="text-[10px] uppercase tracking-[0.16em] text-[#AAA] mt-3 font-bold">{label}</p>
                </div>
              ))}
            </div>
          </BlurFade>
        </div>
      </section>

      {/* ══ FEATURES ═══════════════════════════════════════════════════════ */}
      <section className="border-b border-[#E8E8E8] py-24 bg-[#F8F7F5]">
        <div className="max-w-7xl mx-auto px-6">
          <BlurFade delay={0}>
            <div className="max-w-2xl mb-14">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#B31C1C] mb-3">Por qué Sala</p>
              <h2 className="font-sans font-black text-[clamp(28px,4vw,52px)] leading-[1.0] tracking-[-0.02em]">
                Todo lo que necesitas.<br />
                <span className="text-[#999]">Una plataforma.</span>
              </h2>
            </div>
          </BlurFade>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map(({ icon: Icon, title, body }, i) => (
              <BlurFade key={title} delay={i * 0.05}>
                <div className="bg-white border border-[#EBEBEB] rounded-2xl p-7 group hover:border-[#B31C1C]/30 hover:shadow-[0_4px_24px_rgba(179,28,28,0.08)] transition-all duration-300">
                  <div className="w-10 h-10 bg-[#FFF5F5] border border-[#FFD5D5] rounded-xl flex items-center justify-center mb-5 group-hover:bg-[#B31C1C] group-hover:border-[#B31C1C] transition-all duration-300">
                    <Icon size={18} className="text-[#B31C1C] group-hover:text-white transition-colors duration-300" strokeWidth={1.8} />
                  </div>
                  <h3 className="text-[15px] font-bold text-[#111] mb-2">{title}</h3>
                  <p className="text-[13px] leading-[1.75] text-[#666]">{body}</p>
                </div>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FOR THOSE ══════════════════════════════════════════════════════ */}
      <section className="border-b border-[#E8E8E8] py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <BlurFade delay={0}>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#B31C1C] mb-4">Para quienes tienen algo real</p>
              <h2 className="font-sans font-black text-[clamp(28px,4vw,56px)] leading-[0.95] tracking-[-0.02em] mb-6">
                Para quienes tienen<br />
                algo real que<br />
                <span className="text-[#B31C1C]">cobrar.</span>
              </h2>
              <p className="text-[16px] leading-[1.8] text-[#555] mb-8 max-w-md">
                Ya seas un consultor independiente, un experto de industria o un profesional de área, Sala te da las herramientas para publicar, crecer y cobrar — sin depender de nadie.
              </p>
              <Link href="/abrir" className="inline-flex items-center gap-2 bg-[#111] text-white px-6 py-3.5 text-[13px] font-bold rounded-sm hover:bg-[#B31C1C] transition-colors duration-200">
                Registrarse gratis <IconArrowRight size={15} />
              </Link>
            </BlurFade>

            <div className="space-y-4">
              {[
                { icon: "👤", title: "Creadores independientes", body: "Publica tu expertise y cobra por el acceso. Sin algoritmos, sin depender de redes sociales." },
                { icon: "🎓", title: "Expertos de industria",    body: "Conecta directamente con tu audiencia y convierte tu experiencia en ingresos recurrentes." },
                { icon: "⚖️", title: "Profesionales de área",    body: "Economistas, abogados, médicos, arquitectos. Tu campo tiene un público que quiere aprender." },
              ].map(({ icon, title, body }, i) => (
                <BlurFade key={title} delay={i * 0.08}>
                  <div className="bg-white border border-[#EBEBEB] rounded-2xl p-5 flex items-start gap-4 group hover:border-[#B31C1C]/30 hover:shadow-[0_4px_20px_rgba(179,28,28,0.06)] transition-all duration-300">
                    <div className="w-12 h-12 rounded-xl border border-[#E8E8E8] bg-[#F8F7F5] flex items-center justify-center text-[20px] shrink-0 group-hover:border-[#B31C1C]/20 transition-colors">
                      {icon}
                    </div>
                    <div>
                      <p className="text-[14px] font-bold text-[#111] mb-1">{title}</p>
                      <p className="text-[13px] text-[#666] leading-[1.65]">{body}</p>
                    </div>
                  </div>
                </BlurFade>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ CREATORS ═══════════════════════════════════════════════════════ */}
      <section className="border-b border-[#E8E8E8] py-24 bg-[#F8F7F5]">
        <div className="max-w-7xl mx-auto px-6">
          <BlurFade delay={0}>
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#B31C1C] mb-2">Salas activas</p>
                <h2 className="font-sans font-black text-[clamp(24px,3.5vw,44px)] leading-tight tracking-[-0.02em]">
                  Impulsando a los mejores<br />
                  <span className="text-[#999]">expertos del mundo hispanohablante.</span>
                </h2>
              </div>
              <Link href="/explorar" className="hidden md:flex items-center gap-1.5 text-[13px] font-semibold text-[#B31C1C] hover:underline shrink-0">
                Ver todas <IconArrowRight size={14} />
              </Link>
            </div>
          </BlurFade>

          <div className="grid md:grid-cols-3 gap-4">
            {creators.map((c, i) => (
              <BlurFade key={c.name} delay={i * 0.07}>
                <Link href={c.href} className="group block bg-white border border-[#EBEBEB] rounded-2xl p-7 hover:border-[#B31C1C]/30 hover:shadow-[0_8px_30px_rgba(179,28,28,0.08)] transition-all duration-300">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: c.color }}>
                      <span className="font-serif text-[14px] font-bold text-white">{c.initial}</span>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#B31C1C]">{c.specialty}</p>
                      <h3 className="text-[16px] font-bold text-[#111] group-hover:text-[#B31C1C] transition-colors">{c.name}</h3>
                    </div>
                  </div>
                  <p className="text-[13px] leading-[1.7] text-[#666] mb-5">{c.bio}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-[#F0F0F0]">
                    <div>
                      <p className="text-[18px] font-black text-[#111]">{c.price}<span className="text-[12px] font-normal text-[#999]">/mes</span></p>
                      <p className="text-[10px] text-[#BBB] mt-0.5">{c.subscribers.toLocaleString()} suscriptores</p>
                    </div>
                    <span className="text-[11px] font-bold text-[#B31C1C] uppercase tracking-[0.1em] group-hover:underline">Ver sala →</span>
                  </div>
                </Link>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>

      {/* ══ PRICING ════════════════════════════════════════════════════════ */}
      <section className="border-b border-[#E8E8E8] py-24">
        <div className="max-w-5xl mx-auto px-6">
          <BlurFade delay={0}>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#B31C1C] text-center mb-3">Precios</p>
            <h2 className="font-sans font-black text-[clamp(24px,3.5vw,44px)] tracking-[-0.02em] text-center mb-2">
              Elige el plan para crecer
            </h2>
            <p className="text-center text-[14px] text-[#888] mb-14">Empieza gratis. Escala cuando estés listo.</p>
          </BlurFade>

          <div className="grid md:grid-cols-3 gap-5">
            {plans.map(({ name, price, period, desc, cta, featured, note, perks }) => (
              <BlurFade key={name} delay={0.05}>
                <div className={`relative rounded-2xl p-7 flex flex-col h-full ${featured ? "bg-[#B31C1C] shadow-[0_16px_48px_rgba(179,28,28,0.3)]" : "bg-white border border-[#EBEBEB]"}`}>
                  {featured && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-[#111] text-white text-[10px] font-black uppercase tracking-[0.1em] px-3 py-1 rounded-full">Recomendado</span>
                    </div>
                  )}
                  <div className="mb-6">
                    <p className={`text-[12px] font-bold uppercase tracking-[0.12em] mb-3 ${featured ? "text-white/70" : "text-[#999]"}`}>{name}</p>
                    <div className="flex items-baseline gap-1 mb-1">
                      <span className={`text-[34px] font-black leading-none ${featured ? "text-white" : "text-[#111]"}`}>{price}</span>
                      <span className={`text-[13px] ${featured ? "text-white/60" : "text-[#999]"}`}>{period}</span>
                    </div>
                    <p className={`text-[12px] mb-1 ${featured ? "text-white/60" : "text-[#888]"}`}>{desc}</p>
                    <p className={`text-[11px] font-bold uppercase tracking-[0.08em] ${featured ? "text-white/80" : "text-[#B31C1C]"}`}>{note}</p>
                  </div>
                  <div className="space-y-2.5 mb-7 flex-1">
                    {perks.map(p => (
                      <div key={p} className="flex items-center gap-2.5">
                        <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${featured ? "bg-white" : "bg-[#B31C1C]"}`} />
                        <span className={`text-[13px] ${featured ? "text-white/80" : "text-[#555]"}`}>{p}</span>
                      </div>
                    ))}
                  </div>
                  <Link href="/abrir" className={`block text-center py-3.5 text-[13px] font-bold uppercase tracking-[0.1em] rounded-sm transition-colors ${featured ? "bg-white text-[#B31C1C] hover:bg-white/90" : "border border-[#E0E0E0] text-[#111] hover:border-[#B31C1C] hover:text-[#B31C1C]"}`}>
                    {cta}
                  </Link>
                </div>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FAQ ════════════════════════════════════════════════════════════ */}
      <section className="border-b border-[#E8E8E8] py-24 bg-[#F8F7F5]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-[380px_1fr] gap-16">
            <BlurFade delay={0}>
              <div className="lg:sticky lg:top-28">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#B31C1C] mb-4">FAQ</p>
                <h2 className="font-sans font-black text-[clamp(28px,4vw,44px)] leading-[0.95] tracking-[-0.02em]">
                  ¿Tienes<br />preguntas?<br />
                  <span className="text-[#B31C1C]">Tenemos<br />respuestas.</span>
                </h2>
              </div>
            </BlurFade>
            <BlurFade delay={0.1}>
              <div className="border-t border-[#E5E5E5]">
                {faqs.map(({ q, a }) => <FaqItem key={q} q={q} a={a} />)}
              </div>
            </BlurFade>
          </div>
        </div>
      </section>

      {/* ══ CTA FINAL — única sección oscura ═══════════════════════════════ */}
      <section className="bg-[#111] py-32 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#B31C1C]/20 rounded-full blur-[100px]" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <BlurFade delay={0}>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#FF8080] mb-6">Empieza hoy</p>
            <h2 className="font-sans font-black text-[clamp(32px,5.5vw,68px)] leading-[0.93] tracking-[-0.03em] text-white mb-6">
              ¿Listo para cobrar<br />
              lo que sabes?
            </h2>
            <p className="text-[16px] text-white/50 max-w-md mx-auto mb-10">
              Únete a los 34 creadores que ya generan ingresos reales con su conocimiento.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/registro" className="flex items-center gap-3 bg-white text-[#111] px-8 py-4 text-[14px] font-bold rounded-sm hover:bg-[#F8F7F5] transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continuar con Google
              </Link>
              <Link href="/abrir" className="border border-white/20 text-white px-8 py-4 text-[14px] font-semibold rounded-sm hover:bg-white/5 transition-colors">
                Abre tu sala gratis →
              </Link>
            </div>
            <p className="text-[11px] text-white/25 mt-5 uppercase tracking-[0.1em]">Sin tarjeta · Gratis para empezar</p>
          </BlurFade>
        </div>
      </section>

      {/* ══ FOOTER ═════════════════════════════════════════════════════════ */}
      <footer className="bg-[#0A0A0A] border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-12">
            <div className="col-span-2 md:col-span-1">
              <p className="text-[18px] font-black uppercase text-white mb-3">SALA</p>
              <p className="text-[12px] text-white/40 leading-[1.7] max-w-[160px]">La plataforma que convierte expertos en creadores que cobran.</p>
            </div>
            {[
              { title: "Plataforma",      links: ["Editor", "Analytics", "Pagos", "Membresías"] },
              { title: "Para creadores",  links: ["Cómo funciona", "Precios", "Casos de uso", "Blog"] },
              { title: "Explorar",        links: ["Economía", "Derecho", "Medicina", "Arquitectura"] },
              { title: "Empresa",         links: ["Acerca de", "Contacto", "Términos", "Privacidad"] },
            ].map(({ title, links }) => (
              <div key={title}>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/40 mb-4">{title}</p>
                <div className="space-y-2.5">
                  {links.map(l => <p key={l} className="text-[13px] text-white/30 hover:text-white/70 transition-colors cursor-pointer">{l}</p>)}
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 pt-6 flex items-center justify-between">
            <p className="text-[11px] text-white/20 uppercase tracking-[0.1em]">© 2025 Sala · Nebbuler</p>
            <a href="mailto:hello@nebbuler.com" className="text-[11px] text-white/20 hover:text-white/60 transition-colors uppercase tracking-[0.1em]">hello@nebbuler.com</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
