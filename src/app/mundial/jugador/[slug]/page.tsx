import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { safeJsonLd } from '@/lib/rateLimit'
import { SELECCIONES_LATAM } from '@/data/mundial-bootstrap'
import jugadoresData from '@/data/mundial-jugadores.json'

export const revalidate = 3600

interface Jugador {
  slug: string
  nombre_completo: string
  seleccion: string
  bandera: string
  posicion: string
  edad_2026: number
  fecha_nacimiento?: string
  club_2026: string
  mundiales_jugados: number
  apodo?: string
  relevancia?: 'WHALE' | 'MEDIUM' | 'NICHE'
  highlights_2024_2026?: string[]
  caso_especial?: string
}

const JUGADORES: Jugador[] = (jugadoresData as { jugadores: Jugador[] }).jugadores

export async function generateStaticParams() {
  return JUGADORES.map((j) => ({ slug: j.slug }))
}

function findSeleccion(nombre: string) {
  return SELECCIONES_LATAM.find(
    (s) => s.pais.toLowerCase() === nombre.toLowerCase(),
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const j = JUGADORES.find((x) => x.slug === slug)
  if (!j) return {}

  const title = `${j.nombre_completo} en el Mundial 2026 · ${j.seleccion} · Nebbuler`
  const description = `${j.nombre_completo} (${j.bandera} ${j.seleccion}, ${j.posicion}, ${j.club_2026}) en el Mundial 2026. ${
    j.caso_especial ?? `Su ${j.mundiales_jugados === 0 ? 'debut mundialista' : `${j.mundiales_jugados + 1}° Mundial`}.`
  } Periodistas y analistas LATAM que mejor lo cubren.`

  return {
    title,
    description,
    alternates: { canonical: `https://nebbuler.com/mundial/jugador/${j.slug}` },
    openGraph: {
      title,
      description,
      url: `https://nebbuler.com/mundial/jugador/${j.slug}`,
      type: 'profile',
      images: [{ url: `/api/og/mundial-jugador?slug=${j.slug}`, width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image', title, description },
  }
}

export default async function JugadorPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const j = JUGADORES.find((x) => x.slug === slug)
  if (!j) notFound()

  const seleccionLatam = findSeleccion(j.seleccion)
  const otrosJugadoresMismoEquipo = JUGADORES.filter(
    (x) => x.seleccion === j.seleccion && x.slug !== j.slug,
  ).slice(0, 5)
  const otrosJugadoresWhale = JUGADORES.filter(
    (x) => x.relevancia === 'WHALE' && x.slug !== j.slug,
  ).slice(0, 8)

  const personLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: j.nombre_completo,
    alternateName: j.apodo,
    nationality: j.seleccion,
    jobTitle: j.posicion,
    affiliation: { '@type': 'SportsTeam', name: j.club_2026 },
    birthDate: j.fecha_nacimiento,
    description: `Futbolista de la selección de ${j.seleccion}. ${j.caso_especial ?? ''}`,
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
        name: j.nombre_completo,
        item: `https://nebbuler.com/mundial/jugador/${j.slug}`,
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(personLd) }} />
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
            {seleccionLatam ? (
              <Link href={`/mundial/${seleccionLatam.slug}`} className="hover:text-white">{j.seleccion}</Link>
            ) : (
              <span>{j.seleccion}</span>
            )} /{' '}
            <span className="text-white/60">{j.nombre_completo}</span>
          </nav>

          <div className="mb-12">
            <p className="text-[#C41C1C] text-xs font-bold tracking-[0.2em] uppercase mb-3">
              Jugador · Mundial 2026
            </p>
            <h1 className="font-serif text-5xl md:text-7xl leading-[0.95] tracking-tight mb-4">
              {j.nombre_completo}
            </h1>
            {j.apodo && <p className="text-2xl text-white/70 italic mb-6">"{j.apodo}"</p>}
            <div className="flex flex-wrap gap-4 text-sm text-white/60">
              <span>{j.bandera} {j.seleccion}</span>
              <span>·</span>
              <span className="capitalize">{j.posicion}</span>
              <span>·</span>
              <span>{j.club_2026}</span>
              <span>·</span>
              <span>{j.edad_2026} años</span>
              <span>·</span>
              <span>
                {j.mundiales_jugados === 0
                  ? 'Debut mundialista'
                  : `${j.mundiales_jugados}° Mundial jugado`}
              </span>
            </div>
          </div>

          {j.caso_especial && (
            <section className="bg-gradient-to-br from-[#C41C1C]/20 to-transparent border border-[#C41C1C]/30 p-6 md:p-8 mb-12">
              <p className="text-[#C41C1C] text-xs font-bold tracking-[0.2em] uppercase mb-3">
                Caso especial
              </p>
              <p className="text-xl md:text-2xl leading-tight">{j.caso_especial}</p>
            </section>
          )}

          {j.highlights_2024_2026 && j.highlights_2024_2026.length > 0 && (
            <section className="mb-12 pt-12 border-t border-white/10">
              <h2 className="font-serif text-2xl mb-6 tracking-tight">Highlights 2024-2026</h2>
              <ul className="space-y-3">
                {j.highlights_2024_2026.map((h, i) => (
                  <li key={i} className="flex gap-3 text-white/80">
                    <span className="text-[#C41C1C] font-bold">→</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="mb-12 pt-12 border-t border-white/10">
            <h2 className="font-serif text-2xl mb-4 tracking-tight">
              ¿Cubrís a {j.nombre_completo.split(' ')[0]} en el Mundial?
            </h2>
            <p className="text-white/70 leading-relaxed mb-6">
              Si sos periodista, analista táctico, podcaster o creador deportivo que cubre a{' '}
              {j.nombre_completo.split(' ')[0]} o a la {j.bandera} {j.seleccion}, aplicá al{' '}
              <strong className="text-white">Programa La Sombra</strong>: 0% comisión variable hasta
              el 31 de julio. Cobrá en{' '}
              {seleccionLatam?.moneda ? `${seleccionLatam.moneda} ` : 'tu moneda local '}
              a tu hinchada. Setup en 24h.
            </p>
            <a
              href={`https://wa.me/56992551416?text=${encodeURIComponent(
                `Hola, cubro a ${j.nombre_completo} y la selección de ${j.seleccion}. Quiero aplicar al Programa La Sombra.`,
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 font-medium hover:bg-[#1ebd5b] transition-colors"
            >
              Aplicar por WhatsApp →
            </a>
          </section>

          {otrosJugadoresMismoEquipo.length > 0 && (
            <section className="mb-12 pt-12 border-t border-white/10">
              <h2 className="font-serif text-xl mb-4 tracking-tight">
                Otros jugadores de {j.bandera} {j.seleccion}
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {otrosJugadoresMismoEquipo.map((o) => (
                  <Link
                    key={o.slug}
                    href={`/mundial/jugador/${o.slug}`}
                    className="border border-white/10 p-4 hover:border-white/40 hover:bg-white/[0.02]"
                  >
                    <p className="font-medium">{o.nombre_completo}</p>
                    <p className="text-xs text-white/50 capitalize mt-1">{o.posicion} · {o.club_2026}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <section className="pt-12 border-t border-white/10">
            <h2 className="font-serif text-xl mb-4 tracking-tight">Otros jugadores top del Mundial 2026</h2>
            <div className="flex flex-wrap gap-2">
              {otrosJugadoresWhale.map((o) => (
                <Link
                  key={o.slug}
                  href={`/mundial/jugador/${o.slug}`}
                  className="inline-flex items-center gap-2 border border-white/15 px-3 py-2 text-sm hover:border-white/40 hover:bg-white/[0.02]"
                >
                  {o.bandera} {o.nombre_completo}
                </Link>
              ))}
            </div>
          </section>
        </main>

        <footer className="border-t border-white/10 mt-12 py-8 px-6">
          <div className="max-w-5xl mx-auto text-xs text-white/40">
            <p>
              © 2026 Nebbuler · Datos del jugador de fuentes públicas (FIFA, ESPN, Transfermarkt,
              Wikipedia). No afiliados con FIFA, jugador, club ni con el Mundial 2026 oficial.
            </p>
          </div>
        </footer>
      </div>
    </>
  )
}
