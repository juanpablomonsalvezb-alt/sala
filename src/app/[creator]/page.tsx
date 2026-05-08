"use client";

import { useState } from "react";

interface Article {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  free: boolean;
}

interface Credential {
  label: string;
}

interface Creator {
  slug: string;
  name: string;
  specialty: string;
  bio: string;
  bioLong: string;
  whyPublish: string;
  subscribers: number;
  publishSchedule: string;
  memberSince: string;
  priceMonthly: number;
  priceLabel: string;
  articles: Article[];
  credentials: Credential[];
  includes: string[];
}

const creator: Creator = {
  slug: "rodrigo-fuentes",
  name: "Rodrigo Fuentes",
  specialty: "ANÁLISIS FINANCIERO",
  bio: "Economista con 12 años en banca de inversión. Explico lo que los medios simplifican de más y los analistas complican demasiado.",
  bioLong:
    "Llevo más de una década analizando mercados financieros en entornos donde las decisiones valen millones. He visto de cerca cómo los grandes actores interpretan —y en muchos casos tergiversan— los datos macroeconómicos. Hoy comparto esa mirada directamente contigo: sin el filtro del titular, sin la agenda del auspiciante.",
  whyPublish:
    "Publico en Sala porque quiero escribir para gente que piensa, no para algoritmos. Aquí no hay clics ni métricas de engagement: solo análisis honesto para profesionales que toman decisiones con dinero real.",
  subscribers: 847,
  publishSchedule: "Publica cada jueves",
  memberSince: "Desde marzo 2024",
  priceMonthly: 9990,
  priceLabel: "$9.990/mes",
  articles: [
    {
      id: "1",
      title: "Por qué el tipo de cambio te está mintiendo",
      date: "12 may 2025",
      excerpt:
        "El dólar no sube ni baja por las razones que los medios te dicen. Hay tres factores estructurales que casi nadie menciona y que determinan el 80% del movimiento.",
      free: true,
    },
    {
      id: "2",
      title: "El efecto silencioso de la tasa de política monetaria en tu cartera",
      date: "5 may 2025",
      excerpt:
        "Cuando el Banco Central mueve la TPM, el impacto no es inmediato ni uniforme. Aquí el mapa completo de cómo se propaga y qué activos sufren primero.",
      free: true,
    },
    {
      id: "3",
      title: "Cobre, litio y el error de análisis que cometen los medios",
      date: "28 abr 2025",
      excerpt:
        "Chile exporta recursos, pero los medios reportan sus precios como si fueran commodities intercambiables. No lo son.",
      free: true,
    },
    {
      id: "4",
      title: "Inflación importada: el canal que nadie ve venir",
      date: "21 abr 2025",
      excerpt:
        "Más allá del IPC doméstico, existe un vector de presión inflacionaria que cruza fronteras silenciosamente.",
      free: false,
    },
    {
      id: "5",
      title: "Por qué las reservas del Banco Central no son lo que parecen",
      date: "14 abr 2025",
      excerpt:
        "El titular dice 'reservas récord'. El análisis dice otra cosa. Desglose de composición y liquidez real.",
      free: false,
    },
  ],
  credentials: [
    { label: "Master en Economía UC" },
    { label: "12 años en banca de inversión" },
    { label: "Ex Bloomberg LP" },
  ],
  includes: ["Acceso inmediato", "Archivo completo", "Cancela cuando quieras"],
};

function SiteNav() {
  return (
    <header>
      <div className="h-[3px] bg-[#C41C1C] w-full" />
      <div className="border-b border-[#DEDEDE] py-3 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <a href="/" className="font-serif text-[22px] font-bold text-[#121212] leading-none" style={{ letterSpacing: "-0.01em" }}>
            SALA
          </a>
          <button className="font-sans text-[12px] font-medium px-4 py-1.5 border border-[#DEDEDE] text-[#666666] hover:border-[#121212] hover:text-[#121212] transition-colors duration-150">
            Iniciar sesión
          </button>
        </div>
      </div>
    </header>
  );
}

function CreatorHeader() {
  return (
    <section className="border-b border-[#DEDEDE] py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <span className="section-label mb-4 inline-block">{creator.specialty}</span>
        <hr className="nyt-rule mb-5" />
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="flex-1">
            <h1
              className="font-serif text-[#121212] mb-4 leading-none"
              style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, letterSpacing: "-0.01em" }}
            >
              {creator.name}
            </h1>
            <p className="font-sans text-[15px] text-[#666666] leading-relaxed mb-5 max-w-lg">
              {creator.bio}
            </p>
            <p className="font-sans text-[12px] text-[#666666]">
              <span className="font-semibold text-[#121212]">{creator.subscribers.toLocaleString("es-CL")} suscriptores</span>
              {" · "}{creator.publishSchedule}{" · "}{creator.memberSince}
            </p>
          </div>
          <div className="shrink-0 flex flex-col items-start md:items-end gap-1.5">
            <button className="font-sans text-[13px] font-medium px-6 py-2.5 border border-[#121212] text-[#121212] hover:bg-[#121212] hover:text-white transition-colors duration-150 whitespace-nowrap">
              Suscribirse · {creator.priceLabel}
            </button>
            <span className="font-sans text-[11px] text-[#666666]">Cancela cuando quieras</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function ArticlesList() {
  const freeArticles = creator.articles.filter((a) => a.free);
  const lockedArticles = creator.articles.filter((a) => !a.free);

  return (
    <section className="py-10 px-6">
      <div className="max-w-4xl mx-auto">
        <span className="section-label mb-3 inline-block">PUBLICACIONES</span>
        <hr className="nyt-rule mb-0" />

        {freeArticles.map((article, i) => (
          <article key={article.id} className="border-b border-[#DEDEDE] py-5 group">
            <div className="flex flex-col md:flex-row md:items-baseline md:gap-6">
              <time className="font-sans text-[11px] font-semibold tracking-wide text-[#C41C1C] shrink-0 mb-1 md:mb-0 uppercase">
                {article.date}
              </time>
              <div className="flex-1">
                <a href="#">
                  <h4
                    className="font-serif text-[20px] font-bold text-[#121212] leading-snug mb-2 group-hover:underline underline-offset-2"
                    style={{ letterSpacing: "-0.01em" }}
                  >
                    {article.title}
                  </h4>
                  <p className="font-sans text-[13px] text-[#666666] leading-relaxed">
                    {article.excerpt}
                  </p>
                </a>
              </div>
            </div>
          </article>
        ))}

        {lockedArticles.map((article) => (
          <article key={article.id} className="border-b border-[#DEDEDE] py-5">
            <div className="flex flex-col md:flex-row md:items-baseline md:gap-6">
              <time className="font-sans text-[11px] font-semibold tracking-wide text-[#DEDEDE] shrink-0 mb-1 md:mb-0 uppercase">
                {article.date}
              </time>
              <div className="flex-1 flex items-center justify-between gap-4">
                <h4
                  className="font-serif text-[20px] font-bold text-[#DEDEDE] leading-snug"
                  style={{ letterSpacing: "-0.01em" }}
                >
                  {article.title}
                </h4>
                <span className="font-sans text-[11px] font-semibold tracking-wide text-[#999] shrink-0 uppercase">
                  Solo suscriptores
                </span>
              </div>
            </div>
          </article>
        ))}

        <div className="py-10 border-b border-[#DEDEDE] text-center">
          <p className="font-sans text-[13px] text-[#666666] mb-5">
            {creator.subscribers.toLocaleString("es-CL")} profesionales ya leen esta sala.
          </p>
          <button className="font-sans text-[13px] font-medium px-8 py-3 bg-[#121212] text-white hover:bg-[#333] transition-colors duration-150">
            Suscribirse · {creator.priceLabel}
          </button>
        </div>
      </div>
    </section>
  );
}

function AboutCreator() {
  return (
    <section className="py-12 px-6 border-t border-[#DEDEDE] bg-[#F7F7F7]">
      <div className="max-w-4xl mx-auto">
        <span className="section-label-dark mb-3 inline-block">SOBRE EL AUTOR</span>
        <hr className="nyt-rule mb-8" />
        <div className="grid md:grid-cols-2 gap-10 md:gap-16">
          <div>
            <h2 className="font-serif text-[22px] font-bold text-[#121212] mb-4" style={{ letterSpacing: "-0.01em" }}>
              {creator.name}
            </h2>
            <p className="font-sans text-[14px] text-[#666666] leading-relaxed mb-6">
              {creator.bioLong}
            </p>
            <blockquote className="border-l-2 border-[#C41C1C] pl-5">
              <p className="font-serif italic text-[15px] text-[#121212] leading-relaxed">
                "{creator.whyPublish}"
              </p>
            </blockquote>
          </div>
          <div>
            <p className="font-sans text-[11px] font-semibold tracking-widest uppercase text-[#666666] mb-4">Credenciales</p>
            <ul className="space-y-3">
              {creator.credentials.map((cred) => (
                <li key={cred.label} className="flex items-start gap-3">
                  <span className="font-serif text-[#C41C1C] mt-0.5 leading-none">—</span>
                  <span className="font-sans text-[14px] text-[#121212]">{cred.label}</span>
                </li>
              ))}
            </ul>
            <hr className="nyt-rule my-6" />
            <ul className="space-y-2">
              {creator.includes.map((item) => (
                <li key={item} className="font-sans text-[13px] text-[#666666]">· {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function CreatorFooter() {
  return (
    <footer className="border-t border-[#DEDEDE] py-6 px-6">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <span className="font-sans text-[11px] font-semibold uppercase tracking-widest text-[#666666]">
          SALA · CHILE · 2025
        </span>
        <a href="mailto:hello@sala.lat" className="font-sans text-[12px] text-[#666666] hover:text-[#121212] transition-colors duration-150">
          hello@sala.lat
        </a>
      </div>
    </footer>
  );
}

export default function CreatorPage() {
  return (
    <main className="min-h-screen bg-white">
      <SiteNav />
      <CreatorHeader />
      <ArticlesList />
      <AboutCreator />
      <CreatorFooter />
    </main>
  );
}
