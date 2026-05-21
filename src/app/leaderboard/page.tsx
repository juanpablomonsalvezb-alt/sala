import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import Nav from '@/components/nav'
import { ShareButtons } from '@/components/magnet/share-buttons'
import { LeaderboardFilters } from './_components/LeaderboardFilters'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Leaderboard 2026 · Los 100 profesionales más leídos en LATAM',
  description:
    'Ranking en vivo de los 100 profesionales con más suscriptores en Nebbuler. Actualizado cada hora. Filtros por país y especialidad.',
  alternates: { canonical: 'https://nebbuler.com/leaderboard' },
  openGraph: {
    title: 'Los 100 profesionales más leídos de LATAM — Leaderboard Nebbuler 2026',
    description:
      'Ranking en vivo de creators de membresías en América Latina. Actualizado cada hora.',
    url: 'https://nebbuler.com/leaderboard',
    type: 'website',
    images: [
      {
        url: 'https://nebbuler.com/api/og/leaderboard',
        width: 1200,
        height: 630,
        alt: 'Leaderboard Nebbuler — Top 100 LATAM',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Los 100 profesionales más leídos de LATAM — Nebbuler',
    description: 'Ranking en vivo. Filtros por país y especialidad.',
    images: ['https://nebbuler.com/api/og/leaderboard'],
  },
}

interface CreatorRow {
  id: string
  name: string
  slug: string
  specialty: string | null
  subscriber_count: number | null
  country_code?: string | null
  verified?: boolean | null
}

// Banda por posición
function getBand(idx: number): string {
  if (idx < 10) return 'TOP 10'
  if (idx < 25) return 'TOP 25'
  if (idx < 50) return 'TOP 50'
  return 'TOP 100'
}

function bandColor(idx: number): string {
  if (idx < 10) return '#C41C1C'
  if (idx < 25) return '#121212'
  if (idx < 50) return '#666666'
  return '#999999'
}

// Mapeo país desde specialty/slug heurístico (fallback)
const COUNTRY_LABEL: Record<string, string> = {
  CL: 'Chile', AR: 'Argentina', MX: 'México', CO: 'Colombia', PE: 'Perú',
  UY: 'Uruguay', BR: 'Brasil', EC: 'Ecuador', BO: 'Bolivia', PY: 'Paraguay',
  CR: 'Costa Rica', PA: 'Panamá', DO: 'Rep. Dominicana', GT: 'Guatemala',
  VE: 'Venezuela', ES: 'España', US: 'Estados Unidos',
}

async function getCreators(): Promise<CreatorRow[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('sala_creators')
      .select('id, name, slug, specialty, subscriber_count, country_code, verified')
      .gt('subscriber_count', 0)
      .order('subscriber_count', { ascending: false })
      .limit(100)
    return (data ?? []) as CreatorRow[]
  } catch {
    return []
  }
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(p => p[0]?.toUpperCase() ?? '')
    .join('')
}

export default async function LeaderboardPage() {
  const realCreators = await getCreators()

  // Rellenar hasta 100 con placeholders editoriales
  const padded: CreatorRow[] = [...realCreators]
  while (padded.length < 100) {
    padded.push({
      id: `placeholder-${padded.length}`,
      name: `Esperando creador #${padded.length + 1}`,
      slug: '',
      specialty: 'Reservado',
      subscriber_count: 0,
      country_code: null,
      verified: false,
    })
  }

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Top 100 creadores Nebbuler LATAM 2026',
    description:
      'Ranking de los 100 profesionales con más suscriptores en Nebbuler.',
    itemListElement: realCreators.slice(0, 100).map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: c.slug ? `https://nebbuler.com/${c.slug}` : 'https://nebbuler.com',
      name: c.name,
    })),
  }

  const shareText =
    'El ranking en vivo de los creators más leídos de LATAM. Filtros por país y especialidad —'

  return (
    <>
      <Nav />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />

      <main className="min-h-screen bg-white text-[#121212]">
        {/* Hero editorial */}
        <section className="border-b border-[#DEDEDE]">
          <div className="max-w-5xl mx-auto px-6 py-20">
            <p className="text-[10px] uppercase tracking-[0.28em] text-[#C41C1C] font-semibold mb-6">
              Leaderboard · 2026
            </p>
            <h1 className="font-serif text-5xl md:text-7xl font-bold leading-[0.95] tracking-[-0.02em] text-[#121212] max-w-4xl mb-8">
              Los 100 profesionales más leídos en LATAM
            </h1>
            <p className="font-serif text-xl md:text-2xl italic text-[#666] max-w-3xl leading-relaxed mb-10">
              Ranking en vivo · actualizado cada hora · ordenado por suscriptores
              activos en Nebbuler.
            </p>

            <div className="flex flex-wrap items-center gap-6 text-[12px] uppercase tracking-[0.2em] text-[#666]">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#C41C1C] animate-pulse" />
                En vivo
              </span>
              <span>·</span>
              <span>{realCreators.length} creators verificados</span>
              <span>·</span>
              <span>Top 5 destacado en imagen compartible</span>
            </div>
          </div>
        </section>

        {/* Filtros */}
        <section className="border-b border-[#DEDEDE] bg-[#FAFAF7]">
          <div className="max-w-5xl mx-auto px-6 py-6">
            <LeaderboardFilters />
          </div>
        </section>

        {/* Lista */}
        <section className="max-w-5xl mx-auto px-6 py-12" id="ranking">
          <ol className="flex flex-col">
            {padded.map((c, i) => {
              const isPlaceholder = !c.slug
              const band = getBand(i)
              const color = bandColor(i)
              const country = c.country_code
                ? COUNTRY_LABEL[c.country_code] ?? c.country_code
                : null
              const inner = (
                <div
                  className="grid grid-cols-[60px_60px_1fr_auto] md:grid-cols-[80px_72px_1fr_240px_140px] items-center gap-4 py-6 border-b border-[#DEDEDE] hover:bg-[#FAFAF7] transition-colors duration-150"
                  data-country={c.country_code ?? ''}
                  data-area={c.specialty ?? ''}
                >
                  <div
                    className="font-serif text-3xl md:text-5xl font-bold tabular-nums"
                    style={{ color }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#121212] text-white flex items-center justify-center font-serif text-lg font-bold">
                    {isPlaceholder ? '—' : getInitials(c.name)}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-serif text-lg md:text-2xl font-bold text-[#121212] leading-tight">
                      {c.name}
                      {c.verified && (
                        <span
                          className="inline-block ml-2 w-2.5 h-2.5 rounded-full bg-[#C41C1C] align-middle"
                          aria-label="Verificado"
                        />
                      )}
                    </span>
                    {!isPlaceholder && (
                      <span className="text-[12px] text-[#666] uppercase tracking-[0.15em] mt-1">
                        @{c.slug}
                      </span>
                    )}
                  </div>
                  <div className="hidden md:flex flex-col text-[12px] text-[#666] font-sans">
                    <span className="font-medium text-[#121212]">
                      {c.specialty ?? '—'}
                    </span>
                    {country && (
                      <span className="text-[11px] uppercase tracking-[0.15em] mt-1">
                        {country}
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <span
                      className="inline-block text-[10px] uppercase tracking-[0.22em] font-bold border px-3 py-1.5"
                      style={{
                        color,
                        borderColor: color,
                      }}
                    >
                      {band}
                    </span>
                  </div>
                </div>
              )

              return (
                <li key={c.id} className="list-none">
                  {isPlaceholder ? (
                    <div className="opacity-60">{inner}</div>
                  ) : (
                    <Link
                      href={`/${c.slug}`}
                      className="block focus:outline-none focus:ring-2 focus:ring-[#C41C1C]"
                    >
                      {inner}
                    </Link>
                  )}
                </li>
              )
            })}
          </ol>
        </section>

        {/* CTA + share */}
        <section className="border-t-2 border-[#121212] bg-[#FAFAF7]">
          <div className="max-w-5xl mx-auto px-6 py-20 text-center">
            <p className="text-[10px] uppercase tracking-[0.28em] text-[#C41C1C] font-semibold mb-6">
              ¿Por qué no tu nombre acá?
            </p>
            <h2 className="font-serif text-4xl md:text-6xl font-bold leading-[1.05] tracking-[-0.02em] text-[#121212] max-w-3xl mx-auto mb-8">
              Abre tu sala y empieza a aparecer en este ranking.
            </h2>
            <p className="font-serif text-lg italic text-[#666] mb-10 max-w-2xl mx-auto">
              Cobrá membresías en tu moneda local. Sin comisión variable.
              El próximo lugar del ranking puede ser tuyo en una semana.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-12">
              <Link
                href="/registro"
                className="inline-block px-8 py-4 bg-[#C41C1C] text-white text-[12px] uppercase tracking-[0.25em] font-medium hover:bg-[#A01818] transition-colors"
              >
                Abrir mi sala
              </Link>
              <Link
                href="/pulse"
                className="inline-block px-8 py-4 border border-[#121212] text-[#121212] text-[12px] uppercase tracking-[0.25em] font-medium hover:bg-[#121212] hover:text-white transition-colors"
              >
                Ver Pulse de esta semana
              </Link>
            </div>

            <div className="max-w-xl mx-auto">
              <p className="text-[11px] uppercase tracking-[0.25em] text-[#666] mb-4 font-medium">
                Compartí el leaderboard
              </p>
              <ShareButtons
                tool="leaderboard"
                url="https://nebbuler.com/leaderboard"
                text={shareText}
              />
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
