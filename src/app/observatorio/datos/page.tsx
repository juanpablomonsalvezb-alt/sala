import type { Metadata } from 'next'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { creators } from '@/data/creators'

export const metadata: Metadata = {
  title: 'Datos Económicos Chile y LATAM 2026 — Observatorio Nebbuler',
  description:
    'Indicadores macroeconómicos, datos de salud y análisis cuantitativos de Chile y Latinoamérica. Fuentes: Banco Mundial, INE, CEPAL, Kaggle.',
  keywords: [
    'inflación chile 2026',
    'pib per cápita latam',
    'tipo de cambio chile 2026',
    'desempleo chile 2026',
    'indicadores macroeconómicos chile',
    'economía latam comparativa',
    'datos económicos chile',
    'ipc chile histórico',
    'usd clp 2026',
    'tasa desempleo chile trimestral',
  ],
  alternates: { canonical: 'https://nebbuler.com/observatorio/datos' },
  openGraph: {
    title: 'Datos Económicos Chile y LATAM 2026 — Observatorio Nebbuler',
    description:
      'Indicadores macroeconómicos de Chile y Latinoamérica: inflación, PIB per cápita, tipo de cambio y desempleo. Fuentes: Banco Mundial, INE, CEPAL.',
    url: 'https://nebbuler.com/observatorio/datos',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Datos Económicos Chile y LATAM 2026 — Observatorio Nebbuler',
    description:
      'Visualizaciones de inflación, PIB, tipo de cambio y desempleo en Chile y LATAM. Datos curados de fuentes públicas.',
  },
}

// ─── Dynamic imports (Recharts es client-only) ────────────────────────────────

function ChartSkeleton() {
  return <div className="h-[280px] bg-[#F7F7F7] animate-pulse rounded-sm" />
}

const InflacionChart = dynamic(
  () => import('@/components/charts/MacroCharts').then((m) => m.InflacionChart),
  { ssr: false, loading: ChartSkeleton }
)

const PibLatamChart = dynamic(
  () => import('@/components/charts/MacroCharts').then((m) => m.PibLatamChart),
  { ssr: false, loading: ChartSkeleton }
)

const TipoCambioChart = dynamic(
  () => import('@/components/charts/MacroCharts').then((m) => m.TipoCambioChart),
  { ssr: false, loading: ChartSkeleton }
)

const DesempleoChart = dynamic(
  () => import('@/components/charts/MacroCharts').then((m) => m.DesempleoChart),
  { ssr: false, loading: ChartSkeleton }
)

// ─── JSON-LD Dataset schema ───────────────────────────────────────────────────

const jsonLdDataset = {
  '@context': 'https://schema.org',
  '@type': 'Dataset',
  name: 'Indicadores Macroeconómicos Chile y LATAM 2022-2026',
  description:
    'Datos de inflación mensual (IPC), PIB per cápita comparativo LATAM, tipo de cambio USD/CLP y tasa de desempleo trimestral en Chile. Período 2022-2026.',
  url: 'https://nebbuler.com/observatorio/datos',
  creator: {
    '@type': 'Organization',
    name: 'Nebbuler',
    url: 'https://nebbuler.com',
  },
  publisher: {
    '@type': 'Organization',
    name: 'Nebbuler',
    url: 'https://nebbuler.com',
  },
  keywords: [
    'inflación chile',
    'pib latam',
    'tipo de cambio',
    'desempleo chile',
    'indicadores macroeconómicos',
    'economía chilena',
    'latam economía',
  ],
  temporalCoverage: '2022/2026',
  spatialCoverage: 'Chile, América Latina',
  license: 'https://creativecommons.org/licenses/by/4.0/',
  isAccessibleForFree: true,
  measurementTechnique: 'Datos curados de fuentes públicas: INE Chile, Banco Central de Chile, Banco Mundial, CEPAL',
}

const jsonLdBreadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Nebbuler', item: 'https://nebbuler.com' },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Observatorio',
      item: 'https://nebbuler.com/observatorio',
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'Datos Económicos',
      item: 'https://nebbuler.com/observatorio/datos',
    },
  ],
}

// ─── Creadores relevantes para economía/finanzas ──────────────────────────────

const RELEVANT_DISCIPLINES = ['economia', 'finanzas', 'historia']

export default function ObservatorioDatosPage() {
  const relevantCreators = creators.filter((c) =>
    RELEVANT_DISCIPLINES.includes(c.discipline)
  )

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdDataset) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />

      {/* ─── Header ─────────────────────────────────────────────────────────── */}
      <div className="border-t-[3px] border-[#C41C1C]">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link
            href="/"
            className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-[#121212]"
          >
            NEBBULER
          </Link>
          <nav className="flex items-center gap-2 text-[12px] font-sans text-[#999]">
            <Link href="/observatorio" className="hover:text-[#C41C1C] transition-colors">
              ← Observatorio
            </Link>
            <span>/</span>
            <span className="text-[#121212] font-semibold">Datos Económicos</span>
          </nav>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-14">
        {/* ─── Intro ──────────────────────────────────────────────────────────── */}
        <div className="mb-12 max-w-2xl">
          <div className="flex items-center gap-3 mb-4">
            <p className="font-sans text-[11px] font-bold tracking-[0.15em] uppercase text-[#C41C1C]">
              OBSERVATORIO NEBBULER
            </p>
            <span className="bg-[#121212] text-white font-sans text-[10px] font-bold tracking-wider uppercase px-2 py-0.5">
              Datos actualizados 2026
            </span>
          </div>

          <h1 className="font-serif text-[36px] sm:text-[46px] font-bold text-[#121212] leading-tight mb-5">
            Datos Económicos Chile y LATAM
          </h1>

          <p className="font-sans text-[15px] text-[#555] leading-relaxed">
            Indicadores macroeconómicos curados de fuentes públicas: INE Chile, Banco Central de
            Chile, Banco Mundial y CEPAL. Período 2022–2026. Actualizados trimestralmente para
            mantener relevancia como referencia de consulta.
          </p>

          <div className="flex flex-wrap gap-4 mt-5">
            {['INE Chile', 'Banco Central', 'Banco Mundial', 'CEPAL'].map((fuente) => (
              <span
                key={fuente}
                className="font-sans text-[10px] font-bold tracking-[0.15em] uppercase text-[#888] border border-[#E5E5E5] px-3 py-1"
              >
                {fuente}
              </span>
            ))}
          </div>
        </div>

        <div className="h-px bg-[#E5E5E5] mb-12" />

        {/* ─── Grid de gráficos ───────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Inflación */}
          <div className="border border-[#E8E8E8] p-6">
            <InflacionChart />
            <p className="font-sans text-[12px] text-[#888] mt-4 leading-relaxed">
              Chile alcanzó su pico inflacionario en septiembre de 2022 (13,7%), el más alto desde
              1994, impulsado por el retiro de fondos de pensiones y el shock global de precios
              post-pandemia. La convergencia hacia la meta del 3% tomó 30 meses.
            </p>
          </div>

          {/* PIB LATAM */}
          <div className="border border-[#E8E8E8] p-6">
            <PibLatamChart />
            <p className="font-sans text-[12px] text-[#888] mt-4 leading-relaxed">
              Chile se ubica en el segundo lugar de la región con un PIB per cápita de USD 17.564
              (2024), detrás de Uruguay. La brecha con México y Brasil refleja diferencias
              estructurales en productividad y apertura comercial.
            </p>
          </div>

          {/* Tipo de cambio */}
          <div className="border border-[#E8E8E8] p-6">
            <TipoCambioChart />
            <p className="font-sans text-[12px] text-[#888] mt-4 leading-relaxed">
              El tipo de cambio USD/CLP mostró una depreciación sostenida durante 2023-2024,
              alcanzando máximos de $967 en marzo de 2024. La apreciación posterior se explica por
              la normalización de la política monetaria y el alza del cobre.
            </p>
          </div>

          {/* Desempleo */}
          <div className="border border-[#E8E8E8] p-6">
            <DesempleoChart />
            <p className="font-sans text-[12px] text-[#888] mt-4 leading-relaxed">
              La tasa de desempleo chilena se mantuvo persistentemente por encima del 8% desde el
              primer trimestre de 2023, reflejando una destrucción neta de empleo formal y la
              ralentización de la economía tras el boom del consumo.
            </p>
          </div>
        </div>

        {/* ─── Nota metodológica ──────────────────────────────────────────────── */}
        <div className="bg-[#FAFAFA] border-l-2 border-[#E5E5E5] p-6 mb-16">
          <p className="font-sans text-[11px] font-bold tracking-[0.15em] uppercase text-[#999] mb-2">
            Nota metodológica
          </p>
          <p className="font-sans text-[13px] text-[#666] leading-relaxed">
            Los datos presentados provienen de fuentes oficiales y organismos multilaterales. Los
            valores de inflación corresponden a la variación anual del IPC publicada mensualmente
            por el INE. El PIB per cápita está expresado en dólares corrientes según el Atlas Method
            del Banco Mundial. El tipo de cambio refleja el dólar observado del Banco Central. Las
            tasas de desempleo corresponden a la encuesta NENE del INE (trimestre móvil). Los datos
            de 2026 corresponden a proyecciones o cifras parciales.
          </p>
        </div>

        <div className="h-px bg-[#E5E5E5] mb-12" />

        {/* ─── Analistas relevantes ───────────────────────────────────────────── */}
        <div className="mb-16">
          <p className="font-sans text-[11px] font-bold tracking-[0.15em] uppercase text-[#C41C1C] mb-2">
            EN NEBBULER
          </p>
          <h2 className="font-serif text-[26px] font-bold text-[#121212] mb-3">
            Analistas que cubren estos datos
          </h2>
          <p className="font-sans text-[14px] text-[#666] mb-8 leading-relaxed max-w-xl">
            Economistas, analistas financieros e historiadores económicos que publican análisis
            profundos sobre los indicadores mostrados arriba. Suscripción directa, sin intermediarios.
          </p>

          <div className="space-y-0">
            {relevantCreators.map((creator, i) => (
              <Link
                key={creator.slug}
                href={`/sala/${creator.slug}`}
                className="group flex items-start gap-5 py-5 border-b border-[#F0F0F0] hover:bg-[#FAFAFA] -mx-2 px-2 transition-colors"
              >
                <span className="font-serif text-[12px] text-[#C41C1C] font-bold tabular-nums w-5 shrink-0 mt-0.5">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-3 flex-wrap mb-1">
                    <span className="font-serif text-[16px] font-bold text-[#121212] group-hover:text-[#C41C1C] transition-colors">
                      {creator.name}
                    </span>
                    <span className="font-sans text-[10px] font-bold tracking-[0.15em] uppercase text-[#999]">
                      {creator.specialty}
                    </span>
                  </div>
                  <p className="font-sans text-[13px] text-[#777] leading-relaxed line-clamp-2">
                    {creator.bio}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-sans text-[12px] font-semibold text-[#121212]">
                    ${creator.price_clp.toLocaleString('es-CL')}
                    <span className="text-[#999] font-normal">/mes</span>
                  </p>
                  <p className="font-sans text-[11px] text-[#C41C1C] font-bold mt-0.5">
                    {creator.trend}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ─── CTA ────────────────────────────────────────────────────────────── */}
        <div className="bg-[#FAFAFA] border-l-2 border-[#C41C1C] p-6">
          <p className="font-serif text-[17px] font-bold text-[#121212] mb-2">
            ¿Analizas economía o finanzas y quieres cobrar por ello?
          </p>
          <p className="font-sans text-[14px] text-[#555] mb-4 leading-relaxed">
            Nebbuler es la plataforma de newsletters de pago para profesionales de Chile y LATAM.
            Sin algoritmos. Sin comisión. Tú pones el precio.
          </p>
          <Link
            href="/para-creadores"
            className="inline-block bg-[#121212] text-white hover:bg-[#C41C1C] transition-colors px-6 py-3 text-xs font-bold tracking-[0.1em] uppercase"
          >
            Abrir mi newsletter →
          </Link>
        </div>
      </div>
    </>
  )
}
