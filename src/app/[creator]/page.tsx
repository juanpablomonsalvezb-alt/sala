"use client"

import { useState } from "react"
import { motion, type Variants } from "framer-motion"
import { Lock, Check, ArrowRight } from "lucide-react"

// ─── Tipos ───────────────────────────────────────────────────────────────────

interface Article {
  id: string
  title: string
  date: string
  excerpt: string
  free: boolean
}

interface Credential {
  label: string
}

interface Creator {
  slug: string
  name: string
  specialty: string
  bio: string
  bioLong: string
  whyPublish: string
  avatarUrl?: string
  subscribers: number
  publishSchedule: string
  memberSince: string
  priceMonthly: number
  priceLabel: string
  articles: Article[]
  credentials: Credential[]
  includes: string[]
}

// ─── Datos del creador ────────────────────────────────────────────────────────

const creator: Creator = {
  slug: "rodrigo-fuentes",
  name: "Rodrigo Fuentes",
  specialty: "Análisis Financiero",
  bio: "Economista con 12 años en banca de inversión. Explico lo que los medios simplifican de más y los analistas complican demasiado.",
  bioLong:
    "Llevo más de una década analizando mercados financieros en entornos donde las decisiones valen millones. He visto de cerca cómo los grandes actores interpretan —y en muchos casos tergiversan— los datos macroeconómicos. Hoy comparto esa mirada directamente contigo: sin el filtro del titular, sin la agenda del auspiciante.",
  whyPublish:
    "Publico en Sala porque quiero escribir para gente que piensa, no para algoritmos. Aquí no hay clics ni métricas de engagement: solo análisis honesto para profesionales que toman decisiones con dinero real.",
  avatarUrl: "",
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
  includes: [
    "Acceso inmediato",
    "Archivo completo",
    "Cancela cuando quieras",
  ],
}

// ─── Animaciones ──────────────────────────────────────────────────────────────

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] },
  }),
}

// ─── ArticleRow ───────────────────────────────────────────────────────────────

function ArticleRow({ article, index }: { article: Article; index: number }) {
  return (
    <motion.a
      href="#"
      custom={index}
      variants={fadeUp}
      initial="hidden"
      animate="show"
      className="group relative flex items-center gap-4 border-b border-[#E5E7EB] py-4 pl-3 pr-4 transition-all duration-150 hover:bg-white hover:border-l-2 hover:border-l-[#0066FF] last:border-b-0"
      style={{ borderLeft: "2px solid transparent" }}
    >
      {/* Borde izquierdo hover — handled via CSS group */}
      <span className="w-24 shrink-0 font-[var(--font-inter),Inter,sans-serif] text-xs text-[#6B7280] tabular-nums">
        {article.date}
      </span>
      <span className="flex-1 font-[var(--font-inter),Inter,sans-serif] text-sm font-[500] text-[#0A0A0A] leading-snug">
        {article.title}
      </span>
      <span className="shrink-0 font-[var(--font-inter),Inter,sans-serif] text-sm font-[500] text-[#0066FF] opacity-0 transition-opacity duration-150 group-hover:opacity-100 flex items-center gap-1">
        Leer <ArrowRight className="size-3.5" />
      </span>
    </motion.a>
  )
}

// ─── LockedContent ────────────────────────────────────────────────────────────

function LockedContent({ creator }: { creator: Creator }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="mt-4 rounded-xl border border-[#E5E7EB] bg-white p-10 text-center"
    >
      <div className="mx-auto mb-4 flex size-10 items-center justify-center rounded-full border border-[#E5E7EB] bg-[#F8F8F8]">
        <Lock className="size-4 text-[#6B7280]" />
      </div>
      <h4 className="mb-1 font-[var(--font-inter),Inter,sans-serif] text-base font-[700] tracking-tight text-[#0A0A0A]">
        Contenido exclusivo para suscriptores
      </h4>
      <p className="mb-6 font-[var(--font-inter),Inter,sans-serif] text-sm text-[#6B7280]">
        {creator.subscribers.toLocaleString("es-CL")} profesionales ya tienen acceso a esta sala.
      </p>
      <button className="mx-auto mb-5 block rounded-lg bg-[#0066FF] px-6 py-2.5 font-[var(--font-inter),Inter,sans-serif] text-sm font-[600] text-white transition-all duration-150 hover:bg-[#0052CC] active:scale-[0.98]">
        Suscribirse · {creator.priceLabel}
      </button>
      <ul className="mx-auto flex flex-col items-start gap-2 w-fit">
        {creator.includes.map((item) => (
          <li key={item} className="flex items-center gap-2 font-[var(--font-inter),Inter,sans-serif] text-xs text-[#6B7280]">
            <Check className="size-3.5 shrink-0 text-[#0066FF]" />
            {item}
          </li>
        ))}
      </ul>
    </motion.div>
  )
}

// ─── Tabs segmented ───────────────────────────────────────────────────────────

type Tab = "preview" | "subscribers"

function SegmentedTabs({
  active,
  onChange,
}: {
  active: Tab
  onChange: (t: Tab) => void
}) {
  return (
    <div className="inline-flex items-center rounded-lg border border-[#E5E7EB] bg-[#F8F8F8] p-0.5">
      <button
        onClick={() => onChange("preview")}
        className={`rounded-md px-4 py-1.5 font-[var(--font-inter),Inter,sans-serif] text-sm font-[500] transition-all duration-150 ${
          active === "preview"
            ? "bg-white text-[#0A0A0A] shadow-sm"
            : "text-[#6B7280] hover:text-[#0A0A0A]"
        }`}
      >
        Vista previa
      </button>
      <button
        onClick={() => onChange("subscribers")}
        className={`flex items-center gap-1.5 rounded-md px-4 py-1.5 font-[var(--font-inter),Inter,sans-serif] text-sm font-[500] transition-all duration-150 ${
          active === "subscribers"
            ? "bg-white text-[#0A0A0A] shadow-sm"
            : "text-[#6B7280] hover:text-[#0A0A0A]"
        }`}
      >
        <Lock className="size-3" />
        Solo suscriptores
      </button>
    </div>
  )
}

// ─── Página ───────────────────────────────────────────────────────────────────

export default function CreatorPage() {
  const [activeTab, setActiveTab] = useState<Tab>("preview")
  const freeArticles = creator.articles.filter((a) => a.free)
  const initial = creator.name.charAt(0)

  return (
    <main className="min-h-screen bg-[#F8F8F8]">

      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-[#E5E7EB] bg-[#F8F8F8]/90 backdrop-blur-md">
        <div className="mx-auto flex h-12 max-w-4xl items-center justify-between px-6">
          <span className="font-[var(--font-inter),Inter,sans-serif] text-sm font-[700] tracking-tight text-[#0A0A0A]">
            Sala
          </span>
          <button className="rounded-md border border-[#E5E7EB] bg-white px-3 py-1.5 font-[var(--font-inter),Inter,sans-serif] text-xs font-[500] text-[#0A0A0A] transition-colors hover:border-[#0A0A0A]">
            Iniciar sesión
          </button>
        </div>
      </nav>

      <div className="mx-auto max-w-4xl px-6 pb-24">

        {/* ── HEADER DEL CREADOR ───────────────────────────────────────────── */}
        <section className="pt-12 pb-8">
          <motion.div
            variants={fadeUp}
            custom={0}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between"
          >
            {/* Avatar + info */}
            <div className="flex items-start gap-5">
              {/* Avatar */}
              <div className="size-16 shrink-0 rounded-full bg-[#0066FF] flex items-center justify-center">
                {creator.avatarUrl ? (
                  <img
                    src={creator.avatarUrl}
                    alt={creator.name}
                    className="size-full rounded-full object-cover"
                  />
                ) : (
                  <span className="font-[var(--font-inter),Inter,sans-serif] text-2xl font-[800] text-white">
                    {initial}
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="flex flex-col gap-2">
                <h1 className="font-[var(--font-inter),Inter,sans-serif] text-[32px] font-[800] leading-none tracking-tight text-[#0A0A0A]">
                  {creator.name}
                </h1>
                {/* Badge especialidad */}
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center rounded-full border border-[#E5E7EB] bg-[#F8F8F8] px-2.5 py-0.5 font-[var(--font-inter),Inter,sans-serif] text-xs font-[500] text-[#0A0A0A]">
                    {creator.specialty}
                  </span>
                </div>
                {/* Bio */}
                <p className="max-w-md font-[var(--font-inter),Inter,sans-serif] text-sm text-[#6B7280] leading-relaxed line-clamp-2">
                  {creator.bio}
                </p>
                {/* Stats */}
                <p className="font-[var(--font-inter),Inter,sans-serif] text-xs text-[#6B7280]">
                  <span className="font-[600] text-[#0A0A0A]">{creator.subscribers.toLocaleString("es-CL")} suscriptores</span>
                  {" · "}
                  {creator.publishSchedule}
                  {" · "}
                  {creator.memberSince}
                </p>
              </div>
            </div>

            {/* CTA derecha */}
            <div className="flex flex-col items-start sm:items-end gap-1.5 shrink-0">
              <button className="rounded-lg bg-[#0066FF] px-5 py-2.5 font-[var(--font-inter),Inter,sans-serif] text-sm font-[600] text-white transition-all duration-150 hover:bg-[#0052CC] active:scale-[0.98] whitespace-nowrap">
                Suscribirse · {creator.priceLabel}
              </button>
              <span className="font-[var(--font-inter),Inter,sans-serif] text-xs text-[#6B7280]">
                Cancela cuando quieras
              </span>
            </div>
          </motion.div>
        </section>

        {/* Separador */}
        <div className="h-px bg-[#E5E7EB]" />

        {/* ── TABS ──────────────────────────────────────────────────────────── */}
        <section className="pt-8">
          <motion.div
            variants={fadeUp}
            custom={1}
            initial="hidden"
            animate="show"
            className="mb-6"
          >
            <SegmentedTabs active={activeTab} onChange={setActiveTab} />
          </motion.div>

          {/* Vista previa */}
          {activeTab === "preview" && (
            <motion.div
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25 }}
            >
              {/* Lista de artículos gratuitos */}
              <div className="rounded-xl border border-[#E5E7EB] bg-[#F8F8F8] overflow-hidden">
                {freeArticles.map((article, index) => (
                  <ArticleRow key={article.id} article={article} index={index} />
                ))}
              </div>

              {/* Contenido bloqueado */}
              <LockedContent creator={creator} />
            </motion.div>
          )}

          {/* Solo suscriptores */}
          {activeTab === "subscribers" && (
            <motion.div
              key="subscribers"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-xl border border-[#E5E7EB] bg-white p-12 text-center"
            >
              <div className="mx-auto mb-4 flex size-10 items-center justify-center rounded-full border border-[#E5E7EB] bg-[#F8F8F8]">
                <Lock className="size-4 text-[#6B7280]" />
              </div>
              <h4 className="mb-2 font-[var(--font-inter),Inter,sans-serif] text-base font-[700] tracking-tight text-[#0A0A0A]">
                Acceso exclusivo para suscriptores
              </h4>
              <p className="mb-6 font-[var(--font-inter),Inter,sans-serif] text-sm text-[#6B7280]">
                El archivo completo está disponible para los{" "}
                {creator.subscribers.toLocaleString("es-CL")} miembros activos.
              </p>
              <button className="rounded-lg bg-[#0066FF] px-6 py-2.5 font-[var(--font-inter),Inter,sans-serif] text-sm font-[600] text-white transition-all hover:bg-[#0052CC] active:scale-[0.98]">
                Suscribirse · {creator.priceLabel}
              </button>
            </motion.div>
          )}
        </section>

        {/* ── SOBRE EL CREADOR ─────────────────────────────────────────────── */}
        <section className="pt-16">
          <div className="h-px bg-[#E5E7EB] mb-12" />
          <motion.div
            variants={fadeUp}
            custom={0}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
          >
            <p className="mb-6 font-[var(--font-inter),Inter,sans-serif] text-xs font-[600] uppercase tracking-widest text-[#6B7280]">
              Sobre el creador
            </p>

            <div className="flex flex-col gap-8 sm:flex-row sm:gap-10">
              {/* Avatar grande */}
              <div className="size-16 shrink-0 rounded-full bg-[#0066FF] flex items-center justify-center">
                <span className="font-[var(--font-inter),Inter,sans-serif] text-2xl font-[800] text-white">
                  {initial}
                </span>
              </div>

              <div className="flex flex-col gap-4 flex-1">
                <div>
                  <h2 className="font-[var(--font-inter),Inter,sans-serif] text-xl font-[700] tracking-tight text-[#0A0A0A]">
                    {creator.name}
                  </h2>
                  {/* Credentials como pills */}
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {creator.credentials.map((cred) => (
                      <span
                        key={cred.label}
                        className="inline-flex items-center rounded-full border border-[#E5E7EB] bg-[#F8F8F8] px-2.5 py-0.5 font-[var(--font-inter),Inter,sans-serif] text-xs font-[500] text-[#0A0A0A]"
                      >
                        {cred.label}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="font-[var(--font-inter),Inter,sans-serif] text-sm text-[#6B7280] leading-relaxed">
                  {creator.bioLong}
                </p>

                {/* Por qué publica */}
                <div className="rounded-lg border border-[#E5E7EB] bg-white p-5">
                  <p className="mb-2 font-[var(--font-inter),Inter,sans-serif] text-xs font-[600] uppercase tracking-widest text-[#6B7280]">
                    Por qué publica en Sala
                  </p>
                  <p className="font-[var(--font-inter),Inter,sans-serif] text-sm text-[#0A0A0A] leading-relaxed">
                    &ldquo;{creator.whyPublish}&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ── CTA FINAL ────────────────────────────────────────────────────── */}
        <motion.section
          variants={fadeUp}
          custom={0}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          className="mt-16 rounded-xl border border-[#E5E7EB] bg-white px-8 py-12 text-center"
        >
          <p className="mb-2 font-[var(--font-inter),Inter,sans-serif] text-xs font-[600] uppercase tracking-widest text-[#6B7280]">
            Únete a {creator.subscribers.toLocaleString("es-CL")} suscriptores
          </p>
          <h3 className="mb-1 font-[var(--font-inter),Inter,sans-serif] text-2xl font-[800] tracking-tight text-[#0A0A0A]">
            Análisis que vale lo que cuesta
          </h3>
          <p className="mb-6 font-[var(--font-inter),Inter,sans-serif] text-sm text-[#6B7280]">
            Acceso completo al archivo y a cada nuevo número cada jueves.
          </p>
          <button className="mx-auto mb-4 block rounded-lg bg-[#0066FF] px-7 py-3 font-[var(--font-inter),Inter,sans-serif] text-sm font-[600] text-white transition-all hover:bg-[#0052CC] active:scale-[0.98]">
            Suscribirse · {creator.priceLabel}
          </button>
          <ul className="mx-auto flex justify-center gap-5">
            {creator.includes.map((item) => (
              <li key={item} className="flex items-center gap-1.5 font-[var(--font-inter),Inter,sans-serif] text-xs text-[#6B7280]">
                <Check className="size-3.5 shrink-0 text-[#0066FF]" />
                {item}
              </li>
            ))}
          </ul>
        </motion.section>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#E5E7EB] py-6">
        <div className="mx-auto max-w-4xl px-6 flex items-center justify-between">
          <span className="font-[var(--font-inter),Inter,sans-serif] text-sm font-[700] text-[#0A0A0A]">
            Sala
          </span>
          <span className="font-[var(--font-inter),Inter,sans-serif] text-xs text-[#6B7280]">
            Conocimiento profesional
          </span>
        </div>
      </footer>
    </main>
  )
}
