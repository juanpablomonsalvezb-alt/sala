// Server Component — sin "use client".
// El H1 principal se renderiza directo en el servidor para LCP óptimo.
// Los islands interactivos (animaciones, ticker, FAQ) se cargan como Client Components
// importados con next/dynamic donde aplica ssr: false para los más pesados.

import type { CSSProperties } from "react";
import Link from "next/link";
import { HomeTicker } from "@/components/home-ticker";
import { CategoryMarqueeDynamic } from "@/components/category-marquee-dynamic";
import {
  HeroSpinningBadge,
  HeroAnimations,
  HeroCta,
  LiveActivity,
  FeaturesSection,
  ParaQuienes,
  PricingSection,
  FaqSection,
  CtaFinalAnimated,
} from "@/components/home-animations";

/* ─── Data estática — permanece en el servidor ──────────────────────────── */

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

/* ─── Page (Server Component) ───────────────────────────────────────────── */

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-[#111]">

      {/* ── TOP TICKER — Client Island (useState + setInterval) ─────────── */}
      <HomeTicker />

      {/* ── NAV — estático, se sirve desde el servidor ──────────────────── */}
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
            {[
              { label: "Explorar",        href: "/explorar" },
              { label: "Para creadores",  href: "/para-creadores" },
              { label: "Precios",         href: "/precios" },
            ].map(({ label, href }) => (
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
            <Link
              href="/entrar"
              className="h-full flex items-center px-5 text-[12px] font-medium text-[#555] hover:text-[#111] border-l border-[#E0E0E0] transition-colors"
            >
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

          {/* Cabecera de portada — H1 en el servidor para LCP óptimo */}
          <div className="flex items-end justify-between pb-5 border-b-[3px] border-[#111]">
            {/* Lado izquierdo: eyebrow + H1 — 100% server, visible en primer paint */}
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-[#767676] mb-2">
                Plataforma de conocimiento profesional · Chile y LATAM
              </p>
              <h1 className="font-serif font-bold text-[clamp(40px,6vw,80px)] leading-[0.88] tracking-[-0.02em]">
                Tu conocimiento<br />
                ya tiene{" "}
                {/*
                  LineShadowTextServer emite HTML estático con las mismas clases
                  CSS de animación que el componente original — texto visible sin JS.
                */}
                <LineShadowTextServer shadowColor="#B31C1C">
                  precio.
                </LineShadowTextServer>
              </h1>
            </div>

            {/* Lado derecho: SpinningText badge — Client Island */}
            <HeroSpinningBadge />
          </div>

          {/* Lista editorial de creadores — Client Island con BlurFade */}
          <div className="py-0">
            <HeroAnimations featuredCreators={featuredCreators} />
          </div>

          {/* CTA + Stats bar — Client Islands */}
          <HeroCta />
        </div>
      </section>

      {/* ── TICKER NEGRO — Marquee cargado sin SSR vía Client wrapper ───── */}
      <CategoryMarqueeDynamic />

      {/* ── LIVE ACTIVITY — AnimatedList, Client Island ─────────────────── */}
      <LiveActivity liveEvents={liveEvents} />

      {/* ── FEATURES ────────────────────────────────────────────────────── */}
      <FeaturesSection features={features} />

      {/* ── PARA QUIENES ────────────────────────────────────────────────── */}
      <ParaQuienes />

      {/* ── PRICING ─────────────────────────────────────────────────────── */}
      <PricingSection plans={plans} />

      {/* ── FAQ ─────────────────────────────────────────────────────────── */}
      <FaqSection faqs={faqs} />

      {/* ── CTA FINAL ───────────────────────────────────────────────────── */}
      <section className="bg-[#111] py-36 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#B31C1C]/12 rounded-full blur-[100px]" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <CtaFinalAnimated />
        </div>
      </section>

      {/* ── FOOTER — estático, servidor ─────────────────────────────────── */}
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
              <p className="text-[12px] text-white/35 leading-[1.75] max-w-[160px]">
                La plataforma que convierte expertos en creadores que cobran.
              </p>
            </div>
            {[
              { title: "Plataforma",     links: ["Editor", "Analytics", "Pagos", "Membresías"] },
              { title: "Para creadores", links: ["Cómo funciona", "Precios", "Casos de uso", "Blog"] },
              { title: "Explorar",       links: ["Economía", "Derecho", "Medicina", "Arquitectura"] },
              { title: "Empresa",        links: ["Acerca de", "Contacto", "Términos", "Privacidad"] },
            ].map(({ title, links }) => (
              <div key={title}>
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/35 mb-4">
                  {title}
                </p>
                <div className="space-y-2.5">
                  {links.map((l) => (
                    <p
                      key={l}
                      className="text-[12px] text-white/25 hover:text-white/60 transition-colors cursor-pointer"
                    >
                      {l}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 pt-6 flex items-center justify-between">
            <p className="text-[9px] text-white/20 uppercase tracking-[0.12em]">© 2025 Sala · Nebbuler</p>
            <a
              href="mailto:hello@nebbuler.com"
              className="text-[9px] text-white/20 hover:text-white/55 transition-colors uppercase tracking-[0.12em]"
            >
              hello@nebbuler.com
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ─── Helpers server-side ────────────────────────────────────────────────── */

// Versión server-safe de LineShadowText: emite HTML estático con las mismas
// clases CSS que el componente original, sin necesitar hydration para mostrar
// el texto. Las animaciones CSS (after:animate-line-shadow) funcionan igual.
function LineShadowTextServer({
  children,
  shadowColor,
}: {
  children: string;
  shadowColor: string;
}) {
  return (
    <span
      data-text={children}
      style={{ "--shadow-color": shadowColor } as CSSProperties}
      className="relative z-0 inline-flex after:absolute after:top-[0.04em] after:left-[0.04em] after:content-[attr(data-text)] after:bg-[linear-gradient(45deg,transparent_45%,var(--shadow-color)_45%,var(--shadow-color)_55%,transparent_0)] after:-z-10 after:bg-size-[0.06em_0.06em] after:bg-clip-text after:text-transparent after:animate-line-shadow"
    >
      {children}
    </span>
  );
}
