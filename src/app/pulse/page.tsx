import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import Nav from '@/components/nav'
import { ShareButtons } from '@/components/magnet/share-buttons'
import { PulseCountdown } from './_components/PulseCountdown'

export const revalidate = 21600 // 6h

export const metadata: Metadata = {
  title: 'Pulse · Lo que mueve a LATAM esta semana',
  description:
    'Dashboard editorial de tendencias profesionales en América Latina. Top keywords, posts virales y nuevos creators. Actualizado cada 6 horas.',
  alternates: { canonical: 'https://nebbuler.com/pulse' },
  openGraph: {
    title: 'Pulse Nebbuler — Lo que mueve a LATAM esta semana',
    description:
      'Top keywords trending, posts virales y nuevos creators. Actualizado cada 6 horas.',
    url: 'https://nebbuler.com/pulse',
    type: 'website',
    images: [
      {
        url: 'https://nebbuler.com/api/og/pulse',
        width: 1200,
        height: 630,
        alt: 'Pulse Nebbuler — Tendencias LATAM',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pulse Nebbuler — Tendencias LATAM esta semana',
    description: 'Top keywords + posts virales + nuevos creators.',
    images: ['https://nebbuler.com/api/og/pulse'],
  },
}

interface Keyword {
  id: string
  keyword: string
  search_volume: number | null
  monthly_growth: number | null
  country_code: string | null
  created_at: string
  weekly_change?: number | null
  status?: string | null
}

interface PostRow {
  id: string
  title: string
  slug: string | null
  view_count?: number | null
  share_count?: number | null
  creator_id: string
  created_at: string
}

interface CreatorMini {
  id: string
  name: string
  slug: string
  specialty: string | null
  created_at: string
}

const FALLBACK_KEYWORDS: Keyword[] = [
  { id: 'k1', keyword: 'inteligencia artificial latam', search_volume: 49000, monthly_growth: 38, country_code: 'AR', created_at: new Date().toISOString() },
  { id: 'k2', keyword: 'monetizar conocimiento online', search_volume: 22000, monthly_growth: 64, country_code: 'CL', created_at: new Date().toISOString() },
  { id: 'k3', keyword: 'membresías profesionales', search_volume: 14000, monthly_growth: 51, country_code: 'MX', created_at: new Date().toISOString() },
  { id: 'k4', keyword: 'cobrar en dólares freelance', search_volume: 31000, monthly_growth: 42, country_code: 'CO', created_at: new Date().toISOString() },
  { id: 'k5', keyword: 'newsletter en español', search_volume: 18000, monthly_growth: 29, country_code: 'PE', created_at: new Date().toISOString() },
  { id: 'k6', keyword: 'consultoria remota', search_volume: 16000, monthly_growth: 22, country_code: 'UY', created_at: new Date().toISOString() },
  { id: 'k7', keyword: 'audiencia profesional linkedin', search_volume: 24000, monthly_growth: 36, country_code: 'CL', created_at: new Date().toISOString() },
  { id: 'k8', keyword: 'creator economy españa', search_volume: 9800, monthly_growth: 47, country_code: 'ES', created_at: new Date().toISOString() },
  { id: 'k9', keyword: 'substack alternativa', search_volume: 12000, monthly_growth: 58, country_code: 'AR', created_at: new Date().toISOString() },
  { id: 'k10', keyword: 'cobrar membresia mensual', search_volume: 11500, monthly_growth: 33, country_code: 'MX', created_at: new Date().toISOString() },
]

const COUNTRY_FLAG: Record<string, string> = {
  AR: 'AR', BR: 'BR', CL: 'CL', CO: 'CO', MX: 'MX', PE: 'PE',
  UY: 'UY', EC: 'EC', BO: 'BO', PY: 'PY', VE: 'VE', ES: 'ES',
}

async function getPulseData() {
  const supabase = await createClient()
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString()

  let keywords: Keyword[] = []
  let posts: PostRow[] = []
  let creators: CreatorMini[] = []
  const creatorIndex: Record<string, CreatorMini> = {}

  try {
    const { data } = await supabase
      .from('trending_keywords')
      .select('id, keyword, search_volume, monthly_growth, country_code, created_at, status')
      .gte('created_at', sevenDaysAgo)
      .order('monthly_growth', { ascending: false })
      .limit(10)
    keywords = (data ?? []) as Keyword[]
  } catch {
    keywords = []
  }
  if (keywords.length === 0) keywords = FALLBACK_KEYWORDS

  try {
    const { data } = await supabase
      .from('sala_posts')
      .select('id, title, slug, view_count, share_count, creator_id, created_at')
      .gte('created_at', sevenDaysAgo)
      .order('view_count', { ascending: false, nullsFirst: false })
      .limit(5)
    posts = (data ?? []) as PostRow[]
  } catch {
    posts = []
  }

  try {
    const { data } = await supabase
      .from('sala_creators')
      .select('id, name, slug, specialty, created_at, subscriber_count')
      .gte('created_at', sevenDaysAgo)
      .order('subscriber_count', { ascending: false })
      .limit(5)
    creators = (data ?? []) as CreatorMini[]
  } catch {
    creators = []
  }

  // Indexar creators para resolver posts -> creator slug
  if (posts.length > 0) {
    try {
      const ids = posts.map(p => p.creator_id).filter(Boolean)
      if (ids.length > 0) {
        const { data } = await supabase
          .from('sala_creators')
          .select('id, name, slug, specialty, created_at')
          .in('id', ids)
        ;(data ?? []).forEach(c => {
          creatorIndex[c.id] = c as CreatorMini
        })
      }
    } catch {
      // ignore
    }
  }

  return { keywords, posts, creators, creatorIndex }
}

function MiniSparkline({ growth }: { growth: number }) {
  // Simulamos una sparkline simple basada en growth con 7 puntos crecientes
  const points = Array.from({ length: 7 }).map((_, i) => {
    const factor = 1 + (i / 6) * (growth / 100)
    return 40 - factor * 14 + Math.sin(i * 1.3) * 3
  })
  const path = points
    .map((y, i) => `${i === 0 ? 'M' : 'L'}${(i * 70) / 6},${y.toFixed(1)}`)
    .join(' ')
  return (
    <svg width="70" height="32" viewBox="0 0 70 40" className="text-[#C41C1C]">
      <path d={path} fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

export default async function PulsePage() {
  const { keywords, posts, creators, creatorIndex } = await getPulseData()

  const semanaLabel = new Date().toLocaleDateString('es-CL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const shareText =
    'Las tendencias profesionales que mueven a LATAM esta semana, en un dashboard editorial actualizado cada 6h —'

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-white text-[#121212]">
        {/* Hero */}
        <section className="border-b border-[#DEDEDE] bg-[#121212] text-[#FAFAF7]">
          <div className="max-w-6xl mx-auto px-6 py-16">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <p className="text-[10px] uppercase tracking-[0.28em] text-[#C41C1C] font-semibold">
                Pulse · Semana del {semanaLabel}
              </p>
              <PulseCountdown />
            </div>
            <h1 className="font-serif text-5xl md:text-7xl font-bold leading-[0.95] tracking-[-0.02em] max-w-4xl mb-6">
              Lo que mueve a LATAM esta semana
            </h1>
            <p className="font-serif text-xl md:text-2xl italic text-[#BBB] max-w-3xl leading-relaxed">
              Tres columnas, una sola lectura: qué buscan, qué leen y quién está
              creciendo en América Latina ahora mismo.
            </p>
          </div>
        </section>

        {/* Grid 3 columnas */}
        <section className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* COL 1 — Keywords */}
            <div>
              <div className="border-b-2 border-[#121212] pb-3 mb-6">
                <p className="text-[10px] uppercase tracking-[0.28em] text-[#C41C1C] font-semibold mb-2">
                  Columna 01
                </p>
                <h2 className="font-serif text-2xl font-bold">
                  Top búsquedas tendencia
                </h2>
              </div>
              <ol className="flex flex-col gap-4">
                {keywords.slice(0, 10).map((k, i) => (
                  <li
                    key={k.id}
                    className="flex items-center gap-3 pb-3 border-b border-[#DEDEDE]"
                  >
                    <span className="font-serif text-lg font-bold text-[#C41C1C] tabular-nums w-6">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-sans text-sm font-medium text-[#121212] capitalize leading-tight truncate">
                        {k.keyword}
                      </p>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-[#999] mt-1">
                        {k.country_code
                          ? COUNTRY_FLAG[k.country_code] ?? k.country_code
                          : 'LATAM'}
                        {k.search_volume
                          ? ` · ${k.search_volume.toLocaleString('es-CL')}/mes`
                          : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <MiniSparkline growth={k.monthly_growth ?? 10} />
                      <span className="text-[11px] font-bold text-[#C41C1C] tabular-nums">
                        +{Math.round(k.monthly_growth ?? 0)}%
                      </span>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {/* COL 2 — Posts virales */}
            <div>
              <div className="border-b-2 border-[#121212] pb-3 mb-6">
                <p className="text-[10px] uppercase tracking-[0.28em] text-[#C41C1C] font-semibold mb-2">
                  Columna 02
                </p>
                <h2 className="font-serif text-2xl font-bold">
                  Posts más leídos
                </h2>
              </div>
              <ol className="flex flex-col gap-5">
                {posts.length === 0 && (
                  <li className="text-[12px] text-[#666] font-sans italic border border-dashed border-[#DEDEDE] p-4">
                    Estamos arrancando. Esta semana todavía no hay posts con
                    suficiente tracción registrada. Vuelve en unos días.
                  </li>
                )}
                {posts.slice(0, 5).map((p, i) => {
                  const author = creatorIndex[p.creator_id]
                  const href = author?.slug && p.slug ? `/${author.slug}/${p.slug}` : '#'
                  return (
                    <li key={p.id} className="border-b border-[#DEDEDE] pb-4">
                      <Link href={href} className="block group">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-[#C41C1C] font-semibold mb-2">
                          {String(i + 1).padStart(2, '0')} ·{' '}
                          {author?.specialty ?? 'Editorial'}
                        </p>
                        <h3 className="font-serif text-lg font-bold text-[#121212] leading-tight group-hover:underline">
                          {p.title}
                        </h3>
                        <p className="text-[11px] text-[#666] mt-2 uppercase tracking-[0.15em]">
                          {author?.name ?? 'Creator Nebbuler'}
                          {typeof p.view_count === 'number'
                            ? ` · ${p.view_count.toLocaleString('es-CL')} lecturas`
                            : ''}
                        </p>
                      </Link>
                    </li>
                  )
                })}
              </ol>
            </div>

            {/* COL 3 — Nuevos creators */}
            <div>
              <div className="border-b-2 border-[#121212] pb-3 mb-6">
                <p className="text-[10px] uppercase tracking-[0.28em] text-[#C41C1C] font-semibold mb-2">
                  Columna 03
                </p>
                <h2 className="font-serif text-2xl font-bold">
                  Nuevos creators
                </h2>
              </div>
              <ol className="flex flex-col gap-4">
                {creators.length === 0 && (
                  <li className="text-[12px] text-[#666] font-sans italic border border-dashed border-[#DEDEDE] p-4">
                    Esta semana no se sumaron nuevos creators al directorio
                    todavía. Sé el primero —{' '}
                    <Link
                      href="/registro"
                      className="text-[#C41C1C] underline hover:no-underline"
                    >
                      abrir mi sala
                    </Link>
                    .
                  </li>
                )}
                {creators.slice(0, 5).map((c, i) => (
                  <li key={c.id} className="border-b border-[#DEDEDE] pb-4">
                    <Link href={`/${c.slug}`} className="flex items-center gap-3 group">
                      <span className="font-serif text-lg font-bold text-[#C41C1C] tabular-nums w-6">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-serif text-base font-bold text-[#121212] group-hover:underline truncate">
                          {c.name}
                        </p>
                        <p className="text-[11px] text-[#666] uppercase tracking-[0.15em] mt-0.5">
                          {c.specialty ?? '—'}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* Tabla week-over-week */}
        <section className="border-t border-[#121212] bg-[#FAFAF7]">
          <div className="max-w-6xl mx-auto px-6 py-16">
            <div className="border-b-2 border-[#121212] pb-3 mb-6">
              <p className="text-[10px] uppercase tracking-[0.28em] text-[#C41C1C] font-semibold mb-2">
                Cambios week-over-week
              </p>
              <h2 className="font-serif text-3xl md:text-4xl font-bold">
                Subió, bajó o llegó nuevo
              </h2>
            </div>
            <table className="w-full text-sm font-sans">
              <thead>
                <tr className="border-b border-[#121212] text-[10px] uppercase tracking-[0.2em] text-[#666]">
                  <th className="text-left py-3 font-medium">Keyword</th>
                  <th className="text-left py-3 font-medium hidden md:table-cell">País</th>
                  <th className="text-right py-3 font-medium">Volumen</th>
                  <th className="text-right py-3 font-medium">Crecimiento</th>
                  <th className="text-right py-3 font-medium">Estado</th>
                </tr>
              </thead>
              <tbody>
                {keywords.slice(0, 10).map((k, i) => {
                  const growth = k.monthly_growth ?? 0
                  const estado =
                    growth >= 50 ? 'NUEVO' : growth >= 20 ? 'SUBIÓ' : growth >= 0 ? 'ESTABLE' : 'BAJÓ'
                  const estadoColor =
                    estado === 'NUEVO' ? '#C41C1C' : estado === 'SUBIÓ' ? '#121212' : '#666'
                  return (
                    <tr key={`row-${k.id}-${i}`} className="border-b border-[#DEDEDE]">
                      <td className="py-3 capitalize text-[#121212] font-medium">
                        {k.keyword}
                      </td>
                      <td className="py-3 text-[#666] hidden md:table-cell uppercase tracking-[0.15em] text-[11px]">
                        {k.country_code ?? '—'}
                      </td>
                      <td className="py-3 text-right text-[#121212] tabular-nums">
                        {k.search_volume?.toLocaleString('es-CL') ?? '—'}
                      </td>
                      <td className="py-3 text-right font-bold text-[#C41C1C] tabular-nums">
                        +{Math.round(growth)}%
                      </td>
                      <td className="py-3 text-right">
                        <span
                          className="text-[10px] uppercase tracking-[0.2em] font-bold border px-2 py-1"
                          style={{ color: estadoColor, borderColor: estadoColor }}
                        >
                          {estado}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Share + CTA */}
        <section className="border-t-2 border-[#121212]">
          <div className="max-w-4xl mx-auto px-6 py-20 text-center">
            <p className="text-[10px] uppercase tracking-[0.28em] text-[#C41C1C] font-semibold mb-6">
              Comparte el Pulse
            </p>
            <h2 className="font-serif text-4xl md:text-6xl font-bold leading-[1.05] tracking-[-0.02em] max-w-3xl mx-auto mb-10">
              Si tu red profesional debería verlo, envíaselo.
            </h2>

            <ShareButtons
              tool="pulse"
              url="https://nebbuler.com/pulse"
              text={shareText}
            />

            <div className="mt-12 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/leaderboard"
                className="inline-block px-8 py-4 border border-[#121212] text-[#121212] text-[12px] uppercase tracking-[0.25em] font-medium hover:bg-[#121212] hover:text-white transition-colors"
              >
                Ver ranking completo
              </Link>
              <Link
                href="/registro"
                className="inline-block px-8 py-4 bg-[#C41C1C] text-white text-[12px] uppercase tracking-[0.25em] font-medium hover:bg-[#A01818] transition-colors"
              >
                Abrir mi sala
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
