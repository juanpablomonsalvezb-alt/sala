import type { Metadata } from 'next'
import Link from 'next/link'
import { safeJsonLd } from '@/lib/rateLimit'
import mundialData from '@/data/mundial-2026.json'
import partidosData from '@/data/mundial-partidos.json'

export const revalidate = 300 // 5 min cache

const ESPN_BASE = 'https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world'
const ESPN_V2 = 'https://site.api.espn.com/apis/v2/sports/soccer/fifa.world'

const TITLE = 'Estadísticas Mundial FIFA 2026 — Tabla de posiciones, goleadores y resultados'
const DESCRIPTION =
  'Tabla de posiciones en tiempo real del Mundial 2026, goleadores, resultados por grupo y fixture completo. Seguí cada partido del Mundial FIFA 2026 con Nebbuler — La Sombra para periodistas deportivos LATAM.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    'estadisticas mundial 2026',
    'tabla posiciones mundial 2026',
    'goleadores mundial fifa 2026',
    'resultados copa del mundo 2026',
    'fixture mundial 2026',
    'tabla mundial 2026 grupos',
    'copa del mundo 2026 clasificacion',
    'mundial 2026 en vivo',
  ],
  alternates: { canonical: 'https://nebbuler.com/mundial/estadisticas' },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: 'https://nebbuler.com/mundial/estadisticas',
    type: 'website',
    images: [{ url: '/api/og/mundial', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION },
}

type EspnTeam = {
  team: {
    id: string
    displayName: string
    abbreviation: string
    logos?: { href: string }[]
  }
  stats: { name: string; displayValue: string }[]
}

type EspnGroup = {
  name: string
  abbreviation: string
  standings: { entries: EspnTeam[] }
}

type EspnStandings = {
  children: EspnGroup[]
}

type Partido = {
  id: number
  slug: string
  equipo1: string
  equipo2: string
  grupo: string | null
  jornada: number
  fase: string
  fecha: string
  placeholder?: boolean
}

type GrupoData = {
  id: string
  selecciones: string[]
  cabeza_serie: string
}

const PARTIDOS = partidosData as Partido[]
const GRUPOS = (mundialData as { grupos: GrupoData[] }).grupos

function getStat(entry: EspnTeam, name: string): string {
  return entry.stats?.find((s) => s.name === name)?.displayValue ?? '—'
}

async function fetchStandings(): Promise<EspnStandings | null> {
  try {
    const res = await fetch(`${ESPN_V2}/standings`, { next: { revalidate: 300 } })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

async function fetchNews() {
  try {
    const res = await fetch(`${ESPN_BASE}/news?limit=6`, { next: { revalidate: 300 } })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

function formatFecha(fecha: string): string {
  const [y, m, d] = fecha.split('-').map(Number)
  const meses = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic']
  return `${d} ${meses[m - 1]} ${y}`
}

const LATAM_SET = new Set([
  // Español
  'Argentina','Brasil','Mexico','México','Colombia','Uruguay','Ecuador',
  'Chile','Peru','Perú','Paraguay','Bolivia','Venezuela','Honduras',
  'Panama','Panamá','Haiti','Haití','Costa Rica',
  // Inglés (ESPN)
  'Brazil','Haiti','Panama','Peru',
])

export default async function EstadisticasPage() {
  const [standings, newsData] = await Promise.all([fetchStandings(), fetchNews()])

  const news = newsData?.articles ?? []
  const gruposEspn: EspnGroup[] = standings?.children ?? []

  // Próximos partidos (primeros de cada grupo, jornada 1)
  const proximosPartidos = PARTIDOS
    .filter((p) => p.fase === 'grupos' && p.jornada === 1)
    .slice(0, 12)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: TITLE,
    description: DESCRIPTION,
    url: 'https://nebbuler.com/mundial/estadisticas',
    about: {
      '@type': 'SportsEvent',
      name: 'Copa del Mundo FIFA 2026',
      startDate: '2026-06-11T18:00:00-05:00',
      endDate: '2026-07-19T18:00:00-05:00',
      sport: 'Soccer',
      eventStatus: 'https://schema.org/EventScheduled',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      location: {
        '@type': 'Place',
        name: 'Estadios del Mundial 2026',
        address: { '@type': 'PostalAddress', addressCountry: 'US' },
      },
      organizer: { '@type': 'Organization', name: 'FIFA', url: 'https://www.fifa.com' },
      performer: { '@type': 'Organization', name: 'FIFA' },
      image: 'https://nebbuler.com/mundial-og.png',
      offers: {
        '@type': 'Offer',
        url: 'https://nebbuler.com/mundial/entradas',
        price: '60',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
      },
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />

      <div className="min-h-screen bg-[#050505] text-white">
        {/* Header */}
        <header className="border-b border-white/10">
          <div className="h-[3px] bg-[#C41C1C]" />
          <div className="py-3 px-6">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
              <Link href="/" className="font-serif text-[22px] font-bold tracking-tight">
                NEBBULER
              </Link>
              <Link href="/mundial" className="text-xs text-white/60 hover:text-white tracking-[0.15em] uppercase">
                ← La Sombra · Mundial 2026
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-6 py-12">
          {/* Breadcrumb */}
          <nav className="text-xs text-white/40 mb-6">
            <Link href="/mundial" className="hover:text-white">Mundial 2026</Link>
            {' / '}
            <span className="text-white/60">Estadísticas</span>
          </nav>

          {/* Hero */}
          <div className="mb-12">
            <p className="text-[#C41C1C] text-xs font-bold tracking-[0.2em] uppercase mb-3">
              Mundial FIFA 2026 · En vivo desde el 11 de junio
            </p>
            <h1 className="font-serif text-6xl md:text-8xl leading-[0.95] tracking-tight mb-6">
              Estadísticas
            </h1>
            <p className="text-white/60 text-lg max-w-2xl">
              Tabla de posiciones, goleadores y fixture completo del Mundial 2026.
              Actualizado en tiempo real durante el torneo.
            </p>
          </div>

          {/* Standings por grupo */}
          <section className="mb-16">
            <h2 className="font-serif text-3xl mb-8 tracking-tight">
              Tabla de posiciones por grupo
            </h2>

            {gruposEspn.length > 0 ? (
              /* ESPN data disponible */
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {gruposEspn.map((grupo) => (
                  <div key={grupo.abbreviation} className="border border-white/10">
                    <div className="bg-[#C41C1C]/10 border-b border-white/10 px-4 py-2 flex items-center justify-between">
                      <span className="font-serif text-lg font-bold">
                        Grupo {grupo.abbreviation.replace(/^Group\s*/i, '')}
                      </span>
                      <Link
                        href={`/mundial/grupo/${grupo.abbreviation.replace(/^Group\s*/i, '').toLowerCase()}`}
                        className="text-[#C41C1C] text-xs hover:underline"
                      >
                        Ver grupo →
                      </Link>
                    </div>
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-white/10 text-white/40">
                          <th className="text-left px-4 py-2 font-normal">Selección</th>
                          <th className="px-2 py-2 font-normal">PJ</th>
                          <th className="px-2 py-2 font-normal">G</th>
                          <th className="px-2 py-2 font-normal">E</th>
                          <th className="px-2 py-2 font-normal">P</th>
                          <th className="px-2 py-2 font-normal text-white/70">Pts</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(grupo.standings?.entries ?? []).map((entry, idx) => {
                          const name = entry.team?.displayName ?? '—'
                          const isLatam = LATAM_SET.has(name)
                          return (
                            <tr
                              key={entry.team?.id ?? idx}
                              className={`border-b border-white/5 ${isLatam ? 'bg-[#C41C1C]/5' : ''}`}
                            >
                              <td className="px-4 py-2">
                                <span className={isLatam ? 'text-white font-medium' : 'text-white/70'}>
                                  {name}
                                </span>
                              </td>
                              <td className="px-2 py-2 text-center text-white/60">{getStat(entry,'gamesPlayed')}</td>
                              <td className="px-2 py-2 text-center text-white/60">{getStat(entry,'wins')}</td>
                              <td className="px-2 py-2 text-center text-white/60">{getStat(entry,'ties')}</td>
                              <td className="px-2 py-2 text-center text-white/60">{getStat(entry,'losses')}</td>
                              <td className="px-2 py-2 text-center font-bold text-white">{getStat(entry,'points')}</td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            ) : (
              /* Fallback pre-torneo — datos estáticos */
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {GRUPOS.map((grupo) => (
                  <div key={grupo.id} className="border border-white/10">
                    <div className="bg-[#C41C1C]/10 border-b border-white/10 px-4 py-2 flex items-center justify-between">
                      <span className="font-serif text-lg font-bold">Grupo {grupo.id}</span>
                      <Link
                        href={`/mundial/grupo/${grupo.id.toLowerCase()}`}
                        className="text-[#C41C1C] text-xs hover:underline"
                      >
                        Ver grupo →
                      </Link>
                    </div>
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-white/10 text-white/40">
                          <th className="text-left px-4 py-2 font-normal">Selección</th>
                          <th className="px-2 py-2 font-normal">PJ</th>
                          <th className="px-2 py-2 font-normal">G</th>
                          <th className="px-2 py-2 font-normal">E</th>
                          <th className="px-2 py-2 font-normal">P</th>
                          <th className="px-2 py-2 font-normal text-white/70">Pts</th>
                        </tr>
                      </thead>
                      <tbody>
                        {grupo.selecciones.map((sel) => {
                          const isLatam = LATAM_SET.has(sel)
                          return (
                            <tr key={sel} className={`border-b border-white/5 ${isLatam ? 'bg-[#C41C1C]/5' : ''}`}>
                              <td className="px-4 py-2">
                                <span className={isLatam ? 'text-white font-medium' : 'text-white/70'}>
                                  {sel}
                                </span>
                              </td>
                              <td className="px-2 py-2 text-center text-white/30">0</td>
                              <td className="px-2 py-2 text-center text-white/30">0</td>
                              <td className="px-2 py-2 text-center text-white/30">0</td>
                              <td className="px-2 py-2 text-center text-white/30">0</td>
                              <td className="px-2 py-2 text-center font-bold text-white/30">0</td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                    <div className="px-4 py-2 border-t border-white/5">
                      <p className="text-white/30 text-xs">Torneo inicia el 11 jun 2026</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Próximos partidos */}
          <section className="mb-16 pt-12 border-t border-white/10">
            <h2 className="font-serif text-3xl mb-8 tracking-tight">Fixture — Jornada 1</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {proximosPartidos.map((p) => {
                const hasLatam = LATAM_SET.has(p.equipo1) || LATAM_SET.has(p.equipo2)
                return (
                  <Link
                    key={p.slug}
                    href={`/mundial/partido/${p.slug}`}
                    className={`border p-4 hover:bg-white/[0.03] transition-colors group ${
                      hasLatam ? 'border-[#C41C1C]/30' : 'border-white/10'
                    }`}
                  >
                    <p className="text-white/30 text-xs uppercase tracking-widest mb-2">
                      Grupo {p.grupo} · {formatFecha(p.fecha)}
                    </p>
                    <p className="text-sm font-medium group-hover:text-white transition-colors">
                      <span className={LATAM_SET.has(p.equipo1) ? 'text-white' : 'text-white/70'}>
                        {p.equipo1}
                      </span>
                      {' '}<span className="text-[#C41C1C]">vs</span>{' '}
                      <span className={LATAM_SET.has(p.equipo2) ? 'text-white' : 'text-white/70'}>
                        {p.equipo2}
                      </span>
                    </p>
                  </Link>
                )
              })}
            </div>
            <div className="mt-6">
              <Link
                href="/mundial/partido/mexico-vs-sudafrica-grupo-a-mundial-2026"
                className="text-[#C41C1C] text-sm hover:underline"
              >
                Ver todos los 104 partidos →
              </Link>
            </div>
          </section>

          {/* Noticias ESPN */}
          {news.length > 0 && (
            <section className="mb-16 pt-12 border-t border-white/10">
              <h2 className="font-serif text-3xl mb-8 tracking-tight">Últimas noticias</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {news.slice(0, 6).map((article: { id: string; headline: string; description: string; published: string; links?: { web?: { href: string } } }) => (
                  <a
                    key={article.id}
                    href={article.links?.web?.href ?? '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border border-white/10 p-5 hover:border-white/30 hover:bg-white/[0.02] transition-colors group"
                  >
                    <p className="text-white/30 text-xs mb-2">
                      {new Date(article.published).toLocaleDateString('es-CL', {
                        day: 'numeric', month: 'short'
                      })}
                    </p>
                    <h3 className="font-serif text-base leading-snug group-hover:text-white transition-colors mb-2">
                      {article.headline}
                    </h3>
                    <p className="text-white/50 text-xs line-clamp-2">{article.description}</p>
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* Pre-torneo si no hay noticias */}
          {news.length === 0 && (
            <section className="mb-16 pt-12 border-t border-white/10">
              <h2 className="font-serif text-3xl mb-4 tracking-tight">Mundial 2026 — Datos clave</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { num: '48', label: 'Selecciones' },
                  { num: '104', label: 'Partidos totales' },
                  { num: '12', label: 'Grupos' },
                  { num: '3', label: 'Países sede' },
                ].map((stat) => (
                  <div key={stat.label} className="border border-white/10 p-6 text-center">
                    <p className="font-serif text-5xl font-bold text-white mb-2">{stat.num}</p>
                    <p className="text-white/50 text-sm uppercase tracking-widest">{stat.label}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* CTA La Sombra */}
          <section className="mb-16 border border-[#C41C1C]/30 p-8 bg-[#C41C1C]/5">
            <p className="text-[#C41C1C] text-xs font-bold tracking-[0.2em] uppercase mb-3">
              Programa La Sombra · Nebbuler
            </p>
            <h2 className="font-serif text-3xl mb-4">
              ¿Cubrís el Mundial 2026?
            </h2>
            <p className="text-white/70 leading-relaxed mb-6 max-w-2xl">
              104 partidos. Millones de búsquedas en español. Los periodistas, analistas y
              podcasters deportivos de LATAM que usen Nebbuler cobran membresías en pesos a
              su audiencia —{' '}
              <strong className="text-white">sin comisión variable durante todo el Mundial</strong>.
            </p>
            <Link
              href="/mundial#aplicar"
              className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 font-medium hover:bg-white/90 transition-colors"
            >
              Aplicar al Programa La Sombra →
            </Link>
          </section>

          {/* Grupos nav */}
          <section className="mb-12 pt-12 border-t border-white/10">
            <h2 className="font-serif text-2xl mb-6">Ir a un grupo</h2>
            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-2">
              {GRUPOS.map((g) => (
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
          <div className="max-w-6xl mx-auto text-xs text-white/40">
            <p>
              © 2026 Nebbuler · Datos en tiempo real vía ESPN API durante el torneo.
              No afiliado con FIFA ni con el Mundial 2026 oficial.
            </p>
          </div>
        </footer>
      </div>
    </>
  )
}
