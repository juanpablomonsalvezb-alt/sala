import { safeJsonLd } from "@/lib/rateLimit"
import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Nebbuler vs Substack vs Patreon — Comparación para profesionales LATAM",
  description:
    "Compara las mejores plataformas para monetizar tu conocimiento en América Latina. Nebbuler cobra 0% de comisión y acepta MercadoPago.",
  keywords: [
    "alternativas substack español",
    "substack vs patreon latam",
    "plataforma creadores sin comisión",
    "monetizar conocimiento latinoamérica",
    "alternativas a substack en español",
    "mejor plataforma monetizar conocimiento latam",
    "plataforma newsletter español sin comision",
  ],
  alternates: { canonical: "https://nebbuler.com/comparar" },
  openGraph: {
    title: "Nebbuler vs Substack vs Patreon",
    description: "0% comisión. Pagos en pesos. 100% para ti.",
    type: "website",
    url: "https://nebbuler.com/comparar",
    images: [{ url: "/og-default.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nebbuler vs Substack vs Patreon",
    description: "0% comisión. Pagos en pesos. 100% para ti.",
  },
}

// ─── Schema JSON-LD ───────────────────────────────────────────────────────────

const FAQ_JSONLD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Nebbuler cobra comisión por suscriptor?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Nebbuler cobra una tarifa fija de $29.990 CLP al mes y el 100% de las suscripciones que cobres es tuyo, menos los cargos propios del procesador de pagos (MercadoPago). No hay comisión variable sobre tus ingresos.",
      },
    },
    {
      "@type": "Question",
      name: "¿Puedo recibir pagos en pesos chilenos, argentinos o mexicanos?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí. Nebbuler integra MercadoPago, lo que permite recibir pagos en CLP, ARS y MXN directamente. Substack, Patreon, Gumroad y Beehiiv solo operan en dólares, lo que añade fricciones para audiencias latinoamericanas.",
      },
    },
    {
      "@type": "Question",
      name: "¿Puedo migrar desde Substack a Nebbuler?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí. Puedes exportar tu lista de suscriptores desde Substack e importarla en Nebbuler. El proceso demora menos de una hora. El equipo de Nebbuler ofrece asistencia directa durante la migración.",
      },
    },
    {
      "@type": "Question",
      name: "¿Qué pasa si tengo pocos suscriptores, vale la pena?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Si tienes menos de 3 suscriptores pagos a $10.000 CLP, Substack sería más barato en términos absolutos. Pero a partir de los 4 suscriptores, la tarifa fija de Nebbuler ya empieza a ser más conveniente, y la brecha crece exponencialmente con cada suscriptor adicional.",
      },
    },
    {
      "@type": "Question",
      name: "¿Nebbuler está disponible en todos los países de LATAM?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Nebbuler opera en 18 países latinoamericanos: Chile, Colombia, México, Argentina, Perú, Ecuador, Venezuela, Costa Rica, Panamá, Guatemala, Honduras, El Salvador, Nicaragua, República Dominicana, Bolivia, Uruguay, Paraguay y Belice.",
      },
    },
  ],
}

const WEBPAGE_JSONLD = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Nebbuler vs Substack vs Patreon — Comparación para profesionales LATAM",
  description:
    "Comparativa detallada de plataformas para monetizar conocimiento en América Latina. Comisiones, pagos locales y soporte en español.",
  url: "https://nebbuler.com/comparar",
  inLanguage: "es",
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: "https://nebbuler.com" },
      { "@type": "ListItem", position: 2, name: "Comparar plataformas", item: "https://nebbuler.com/comparar" },
    ],
  },
}

// ─── Datos de la tabla ────────────────────────────────────────────────────────

const platforms = [
  { id: "nebbuler", label: "Nebbuler", highlight: true },
  { id: "substack", label: "Substack", highlight: false },
  { id: "patreon", label: "Patreon", highlight: false },
  { id: "gumroad", label: "Gumroad", highlight: false },
  { id: "beehiiv", label: "Beehiiv", highlight: false },
]

type CellValue = string | { yes: boolean }

const rows: { label: string; cells: CellValue[] }[] = [
  {
    label: "Comisión plataforma",
    cells: ["0%", "10%", "5–12%", "10%", "0% (plan pago)"],
  },
  {
    label: "Precio mensual",
    cells: ["$29.990 CLP", "Gratis*", "Gratis*", "Gratis*", "~$42 USD"],
  },
  {
    label: "Pagos en CLP / ARS / MXN",
    cells: [{ yes: true }, { yes: false }, { yes: false }, { yes: false }, { yes: false }],
  },
  {
    label: "Idioma plataforma",
    cells: ["Español", "Inglés", "Inglés", "Inglés", "Inglés"],
  },
  {
    label: "Soporte LATAM nativo",
    cells: [{ yes: true }, { yes: false }, { yes: false }, { yes: false }, { yes: false }],
  },
  {
    label: "Público objetivo",
    cells: ["Profesionales", "Periodistas", "Artistas", "Creadores", "Newsletters"],
  },
  {
    label: "Cursos y contenido",
    cells: [{ yes: true }, { yes: true }, { yes: true }, { yes: true }, { yes: false }],
  },
  {
    label: "Newsletter integrado",
    cells: [{ yes: true }, { yes: true }, { yes: false }, { yes: false }, { yes: true }],
  },
  {
    label: "MercadoPago",
    cells: [{ yes: true }, { yes: false }, { yes: false }, { yes: false }, { yes: false }],
  },
]

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="w-4 h-4 text-emerald-600 flex-shrink-0"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="8" cy="8" r="7.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M5 8.5l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CrossIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="w-4 h-4 text-red-400 flex-shrink-0"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="8" cy="8" r="7.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M6 6l4 4M10 6l-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function renderCell(value: CellValue, isHighlight: boolean) {
  if (typeof value === "object" && "yes" in value) {
    return (
      <span className="flex justify-center">
        {value.yes ? <CheckIcon /> : <CrossIcon />}
      </span>
    )
  }
  // String cell — bold zero-commission on Nebbuler column
  if (isHighlight && value === "0%") {
    return <span className="font-bold text-base">{value}</span>
  }
  return <span>{value}</span>
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CompararPage() {
  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(FAQ_JSONLD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(WEBPAGE_JSONLD) }}
      />

      <main className="min-h-screen bg-white text-[#121212]">
        {/* Barra roja */}
        <div className="h-[3px] w-full bg-[#C41C1C]" />

        {/* Nav mínimo */}
        <header className="border-b border-[#DEDEDE]">
          <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
            <Link
              href="/"
              className="font-serif font-bold text-[22px] tracking-[-0.02em] text-[#121212] hover:text-[#C41C1C] transition-colors"
            >
              NEBBULER
            </Link>
            <nav className="hidden sm:flex items-center gap-1 text-[11px] font-sans text-[#666]">
              {[
                { label: "Explorar", href: "/directorio" },
                { label: "Precios", href: "/precios" },
                { label: "Para creadores", href: "/para-creadores" },
              ].map((item, i) => (
                <span key={item.label} className="flex items-center gap-1">
                  {i > 0 && <span className="text-[#DEDEDE] px-1">·</span>}
                  <Link
                    href={item.href}
                    className="hover:text-[#121212] transition-colors uppercase tracking-[0.08em]"
                  >
                    {item.label}
                  </Link>
                </span>
              ))}
            </nav>
          </div>
        </header>

        {/* ── 1. HERO ─────────────────────────────────────────────────────── */}
        <section className="max-w-4xl mx-auto px-6 pt-16 pb-12 sm:pt-24 sm:pb-16">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center gap-2 text-[11px] font-sans text-[#999] uppercase tracking-[0.1em]">
              <li>
                <Link href="/" className="hover:text-[#121212] transition-colors">
                  Inicio
                </Link>
              </li>
              <li aria-hidden="true" className="text-[#DEDEDE]">/</li>
              <li className="text-[#666]">Comparar plataformas</li>
            </ol>
          </nav>

          {/* Eyebrow */}
          <p className="font-sans text-[11px] uppercase tracking-[0.15em] text-[#C41C1C] mb-5">
            Comparativa · Actualizado mayo 2026
          </p>

          {/* H1 */}
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#121212] leading-[1.18] tracking-[-0.02em] mb-6 max-w-3xl">
            Nebbuler vs Substack vs Patreon: ¿Cuál plataforma te conviene si eres profesional en LATAM?
          </h1>

          <div className="w-10 h-[2px] bg-[#C41C1C] mb-6" />

          <p className="font-sans text-base sm:text-lg text-[#555] leading-relaxed max-w-2xl mb-10">
            Comparamos comisiones, pagos locales y soporte en español para que elijas con información real. No todas las plataformas son iguales cuando cobras en pesos.
          </p>

          {/* CTA hero */}
          <Link
            href="/registro"
            className="inline-flex items-center gap-2 bg-[#121212] text-white font-sans text-sm px-8 py-3.5 hover:bg-[#C41C1C] transition-colors duration-200"
          >
            Crear mi portal gratis
            <span aria-hidden="true">→</span>
          </Link>
        </section>

        {/* Divisor */}
        <div className="max-w-4xl mx-auto px-6">
          <div className="w-full h-px bg-[#F0F0F0]" />
        </div>

        {/* ── 2. TABLA ────────────────────────────────────────────────────── */}
        <section
          className="max-w-5xl mx-auto px-4 sm:px-6 py-14 sm:py-20"
          aria-label="Tabla comparativa de plataformas"
        >
          <h2 className="font-serif text-2xl sm:text-3xl text-[#121212] mb-2 tracking-[-0.01em]">
            Comparación completa
          </h2>
          <p className="font-sans text-sm text-[#888] mb-8">
            *Substack, Patreon y Gumroad son &quot;gratis&quot; pero cobran comisión sobre cada pago recibido.
          </p>

          {/* Scroll wrapper para mobile */}
          <div className="overflow-x-auto -mx-4 sm:mx-0 pb-2">
            <table className="w-full border-collapse min-w-[640px]" role="table">
              {/* Header sticky */}
              <thead>
                <tr>
                  {/* Columna vacía de característica */}
                  <th
                    scope="col"
                    className="text-left py-3 px-4 font-sans text-[10px] uppercase tracking-[0.12em] text-[#999] border-b border-[#F0F0F0] bg-white w-[200px] min-w-[160px]"
                  >
                    Característica
                  </th>
                  {platforms.map((p) => (
                    <th
                      key={p.id}
                      scope="col"
                      className={`text-center py-3 px-3 font-sans text-[11px] uppercase tracking-[0.1em] border-b ${
                        p.highlight
                          ? "bg-[#121212] text-white border-[#121212]"
                          : "bg-white text-[#999] border-[#F0F0F0]"
                      }`}
                    >
                      {p.highlight && (
                        <span className="block text-[9px] text-emerald-400 mb-0.5 uppercase tracking-[0.15em]">
                          Recomendado
                        </span>
                      )}
                      {p.label}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {rows.map((row, ri) => (
                  <tr
                    key={row.label}
                    className={ri % 2 === 0 ? "bg-white" : "bg-[#FAFAFA]"}
                  >
                    <td className="py-3.5 px-4 font-sans text-sm text-[#444] border-b border-[#F0F0F0]">
                      {row.label}
                    </td>
                    {platforms.map((p, pi) => (
                      <td
                        key={p.id}
                        className={`py-3.5 px-3 text-center font-sans text-sm border-b ${
                          p.highlight
                            ? "bg-[#121212] text-white border-[#1A1A1A]"
                            : "text-[#444] border-[#F0F0F0]"
                        }`}
                      >
                        {renderCell(row.cells[pi], p.highlight)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="font-sans text-[11px] text-[#AAAAAA] mt-3">
            Datos verificados en mayo 2026. Los precios en USD corresponden a tarifas oficiales publicadas por cada plataforma.
          </p>
        </section>

        {/* Divisor */}
        <div className="max-w-4xl mx-auto px-6">
          <div className="w-full h-px bg-[#F0F0F0]" />
        </div>

        {/* ── 3. PROBLEMA CON LAS PLATAFORMAS GRINGAS ─────────────────────── */}
        <section className="max-w-4xl mx-auto px-6 py-14 sm:py-20">
          <p className="font-sans text-[11px] uppercase tracking-[0.15em] text-[#C41C1C] mb-4">
            El problema
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#121212] mb-10 tracking-[-0.01em]">
            Por qué las plataformas gringas no funcionan bien en LATAM
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="border border-[#E8E8E8] p-6 bg-white">
              <div className="w-8 h-8 flex items-center justify-center bg-[#FFF5F5] border border-[#FECACA] mb-4">
                <span className="font-serif text-lg text-[#C41C1C]" aria-hidden="true">$</span>
              </div>
              <h3 className="font-serif text-lg text-[#121212] mb-3 leading-snug">
                Cobran en dólares
              </h3>
              <p className="font-sans text-sm text-[#666] leading-relaxed">
                Si tus suscriptores están en Chile, Argentina o México, pagar en USD es una barrera real. El tipo de cambio fluctúa, las tarjetas tienen recargos internacionales y muchos lectores no tienen tarjetas habilitadas para pagos en moneda extranjera.
              </p>
            </div>

            {/* Card 2 */}
            <div className="border border-[#E8E8E8] p-6 bg-white">
              <div className="w-8 h-8 flex items-center justify-center bg-[#FFF5F5] border border-[#FECACA] mb-4">
                <span className="font-serif text-lg text-[#C41C1C]" aria-hidden="true">%</span>
              </div>
              <h3 className="font-serif text-lg text-[#121212] mb-3 leading-snug">
                Se quedan con el 10%
              </h3>
              <p className="font-sans text-sm text-[#666] leading-relaxed">
                En Substack, de cada $100 que cobras, $10 van a ellos para siempre. No importa si llevas 1 año o 10. No importa si tienes 10 suscriptores o 10.000. La comisión escala contigo y te castiga por crecer.
              </p>
            </div>

            {/* Card 3 */}
            <div className="border border-[#E8E8E8] p-6 bg-white">
              <div className="w-8 h-8 flex items-center justify-center bg-[#FFF5F5] border border-[#FECACA] mb-4">
                <span className="font-serif text-lg text-[#121212]" aria-hidden="true">?</span>
              </div>
              <h3 className="font-serif text-lg text-[#121212] mb-3 leading-snug">
                No entienden LATAM
              </h3>
              <p className="font-sans text-sm text-[#666] leading-relaxed">
                Sin MercadoPago, sin pesos, sin soporte en español. Sus equipos están en Nueva York o San Francisco. Las realidades de cobro en Argentina, Chile o México no están en su roadmap.
              </p>
            </div>
          </div>
        </section>

        {/* Divisor */}
        <div className="max-w-4xl mx-auto px-6">
          <div className="w-full h-px bg-[#F0F0F0]" />
        </div>

        {/* ── 4. CALCULADORA DE AHORRO (estática) ─────────────────────────── */}
        <section className="max-w-4xl mx-auto px-6 py-14 sm:py-20">
          <p className="font-sans text-[11px] uppercase tracking-[0.15em] text-[#C41C1C] mb-4">
            Ejemplo concreto
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#121212] mb-3 tracking-[-0.01em]">
            ¿Cuánto ahorras con Nebbuler?
          </h2>
          <p className="font-sans text-sm text-[#888] mb-10">
            Supongamos que tienes 100 suscriptores pagando $10.000 CLP al mes cada uno.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {/* Con Substack */}
            <div className="border border-[#FECACA] bg-[#FFF5F5] p-6">
              <p className="font-sans text-[10px] uppercase tracking-[0.12em] text-[#C41C1C] mb-3">
                Con Substack (10% comisión)
              </p>
              <div className="space-y-2 font-sans text-sm text-[#444]">
                <div className="flex justify-between">
                  <span>Ingresos brutos</span>
                  <span className="font-medium text-[#121212]">$1.000.000 CLP</span>
                </div>
                <div className="flex justify-between text-[#C41C1C]">
                  <span>Comisión Substack (10%)</span>
                  <span className="font-medium">−$100.000 CLP</span>
                </div>
                <div className="flex justify-between text-[#C41C1C]">
                  <span>Comisión procesador (~3%)</span>
                  <span className="font-medium">−$30.000 CLP</span>
                </div>
                <div className="w-full h-px bg-[#FECACA] my-2" />
                <div className="flex justify-between font-semibold text-[#121212]">
                  <span>Lo que recibes</span>
                  <span>$870.000 CLP</span>
                </div>
                <div className="flex justify-between font-bold text-[#C41C1C] text-base pt-1">
                  <span>Costo mensual real</span>
                  <span>$130.000 CLP</span>
                </div>
              </div>
            </div>

            {/* Con Nebbuler */}
            <div className="border border-[#D1FAE5] bg-[#F0FDF4] p-6">
              <p className="font-sans text-[10px] uppercase tracking-[0.12em] text-emerald-700 mb-3">
                Con Nebbuler (tarifa fija)
              </p>
              <div className="space-y-2 font-sans text-sm text-[#444]">
                <div className="flex justify-between">
                  <span>Ingresos brutos</span>
                  <span className="font-medium text-[#121212]">$1.000.000 CLP</span>
                </div>
                <div className="flex justify-between text-[#666]">
                  <span>Comisión Nebbuler</span>
                  <span className="font-medium text-emerald-700">$0 CLP</span>
                </div>
                <div className="flex justify-between text-[#666]">
                  <span>Comisión procesador (~3%)</span>
                  <span className="font-medium">−$30.000 CLP</span>
                </div>
                <div className="flex justify-between text-[#666]">
                  <span>Tarifa Nebbuler</span>
                  <span className="font-medium">−$29.990 CLP</span>
                </div>
                <div className="w-full h-px bg-[#A7F3D0] my-2" />
                <div className="flex justify-between font-semibold text-[#121212]">
                  <span>Lo que recibes</span>
                  <span>$940.010 CLP</span>
                </div>
                <div className="flex justify-between font-bold text-emerald-700 text-base pt-1">
                  <span>Costo mensual real</span>
                  <span>$59.990 CLP</span>
                </div>
              </div>
            </div>
          </div>

          {/* Ahorro anual resaltado */}
          <div className="bg-[#121212] text-white p-6 sm:p-8">
            <p className="font-sans text-[10px] uppercase tracking-[0.15em] text-[#AAAAAA] mb-4">
              Ahorro acumulado
            </p>
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-8">
              <div>
                <p className="font-serif text-4xl sm:text-5xl font-bold text-white leading-none mb-1">
                  $840.120
                </p>
                <p className="font-sans text-sm text-[#AAAAAA]">
                  CLP ahorrados al año con Nebbuler vs Substack
                </p>
              </div>
              <div className="sm:border-l sm:border-[#333] sm:pl-8">
                <p className="font-sans text-sm text-[#AAAAAA] mb-1">Equivale a</p>
                <p className="font-serif text-2xl text-emerald-400 font-bold">
                  70 meses gratis
                </p>
                <p className="font-sans text-xs text-[#666] mt-0.5">
                  de tarifa Nebbuler recuperados
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Divisor */}
        <div className="max-w-4xl mx-auto px-6">
          <div className="w-full h-px bg-[#F0F0F0]" />
        </div>

        {/* ── 5. FAQ ───────────────────────────────────────────────────────── */}
        <section className="max-w-3xl mx-auto px-6 py-14 sm:py-20">
          <p className="font-sans text-[11px] uppercase tracking-[0.15em] text-[#C41C1C] mb-4">
            Preguntas frecuentes
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#121212] mb-10 tracking-[-0.01em]">
            Lo que más nos preguntan
          </h2>

          <dl className="space-y-0">
            {[
              {
                q: "¿Nebbuler cobra comisión por suscriptor?",
                a: "No. Nebbuler cobra una tarifa fija de $29.990 CLP al mes y el 100% de las suscripciones que cobres es tuyo, menos los cargos propios del procesador de pagos (MercadoPago). No hay comisión variable sobre tus ingresos.",
              },
              {
                q: "¿Puedo recibir pagos en pesos chilenos, argentinos o mexicanos?",
                a: "Sí. Nebbuler integra MercadoPago, lo que permite recibir pagos en CLP, ARS y MXN directamente. Substack, Patreon, Gumroad y Beehiiv solo operan en dólares, lo que añade fricciones para audiencias latinoamericanas.",
              },
              {
                q: "¿Puedo migrar desde Substack a Nebbuler?",
                a: "Sí. Puedes exportar tu lista de suscriptores desde Substack e importarla en Nebbuler. El proceso demora menos de una hora. El equipo de Nebbuler ofrece asistencia directa durante la migración.",
              },
              {
                q: "¿Qué pasa si tengo pocos suscriptores, vale la pena?",
                a: "Si tienes menos de 3 suscriptores pagos a $10.000 CLP, Substack sería más barato en términos absolutos. Pero a partir de los 4 suscriptores, la tarifa fija de Nebbuler ya empieza a ser más conveniente, y la brecha crece exponencialmente con cada suscriptor adicional.",
              },
              {
                q: "¿Nebbuler está disponible en todos los países de LATAM?",
                a: "Nebbuler opera en 18 países latinoamericanos: Chile, Colombia, México, Argentina, Perú, Ecuador, Venezuela, Costa Rica, Panamá, Guatemala, Honduras, El Salvador, Nicaragua, República Dominicana, Bolivia, Uruguay, Paraguay y Belice.",
              },
            ].map((item, i) => (
              <div key={i} className="border-b border-[#F0F0F0] py-6 first:border-t">
                <dt className="font-serif text-lg text-[#121212] mb-3 leading-snug">
                  {item.q}
                </dt>
                <dd className="font-sans text-sm text-[#555] leading-relaxed">
                  {item.a}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Divisor */}
        <div className="max-w-4xl mx-auto px-6">
          <div className="w-full h-px bg-[#F0F0F0]" />
        </div>

        {/* ── 6. CTA FINAL ─────────────────────────────────────────────────── */}
        <section className="max-w-4xl mx-auto px-6 py-16 sm:py-24 text-center">
          <p className="font-sans text-[11px] uppercase tracking-[0.15em] text-[#C41C1C] mb-5">
            Da el paso
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#121212] mb-4 tracking-[-0.02em]">
            Empieza gratis.
            <br />
            <span className="text-[#C41C1C]">Sin comisión. Sin letra chica.</span>
          </h2>
          <p className="font-sans text-base text-[#666] mb-10 max-w-lg mx-auto leading-relaxed">
            Abre tu portal profesional en Nebbuler hoy. 0% de comisión, pagos en pesos, soporte en español. Tu conocimiento vale —&nbsp;y ahora también cobra.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
            <Link
              href="/registro"
              className="inline-flex items-center gap-2 bg-[#121212] text-white font-sans text-sm px-10 py-4 hover:bg-[#C41C1C] transition-colors duration-200"
            >
              Crear mi portal gratis
              <span aria-hidden="true">→</span>
            </Link>
            <Link
              href="/precios"
              className="inline-flex items-center gap-2 border border-[#DEDEDE] text-[#444] font-sans text-sm px-8 py-4 hover:border-[#121212] hover:text-[#121212] transition-colors duration-200"
            >
              Ver precios
            </Link>
          </div>
          <p className="font-sans text-xs text-[#AAAAAA] mt-5">
            Sin tarjeta de crédito requerida para comenzar.
          </p>
        </section>

        {/* ── FOOTER ───────────────────────────────────────────────────────── */}
        <footer className="border-t border-[#F0F0F0] px-6 py-8">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <Link
              href="/"
              className="font-sans text-sm text-[#999] hover:text-[#121212] transition-colors"
            >
              ← Volver al inicio
            </Link>
            <div className="flex flex-wrap gap-4 text-[11px] font-sans text-[#AAAAAA]">
              <Link href="/precios" className="hover:text-[#121212] transition-colors">Precios</Link>
              <Link href="/para-creadores" className="hover:text-[#121212] transition-colors">Para creadores</Link>
              <Link href="/faq" className="hover:text-[#121212] transition-colors">FAQ</Link>
              <Link href="/terminos" className="hover:text-[#121212] transition-colors">Términos</Link>
              <Link href="/privacidad" className="hover:text-[#121212] transition-colors">Privacidad</Link>
            </div>
          </div>
        </footer>
      </main>
    </>
  )
}
