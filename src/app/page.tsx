// Server Component — sin "use client".
// El H1 principal se renderiza directo en el servidor para LCP óptimo.
// Los islands interactivos (animaciones, ticker, FAQ) se cargan como Client Components
// importados con next/dynamic donde aplica ssr: false para los más pesados.

import type { CSSProperties } from "react";
import Link from "next/link";
import Image from "next/image";
import { TrendingModule, ObservatorioModule, PreguntaModule, GlosarioModule } from "@/components/home-discovery";
import { HomeTicker } from "@/components/home-ticker";
import { CategoryMarqueeDynamic } from "@/components/category-marquee-dynamic";
import {
  HeroAnimations,
  HeroCta,
  LiveActivity,
  FeaturesSection,
  ParaQuienes,
  PricingSection,
  FaqSection,
  CtaFinalAnimated,
} from "@/components/home-animations";
import { featuredCreators as featuredCreatorsData } from "@/data/creators";

/* ─── Data estática — permanece en el servidor ──────────────────────────── */

const featuredCreators = [
  { initial: "RF", name: "RODRIGO FUENTES MARÍN",  specialty: "MACROECONOMÍA",          color: "#1a1a2e", earnings: "2.613.762", trend: "+38%", subscribers: 524, posts: 67, since: "Nov 2025", href: "/rodrigo-fuentes-marin"  },
  { initial: "CV", name: "CAROLINA VEGA TORO",      specialty: "FINANZAS CORPORATIVAS",  color: "#1a2e1a", earnings: "1.958.076", trend: "+43%", subscribers: 392, posts: 44, since: "Nov 2025", href: "/carolina-vega-toro" },
  { initial: "MC", name: "MATÍAS CORNEJO SILVA",    specialty: "DERECHO TRIBUTARIO",     color: "#2e1a1a", earnings: "1.701.192", trend: "+29%", subscribers: 341, posts: 51, since: "Dic 2025", href: "/matias-cornejo-silva" },
];

const features = [
  { num: "I",   title: "Editor profesional",   body: "Escribe, formatea y publica contenido largo. Tú controlas qué es libre y qué es exclusivo." },
  { num: "II",  title: "Gestión de audiencia", body: "CRM de tus lectores. Segmenta, comunícate y conoce a quienes realmente pagan." },
  { num: "III", title: "Pagos directos",       body: "Cobra suscripciones mes a mes directo a tu cuenta. 0% de comisión — siempre." },
  { num: "IV",  title: "Analytics real",       body: "Aperturas, retención, ingresos. Los datos que importan para crecer." },
  { num: "V",   title: "Acceso por membresía", body: "Tus suscriptores pagan para leer lo que sólo tú puedes escribir." },
  { num: "VI",  title: "Listo en 15 minutos",  body: "Sin código, sin diseñador. Configuras tu perfil, precio y publicas hoy." },
];

const plans = [
  { name: "Nebbuler", price: "$29.990", period: "/ mes", note: "0% comisión", cta: "30 días gratis", featured: true, perks: ["Suscriptores ilimitados", "0% de comisión sobre tus ingresos", "Editor premium", "Analytics completo", "Soporte prioritario", "30 días de prueba sin tarjeta"] },
];

const faqs = [
  { q: "¿Necesito saber programar?",                        a: "No. Configuras tu sala en 15 minutos, sin código ni diseño." },
  { q: "¿Cómo recibo los pagos?",                           a: "Directo a tu cuenta. Nebbuler cobra $29.990/mes fijo — tú te quedas con el 100% de tus ingresos." },
  { q: "¿Puedo tener contenido gratuito y de pago?",        a: "Sí. Tú decides qué es abierto y qué es exclusivo." },
  { q: "¿Qué pasa si cancelo?",                             a: "Cancelas cuando quieras. Tus datos quedan accesibles." },
  { q: "¿Nebbuler funciona fuera de Chile?",                a: "Sí. Disponible en toda Latinoamérica." },
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
          <Link href="/" className="flex items-center gap-2 border-r border-[#E0E0E0] pr-6 mr-0">
            <Image src="/nebbuler-logo.png" alt="Nebbuler" width={36} height={36} className="h-9 w-auto" priority />
            <span className="text-[17px] font-black uppercase tracking-[0.04em] text-[#111] font-serif">NEBBULER</span>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-0 flex-1 pl-0">
            {[
              { label: "Explorar",        href: "/directorio" },
              { label: "Demo",            href: "/demo" },
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
              Abre tu espacio
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
                El conocimiento que antes no se vendía · Chile y LATAM
              </p>
              <h1 className="font-serif font-bold text-[clamp(40px,6vw,80px)] leading-[1.056] tracking-[-0.02em]">
                Tu conocimiento<br />
                ya tiene{" "}
                {/*
                  LineShadowTextServer emite HTML estático con las mismas clases
                  CSS de animación que el componente original — texto visible sin JS.
                */}
                <span style={{ backgroundColor: '#C41C1C', color: '#fff', padding: '0 6px 2px', display: 'inline' }}>
                  precio.
                </span>
              </h1>
            </div>

            {/* Lado derecho eliminado */}
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

      {/* ── CREADORES DESTACADOS — grid editorial ───────────────────────── */}
      <section className="border-t border-[#DEDEDE] py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-baseline justify-between mb-8">
            <div>
              <p className="text-[10px] font-sans font-bold tracking-[0.2em] uppercase text-[#999] mb-1">Nebbuler · Mayo 2026</p>
              <h2 className="font-serif text-2xl font-bold text-[#121212]">Los creadores más buscados este mes</h2>
            </div>
            <Link href="/directorio" className="text-xs font-sans font-bold tracking-[0.1em] uppercase text-[#C41C1C] hover:underline">
              Ver todos →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#DEDEDE]">
            {featuredCreatorsData.map((creator) => (
              <div key={creator.slug} className="bg-white p-6">
                <p className="text-[10px] font-sans font-bold tracking-[0.15em] uppercase text-[#C41C1C] mb-2">{creator.specialty}</p>
                <h3 className="font-serif text-lg font-bold text-[#121212] mb-2 leading-tight group-hover:text-[#C41C1C] transition-colors">{creator.name}</h3>
                <p className="text-xs font-sans text-[#666] leading-relaxed mb-4 line-clamp-2">{creator.bio}</p>
                {creator.verified && (
                  <p className="text-[9px] font-sans font-bold tracking-[0.1em] uppercase text-[#065F46] border-l-2 border-[#C41C1C] pl-2 mb-4">EXPERTO RECONOCIDO POR NEBBULER</p>
                )}
                <div className="border-t border-[#DEDEDE] pt-4 flex justify-between items-center">
                  <span className="text-xs font-sans"><span className="font-bold text-[#121212]">${creator.price_clp.toLocaleString('es-CL')}</span><span className="text-[#999]">/mes</span></span>
                  <span className="text-xs font-sans text-[#999]"><span className="font-bold text-[#121212]">{creator.subscriber_count.toLocaleString('es-CL')}</span> suscriptores</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────────────────────────────── */}
      <FeaturesSection features={features} />

      {/* ── PARA QUIENES ────────────────────────────────────────────────── */}
      <ParaQuienes />

      {/* ── PRICING ─────────────────────────────────────────────────────── */}
      <PricingSection plans={plans} />

      {/* ── FAQ ─────────────────────────────────────────────────────────── */}
      <FaqSection faqs={faqs} />

      {/* ── DESCUBRIMIENTO — secciones clave del sitio ───────────────────── */}
      <TrendingModule />
      <ObservatorioModule />
      <PreguntaModule />
      <GlosarioModule />

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
                <Image src="/nebbuler-logo.png" alt="Nebbuler" width={24} height={24} className="h-6 w-auto brightness-0 invert" />
                <span className="text-[15px] font-bold uppercase tracking-[0.04em] text-white font-serif">NEBBULER</span>
              </div>
              <p className="text-[12px] text-white/35 leading-[1.75] max-w-[160px]">
                El conocimiento que antes no se vendía.
              </p>
            </div>
            {([
              { title: "Plataforma", links: [
                { label: "Editor",      href: "/para-creadores" },
                { label: "Analytics",   href: "/para-creadores" },
                { label: "Pagos",       href: "/precios" },
                { label: "Membresías",  href: "/para-creadores" },
              ]},
              { title: "Para creadores", links: [
                { label: "Cómo funciona", href: "/para-creadores" },
                { label: "Precios",        href: "/precios" },
                { label: "Casos de uso",  href: "/para-creadores" },
                { label: "Abre tu sala",  href: "/abrir" },
              ]},
              { title: "Explorar", links: [
                { label: "Directorio",    href: "/directorio" },
                { label: "Observatorio",  href: "/observatorio" },
                { label: "Glosario",      href: "/glosario" },
                { label: "Trending",      href: "/trending" },
                { label: "Pregunta",      href: "/pregunta" },
              ]},
              { title: "Empresa", links: [
                { label: "Sobre Nebbuler", href: "/sobre" },
                { label: "Contacto",       href: "/contacto" },
                { label: "Términos",       href: "/terminos" },
                { label: "Privacidad",     href: "/privacidad" },
              ]},
            ] as { title: string; links: { label: string; href: string }[] }[]).map(({ title, links }) => (
              <div key={title}>
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/35 mb-4">
                  {title}
                </p>
                <div className="space-y-2.5">
                  {links.map(({ label, href }) => (
                    href.startsWith('mailto:') ? (
                      <a
                        key={label}
                        href={href}
                        className="block text-[12px] text-white/25 hover:text-white/60 transition-colors"
                      >
                        {label}
                      </a>
                    ) : (
                      <Link
                        key={label}
                        href={href}
                        className="block text-[12px] text-white/25 hover:text-white/60 transition-colors"
                      >
                        {label}
                      </Link>
                    )
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 pt-6 flex items-center justify-between">
            <p className="text-[9px] text-white/20 uppercase tracking-[0.12em]">© 2026 Nebbuler</p>
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
