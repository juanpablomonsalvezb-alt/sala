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
import { featuredCreators as featuredCreatorsData } from "@/data/creators"
import SubscribeWidget from "@/components/newsletter/SubscribeWidget"
import { ToolsDropdown } from "@/components/tools-dropdown"

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
  { name: "Nebbuler", price: "US$19", period: "/ mes", note: "0% comisión · pago en moneda local", cta: "Abrir mi sala →", featured: true, perks: ["Suscriptores ilimitados", "0% de comisión sobre tus ingresos", "Editor premium", "Analytics completo", "Soporte prioritario", "Sin contrato — cancela cuando quieras"] },
];

const faqs = [
  { q: "¿Necesito saber programar?",                        a: "No. Configuras tu sala en 15 minutos, sin código ni diseño." },
  { q: "¿Cómo recibo los pagos?",                           a: "Directo a tu cuenta. Nebbuler cobra US$19/mes fijo — tú te quedas con el 100% de tus ingresos." },
  { q: "¿Puedo tener contenido gratuito y de pago?",        a: "Sí. Tú decides qué es abierto y qué es exclusivo." },
  { q: "¿Qué pasa si cancelo?",                             a: "Cancelas cuando quieras. Tus datos quedan accesibles." },
  { q: "¿Nebbuler funciona en toda Latinoamérica?",         a: "Sí. Disponible en toda la región. Cobra en la moneda local de tu país." },
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
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-0 flex items-stretch justify-between h-14">

          {/* Logo — texto oculto en móvil muy pequeño para dar espacio al login */}
          <Link href="/" className="flex items-center gap-1.5 sm:gap-2 border-r border-[#E0E0E0] pr-3 sm:pr-6 mr-0 shrink-0">
            <Image src="/nebbuler-logo.png" alt="Nebbuler" width={36} height={36} className="h-8 sm:h-9 w-auto" priority />
            <span className="hidden xs:inline text-[14px] sm:text-[17px] font-black uppercase tracking-[0.04em] text-[#111] font-serif">NEBBULER</span>
            <span className="xs:hidden text-[13px] font-black uppercase tracking-[0.03em] text-[#111] font-serif">NB</span>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-0 flex-1 pl-0">
            {[
              { label: "Explorar",        href: "/directorio" },
              { label: "Demo",            href: "/demo" },
              { label: "Para creadores",  href: "/para-creadores" },
            ].map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="h-full flex items-center px-5 text-[12px] font-medium tracking-[0.04em] text-[#555] hover:text-[#111] hover:bg-[#F8F7F5] border-r border-[#F0F0F0] transition-colors"
              >
                {label}
              </Link>
            ))}
            <ToolsDropdown />
          </nav>

          {/* CTA — siempre visible, compacto en móvil */}
          <div className="flex items-center gap-0">
            <Link
              href="/entrar"
              className="h-full flex items-center px-3 sm:px-5 text-[11px] sm:text-[12px] font-medium text-[#555] hover:text-[#111] border-l border-[#E0E0E0] transition-colors whitespace-nowrap"
            >
              <span className="hidden sm:inline">Iniciar sesión</span>
              <span className="sm:hidden">Entrar</span>
            </Link>
            <Link
              href="/abrir"
              className="h-full flex items-center px-3 sm:px-6 bg-[#B31C1C] text-white text-[11px] sm:text-[12px] font-bold tracking-[0.04em] uppercase hover:bg-[#8E1515] transition-colors whitespace-nowrap"
            >
              <span className="hidden sm:inline">Abre tu espacio</span>
              <span className="sm:hidden">Abrir</span>
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
                Membresías directas · 0% comisión · América Latina
              </p>
              <h1 className="font-serif font-bold text-[clamp(40px,6vw,80px)] leading-[1.056] tracking-[-0.02em]">
                Cobra por lo<br />
                que{" "}
                <span style={{ backgroundColor: '#C41C1C', color: '#fff', padding: '0 6px 2px', display: 'inline' }}>
                  sabes.
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

      {/* ── TICKER NEGRO — oculto en móvil (marquee pesado) ────────────── */}
      <div className="hidden sm:block">
        <CategoryMarqueeDynamic />
      </div>

      {/* ── LIVE ACTIVITY — oculto en móvil ─────────────────────────────── */}
      <div className="hidden sm:block">
        <LiveActivity liveEvents={liveEvents} />
      </div>

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

      {/* ── FEATURES ─────────────────── oculto en móvil ───────────────── */}
      <div className="hidden sm:block">
        <FeaturesSection features={features} />
      </div>

      {/* ── POSTERS ──────────────────── manifiesto visual ──────────────── */}
      <section className="border-t border-[#E0E0E0] py-12 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-[10px] font-sans font-bold tracking-[0.2em] uppercase text-[#C41C1C] mb-8 text-center">
            Por qué Nebbuler
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {[
              { src: '/social-images/posters/nebbuler_v2_1.png', alt: 'Meta lleva años cobrando por lo que tú sabes' },
              { src: '/social-images/posters/nebbuler_v2_3.png', alt: 'Eres el producto. O eres el dueño.' },
              { src: '/social-images/posters/nebbuler_v2_5.png', alt: 'No eres un creador de contenido. Eres un experto.' },
              { src: '/social-images/posters/nebbuler_v2_7.png', alt: '0% de comisión. 100% tuyo.' },
              { src: '/social-images/posters/nebbuler_v2_9.png', alt: 'Tu conocimiento tiene precio.' },
            ].map((poster) => (
              <div key={poster.src} className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src={poster.src}
                  alt={poster.alt}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PARA QUIENES ─────────────── oculto en móvil ───────────────── */}
      <div className="hidden sm:block">
        <ParaQuienes />
      </div>

      {/* ── PRICING ─────────────────────────────────────────────────────── */}
      <PricingSection plans={plans} />

      {/* ── FAQ ─────────────────────────────────────────────────────────── */}
      <FaqSection faqs={faqs} />

      {/* ── DESCUBRIMIENTO — oculto en móvil ────────────────────────────── */}
      <div className="hidden sm:block">
        <TrendingModule />
        <ObservatorioModule />
        <PreguntaModule />
        <GlosarioModule />
      </div>

      {/* ── INSTALAR COMO APP ───────────────────────────────────────────── */}
      <section className="border-t border-[#E0E0E0] py-16 bg-[#F8F7F5]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-center gap-10">

            {/* QR */}
            <div className="flex-shrink-0 flex flex-col items-center gap-3">
              <div className="bg-white border border-[#E0E0E0] p-4 shadow-sm">
                <Image src="/nebbuler-qr.svg" alt="QR para instalar Nebbuler" width={120} height={120} />
              </div>
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#999]">Apunta tu cámara aquí</p>
            </div>

            {/* Texto + instrucciones */}
            <div className="flex-1 text-center sm:text-left">
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#B31C1C] mb-3">Acceso instantáneo</p>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#111] mb-4">
                Nebbuler en tu pantalla de inicio
              </h2>
              <p className="text-sm text-[#555] mb-6 leading-relaxed">
                Sin ir al App Store. Escanea el código con tu cámara y agrégala directamente desde el navegador.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                {/* iOS */}
                <div className="flex-1 bg-white border border-[#E0E0E0] p-4">
                  <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#999] mb-3">iPhone / iPad</p>
                  <ol className="space-y-2">
                    {["Abre nebbuler.com en Safari", "Toca el ícono compartir ⎙", "Selecciona «Agregar a inicio»", "Toca «Agregar»"].map((step, i) => (
                      <li key={i} className="flex items-start gap-2 text-[11px] text-[#444]">
                        <span className="font-bold text-[#B31C1C] shrink-0">{i + 1}.</span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Android */}
                <div className="flex-1 bg-white border border-[#E0E0E0] p-4">
                  <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#999] mb-3">Android</p>
                  <ol className="space-y-2">
                    {["Abre nebbuler.com en Chrome", "Toca el menú ⋮ arriba a la derecha", "Selecciona «Agregar a pantalla»", "Confirma tocando «Instalar»"].map((step, i) => (
                      <li key={i} className="flex items-start gap-2 text-[11px] text-[#444]">
                        <span className="font-bold text-[#B31C1C] shrink-0">{i + 1}.</span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HERRAMIENTAS GRATUITAS ─────────────────────────────────────── */}
      <section className="border-t border-[#E0E0E0] py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-baseline justify-between mb-10">
            <div>
              <p className="text-[10px] font-sans font-bold tracking-[0.2em] uppercase text-[#C41C1C] mb-1">Acceso libre</p>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#121212]">Herramientas gratuitas</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#DEDEDE]">
            {([
              {
                tag: "VIRAL",
                title: "¿Cuánto te quitan?",
                desc: "Descubre cuánto cobran las plataformas por tu trabajo. Compara y decide dónde publicar.",
                href: "/cuanto-te-quitan",
                cta: "Calcular →",
              },
              {
                tag: "MUNDIAL 2026",
                title: "Calendario de partidos",
                desc: "Agrega los 72 partidos del Mundial a tu Google Calendar o Apple Calendar con un clic.",
                href: "https://fifa2026.nebbuler.com/calendario",
                cta: "Ver calendario →",
                external: true,
              },
              {
                tag: "MUNDIAL 2026",
                title: "Predictor de bracket",
                desc: "Predice el Mundial completo: 12 grupos, 32 eliminatorias, final. Compite con amigos.",
                href: "https://fifa2026.nebbuler.com",
                cta: "Hacer predicción →",
                external: true,
              },
              {
                tag: "DATOS",
                title: "Salarios LATAM",
                desc: "Rangos salariales por profesión y país en toda América Latina. Datos actualizados.",
                href: "/salario",
                cta: "Consultar →",
              },
            ] as { tag: string; title: string; desc: string; href: string; cta: string; external?: boolean }[]).map((tool) => (
              <div key={tool.title} className="bg-white p-6 flex flex-col">
                <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#C41C1C] mb-3">{tool.tag}</p>
                <h3 className="font-serif text-lg font-bold text-[#121212] mb-2 leading-tight">{tool.title}</h3>
                <p className="text-[12px] text-[#666] leading-relaxed mb-5 flex-1">{tool.desc}</p>
                {tool.external ? (
                  <a
                    href={tool.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#B31C1C] hover:text-[#8E1515] transition-colors border-t border-[#DEDEDE] pt-4"
                  >
                    {tool.cta}
                  </a>
                ) : (
                  <Link
                    href={tool.href}
                    className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#B31C1C] hover:text-[#8E1515] transition-colors border-t border-[#DEDEDE] pt-4"
                  >
                    {tool.cta}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ──────────────────────────────────────────────────── */}
      <section className="bg-white py-16 border-t border-gray-100">
        <div className="max-w-xl mx-auto px-6">
          <SubscribeWidget
            title="Análisis profesional cada semana"
            description="Economistas, abogados y médicos explicando LATAM. Sin spam. Baja cuando quieras."
            ctaLabel="Suscribirme gratis"
          />
        </div>
      </section>

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
          <div className="grid grid-cols-2 md:grid-cols-6 gap-10 mb-12">
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
              { title: "Herramientas", links: [
                { label: "¿Cuánto te quitan?",   href: "/cuanto-te-quitan" },
                { label: "Mundial 2026",          href: "/mundial" },
                { label: "Calendario partidos",   href: "https://fifa2026.nebbuler.com/calendario" },
                { label: "Predictor bracket",     href: "https://fifa2026.nebbuler.com" },
                { label: "Salarios LATAM",        href: "/salario" },
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
                    href.startsWith('mailto:') || href.startsWith('https://') ? (
                      <a
                        key={label}
                        href={href}
                        target={href.startsWith('https://') ? '_blank' : undefined}
                        rel={href.startsWith('https://') ? 'noopener noreferrer' : undefined}
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
          <div className="border-t border-white/10 pt-6 flex items-center justify-between flex-wrap gap-4">
            <p className="text-[9px] text-white/20 uppercase tracking-[0.12em]">© 2026 Nebbuler</p>

            {/* QR para instalar como app — imagen estática, sin JS */}
            <div className="hidden sm:flex items-center gap-3">
              <div>
                <p className="text-[9px] text-white/40 uppercase tracking-[0.14em] mb-0.5">Instala la app</p>
                <p className="text-[8px] text-white/20">Escanea con tu móvil</p>
              </div>
              <Image src="/nebbuler-qr.svg" alt="Instala Nebbuler como app" width={52} height={52} className="opacity-70 hover:opacity-100 transition-opacity" />
            </div>

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
