import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { safeJsonLd } from '@/lib/rateLimit'
import { SELECCIONES_LATAM, MUNDIAL } from '@/data/mundial-bootstrap'
import partidos from '@/data/mundial-partidos.json'
import { PARTIDOS_EDITORIAL, GRUPOS_EDITORIAL } from '@/data/mundial-editorial'

export const revalidate = 3600

type Partido = {
  id: number
  slug: string
  equipo1: string
  equipo2: string
  grupo: string | null
  jornada: number
  fase: string
  fase_nombre?: string
  fecha: string
  hora_ref: string
  placeholder?: boolean
}

const PARTIDOS = partidos as Partido[]

const FASE_LABELS: Record<string, string> = {
  grupos: 'Fase de Grupos',
  dieciseisavos: 'Dieciseisavos de Final',
  octavos: 'Octavos de Final',
  cuartos: 'Cuartos de Final',
  semifinales: 'Semifinales',
  'tercer-lugar': 'Partido por el Tercer Puesto',
  final: 'Final',
}

const LATAM_SET = new Set([
  'Argentina', 'Brasil', 'Mexico', 'México', 'Colombia', 'Uruguay',
  'Ecuador', 'Chile', 'Peru', 'Perú', 'Paraguay', 'Bolivia',
  'Venezuela', 'Honduras', 'Panama', 'Panamá', 'Haiti', 'Haití',
  'Costa Rica',
])

function formatFecha(fecha: string): string {
  const [y, m, d] = fecha.split('-').map(Number)
  const meses = ['enero','febrero','marzo','abril','mayo','junio',
    'julio','agosto','septiembre','octubre','noviembre','diciembre']
  return `${d} de ${meses[m - 1]} de ${y}`
}

function findSeleccion(name: string) {
  return SELECCIONES_LATAM.find(
    (s) => s.pais.toLowerCase() === name.toLowerCase() || s.slug === name.toLowerCase(),
  )
}

export async function generateStaticParams() {
  return PARTIDOS.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const partido = PARTIDOS.find((p) => p.slug === slug)
  if (!partido) return {}

  const faseLabel = FASE_LABELS[partido.fase] ?? partido.fase_nombre ?? partido.fase
  const isPlaceholder = partido.placeholder

  const title = isPlaceholder
    ? `${faseLabel} · Mundial 2026 · Nebbuler`
    : `${partido.equipo1} vs ${partido.equipo2} · ${faseLabel} · Mundial FIFA 2026`

  const description = isPlaceholder
    ? `${faseLabel} del Mundial FIFA 2026. Análisis, fecha, hora y cómo los periodistas deportivos de LATAM están monetizando la Copa del Mundo con Nebbuler.`
    : `${partido.equipo1} vs ${partido.equipo2} en el Mundial FIFA 2026 — ${faseLabel}${partido.grupo ? `, Grupo ${partido.grupo}` : ''}. Fecha: ${formatFecha(partido.fecha)}. Análisis en español para LATAM. Programa La Sombra de Nebbuler: 0% comisión para creadores deportivos.`

  return {
    title,
    description,
    keywords: isPlaceholder
      ? [`${faseLabel} mundial 2026`, 'copa del mundo 2026', 'mundial fifa 2026 fecha']
      : [
          `${partido.equipo1} vs ${partido.equipo2} mundial 2026`,
          `${partido.equipo1} vs ${partido.equipo2} copa del mundo 2026`,
          `${partido.equipo1} vs ${partido.equipo2} fifa 2026`,
          `cuando juega ${partido.equipo1} vs ${partido.equipo2} 2026`,
          `${partido.equipo1} ${partido.equipo2} ${formatFecha(partido.fecha)}`,
          `grupo ${partido.grupo ?? ''} mundial 2026`,
        ],
    alternates: { canonical: `https://nebbuler.com/mundial/partido/${partido.slug}` },
    openGraph: {
      title,
      description,
      url: `https://nebbuler.com/mundial/partido/${partido.slug}`,
      type: 'website',
      images: [{ url: `/api/og/mundial`, width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image', title, description },
  }
}

export default async function PartidoPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const partido = PARTIDOS.find((p) => p.slug === slug)
  if (!partido) notFound()

  const faseLabel = FASE_LABELS[partido.fase] ?? partido.fase_nombre ?? partido.fase
  const isPlaceholder = partido.placeholder ?? false
  const latamEnPartido = [partido.equipo1, partido.equipo2].filter((e) => LATAM_SET.has(e))
  const editorial = PARTIDOS_EDITORIAL[partido.slug] ?? null
  const grupoEditorial = partido.grupo ? GRUPOS_EDITORIAL[partido.grupo] ?? null : null
  const sel1 = findSeleccion(partido.equipo1)
  const sel2 = findSeleccion(partido.equipo2)

  // Partidos del mismo grupo para enlace interno
  const mismoGrupo = partido.grupo
    ? PARTIDOS.filter(
        (p) => p.grupo === partido.grupo && p.slug !== partido.slug && !p.placeholder,
      )
    : []

  const jsonLd = isPlaceholder
    ? null
    : {
        '@context': 'https://schema.org',
        '@type': 'SportsEvent',
        name: `${partido.equipo1} vs ${partido.equipo2} - ${faseLabel} - Mundial 2026`,
        description: `Partido del Mundial FIFA 2026: ${partido.equipo1} contra ${partido.equipo2}`,
        startDate: `${partido.fecha}T18:00:00-05:00`,
        endDate: `${partido.fecha}T20:00:00-05:00`,
        sport: 'Soccer',
        eventStatus: 'https://schema.org/EventScheduled',
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        location: {
          '@type': 'Place',
          name: 'Sede del Mundial 2026',
          address: {
            '@type': 'PostalAddress',
            addressCountry: 'US',
          },
        },
        organizer: {
          '@type': 'Organization',
          name: 'FIFA',
          url: 'https://www.fifa.com',
        },
        performer: [
          { '@type': 'SportsTeam', name: partido.equipo1 },
          { '@type': 'SportsTeam', name: partido.equipo2 },
        ],
        competitor: [
          { '@type': 'SportsTeam', name: partido.equipo1 },
          { '@type': 'SportsTeam', name: partido.equipo2 },
        ],
        image: 'https://nebbuler.com/mundial-og.png',
        offers: {
          '@type': 'Offer',
          url: 'https://nebbuler.com/mundial/entradas',
          price: '120',
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
          validFrom: '2025-10-01',
        },
        superEvent: {
          '@type': 'SportsEvent',
          name: 'Copa del Mundo FIFA 2026',
          startDate: MUNDIAL.fecha_inicio,
          endDate: MUNDIAL.fecha_fin,
        },
      }

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://nebbuler.com' },
      { '@type': 'ListItem', position: 2, name: 'Mundial 2026', item: 'https://nebbuler.com/mundial' },
      {
        '@type': 'ListItem', position: 3,
        name: isPlaceholder ? faseLabel : `${partido.equipo1} vs ${partido.equipo2}`,
        item: `https://nebbuler.com/mundial/partido/${partido.slug}`,
      },
    ],
  }

  return (
    <>
      {jsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbLd) }} />

      <div className="min-h-screen bg-[#050505] text-white">
        {/* Header */}
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
          {/* Breadcrumb */}
          <nav className="text-xs text-white/40 mb-6">
            <Link href="/mundial" className="hover:text-white">Mundial 2026</Link>
            {partido.grupo && (
              <>
                {' / '}
                <Link href={`/mundial/grupo/${partido.grupo.toLowerCase()}`} className="hover:text-white">
                  Grupo {partido.grupo}
                </Link>
              </>
            )}
            {' / '}
            <span className="text-white/60">
              {isPlaceholder ? faseLabel : `${partido.equipo1} vs ${partido.equipo2}`}
            </span>
          </nav>

          {/* Eyebrow */}
          <p className="text-[#C41C1C] text-xs font-bold tracking-[0.2em] uppercase mb-4">
            {faseLabel}
            {partido.grupo && ` · Grupo ${partido.grupo}`}
            {' · Mundial FIFA 2026'}
          </p>

          {/* Título principal */}
          {isPlaceholder ? (
            <h1 className="font-serif text-5xl md:text-7xl leading-[0.95] tracking-tight mb-6">
              {faseLabel}
            </h1>
          ) : (
            <h1 className="font-serif text-5xl md:text-7xl leading-[0.95] tracking-tight mb-6">
              <span className={sel1 ? 'text-white' : 'text-white/80'}>{partido.equipo1}</span>
              <span className="text-[#C41C1C] mx-4">vs</span>
              <span className={sel2 ? 'text-white' : 'text-white/80'}>{partido.equipo2}</span>
            </h1>
          )}

          {/* Fecha y hora */}
          <div className="flex flex-wrap gap-6 mb-12 text-sm text-white/60">
            <div>
              <span className="text-white/30 text-xs uppercase tracking-widest block mb-1">Fecha</span>
              <span className="text-white">{formatFecha(partido.fecha)}</span>
            </div>
            <div>
              <span className="text-white/30 text-xs uppercase tracking-widest block mb-1">Hora</span>
              <span className="text-white">{partido.hora_ref}</span>
            </div>
            <div>
              <span className="text-white/30 text-xs uppercase tracking-widest block mb-1">Jornada</span>
              <span className="text-white">{partido.jornada}</span>
            </div>
          </div>

          {/* Cards equipos */}
          {!isPlaceholder && (
            <section className="mb-16">
              <div className="grid sm:grid-cols-2 gap-6">
                {[{ equipo: partido.equipo1, sel: sel1 }, { equipo: partido.equipo2, sel: sel2 }].map(
                  ({ equipo, sel }) => (
                    <div
                      key={equipo}
                      className={`border p-6 ${
                        LATAM_SET.has(equipo)
                          ? 'border-[#C41C1C]/40 bg-[#C41C1C]/5'
                          : 'border-white/10'
                      }`}
                    >
                      {sel && <p className="text-4xl mb-3">{sel.bandera}</p>}
                      <h2 className="font-serif text-2xl mb-2">{equipo}</h2>
                      {LATAM_SET.has(equipo) && (
                        <p className="text-[#C41C1C] text-xs mb-3">Selección de LATAM</p>
                      )}
                      {sel && (
                        <Link
                          href={`/mundial/${sel.slug}`}
                          className="text-[#C41C1C] text-xs hover:underline"
                        >
                          Creadores que cubren a {equipo} →
                        </Link>
                      )}
                    </div>
                  ),
                )}
              </div>
            </section>
          )}

          {/* Contenido editorial */}
          {editorial && (
            <section className="mb-16">
              <div className="border-t-[3px] border-white pt-8 mb-8">
                <p className="text-[#C41C1C] text-xs font-bold tracking-[0.2em] uppercase mb-4">
                  Análisis del partido
                </p>
                <p className="text-white/80 leading-relaxed text-lg mb-6 font-serif">
                  {editorial.analisis}
                </p>
              </div>

              <div className="grid sm:grid-cols-3 gap-6">
                <div className="border border-white/10 p-5">
                  <p className="text-[#C41C1C] text-xs font-bold tracking-[0.15em] uppercase mb-3">Contexto</p>
                  <p className="text-white/70 text-sm leading-relaxed">{editorial.contexto}</p>
                </div>
                <div className="border border-white/10 p-5">
                  <p className="text-[#C41C1C] text-xs font-bold tracking-[0.15em] uppercase mb-3">Dato histórico</p>
                  <p className="text-white/70 text-sm leading-relaxed">{editorial.dato_historico}</p>
                </div>
                <div className="border border-[#C41C1C]/30 bg-[#C41C1C]/5 p-5">
                  <p className="text-[#C41C1C] text-xs font-bold tracking-[0.15em] uppercase mb-3">Para creadores</p>
                  <p className="text-white/70 text-sm leading-relaxed">{editorial.angulo_creador}</p>
                </div>
              </div>
            </section>
          )}

          {/* Contexto del grupo sin editorial específico */}
          {!editorial && grupoEditorial && !isPlaceholder && (
            <section className="mb-16 border-t border-white/10 pt-10">
              <p className="text-[#C41C1C] text-xs font-bold tracking-[0.2em] uppercase mb-4">
                Grupo {partido.grupo} · Mundial 2026
              </p>
              <p className="text-white/70 leading-relaxed mb-4">{grupoEditorial.descripcion}</p>
              {grupoEditorial.latam_contexto && (
                <p className="text-white/60 leading-relaxed text-sm border-l-2 border-[#C41C1C] pl-4">
                  {grupoEditorial.latam_contexto}
                </p>
              )}
            </section>
          )}

          {/* Bloque La Sombra — CTA */}
          {latamEnPartido.length > 0 && (
            <section className="mb-16 border border-[#C41C1C]/30 p-8 bg-[#C41C1C]/5">
              <p className="text-[#C41C1C] text-xs font-bold tracking-[0.2em] uppercase mb-3">
                Programa La Sombra · Nebbuler
              </p>
              <h2 className="font-serif text-3xl mb-4">
                {latamEnPartido.length === 1
                  ? `¿Cubrís a ${latamEnPartido[0]}?`
                  : `¿Cubrís ${latamEnPartido.join(' o ')}?`}
              </h2>
              <p className="text-white/70 leading-relaxed mb-6">
                Este partido va a generar{' '}
                <strong className="text-white">miles de búsquedas en español</strong> en las horas
                previas y posteriores. Los periodistas, analistas y podcasters deportivos de LATAM
                que usen Nebbuler cobran membresías en pesos a su audiencia —{' '}
                <strong className="text-white">sin comisión variable durante todo el Mundial 2026</strong>.
              </p>
              <Link
                href="/mundial#aplicar"
                className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 font-medium hover:bg-white/90 transition-colors"
              >
                Aplicar al Programa La Sombra →
              </Link>
            </section>
          )}

          {latamEnPartido.length === 0 && !isPlaceholder && (
            <section className="mb-16 border border-white/10 p-8">
              <p className="text-white/30 text-xs font-bold tracking-[0.2em] uppercase mb-3">
                Programa La Sombra · Nebbuler
              </p>
              <h2 className="font-serif text-2xl mb-4">¿Seguís el Mundial 2026?</h2>
              <p className="text-white/60 leading-relaxed mb-6">
                El Programa La Sombra de Nebbuler permite a periodistas y creadores deportivos
                de toda Latinoamérica monetizar su cobertura del Mundial con 0% de comisión variable.
              </p>
              <Link href="/mundial" className="text-[#C41C1C] text-sm hover:underline">
                Conocer el Programa La Sombra →
              </Link>
            </section>
          )}

          {/* Otros partidos del grupo */}
          {mismoGrupo.length > 0 && (
            <section className="mb-16 pt-12 border-t border-white/10">
              <h2 className="font-serif text-2xl mb-6">
                Otros partidos del Grupo {partido.grupo}
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {mismoGrupo.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/mundial/partido/${p.slug}`}
                    className="border border-white/10 p-4 hover:border-white/30 hover:bg-white/[0.02] transition-colors"
                  >
                    <p className="font-medium text-sm">
                      {p.equipo1} <span className="text-[#C41C1C]">vs</span> {p.equipo2}
                    </p>
                    <p className="text-white/40 text-xs mt-1">
                      Jornada {p.jornada} · {formatFecha(p.fecha)}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Enlace al grupo */}
          {partido.grupo && (
            <div className="mb-12">
              <Link
                href={`/mundial/grupo/${partido.grupo.toLowerCase()}`}
                className="text-white/50 text-sm hover:text-white inline-flex items-center gap-2"
              >
                ← Ver clasificación completa del Grupo {partido.grupo}
              </Link>
            </div>
          )}
        </main>

        <footer className="border-t border-white/10 py-8 px-6">
          <div className="max-w-5xl mx-auto text-xs text-white/40">
            <p>
              © 2026 Nebbuler · Programa La Sombra para creadores deportivos LATAM.
              No afiliado con FIFA ni con el Mundial 2026 oficial.
            </p>
          </div>
        </footer>
      </div>
    </>
  )
}
