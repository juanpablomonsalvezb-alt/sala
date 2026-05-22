import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { safeJsonLd } from '@/lib/rateLimit'
import sedesData from '@/data/mundial-sedes-detalle.json'

export const revalidate = 3600

interface Sede {
  slug: string
  ciudad: string
  pais: string
  estadio_nombre_oficial: string
  estadio_nombre_torneo: string
  capacidad_mundial: number
  capacidad_nominal?: number
  inauguracion_año?: number
  partidos_asignados: number
  desglose_partidos?: string
  rol_especial?: string
  usos_historicos?: string[]
  hispanohablantes_pct?: number
  clima_jun_jul?: string
  huso_horario?: string
  aeropuerto_principal?: string
  transporte_estadio?: string
  precio_hotel_4_estrellas_usd?: number
  precio_hotel_rango_usd?: string
  vuelos_directos_desde?: string[]
  tip_creador_deportivo?: string
}

const SEDES: Sede[] = (sedesData as { sedes: Sede[] }).sedes

export async function generateStaticParams() {
  return SEDES.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const s = SEDES.find((x) => x.slug === slug)
  if (!s) return {}

  const title = `${s.estadio_nombre_oficial}, ${s.ciudad} · Mundial 2026 · Nebbuler`
  const description = `Todo sobre ${s.estadio_nombre_oficial} (${s.ciudad}, ${s.pais}) en el Mundial 2026: ${
    s.partidos_asignados
  } partidos, capacidad ${s.capacidad_mundial.toLocaleString('es-CL')} espectadores. ${
    s.rol_especial ?? 'Sede del Mundial.'
  }`

  return {
    title,
    description,
    alternates: { canonical: `https://nebbuler.com/mundial/sede/${s.slug}` },
    openGraph: {
      title,
      description,
      url: `https://nebbuler.com/mundial/sede/${s.slug}`,
      type: 'website',
      images: [{ url: `/api/og/mundial-sede?slug=${s.slug}`, width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image', title, description },
  }
}

export default async function SedePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const s = SEDES.find((x) => x.slug === slug)
  if (!s) notFound()

  const placeLd = {
    '@context': 'https://schema.org',
    '@type': 'StadiumOrArena',
    name: s.estadio_nombre_oficial,
    alternateName: s.estadio_nombre_torneo,
    address: {
      '@type': 'PostalAddress',
      addressLocality: s.ciudad,
      addressCountry: s.pais,
    },
    maximumAttendeeCapacity: s.capacidad_mundial,
    foundingDate: s.inauguracion_año ? String(s.inauguracion_año) : undefined,
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
        name: s.ciudad,
        item: `https://nebbuler.com/mundial/sede/${s.slug}`,
      },
    ],
  }

  const otrasSedes = SEDES.filter((x) => x.slug !== s.slug)
  const mismasPais = otrasSedes.filter((x) => x.pais === s.pais).slice(0, 5)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(placeLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbLd) }} />
      <div className="min-h-screen bg-[#050505] text-white">
        <header className="border-b border-white/10">
          <div className="h-[3px] bg-[#C41C1C]" />
          <div className="py-3 px-6">
            <div className="max-w-5xl mx-auto flex items-center justify-between">
              <Link href="/" className="font-serif text-[22px] font-bold tracking-tight">
                NEBBULER
              </Link>
              <Link href="/mundial" className="text-xs text-white/60 hover:text-white tracking-[0.15em] uppercase">
                ← La Sombra
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-6 py-12 md:py-16">
          <nav className="text-xs text-white/40 mb-6">
            <Link href="/mundial" className="hover:text-white">Mundial 2026</Link> /{' '}
            <span>Sedes</span> /{' '}
            <span className="text-white/60">{s.ciudad}</span>
          </nav>

          <p className="text-[#C41C1C] text-xs font-bold tracking-[0.2em] uppercase mb-3">
            Sede · {s.pais} · {s.partidos_asignados} partido{s.partidos_asignados > 1 ? 's' : ''}
          </p>
          <h1 className="font-serif text-4xl md:text-6xl leading-[1.05] tracking-tight mb-2">
            {s.estadio_nombre_oficial}
          </h1>
          {s.estadio_nombre_torneo !== s.estadio_nombre_oficial && (
            <p className="text-lg text-white/60 italic mb-4">
              durante el Mundial: "{s.estadio_nombre_torneo}"
            </p>
          )}
          <p className="text-xl text-white/70 mb-10">
            {s.ciudad}, {s.pais}
          </p>

          {s.rol_especial && (
            <section className="bg-gradient-to-br from-[#C41C1C]/20 to-transparent border border-[#C41C1C]/30 p-6 md:p-8 mb-12">
              <p className="text-[#C41C1C] text-xs font-bold tracking-[0.2em] uppercase mb-3">
                Rol especial
              </p>
              <p className="text-lg md:text-xl leading-tight">{s.rol_especial}</p>
            </section>
          )}

          <section className="grid sm:grid-cols-2 md:grid-cols-4 gap-3 mb-12">
            <Stat label="Capacidad" value={s.capacidad_mundial.toLocaleString('es-CL')} sub="espectadores" />
            <Stat label="Partidos" value={String(s.partidos_asignados)} sub={s.desglose_partidos ?? ''} />
            {s.inauguracion_año && (
              <Stat label="Inauguración" value={String(s.inauguracion_año)} sub={`${2026 - s.inauguracion_año} años`} />
            )}
            {s.hispanohablantes_pct !== undefined && (
              <Stat label="Hispanohablantes" value={`${s.hispanohablantes_pct}%`} sub="de la ciudad" />
            )}
          </section>

          {s.usos_historicos && s.usos_historicos.length > 0 && (
            <section className="mb-12 pt-8 border-t border-white/10">
              <h2 className="font-serif text-2xl mb-6 tracking-tight">Historia del estadio</h2>
              <ul className="space-y-3">
                {s.usos_historicos.map((u, i) => (
                  <li key={i} className="flex gap-3 text-white/80">
                    <span className="text-[#C41C1C] font-bold">→</span>
                    <span>{u}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="grid md:grid-cols-2 gap-6 mb-12 pt-8 border-t border-white/10">
            {s.clima_jun_jul && (
              <div>
                <p className="text-[10px] tracking-[0.2em] uppercase text-white/40 mb-2">Clima junio-julio</p>
                <p className="text-white/80">{s.clima_jun_jul}</p>
              </div>
            )}
            {s.huso_horario && (
              <div>
                <p className="text-[10px] tracking-[0.2em] uppercase text-white/40 mb-2">Huso horario</p>
                <p className="text-white/80">{s.huso_horario}</p>
              </div>
            )}
            {s.aeropuerto_principal && (
              <div>
                <p className="text-[10px] tracking-[0.2em] uppercase text-white/40 mb-2">Aeropuerto</p>
                <p className="text-white/80">{s.aeropuerto_principal}</p>
              </div>
            )}
            {s.transporte_estadio && (
              <div>
                <p className="text-[10px] tracking-[0.2em] uppercase text-white/40 mb-2">Cómo llegar al estadio</p>
                <p className="text-white/80">{s.transporte_estadio}</p>
              </div>
            )}
            {s.precio_hotel_4_estrellas_usd && (
              <div>
                <p className="text-[10px] tracking-[0.2em] uppercase text-white/40 mb-2">Hotel 4 estrellas</p>
                <p className="text-white/80">
                  ~US${s.precio_hotel_4_estrellas_usd}/noche{' '}
                  {s.precio_hotel_rango_usd && (
                    <span className="text-white/40 text-sm">(rango: US${s.precio_hotel_rango_usd})</span>
                  )}
                </p>
              </div>
            )}
            {s.vuelos_directos_desde && s.vuelos_directos_desde.length > 0 && (
              <div>
                <p className="text-[10px] tracking-[0.2em] uppercase text-white/40 mb-2">Vuelos directos desde LATAM</p>
                <p className="text-white/80">{s.vuelos_directos_desde.join(', ')}</p>
              </div>
            )}
          </section>

          {s.tip_creador_deportivo && (
            <section className="mb-12 pt-8 border-t border-white/10">
              <p className="text-[#C41C1C] text-xs font-bold tracking-[0.2em] uppercase mb-3">
                Tip para creador deportivo
              </p>
              <p className="text-lg text-white/80 leading-relaxed">{s.tip_creador_deportivo}</p>
            </section>
          )}

          <section className="pt-12 border-t border-white/10">
            <h2 className="font-serif text-3xl mb-4 tracking-tight">
              ¿Cubrís el Mundial desde {s.ciudad}?
            </h2>
            <p className="text-white/70 leading-relaxed mb-6">
              Si sos periodista, fotógrafo o creador deportivo cubriendo desde {s.ciudad}, aplicá
              al <strong className="text-white">Programa La Sombra</strong>. Cobrá en moneda local
              a tu audiencia hispanohablante mientras transmitís el Mundial.
            </p>
            <a
              href={`https://wa.me/56992551416?text=${encodeURIComponent(
                `Hola, cubro el Mundial desde ${s.ciudad}. Quiero aplicar al Programa La Sombra.`,
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 font-medium hover:bg-[#1ebd5b] transition-colors"
            >
              Aplicar por WhatsApp →
            </a>
          </section>

          {mismasPais.length > 0 && (
            <section className="mt-12 pt-12 border-t border-white/10">
              <h3 className="font-serif text-xl mb-4">Otras sedes en {s.pais}</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {mismasPais.map((o) => (
                  <Link
                    key={o.slug}
                    href={`/mundial/sede/${o.slug}`}
                    className="border border-white/10 p-4 hover:border-white/40 hover:bg-white/[0.02]"
                  >
                    <p className="font-medium">{o.ciudad}</p>
                    <p className="text-xs text-white/50 mt-1">{o.estadio_nombre_oficial}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <section className="mt-8 pt-8 border-t border-white/10">
            <h3 className="font-serif text-xl mb-4">Las 16 sedes del Mundial 2026</h3>
            <div className="flex flex-wrap gap-2">
              {SEDES.map((o) => (
                <Link
                  key={o.slug}
                  href={`/mundial/sede/${o.slug}`}
                  className={`inline-flex items-center gap-2 px-3 py-2 text-sm border ${
                    o.slug === s.slug
                      ? 'border-[#C41C1C] bg-[#C41C1C]/10'
                      : 'border-white/15 hover:border-white/40 hover:bg-white/[0.02]'
                  }`}
                >
                  {o.ciudad}
                </Link>
              ))}
            </div>
          </section>
        </main>

        <footer className="border-t border-white/10 mt-12 py-8 px-6">
          <div className="max-w-5xl mx-auto text-xs text-white/40">
            <p>
              © 2026 Nebbuler · Datos verificados de FIFA, host committees oficiales y Wikipedia.
              No afiliados con FIFA, estadios ni con el Mundial 2026 oficial.
            </p>
          </div>
        </footer>
      </div>
    </>
  )
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="border border-white/10 p-5">
      <p className="text-[10px] tracking-[0.2em] uppercase text-white/40 mb-2">{label}</p>
      <p className="font-serif text-2xl font-bold leading-tight">{value}</p>
      {sub && <p className="text-xs text-white/40 mt-2">{sub}</p>}
    </div>
  )
}
