"use client";

import Link from "next/link";
import Nav from "@/components/nav";
import { NumberTicker } from "@/components/ui/number-ticker";
import { BlurFade } from "@/components/ui/blur-fade";
import { BorderBeam } from "@/components/ui/border-beam";

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
    featured: true,
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
    featured: false,
  },
  {
    name: "Marco Salinas",
    specialty: "ARQUITECTURA",
    initial: "MS",
    bio: "Arquitectura latinoamericana que no sale en los libros.",
    price: "$7.990",
    subscribers: 312,
    href: "/marco-salinas",
    color: "#2e1a1a",
    posts: 24,
    featured: false,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans text-[#121212]">
      <Nav />

      {/* HERO — Asimétrico, editorial */}
      <section className="border-b border-[#DEDEDE]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-[1fr_400px] gap-0 min-h-[560px]">
            {/* Left: Tipografía editorial oversized */}
            <div className="py-16 lg:py-24 lg:pr-16 flex flex-col justify-between border-r border-[#DEDEDE]">
              <BlurFade delay={0}>
                <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#C41C1C]">
                  <span className="w-4 h-px bg-[#C41C1C]" />
                  Plataforma de conocimiento profesional
                </span>
              </BlurFade>

              <div className="my-auto py-10">
                <BlurFade delay={0.08}>
                  <h1 className="font-serif text-[clamp(52px,7vw,92px)] font-bold leading-[0.93] tracking-[-0.03em] text-[#121212]">
                    El lugar donde<br />
                    tu conocimiento<br />
                    <em className="not-italic text-[#C41C1C]">encuentra</em><br />
                    <em className="not-italic text-[#C41C1C]">su valor.</em>
                  </h1>
                </BlurFade>
              </div>

              <BlurFade delay={0.18}>
                <div className="flex flex-col sm:flex-row gap-3 items-start">
                  <Link
                    href="/abrir"
                    className="bg-[#C41C1C] text-white px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.1em] hover:bg-[#A01515] transition-colors duration-200"
                  >
                    Abre la tuya — es gratis
                  </Link>
                  <Link
                    href="/explorar"
                    className="border border-[#DEDEDE] px-6 py-3 text-[12px] font-medium text-[#555] uppercase tracking-[0.1em] hover:border-[#121212] hover:text-[#121212] transition-all duration-200"
                  >
                    Explorar salas →
                  </Link>
                </div>
              </BlurFade>
            </div>

            {/* Right: Tarjeta "featured creator" + descripción */}
            <div className="hidden lg:flex flex-col justify-center py-16 pl-12 gap-8">
              <BlurFade delay={0.25}>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#999]">
                  Sala destacada esta semana
                </p>
                <Link
                  href={creators[0].href}
                  className="group mt-4 block border border-[#EBEBEB] bg-white hover:border-[#C41C1C] transition-colors duration-300 overflow-hidden"
                >
                  <div className="p-6">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center mb-5"
                      style={{ backgroundColor: creators[0].color }}
                    >
                      <span className="font-serif text-[15px] font-bold text-white">
                        {creators[0].initial}
                      </span>
                    </div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#C41C1C] mb-1.5">
                      {creators[0].specialty}
                    </p>
                    <h3 className="font-serif text-[22px] font-bold leading-tight tracking-[-0.01em] mb-3 group-hover:text-[#C41C1C] transition-colors">
                      {creators[0].name}
                    </h3>
                    <p className="text-[13px] leading-[1.6] text-[#666] mb-5">
                      {creators[0].bio}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-[#F0F0F0]">
                      <div>
                        <p className="text-[15px] font-bold">
                          {creators[0].price}
                          <span className="text-[11px] font-normal text-[#999]">/mes</span>
                        </p>
                        <p className="text-[10px] text-[#999] mt-0.5">
                          {creators[0].subscribers.toLocaleString()} suscriptores
                        </p>
                      </div>
                      <span className="text-[11px] font-semibold text-[#C41C1C] uppercase tracking-[0.1em] group-hover:underline">
                        Ver sala →
                      </span>
                    </div>
                  </div>
                </Link>
              </BlurFade>

              <BlurFade delay={0.35}>
                <p className="text-[13px] leading-[1.7] text-[#888] max-w-[320px]">
                  Economistas, abogados, médicos y consultores publican lo que saben. Sin algoritmo. Sin intermediario.
                </p>
              </BlurFade>
            </div>
          </div>
        </div>
      </section>

      {/* STATS — todo blanco, números editoriales */}
      <section className="border-b border-[#DEDEDE]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-3 divide-x divide-[#DEDEDE]">
            {[
              { value: 34, prefix: "", suffix: "", label: "Creadores activos" },
              { value: 2418, prefix: "", suffix: "", label: "Suscriptores pagando" },
              { value: 180, prefix: "$", suffix: "K", label: "Generados en 2025" },
            ].map(({ value, prefix, suffix, label }, i) => (
              <BlurFade key={label} delay={i * 0.07}>
                <div className="px-8 py-12 first:pl-0 last:pr-0 group">
                  <p className="font-serif text-[clamp(44px,6vw,80px)] font-bold leading-none tracking-[-0.03em] text-[#121212] flex items-baseline gap-0.5">
                    {prefix && <span className="text-[#C41C1C]">{prefix}</span>}
                    <NumberTicker value={value} className="text-[#121212]" />
                    {suffix && <span className="text-[#C41C1C]">{suffix}</span>}
                  </p>
                  <p className="text-[10px] uppercase tracking-[0.14em] text-[#999] mt-3 font-medium">
                    {label}
                  </p>
                </div>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>

      {/* BENTO GRID — Salas destacadas */}
      <section className="border-b border-[#DEDEDE]">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <BlurFade delay={0}>
            <div className="flex items-center gap-4 mb-10">
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#C41C1C]">
                Salas destacadas
              </span>
              <div className="flex-1 h-px bg-[#DEDEDE]" />
              <Link
                href="/explorar"
                className="text-[10px] font-medium text-[#888] hover:text-[#121212] uppercase tracking-[0.12em] transition-colors"
              >
                Ver todas →
              </Link>
            </div>
          </BlurFade>

          {/* Bento Grid: [large 2-col] + [2 small stacked] */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#DEDEDE]">
            {/* Card grande — ocupa 2 columnas */}
            <BlurFade delay={0.05} className="md:col-span-2">
              <Link
                href={creators[0].href}
                className="group relative flex flex-col h-full min-h-[340px] bg-white p-10 hover:bg-[#FAFAFA] transition-colors duration-300 overflow-hidden"
              >
                <div className="flex items-start gap-5 mb-auto">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105"
                    style={{ backgroundColor: creators[0].color }}
                  >
                    <span className="font-serif text-[20px] font-bold text-white">
                      {creators[0].initial}
                    </span>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#C41C1C] mb-1.5">
                      {creators[0].specialty}
                    </p>
                    <h3 className="font-serif text-[32px] md:text-[40px] font-bold leading-tight tracking-[-0.02em] text-[#121212] group-hover:text-[#C41C1C] transition-colors duration-200">
                      {creators[0].name}
                    </h3>
                  </div>
                </div>

                <p className="text-[15px] leading-[1.75] text-[#555] mt-6 mb-8 max-w-lg">
                  {creators[0].bio}
                </p>

                <div className="flex items-end justify-between">
                  <div>
                    <p className="font-serif text-[28px] font-bold text-[#121212] leading-none">
                      {creators[0].price}
                      <span className="font-sans text-[13px] font-normal text-[#999] ml-1">/mes</span>
                    </p>
                    <p className="text-[11px] text-[#999] mt-1.5">
                      {creators[0].subscribers.toLocaleString()} suscriptores · {creators[0].posts} publicaciones
                    </p>
                  </div>
                  <span className="text-[12px] font-semibold text-[#C41C1C] uppercase tracking-[0.1em] group-hover:underline">
                    Ver sala →
                  </span>
                </div>

                {/* Número decorativo de fondo */}
                <span className="absolute bottom-6 right-8 font-serif text-[120px] font-bold text-[#F5F5F5] leading-none select-none pointer-events-none">
                  01
                </span>
              </Link>
            </BlurFade>

            {/* Cards pequeñas — 1 columna, apiladas */}
            <div className="flex flex-col gap-px bg-[#DEDEDE]">
              {creators.slice(1).map((c, i) => (
                <BlurFade key={c.name} delay={0.1 + i * 0.08}>
                  <Link
                    href={c.href}
                    className="group flex flex-col flex-1 bg-white p-8 hover:bg-[#FAFAFA] transition-colors duration-300 overflow-hidden min-h-[168px] relative"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                        style={{ backgroundColor: c.color }}
                      >
                        <span className="font-serif text-[13px] font-bold text-white">{c.initial}</span>
                      </div>
                      <div>
                        <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-[#C41C1C]">
                          {c.specialty}
                        </p>
                        <h3 className="font-serif text-[18px] font-bold leading-tight tracking-[-0.01em] text-[#121212] group-hover:text-[#C41C1C] transition-colors duration-200">
                          {c.name}
                        </h3>
                      </div>
                    </div>
                    <p className="text-[12px] leading-[1.65] text-[#666] mb-4 line-clamp-2">
                      {c.bio}
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                      <p className="text-[13px] font-bold">
                        {c.price}
                        <span className="text-[10px] font-normal text-[#999]">/mes</span>
                      </p>
                      <span className="text-[10px] font-semibold text-[#C41C1C] uppercase tracking-[0.1em] group-hover:underline">
                        Ver →
                      </span>
                    </div>
                    <span className="absolute bottom-3 right-5 font-serif text-[64px] font-bold text-[#F7F7F7] leading-none select-none pointer-events-none">
                      0{i + 2}
                    </span>
                  </Link>
                </BlurFade>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PARA CREADORES — layout editorial split */}
      <section className="border-b border-[#DEDEDE]">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-2 gap-0 md:divide-x divide-[#DEDEDE]">
            {/* Left: Texto */}
            <BlurFade delay={0}>
              <div className="md:pr-16 pb-10 md:pb-0">
                <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#C41C1C] mb-6">
                  <span className="w-4 h-px bg-[#C41C1C]" />
                  Para creadores
                </span>
                <h2 className="font-serif text-[clamp(32px,4vw,52px)] font-bold leading-[1.05] tracking-[-0.02em] text-[#121212] mb-6">
                  Tienes conocimiento<br />
                  que vale.<br />
                  <em className="not-italic text-[#C41C1C]">Sala te ayuda</em><br />
                  a cobrarlo.
                </h2>
                <p className="text-[15px] leading-[1.75] text-[#555] mb-8 max-w-md">
                  Profesionales como tú publican análisis, reflexiones y contenido que sus lectores más comprometidos pagan mes a mes.
                </p>
                <Link
                  href="/para-creadores"
                  className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#121212] border-b border-[#121212] pb-0.5 hover:text-[#C41C1C] hover:border-[#C41C1C] transition-colors"
                >
                  Saber más →
                </Link>
              </div>
            </BlurFade>

            {/* Right: Card con BorderBeam */}
            <BlurFade delay={0.15}>
              <div className="md:pl-16 pt-10 md:pt-0">
                <div className="relative border border-[#E5E5E5] bg-white overflow-hidden">
                  <BorderBeam size={280} duration={14} delay={0} colorFrom="#C41C1C" colorTo="#F5A0A0" />
                  <div className="p-8">
                    <p className="text-[10px] uppercase tracking-[0.14em] text-[#999] mb-6 font-medium">
                      Con 100 suscriptores a $9.990/mes
                    </p>
                    <p className="font-serif text-[clamp(42px,6vw,64px)] font-bold leading-none tracking-[-0.03em] text-[#121212] mb-1">
                      $998.000
                    </p>
                    <p className="text-[13px] text-[#666] mb-8 mt-2">
                      pesos chilenos al mes — para ti.
                    </p>
                    <div className="space-y-3 mb-8">
                      {[
                        "Sala toma 0% cuando tienes Plan Pro",
                        "Pagos directos a tu cuenta",
                        "Cancela cuando quieras",
                      ].map((item) => (
                        <div key={item} className="flex items-start gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#C41C1C] mt-2 shrink-0" />
                          <p className="text-[13px] text-[#555]">{item}</p>
                        </div>
                      ))}
                    </div>
                    <Link
                      href="/abrir"
                      className="block bg-[#121212] text-white text-center px-6 py-3.5 text-[12px] font-semibold uppercase tracking-[0.1em] hover:bg-[#C41C1C] transition-colors duration-200"
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

      {/* CÓMO FUNCIONA — pasos numerados, minimalista */}
      <section className="border-b border-[#DEDEDE]">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <BlurFade delay={0}>
            <div className="flex items-center gap-4 mb-12">
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#C41C1C]">
                Cómo funciona
              </span>
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
                <div className="bg-white px-10 py-10 first:pl-0 last:pr-0 relative overflow-hidden group hover:bg-[#FAFAFA] transition-colors duration-200">
                  <p className="font-serif text-[clamp(56px,7vw,80px)] font-bold text-[#F0F0F0] leading-none mb-5 transition-colors duration-200 group-hover:text-[#EBEBEB]">
                    {num}
                  </p>
                  <h3 className="font-serif text-[19px] font-bold text-[#121212] mb-3 tracking-[-0.01em]">
                    {title}
                  </h3>
                  <p className="text-[13px] leading-[1.75] text-[#666]">{body}</p>
                </div>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>

      {/* MANIFIESTO — centrado, tipografía editorial */}
      <section className="border-b border-[#DEDEDE]">
        <div className="max-w-4xl mx-auto px-6 py-24 md:py-36 text-center">
          <BlurFade delay={0}>
            <span className="inline-block w-8 h-px bg-[#C41C1C] mb-10" />
            <p className="font-serif text-[clamp(24px,4vw,52px)] font-bold leading-[1.2] tracking-[-0.02em] text-[#121212] italic mb-12">
              &ldquo;Durante años regalaste<br />
              tu conocimiento.<br />
              Sala existe para que<br />
              eso cambie.&rdquo;
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/abrir"
                className="bg-[#C41C1C] text-white px-10 py-4 text-[12px] font-semibold uppercase tracking-[0.12em] hover:bg-[#121212] transition-colors duration-200"
              >
                Abre tu sala hoy →
              </Link>
            </div>
            <p className="text-[11px] text-[#BBB] mt-5 uppercase tracking-[0.1em]">
              Gratis para empezar · Sin tarjeta de crédito
            </p>
          </BlurFade>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#DEDEDE]">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <p className="text-[10px] uppercase tracking-[0.12em] text-[#BBB] font-medium">
            SALA · NEBBULER · 2025
          </p>
          <a
            href="mailto:hello@nebbuler.com"
            className="text-[10px] text-[#BBB] hover:text-[#121212] transition-colors uppercase tracking-[0.1em]"
          >
            hello@nebbuler.com
          </a>
        </div>
      </footer>
    </div>
  );
}
