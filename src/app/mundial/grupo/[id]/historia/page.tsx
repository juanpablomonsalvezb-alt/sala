import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { safeJsonLd } from '@/lib/rateLimit'
import type { GrupoHistoria } from '@/lib/mundial/grupo-historia-types'
import historiaRaw from '@/data/mundial-historia.json'
import {
  SeleccionCard,
  EnfrentamientoCard,
  NarrativaSection,
  CTACoverGroup,
} from './_components'
import {
  GrupoHero,
  StorylineSection,
  TradingCardsSection,
  MatchupsSection,
  CuriosidadesSection,
  CTAV2,
} from './_components-v2'

export const revalidate = 3600

const GRUPOS_HISTORIA = historiaRaw as unknown as Record<string, GrupoHistoria>

export async function generateStaticParams() {
  return Object.keys(GRUPOS_HISTORIA).map((id) => ({ id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const g = GRUPOS_HISTORIA[id.toLowerCase()]
  if (!g) return {}

  const equipos = g.selecciones.map((s) => s.pais).join(', ')
  const title = `Grupo ${g.id} del Mundial 2026 · Historia, enfrentamientos y datos · Nebbuler`
  const description = `Todo lo que tenés que saber del Grupo ${g.id} del Mundial 2026 (${equipos}): historia mundialista de cada selección, enfrentamientos previos en Mundiales y datos para cubrir cada partido.`

  return {
    title,
    description,
    alternates: {
      canonical: `https://nebbuler.com/mundial/grupo/${g.id.toLowerCase()}/historia`,
    },
    openGraph: {
      title,
      description,
      url: `https://nebbuler.com/mundial/grupo/${g.id.toLowerCase()}/historia`,
      type: 'article',
      images: [
        {
          url: `/api/og/mundial-grupo?id=${g.id}`,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: { card: 'summary_large_image', title, description },
  }
}

export default async function GrupoHistoriaPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const g = GRUPOS_HISTORIA[id.toLowerCase()]
  if (!g) notFound()

  const banderaMap = Object.fromEntries(g.selecciones.map((s) => [s.pais, s.bandera]))
  const useV2 = true

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `Grupo ${g.id} del Mundial 2026: historia, enfrentamientos y datos`,
    description: `Análisis histórico del Grupo ${g.id} del Mundial 2026.`,
    datePublished: '2026-05-22',
    dateModified: new Date().toISOString().split('T')[0],
    author: { '@type': 'Organization', name: 'Nebbuler' },
    publisher: { '@type': 'Organization', name: 'Nebbuler', url: 'https://nebbuler.com' },
    inLanguage: 'es',
    about: g.selecciones.map((s) => ({
      '@type': 'SportsTeam',
      name: `Selección de fútbol de ${s.pais}`,
    })),
  }

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://nebbuler.com' },
      { '@type': 'ListItem', position: 2, name: 'Mundial 2026', item: 'https://nebbuler.com/mundial' },
      {
        '@type': 'ListItem',
        position: 3,
        name: `Grupo ${g.id}`,
        item: `https://nebbuler.com/mundial/grupo/${g.id.toLowerCase()}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: 'Historia',
        item: `https://nebbuler.com/mundial/grupo/${g.id.toLowerCase()}/historia`,
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbLd) }}
      />
      <div className="min-h-screen bg-[#050505] text-white">
        <header className="border-b border-white/10 sticky top-0 z-50 bg-[#050505]/90 backdrop-blur">
          <div className="h-[3px] bg-[#C41C1C]" />
          <div className="py-3 px-6">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
              <Link href="/" className="font-serif text-[22px] font-bold tracking-tight">
                NEBBULER
              </Link>
              <Link
                href="/mundial"
                className="text-xs text-white/60 hover:text-white tracking-[0.15em] uppercase"
              >
                ← La Sombra
              </Link>
            </div>
          </div>
        </header>

        {useV2 ? (
          <>
            <GrupoHero grupo={g} />
            <StorylineSection grupo={g} />
            <TradingCardsSection selecciones={g.selecciones} />
            <MatchupsSection enfrentamientos={g.enfrentamientos} banderaMap={banderaMap} />
            <CuriosidadesSection datos={g.narrativa.datos_curiosos_grupo} />
            <CTAV2 grupoId={g.id} />
          </>
        ) : (
          <main className="max-w-5xl mx-auto px-6 py-12 md:py-16">
            <nav className="text-xs text-white/40 mb-6">
              <Link href="/mundial" className="hover:text-white">Mundial 2026</Link>
              {' / '}
              <Link href={`/mundial/grupo/${g.id.toLowerCase()}`} className="hover:text-white">
                Grupo {g.id}
              </Link>
              {' / '}
              <span className="text-white/60">Historia</span>
            </nav>

            <div className="mb-12">
              <p className="text-[#C41C1C] text-xs font-bold tracking-[0.2em] uppercase mb-3">
                Análisis histórico · Fase de grupos
              </p>
              <h1 className="font-serif text-5xl md:text-7xl leading-[0.95] tracking-tight mb-4">
                Grupo <span className="italic text-[#C41C1C]">{g.id}</span>: historia.
              </h1>
              <p className="text-xl text-white/70 leading-relaxed mb-6">
                {g.selecciones.map((s) => `${s.bandera} ${s.pais}`).join(' · ')}
              </p>
            </div>

            <NarrativaSection grupo={g} />

            <section className="mt-16 pt-12 border-t border-white/10">
              <h2 className="font-serif text-3xl mb-2 tracking-tight">Las 4 selecciones</h2>
              <div className="grid md:grid-cols-2 gap-4 mt-8">
                {g.selecciones.map((s) => (
                  <SeleccionCard key={s.pais} s={s} />
                ))}
              </div>
            </section>

            <section className="mt-16 pt-12 border-t border-white/10">
              <h2 className="font-serif text-3xl mb-2 tracking-tight">
                Cara a cara dentro del grupo
              </h2>
              <div className="grid md:grid-cols-2 gap-4 mt-8">
                {g.enfrentamientos.map((e, i) => (
                  <EnfrentamientoCard
                    key={`${e.team1}-${e.team2}-${i}`}
                    e={e}
                    banderaMap={banderaMap}
                  />
                ))}
              </div>
            </section>

            <CTACoverGroup grupoId={g.id} />
          </main>
        )}

        <footer className="border-t border-white/10 py-8 px-6">
          <div className="max-w-6xl mx-auto text-xs text-white/40">
            <p>
              © 2026 Nebbuler · Datos verificados con fuentes públicas (FIFA, Wikipedia,
              RSSSF, ESPN). No afiliados con FIFA ni con el Mundial 2026 oficial.
            </p>
          </div>
        </footer>
      </div>
    </>
  )
}
