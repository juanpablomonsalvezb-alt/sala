"use client"

import { motion, type Variants } from "framer-motion"
import { Lock, CheckCircle, ArrowRight, Users, Calendar, Clock } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"

// ─── Tipos ──────────────────────────────────────────────────────────────────

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

// ─── Datos del creador ───────────────────────────────────────────────────────

const creator: Creator = {
  slug: "rodrigo-fuentes",
  name: "Rodrigo Fuentes",
  specialty: "Economía · Mercados · Análisis Financiero",
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
      date: "12 mayo 2025",
      excerpt:
        "El dólar no sube ni baja por las razones que los medios te dicen. Hay tres factores estructurales que casi nadie menciona y que determinan el 80% del movimiento.",
      free: true,
    },
    {
      id: "2",
      title: "El efecto silencioso de la tasa de política monetaria en tu cartera",
      date: "5 mayo 2025",
      excerpt:
        "Cuando el Banco Central mueve la TPM, el impacto no es inmediato ni uniforme. Aquí el mapa completo de cómo se propaga y qué activos sufren primero.",
      free: true,
    },
    {
      id: "3",
      title: "Cobre, litio y el error de análisis que cometen los medios",
      date: "28 abril 2025",
      excerpt:
        "Chile exporta recursos, pero los medios reportan sus precios como si fueran commodities intercambiables. No lo son. La diferencia importa y afecta proyecciones completas.",
      free: true,
    },
    {
      id: "4",
      title: "Inflación importada: el canal que nadie ve venir",
      date: "21 abril 2025",
      excerpt:
        "Más allá del IPC doméstico, existe un vector de presión inflacionaria que cruza fronteras silenciosamente. Los bancos centrales lo saben. El mercado retail, no.",
      free: false,
    },
    {
      id: "5",
      title: "Por qué las reservas del Banco Central no son lo que parecen",
      date: "14 abril 2025",
      excerpt:
        "El titular dice 'reservas récord'. El análisis dice otra cosa. Desglose de composición, liquidez real y lo que el número gordo oculta.",
      free: false,
    },
  ],
  credentials: [
    { label: "Master en Economía UC" },
    { label: "12 años en banca de inversión" },
    { label: "Ex Bloomberg LP" },
  ],
  includes: [
    "Análisis semanal cada jueves",
    "Archivo completo desde el primer número",
    "Cancela cuando quieras",
  ],
}

// ─── Animaciones ─────────────────────────────────────────────────────────────

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: "easeOut" },
  }),
}

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
}

// ─── Componente ArticleCard ───────────────────────────────────────────────────

function ArticleCard({ article, index }: { article: Article; index: number }) {
  return (
    <motion.article
      custom={index}
      variants={fadeUp}
      initial="hidden"
      animate="show"
      className="group border-b border-[#1E1E1E] py-8 last:border-0"
    >
      <div className="flex flex-col gap-3">
        {/* Fecha */}
        <span className="font-sans text-xs font-semibold uppercase tracking-widest text-[#C9A96E]">
          {article.date}
        </span>

        {/* Título */}
        <h3
          className="font-serif text-2xl font-semibold leading-tight text-[#F5F0E8] transition-colors duration-200 group-hover:text-[#C9A96E]"
          style={{ fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif" }}
        >
          {article.title}
        </h3>

        {/* Extracto */}
        <p className="font-sans text-sm leading-relaxed text-[#8A8070] line-clamp-2">
          {article.excerpt}
        </p>

        {/* CTA */}
        {article.free && (
          <div className="mt-1 flex items-center gap-2">
            <span className="font-sans text-sm font-medium text-[#C9A96E] transition-all duration-200 group-hover:gap-3 flex items-center gap-1.5">
              Leer
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
            </span>
          </div>
        )}
      </div>
    </motion.article>
  )
}

// ─── Componente LockedContent ─────────────────────────────────────────────────

function LockedContent({ creator }: { creator: Creator }) {
  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="show"
      className="relative mt-2 overflow-hidden rounded-2xl border border-[#1E1E1E]"
    >
      {/* Artículo fantasma con blur */}
      <div className="pointer-events-none select-none blur-sm opacity-40 px-8 py-8 border-b border-[#1E1E1E]">
        <span className="font-sans text-xs font-semibold uppercase tracking-widest text-[#C9A96E]">
          21 abril 2025
        </span>
        <h3
          className="mt-3 font-serif text-2xl font-semibold text-[#F5F0E8]"
          style={{ fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif" }}
        >
          Inflación importada: el canal que nadie ve venir
        </h3>
        <p className="mt-2 font-sans text-sm text-[#8A8070]">
          Más allá del IPC doméstico, existe un vector de presión inflacionaria que cruza fronteras silenciosamente...
        </p>
      </div>

      {/* Overlay de bloqueo */}
      <div className="relative bg-gradient-to-b from-[#111111]/60 via-[#111111]/95 to-[#111111] px-8 py-10 flex flex-col items-center text-center gap-6 backdrop-blur-sm">
        {/* Ícono */}
        <div className="flex size-14 items-center justify-center rounded-full border border-[#C9A96E]/30 bg-[#C9A96E]/10">
          <Lock className="size-6 text-[#C9A96E]" />
        </div>

        <div className="flex flex-col gap-2 max-w-md">
          <h4
            className="font-serif text-2xl font-semibold text-[#F5F0E8]"
            style={{ fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif" }}
          >
            Este contenido es exclusivo para suscriptores
          </h4>
          <p className="font-sans text-sm text-[#8A8070]">
            {creator.subscribers.toLocaleString("es-CL")} profesionales ya tienen acceso al archivo completo.
          </p>
        </div>

        {/* Botón CTA */}
        <button className="w-full max-w-xs rounded-xl bg-[#C9A96E] px-6 py-4 font-sans text-base font-semibold text-[#0A0A0A] transition-all duration-200 hover:bg-[#D4B87A] hover:shadow-[0_0_24px_rgba(201,169,110,0.25)] active:scale-[0.98]">
          Suscribirse ahora → {creator.priceLabel}
        </button>

        {/* Lista de beneficios */}
        <ul className="flex flex-col gap-2 text-left">
          {creator.includes.map((item) => (
            <li key={item} className="flex items-center gap-2.5 font-sans text-sm text-[#F5F0E8]/80">
              <CheckCircle className="size-4 shrink-0 text-[#C9A96E]" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  )
}

// ─── Página principal ─────────────────────────────────────────────────────────

export default function CreatorPage() {
  const freeArticles = creator.articles.filter((a) => a.free)

  return (
    <main className="min-h-screen bg-[#0A0A0A]">
      {/* Barra superior */}
      <nav className="sticky top-0 z-50 border-b border-[#1E1E1E] bg-[#0A0A0A]/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-6">
          <span
            className="font-serif text-xl font-semibold tracking-tight text-[#F5F0E8]"
            style={{ fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif" }}
          >
            Sala
          </span>
          <button className="rounded-lg border border-[#C9A96E]/40 bg-transparent px-4 py-1.5 font-sans text-sm font-medium text-[#C9A96E] transition-colors hover:bg-[#C9A96E]/10">
            Iniciar sesión
          </button>
        </div>
      </nav>

      <div className="mx-auto max-w-4xl px-6 pb-24">

        {/* ── 1. HERO DEL CREADOR ─────────────────────────────────────────── */}
        <section className="pt-16 pb-12">
          <motion.div
            variants={fadeUp}
            custom={0}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-8 sm:flex-row sm:items-start sm:gap-10"
          >
            {/* Avatar grande */}
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="size-28 sm:size-32 rounded-full border-2 border-[#C9A96E]/40 bg-gradient-to-br from-[#C9A96E] to-[#A07A45] flex items-center justify-center shadow-[0_0_40px_rgba(201,169,110,0.15)]">
                  {creator.avatarUrl ? (
                    <img
                      src={creator.avatarUrl}
                      alt={creator.name}
                      className="size-full rounded-full object-cover"
                    />
                  ) : (
                    <span
                      className="font-serif text-5xl font-semibold text-[#0A0A0A]"
                      style={{ fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif" }}
                    >
                      {creator.name.charAt(0)}
                    </span>
                  )}
                </div>
                {/* Indicador activo */}
                <span className="absolute bottom-1 right-1 size-3.5 rounded-full border-2 border-[#0A0A0A] bg-emerald-500" />
              </div>
            </div>

            {/* Info del creador */}
            <div className="flex flex-col gap-4 flex-1 min-w-0">
              {/* Especialidad */}
              <span className="font-sans text-xs font-bold uppercase tracking-[0.15em] text-[#C9A96E]">
                {creator.specialty}
              </span>

              {/* Nombre */}
              <h1
                className="font-serif text-4xl sm:text-5xl font-semibold leading-none text-[#F5F0E8]"
                style={{ fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif" }}
              >
                {creator.name}
              </h1>

              {/* Bio corta */}
              <p className="font-sans text-[#8A8070] text-base leading-relaxed max-w-xl">
                {creator.bio}
              </p>

              {/* Stats en línea */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-sans text-sm text-[#8A8070]">
                <span className="flex items-center gap-1.5">
                  <Users className="size-3.5 text-[#C9A96E]" />
                  <strong className="text-[#F5F0E8]">
                    {creator.subscribers.toLocaleString("es-CL")}
                  </strong>{" "}
                  suscriptores
                </span>
                <span className="text-[#1E1E1E]">·</span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="size-3.5 text-[#C9A96E]" />
                  {creator.publishSchedule}
                </span>
                <span className="text-[#1E1E1E]">·</span>
                <span className="flex items-center gap-1.5">
                  <Clock className="size-3.5 text-[#C9A96E]" />
                  {creator.memberSince}
                </span>
              </div>

              {/* CTA suscripción */}
              <div className="mt-2 flex flex-col gap-2">
                <button className="w-fit rounded-xl bg-[#C9A96E] px-7 py-3.5 font-sans text-base font-semibold text-[#0A0A0A] transition-all duration-200 hover:bg-[#D4B87A] hover:shadow-[0_0_28px_rgba(201,169,110,0.3)] active:scale-[0.98]">
                  Suscribirse · {creator.priceLabel}
                </button>
                <p className="font-sans text-xs text-[#8A8070]">
                  Cancela cuando quieras. Acceso inmediato.
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        <Separator className="bg-[#1E1E1E]" />

        {/* ── 2 & 3 & 4. TABS DE CONTENIDO ────────────────────────────────── */}
        <section className="pt-10">
          <Tabs defaultValue="preview">
            {/* Tab list */}
            <motion.div
              variants={fadeUp}
              custom={1}
              initial="hidden"
              animate="show"
            >
              <TabsList
                variant="line"
                className="mb-8 border-b border-[#1E1E1E] rounded-none bg-transparent w-full justify-start gap-0 pb-0 h-auto"
              >
                <TabsTrigger
                  value="preview"
                  className="rounded-none pb-3 px-0 mr-8 font-sans text-sm font-semibold text-[#8A8070] data-active:text-[#F5F0E8] data-active:border-b-2 data-active:border-[#C9A96E] transition-colors hover:text-[#F5F0E8] after:bg-[#C9A96E]"
                >
                  Vista previa
                </TabsTrigger>
                <TabsTrigger
                  value="subscribers"
                  className="rounded-none pb-3 px-0 font-sans text-sm font-semibold text-[#8A8070] data-active:text-[#F5F0E8] transition-colors hover:text-[#F5F0E8] flex items-center gap-2"
                >
                  <Lock className="size-3.5 text-[#C9A96E]" />
                  Suscriptores
                </TabsTrigger>
              </TabsList>
            </motion.div>

            {/* Tab: Vista previa */}
            <TabsContent value="preview">
              <div>
                {/* Artículos gratuitos */}
                {freeArticles.map((article, index) => (
                  <ArticleCard key={article.id} article={article} index={index} />
                ))}

                {/* Contenido bloqueado */}
                <div className="mt-6">
                  <LockedContent creator={creator} />
                </div>
              </div>
            </TabsContent>

            {/* Tab: Suscriptores (bloqueado) */}
            <TabsContent value="subscribers">
              <motion.div
                variants={fadeIn}
                initial="hidden"
                animate="show"
                className="flex flex-col items-center justify-center gap-6 py-20 text-center"
              >
                <div className="flex size-16 items-center justify-center rounded-full border border-[#C9A96E]/30 bg-[#C9A96E]/10">
                  <Lock className="size-7 text-[#C9A96E]" />
                </div>
                <div className="flex flex-col gap-2 max-w-sm">
                  <h4
                    className="font-serif text-2xl font-semibold text-[#F5F0E8]"
                    style={{ fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif" }}
                  >
                    Solo para suscriptores
                  </h4>
                  <p className="font-sans text-sm text-[#8A8070]">
                    El archivo completo está disponible para los{" "}
                    {creator.subscribers.toLocaleString("es-CL")} miembros activos.
                  </p>
                </div>
                <button className="rounded-xl bg-[#C9A96E] px-6 py-3.5 font-sans text-sm font-semibold text-[#0A0A0A] transition-all hover:bg-[#D4B87A] hover:shadow-[0_0_24px_rgba(201,169,110,0.25)] active:scale-[0.98]">
                  Suscribirse → {creator.priceLabel}
                </button>
              </motion.div>
            </TabsContent>
          </Tabs>
        </section>

        <Separator className="mt-12 bg-[#1E1E1E]" />

        {/* ── 5. SOBRE EL CREADOR ──────────────────────────────────────────── */}
        <section className="pt-14 pb-8">
          <motion.div
            variants={fadeUp}
            custom={0}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="flex flex-col gap-10"
          >
            {/* Encabezado */}
            <div className="flex flex-col gap-1">
              <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#C9A96E]">
                Sobre el autor
              </span>
              <h2
                className="font-serif text-3xl font-semibold text-[#F5F0E8]"
                style={{ fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif" }}
              >
                {creator.name}
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
              {/* Bio larga */}
              <motion.div
                variants={fadeUp}
                custom={1}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="flex flex-col gap-4"
              >
                <p className="font-sans text-base leading-relaxed text-[#8A8070]">
                  {creator.bioLong}
                </p>

                {/* Credenciales */}
                <div className="mt-2 flex flex-col gap-2">
                  {creator.credentials.map((cred) => (
                    <div key={cred.label} className="flex items-center gap-2.5">
                      <span className="size-1 rounded-full bg-[#C9A96E] flex-shrink-0" />
                      <span className="font-sans text-sm text-[#F5F0E8]/70">{cred.label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Por qué publico en Sala */}
              <motion.div
                variants={fadeUp}
                custom={2}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="flex flex-col gap-4 rounded-2xl border border-[#1E1E1E] bg-[#111111] p-7"
              >
                <div className="flex flex-col gap-1">
                  <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#C9A96E]">
                    Por qué publico en Sala
                  </span>
                </div>
                <blockquote className="font-serif text-lg font-medium italic leading-relaxed text-[#F5F0E8]/80"
                  style={{ fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif" }}
                >
                  &ldquo;{creator.whyPublish}&rdquo;
                </blockquote>
                <div className="mt-auto flex items-center gap-3 pt-4 border-t border-[#1E1E1E]">
                  <div className="size-9 rounded-full bg-gradient-to-br from-[#C9A96E] to-[#A07A45] flex items-center justify-center flex-shrink-0">
                    <span
                      className="font-serif text-base font-semibold text-[#0A0A0A]"
                      style={{ fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif" }}
                    >
                      {creator.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-sans text-sm font-semibold text-[#F5F0E8]">
                      {creator.name}
                    </span>
                    <span className="font-sans text-xs text-[#8A8070]">
                      {creator.memberSince}
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* ── CTA FINAL ───────────────────────────────────────────────────── */}
        <motion.section
          variants={fadeUp}
          custom={0}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-6 rounded-2xl border border-[#C9A96E]/20 bg-gradient-to-br from-[#111111] to-[#0F0F0F] px-8 py-12 text-center"
        >
          <div className="mx-auto flex max-w-md flex-col items-center gap-5">
            <div className="flex flex-col gap-2">
              <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#C9A96E]">
                Únete a {creator.subscribers.toLocaleString("es-CL")} suscriptores
              </span>
              <h3
                className="font-serif text-3xl font-semibold text-[#F5F0E8]"
                style={{ fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif" }}
              >
                Análisis que vale lo que cuesta
              </h3>
              <p className="font-sans text-sm text-[#8A8070]">
                Acceso completo al archivo y a cada nuevo número cada jueves.
              </p>
            </div>

            <button className="w-full rounded-xl bg-[#C9A96E] px-7 py-4 font-sans text-base font-semibold text-[#0A0A0A] transition-all duration-200 hover:bg-[#D4B87A] hover:shadow-[0_0_32px_rgba(201,169,110,0.3)] active:scale-[0.98]">
              Suscribirse · {creator.priceLabel}
            </button>

            <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2">
              {creator.includes.map((item) => (
                <li key={item} className="flex items-center gap-1.5 font-sans text-xs text-[#8A8070]">
                  <CheckCircle className="size-3.5 flex-shrink-0 text-[#C9A96E]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </motion.section>
      </div>

      {/* Footer mínimo */}
      <footer className="border-t border-[#1E1E1E] py-8">
        <div className="mx-auto max-w-4xl px-6 flex items-center justify-between">
          <span
            className="font-serif text-lg font-semibold text-[#F5F0E8]/40"
            style={{ fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif" }}
          >
            Sala
          </span>
          <span className="font-sans text-xs text-[#8A8070]">
            Conocimiento profesional premium
          </span>
        </div>
      </footer>
    </main>
  )
}
