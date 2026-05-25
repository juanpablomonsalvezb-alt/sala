import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { safeJsonLd } from '@/lib/rateLimit'
import { SELECCIONES_LATAM, MUNDIAL } from '@/data/mundial-bootstrap'
import mundialData from '@/data/mundial-2026.json'
import partidosData from '@/data/mundial-partidos.json'

export const revalidate = 3600

type Grupo = {
  id: string
  cabeza_serie: string
  selecciones: string[]
  nota?: string
}

const GRUPOS: Grupo[] = (mundialData as { grupos: Grupo[] }).grupos

const LATAM_NAMES = new Set([
  'Argentina',
  'Brasil',
  'Mexico',
  'México',
  'Colombia',
  'Uruguay',
  'Ecuador',
  'Chile',
  'Peru',
  'Perú',
  'Paraguay',
])

function findSeleccion(name: string) {
  return SELECCIONES_LATAM.find(
    (s) => s.pais.toLowerCase() === name.toLowerCase() || s.slug === name.toLowerCase(),
  )
}

export async function generateStaticParams() {
  return GRUPOS.map((g) => ({ id: g.id.toLowerCase() }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const grupo = GRUPOS.find((g) => g.id.toLowerCase() === id.toLowerCase())
  if (!grupo) return {}

  const title = `Grupo ${grupo.id} del Mundial 2026 · ${grupo.selecciones.join(' · ')}`
  const description = `Todo el Grupo ${grupo.id} del Mundial 2026: ${grupo.selecciones.join(', ')}. Fixtures, análisis y los periodistas/podcasters LATAM que mejor lo van a cubrir. Programa Nebbuler La Sombra: 0% comisión para creadores deportivos.`

  return {
    title,
    description,
    alternates: { canonical: `https://nebbuler.com/mundial/grupo/${grupo.id.toLowerCase()}` },
    openGraph: {
      title,
      description,
      url: `https://nebbuler.com/mundial/grupo/${grupo.id.toLowerCase()}`,
      type: 'website',
      images: [{ url: `/api/og/mundial-grupo?id=${grupo.id}`, width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image', title, description },
  }
}

export default async function GrupoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const grupo = GRUPOS.find((g) => g.id.toLowerCase() === id.toLowerCase())
  if (!grupo) notFound()

  const latamEnGrupo = grupo.selecciones.filter((s) => LATAM_NAMES.has(s))
  const otrosGrupos = GRUPOS.filter((g) => g.id !== grupo.id)
  const partidosGrupo = (partidosData as { slug: string; equipo1: string; equipo2: string; jornada: number; fecha: string; grupo: string | null }[])
    .filter((p) => p.grupo === grupo.id)
    .sort((a, b) => a.jornada - b.jornada)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    name: `Grupo ${grupo.id.toUpperCase()} - Copa del Mundo FIFA 2026`,
    description: `Fase de grupos del Mundial 2026. ${grupo.selecciones.join(', ')}`,
    startDate: '2026-06-11T18:00:00-05:00',
    endDate: '2026-06-27T20:00:00-05:00',
    sport: 'Soccer',
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: 'Estadios del Mundial 2026',
      address: { '@type': 'PostalAddress', addressCountry: 'US' },
    },
    organizer: { '@type': 'Organization', name: 'FIFA', url: 'https://www.fifa.com' },
    performer: grupo.selecciones.map((s) => ({
      '@type': 'SportsTeam',
      name: `Selección de fútbol de ${s}`,
    })),
    competitor: grupo.selecciones.map((s) => ({
      '@type': 'SportsTeam',
      name: `Selección de fútbol de ${s}`,
    })),
    image: 'https://nebbuler.com/mundial-og.png',
    offers: {
      '@type': 'Offer',
      url: 'https://nebbuler.com/mundial/entradas',
      price: '120',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
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
        name: `Grupo ${grupo.id}`,
        item: `https://nebbuler.com/mundial/grupo/${grupo.id.toLowerCase()}`,
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
        <header className="border-b border-white/10">
          <div className="h-[3px] bg-[#C41C1C]" />
          <div className="py-3 px-6">
            <div className="max-w-5xl mx-auto flex items-center justify-between">
              <Link href="/" className="font-serif text-[22px] font-bold tracking-tight">
                NEBBULER
              </Link>
              <Link href="/mundial" className="text-xs text-white/60 hover:text-white tracking-[0.15em] uppercase">
                ← La Sombra · Mundial 2026
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-6 py-12 md:py-20">
          <nav className="text-xs text-white/40 mb-6">
            <Link href="/mundial" className="hover:text-white">Mundial 2026</Link>
            {' / '}
            <span className="text-white/60">Grupo {grupo.id}</span>
          </nav>

          <div className="mb-12">
            <p className="text-[#C41C1C] text-xs font-bold tracking-[0.2em] uppercase mb-3">
              Fase de Grupos · Mundial 2026
            </p>
            <h1 className="font-serif text-6xl md:text-8xl leading-[0.95] tracking-tight mb-6">
              Grupo <span className="italic text-[#C41C1C]">{grupo.id}</span>
            </h1>
            <p className="text-2xl text-white/80 mb-2">
              {grupo.selecciones.join(' · ')}
            </p>
            <p className="text-sm text-white/50">
              Cabeza de serie: <strong className="text-white/80">{grupo.cabeza_serie}</strong>
              {grupo.nota && ` · ${grupo.nota}`}
            </p>
          </div>

          {/* Equipos */}
          <section className="mb-16">
            <h2 className="font-serif text-2xl mb-6 tracking-tight">Selecciones</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {grupo.selecciones.map((s) => {
                const sel = findSeleccion(s)
                return (
                  <div
                    key={s}
                    className={`border p-5 ${
                      sel ? 'border-[#C41C1C]/40 bg-[#C41C1C]/5' : 'border-white/10'
                    }`}
                  >
                    {sel && <p className="text-3xl mb-2">{sel.bandera}</p>}
                    <p className="font-serif text-lg">{s}</p>
                    {sel && (
                      <Link
                        href={`/mundial/${sel.slug}`}
                        className="text-[#C41C1C] text-xs mt-2 inline-block hover:underline"
                      >
                        Creadores destacados →
                      </Link>
                    )}
                    {!sel && (
                      <p className="text-white/40 text-xs mt-2">Fase de grupos</p>
                    )}
                  </div>
                )
              })}
            </div>
          </section>

          {latamEnGrupo.length > 0 && (
            <section className="mb-16 pt-12 border-t border-white/10">
              <h2 className="font-serif text-2xl mb-6 tracking-tight">
                {latamEnGrupo.length === 1
                  ? `${latamEnGrupo[0]} en el Grupo ${grupo.id}`
                  : `Selecciones LATAM en el Grupo ${grupo.id}`}
              </h2>
              <p className="text-white/70 leading-relaxed mb-6">
                {latamEnGrupo.length} selección{latamEnGrupo.length > 1 ? 'es' : ''} de América
                Latina en este grupo significa{' '}
                <strong className="text-white">decenas de miles de hinchas hispanohablantes</strong>{' '}
                buscando análisis pre y post-partido en su idioma, en su moneda, sin pasar por
                plataformas gringas.
              </p>
              <p className="text-white/70 leading-relaxed mb-6">
                El Programa La Sombra de Nebbuler permite que los periodistas, podcasters y
                analistas tácticos que cubran este grupo cobren a su audiencia membresías en
                pesos, sin comisión variable durante todo el Mundial.
              </p>
              <Link
                href="/mundial#aplicar"
                className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 font-medium hover:bg-white/90 transition-colors"
              >
                Aplicar al Programa La Sombra →
              </Link>
            </section>
          )}

          {/* Partidos del grupo */}
          <section className="mb-16 pt-12 border-t border-white/10">
            <h2 className="font-serif text-2xl mb-6 tracking-tight">
              Partidos del Grupo {grupo.id}
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {partidosGrupo.map((p) => (
                <Link
                  key={p.slug}
                  href={`/mundial/partido/${p.slug}`}
                  className="border border-white/10 p-4 hover:border-white/30 hover:bg-white/[0.02] transition-colors group"
                >
                  <p className="text-xs text-white/40 uppercase tracking-widest mb-1">
                    Jornada {p.jornada}
                  </p>
                  <p className="font-medium text-sm group-hover:text-white transition-colors">
                    {p.equipo1} <span className="text-[#C41C1C]">vs</span> {p.equipo2}
                  </p>
                  <p className="text-white/40 text-xs mt-1">{p.fecha}</p>
                </Link>
              ))}
            </div>
          </section>

          <section className="mb-16 pt-12 border-t border-white/10">
            <h2 className="font-serif text-2xl mb-6 tracking-tight">
              Otros grupos del Mundial 2026
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-11 gap-2">
              {otrosGrupos.map((g) => (
                <Link
                  key={g.id}
                  href={`/mundial/grupo/${g.id.toLowerCase()}`}
                  className="border border-white/15 py-3 text-center text-sm hover:border-white/40 hover:bg-white/[0.02]"
                >
                  {g.id}
                </Link>
              ))}
            </div>
          </section>
        </main>

        <footer className="border-t border-white/10 py-8 px-6">
          <div className="max-w-5xl mx-auto text-xs text-white/40">
            <p>
              © 2026 Nebbuler · La Sombra es un programa de Nebbuler para creadores deportivos
              LATAM. No afiliado con FIFA ni con el Mundial 2026 oficial.
            </p>
          </div>
        </footer>
      </div>
    </>
  )
}
