"use client";

import Link from "next/link";
import Nav from "@/components/nav";
import { NumberTicker } from "@/components/ui/number-ticker";
import { BlurFade } from "@/components/ui/blur-fade";
import { BorderBeam } from "@/components/ui/border-beam";
import { Marquee } from "@/components/ui/marquee";
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";
import { BackgroundBeams } from "@/components/ui/background-beams";
import {
  IconBolt,
  IconCash,
  IconShieldCheck,
  IconChartBar,
  IconUserCircle,
  IconArticle,
} from "@tabler/icons-react";

/* ─── Data ──────────────────────────────────────────────────────────────── */

const creators = [
  {
    name: "Rodrigo Fuentes",
    specialty: "ECONOMÍA",
    initial: "RF",
    bio: "Análisis semanal del mercado chileno para entender qué está pasando realmente, sin el filtro del titular.",
    price: "$9.990",
    subscribers: 847,
    href: "/rodrigo-fuentes",
    color: "#1a1a2e",
    posts: 48,
  },
  {
    name: "Isabel Contreras",
    specialty: "DERECHO TRIBUTARIO",
    initial: "IC",
    bio: "Lo que el SII no te explica, pero necesitas saber para no pagar de más.",
    price: "$12.990",
    subscribers: 523,
    href: "/isabel-contreras",
    color: "#1a2e1a",
    posts: 31,
  },
  {
    name: "Marco Salinas",
    specialty: "ARQUITECTURA",
    initial: "MS",
    bio: "Arquitectura latinoamericana que no sale en los libros. Una mirada desde adentro.",
    price: "$7.990",
    subscribers: 312,
    href: "/marco-salinas",
    color: "#2e1a1a",
    posts: 24,
  },
];

const tickerItems = [
  { tag: "ECONOMÍA", name: "Rodrigo Fuentes", stat: "847 suscriptores · $9.990/mes" },
  { tag: "DERECHO TRIBUTARIO", name: "Isabel Contreras", stat: "523 suscriptores · $12.990/mes" },
  { tag: "ARQUITECTURA", name: "Marco Salinas", stat: "312 suscriptores · $7.990/mes" },
  { tag: "FINANZAS PERSONALES", name: "Lucía Morales", stat: "614 suscriptores · $8.990/mes" },
  { tag: "MEDICINA", name: "Carlos Venegas", stat: "291 suscriptores · $14.990/mes" },
  { tag: "EDUCACIÓN", name: "Ana Reyes", stat: "438 suscriptores · $6.990/mes" },
];

const features = [
  {
    icon: IconBolt,
    title: "Listo en 15 minutos",
    body: "Sin código, sin diseñador, sin agencia. Configuras tu perfil y comienzas a publicar hoy.",
  },
  {
    icon: IconCash,
    title: "0% de comisión",
    body: "Con Plan Pro Sala no toma nada. Los pagos van directo a tu cuenta, sin intermediarios.",
  },
  {
    icon: IconShieldCheck,
    title: "Contenido exclusivo",
    body: "Tú controlas qué es libre y qué es para suscriptores. Tu audiencia paga por el acceso.",
  },
  {
    icon: IconChartBar,
    title: "Analytics real",
    body: "Ve quiénes abren, qué leen y cómo crece tu sala mes a mes. Datos que importan.",
  },
  {
    icon: IconUserCircle,
    title: "Tu audiencia, tuya",
    body: "Sin algoritmo. Sin red social. Tus suscriptores son tuyos, siempre.",
  },
  {
    icon: IconArticle,
    title: "Editor profesional",
    body: "Escribe, formatea y publica. Soporta texto largo, imágenes y citas. Editorial de verdad.",
  },
];

/* ─── Page ──────────────────────────────────────────────────────────────── */

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans text-[#121212]">
      <Nav />

      {/* ══ HERO ═══════════════════════════════════════════════════════════ */}
      <section className="border-b border-[#DEDEDE]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-[1fr_460px] min-h-[620px]">

            {/* LEFT */}
            <div className="py-16 lg:py-24 lg:pr-14 lg:border-r border-[#DEDEDE] flex flex-col justify-between">
              <BlurFade delay={0}>
                <AnimatedGradientText className="rounded-full text-[11px] font-semibold tracking-[0.1em] uppercase text-[#121212] px-4 py-1.5 ml-0 mx-0 bg-white/80 shadow-none">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#C41C1C] mr-2 [animation:var(--animate-pulse-dot)]" />
                  34 creadores activos · 2.418 suscriptores pagando
                </AnimatedGradientText>
              </BlurFade>

              <div className="py-10 lg:py-12">
                <BlurFade delay={0.06}>
                  <h1 className="font-serif text-[clamp(46px,6vw,86px)] font-bold leading-[0.93] tracking-[-0.03em]">
                    Llevas años<br />
                    dando lo mejor<br />
                    de ti, gratis.<br />
                    <em className="not-italic text-[#C41C1C]">Ya no más.</em>
                  </h1>
                </BlurFade>
                <BlurFade delay={0.14}>
                  <p className="text-[16px] leading-[1.8] text-[#555] mt-7 max-w-[420px]">
                    Economistas, abogados, médicos y consultores publican lo que realmente saben. Sus lectores más comprometidos pagan por ello.
                  </p>
                </BlurFade>
              </div>

              <BlurFade delay={0.22}>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/abrir"
                    className="bg-[#C41C1C] text-white px-7 py-3.5 text-[12px] font-bold uppercase tracking-[0.1em] hover:bg-[#A01515] transition-colors duration-200"
                  >
                    Abre tu sala — gratis →
                  </Link>
                  <Link
                    href="/explorar"
                    className="border border-[#D0D0D0] px-7 py-3.5 text-[12px] font-medium text-[#666] uppercase tracking-[0.1em] hover:border-[#121212] hover:text-[#121212] transition-all duration-200"
                  >
                    Explorar salas
                  </Link>
                </div>
                <p className="text-[11px] text-[#BBB] mt-3 uppercase tracking-[0.08em]">
                  Sin tarjeta de crédito · 0% de comisión para empezar
                </p>
              </BlurFade>
            </div>

            {/* RIGHT — Mockup de dashboard del creador */}
            <div className="hidden lg:flex items-center justify-center py-12 pl-12">
              <BlurFade delay={0.28}>
                <div className="w-full max-w-[400px] relative">

                  {/* Card principal: earnings */}
                  <div className="relative border border-[#E8E8E8] bg-white shadow-[0_4px_40px_rgba(0,0,0,0.07)] overflow-hidden">
                    <BorderBeam size={280} duration={16} delay={0} colorFrom="#C41C1C" colorTo="#FF9999" />

                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-[#F0F0F0]">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#1a1a2e] flex items-center justify-center">
                          <span className="font-serif text-[11px] font-bold text-white">RF</span>
                        </div>
                        <div>
                          <p className="text-[12px] font-bold text-[#121212]">Rodrigo Fuentes</p>
                          <p className="text-[10px] text-[#999] uppercase tracking-[0.1em]">Economía</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold text-[#22a222] bg-[#22a22215] px-2.5 py-1 rounded-full uppercase tracking-[0.08em]">
                        Activo
                      </span>
                    </div>

                    {/* Earnings big number */}
                    <div className="px-6 pt-6 pb-4">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#999] mb-1">
                        Ingresos este mes
                      </p>
                      <p className="font-serif text-[42px] font-bold leading-none tracking-[-0.02em] text-[#121212]">
                        $8.470.000
                      </p>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <span className="text-[11px] text-[#22a222] font-semibold">↑ 12%</span>
                        <span className="text-[11px] text-[#999]">vs mes anterior</span>
                      </div>
                    </div>

                    {/* Mini bar chart */}
                    <div className="px-6 pb-5">
                      <div className="flex items-end gap-1.5 h-14">
                        {[55, 70, 60, 80, 72, 90, 85, 95, 88, 100, 92, 847].map((h, i) => (
                          <div
                            key={i}
                            className={`flex-1 rounded-sm transition-all duration-500 ${i === 11 ? "bg-[#C41C1C]" : "bg-[#F0F0F0]"}`}
                            style={{ height: `${(h / 100) * 56}px` }}
                          />
                        ))}
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-[9px] text-[#CCC]">Ene</span>
                        <span className="text-[9px] text-[#CCC]">Dic</span>
                      </div>
                    </div>

                    {/* Stats row */}
                    <div className="grid grid-cols-2 divide-x divide-[#F0F0F0] border-t border-[#F0F0F0]">
                      <div className="px-6 py-4">
                        <p className="text-[22px] font-bold font-serif text-[#121212]">847</p>
                        <p className="text-[10px] text-[#999] uppercase tracking-[0.1em]">Suscriptores</p>
                      </div>
                      <div className="px-6 py-4">
                        <p className="text-[22px] font-bold font-serif text-[#121212]">48</p>
                        <p className="text-[10px] text-[#999] uppercase tracking-[0.1em]">Publicaciones</p>
                      </div>
                    </div>
                  </div>

                  {/* Notification flotante */}
                  <div className="absolute -bottom-5 -right-4 bg-white border border-[#EEEEEE] shadow-[0_4px_20px_rgba(0,0,0,0.1)] px-4 py-2.5 flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-[#C41C1C]/10 flex items-center justify-center shrink-0">
                      <span className="text-[10px]">🔔</span>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-[#121212]">María C. se suscribió</p>
                      <p className="text-[10px] text-[#999]">hace 2 minutos · $9.990/mes</p>
                    </div>
                  </div>
                </div>
              </BlurFade>
            </div>

          </div>
        </div>
      </section>

      {/* ══ MARQUEE ════════════════════════════════════════════════════════ */}
      <div className="border-b border-[#DEDEDE] overflow-hidden py-3 select-none">
        <Marquee duration={45} pauseOnHover>
          {tickerItems.map((item) => (
            <div key={item.name} className="flex items-center gap-2 px-6 shrink-0">
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#C41C1C]">
                {item.tag}
              </span>
              <span className="w-1 h-1 rounded-full bg-[#DEDEDE]" />
              <span className="text-[11px] font-semibold text-[#121212]">{item.name}</span>
              <span className="text-[10px] text-[#AAA]">{item.stat}</span>
              <span className="ml-4 text-[#DEDEDE]">·</span>
            </div>
          ))}
        </Marquee>
      </div>

      {/* ══ STATS ══════════════════════════════════════════════════════════ */}
      <section className="border-b border-[#DEDEDE]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-3 divide-x divide-[#DEDEDE]">
            {[
              { value: 34, pre: "", suf: "", label: "Creadores activos" },
              { value: 2418, pre: "", suf: "", label: "Suscriptores pagando" },
              { value: 180, pre: "$", suf: "K", label: "Generados en 2025" },
            ].map(({ value, pre, suf, label }, i) => (
              <BlurFade key={label} delay={i * 0.06}>
                <div className="px-8 py-12 first:pl-0 last:pr-0">
                  <p className="font-serif text-[clamp(40px,5.5vw,72px)] font-bold leading-none tracking-[-0.03em] flex items-baseline gap-0.5">
                    {pre && <span className="text-[#C41C1C]">{pre}</span>}
                    <NumberTicker value={value} className="text-[#121212]" />
                    {suf && <span className="text-[#C41C1C]">{suf}</span>}
                  </p>
                  <p className="text-[10px] uppercase tracking-[0.16em] text-[#AAA] mt-3 font-bold">
                    {label}
                  </p>
                </div>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FEATURES — iconos + beneficios ════════════════════════════════ */}
      <section className="border-b border-[#DEDEDE]">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <BlurFade delay={0}>
            <div className="flex items-center gap-4 mb-12">
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#C41C1C]">
                Por qué Sala
              </span>
              <div className="flex-1 h-px bg-[#DEDEDE]" />
            </div>
          </BlurFade>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#DEDEDE]">
            {features.map(({ icon: Icon, title, body }, i) => (
              <BlurFade key={title} delay={i * 0.06}>
                <div className="bg-white p-8 group hover:bg-[#FAFAFA] transition-colors duration-200">
                  <div className="w-10 h-10 border border-[#EEEEEE] flex items-center justify-center mb-5 group-hover:border-[#C41C1C] group-hover:bg-[#C41C1C]/5 transition-all duration-200">
                    <Icon size={18} className="text-[#C41C1C]" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-serif text-[18px] font-bold mb-2 tracking-[-0.01em]">
                    {title}
                  </h3>
                  <p className="text-[13px] leading-[1.75] text-[#666]">{body}</p>
                </div>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>

      {/* ══ BENTO GRID — salas destacadas ══════════════════════════════════ */}
      <section className="border-b border-[#DEDEDE] bg-[#FAFAFA]">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <BlurFade delay={0}>
            <div className="flex items-center gap-4 mb-10">
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#C41C1C]">
                Salas destacadas
              </span>
              <div className="flex-1 h-px bg-[#DEDEDE]" />
              <Link href="/explorar" className="text-[10px] font-medium text-[#888] hover:text-[#121212] uppercase tracking-[0.12em] transition-colors">
                Ver todas →
              </Link>
            </div>
          </BlurFade>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#DEDEDE]">
            {/* Card grande */}
            <BlurFade delay={0.05} className="md:col-span-2">
              <Link
                href={creators[0].href}
                className="group relative flex flex-col h-full min-h-[340px] bg-white p-10 hover:bg-[#FAFAFA] transition-colors duration-300 overflow-hidden"
              >
                <div className="flex items-start gap-4 mb-auto">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105"
                    style={{ backgroundColor: creators[0].color }}
                  >
                    <span className="font-serif text-[20px] font-bold text-white">{creators[0].initial}</span>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#C41C1C] mb-1">
                      {creators[0].specialty}
                    </p>
                    <h3 className="font-serif text-[clamp(28px,4vw,42px)] font-bold leading-tight tracking-[-0.02em] group-hover:text-[#C41C1C] transition-colors">
                      {creators[0].name}
                    </h3>
                  </div>
                </div>
                <p className="text-[15px] leading-[1.75] text-[#555] mt-6 mb-8 max-w-lg">
                  {creators[0].bio}
                </p>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="font-serif text-[28px] font-bold leading-none">
                      {creators[0].price}
                      <span className="font-sans text-[12px] font-normal text-[#999] ml-1">/mes</span>
                    </p>
                    <p className="text-[11px] text-[#999] mt-1">
                      {creators[0].subscribers.toLocaleString()} suscriptores · {creators[0].posts} publicaciones
                    </p>
                  </div>
                  <span className="text-[12px] font-bold text-[#C41C1C] uppercase tracking-[0.1em] group-hover:underline">
                    Ver sala →
                  </span>
                </div>
                <span className="absolute -bottom-3 right-5 font-serif text-[120px] font-bold text-[#F2F2F2] leading-none select-none pointer-events-none">
                  01
                </span>
              </Link>
            </BlurFade>

            {/* Cards pequeñas */}
            <div className="flex flex-col gap-px bg-[#DEDEDE]">
              {creators.slice(1).map((c, i) => (
                <BlurFade key={c.name} delay={0.1 + i * 0.07}>
                  <Link
                    href={c.href}
                    className="group flex flex-col bg-white p-8 hover:bg-[#FAFAFA] transition-colors duration-300 overflow-hidden min-h-[168px] relative"
                  >
                    <div className="flex items-center gap-3 mb-3.5">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                        style={{ backgroundColor: c.color }}
                      >
                        <span className="font-serif text-[12px] font-bold text-white">{c.initial}</span>
                      </div>
                      <div>
                        <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#C41C1C]">{c.specialty}</p>
                        <h3 className="font-serif text-[18px] font-bold leading-tight tracking-[-0.01em] group-hover:text-[#C41C1C] transition-colors">
                          {c.name}
                        </h3>
                      </div>
                    </div>
                    <p className="text-[12px] leading-[1.65] text-[#666] mb-3 line-clamp-2 overflow-hidden">{c.bio}</p>
                    <div className="flex items-center justify-between mt-auto">
                      <p className="text-[13px] font-bold">{c.price}<span className="text-[10px] font-normal text-[#999]">/mes</span></p>
                      <span className="text-[10px] font-bold text-[#C41C1C] uppercase tracking-[0.12em] group-hover:underline">Ver →</span>
                    </div>
                    <span className="absolute -bottom-2 right-4 font-serif text-[70px] font-bold text-[#F2F2F2] leading-none select-none pointer-events-none">
                      0{i + 2}
                    </span>
                  </Link>
                </BlurFade>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ PARA CREADORES — split + BorderBeam ═══════════════════════════ */}
      <section className="border-b border-[#DEDEDE]">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-2 gap-0 md:divide-x divide-[#DEDEDE]">
            <BlurFade delay={0}>
              <div className="md:pr-16 pb-10 md:pb-0">
                <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#C41C1C] mb-6">
                  <span className="w-4 h-px bg-[#C41C1C]" />
                  Para creadores
                </span>
                <h2 className="font-serif text-[clamp(28px,4vw,50px)] font-bold leading-[1.05] tracking-[-0.02em] mb-6">
                  Tu conocimiento<br />
                  tiene precio.<br />
                  <em className="not-italic text-[#C41C1C]">Sala te ayuda</em><br />
                  a cobrarlo.
                </h2>
                <p className="text-[15px] leading-[1.8] text-[#555] mb-8 max-w-md">
                  Profesionales como tú publican análisis, reflexiones y contenido que sus lectores más comprometidos pagan mes a mes.
                </p>
                <Link
                  href="/para-creadores"
                  className="inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.12em] border-b-2 border-[#121212] pb-0.5 hover:text-[#C41C1C] hover:border-[#C41C1C] transition-colors"
                >
                  Saber más →
                </Link>
              </div>
            </BlurFade>

            <BlurFade delay={0.15}>
              <div className="md:pl-16 pt-10 md:pt-0">
                <div className="relative border border-[#E0E0E0] overflow-hidden">
                  <BorderBeam size={320} duration={14} colorFrom="#C41C1C" colorTo="#FF9999" />
                  <div className="p-8">
                    <p className="text-[10px] uppercase tracking-[0.16em] text-[#999] mb-4 font-bold">
                      Con 100 suscriptores a $9.990/mes
                    </p>
                    <p className="font-serif text-[clamp(40px,6vw,66px)] font-bold leading-none tracking-[-0.03em]">
                      $998.000
                    </p>
                    <p className="text-[13px] text-[#666] mt-2 mb-7">pesos chilenos al mes — para ti.</p>
                    <div className="space-y-3 mb-7">
                      {[
                        "0% de comisión con Plan Pro",
                        "Pagos directos a tu cuenta",
                        "Cancela cuando quieras",
                      ].map((item) => (
                        <div key={item} className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#C41C1C] shrink-0" />
                          <p className="text-[13px] text-[#555]">{item}</p>
                        </div>
                      ))}
                    </div>
                    <Link
                      href="/abrir"
                      className="block bg-[#121212] text-white text-center px-6 py-3.5 text-[12px] font-bold uppercase tracking-[0.12em] hover:bg-[#C41C1C] transition-colors duration-200"
                    >
                      Abre tu sala gratis →
                    </Link>
                  </div>
                </div>
              </div>
            </BlurFade>
          </div>
        </div>
      </section>

      {/* ══ CÓMO FUNCIONA ══════════════════════════════════════════════════ */}
      <section className="border-b border-[#DEDEDE]">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <BlurFade delay={0}>
            <div className="flex items-center gap-4 mb-12">
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#C41C1C]">Cómo funciona</span>
              <div className="flex-1 h-px bg-[#DEDEDE]" />
            </div>
          </BlurFade>
          <div className="grid md:grid-cols-3 gap-px bg-[#DEDEDE]">
            {[
              { num: "01", title: "Abre tu sala", body: "Configuras tu perfil y precio en 15 minutos. Sin código. Sin diseñador." },
              { num: "02", title: "Publica lo que sabes", body: "Artículos, análisis, reflexiones. Tú decides qué es gratuito y qué es exclusivo." },
              { num: "03", title: "Cobra mes a mes", body: "Tus suscriptores pagan directo. Sala cobra solo cuando tú ganas." },
            ].map(({ num, title, body }, i) => (
              <BlurFade key={num} delay={i * 0.08}>
                <div className="bg-white px-10 py-10 relative overflow-hidden group hover:bg-[#FAFAFA] transition-colors">
                  <p className="font-serif text-[clamp(52px,7vw,80px)] font-bold text-[#EEEEEE] leading-none mb-5 group-hover:text-[#E5E5E5] transition-colors">
                    {num}
                  </p>
                  <h3 className="font-serif text-[19px] font-bold mb-3">{title}</h3>
                  <p className="text-[13px] leading-[1.75] text-[#666]">{body}</p>
                </div>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>

      {/* ══ MANIFESTO — sección oscura, BackgroundBeams ════════════════════ */}
      <section className="relative bg-[#0A0A0A] border-b border-[#222] overflow-hidden">
        <BackgroundBeams className="opacity-30" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 py-28 md:py-44 text-center">
          <BlurFade delay={0}>
            <div className="inline-flex items-center gap-3 mb-12">
              <span className="w-8 h-px bg-[#C41C1C]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C41C1C]">
                Por qué existe Sala
              </span>
              <span className="w-8 h-px bg-[#C41C1C]" />
            </div>

            <p className="font-serif text-[clamp(24px,4vw,54px)] font-bold leading-[1.2] tracking-[-0.02em] italic text-white mb-16">
              &ldquo;Durante años regalaste<br />
              tu conocimiento.<br />
              <span className="text-[#C41C1C]">Sala existe para que<br />
              eso cambie.&rdquo;</span>
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/abrir"
                className="bg-[#C41C1C] text-white px-10 py-4 text-[12px] font-bold uppercase tracking-[0.14em] hover:bg-white hover:text-[#C41C1C] transition-colors duration-200"
              >
                Abre tu sala hoy →
              </Link>
              <Link
                href="/explorar"
                className="text-[12px] font-medium text-[#666] uppercase tracking-[0.12em] hover:text-white transition-colors"
              >
                O explora las salas →
              </Link>
            </div>
            <p className="text-[11px] text-[#444] mt-5 uppercase tracking-[0.1em]">
              Gratis para empezar · Sin tarjeta de crédito
            </p>
          </BlurFade>
        </div>
      </section>

      {/* ══ FOOTER ═════════════════════════════════════════════════════════ */}
      <footer className="bg-[#0A0A0A] border-t border-[#222]">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <p className="text-[10px] uppercase tracking-[0.12em] text-[#444] font-bold">
            SALA · NEBBULER · 2025
          </p>
          <a href="mailto:hello@nebbuler.com" className="text-[10px] text-[#444] hover:text-white transition-colors uppercase tracking-[0.1em]">
            hello@nebbuler.com
          </a>
        </div>
      </footer>
    </div>
  );
}
