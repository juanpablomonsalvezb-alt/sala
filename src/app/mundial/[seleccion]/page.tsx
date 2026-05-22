import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { safeJsonLd } from '@/lib/rateLimit'
import { SELECCIONES_LATAM, MUNDIAL, PROGRAMA_LA_SOMBRA, TASAS_USD } from '@/data/mundial-bootstrap'

export const revalidate = 3600

export async function generateStaticParams() {
  return SELECCIONES_LATAM.map((s) => ({ seleccion: s.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ seleccion: string }>
}): Promise<Metadata> {
  const { seleccion: slug } = await params
  const s = SELECCIONES_LATAM.find((x) => x.slug === slug)
  if (!s) return {}

  const title = `Periodistas y creadores deportivos de ${s.pais} · Mundial 2026 · La Sombra`
  const description = `Programa Nebbuler La Sombra para periodistas, analistas y podcasters de ${s.pais} (${s.apodo}) durante el Mundial 2026. 0% comisión variable hasta el 31 de julio. Cobrá en ${s.moneda} a tus ${s.audiencia_estimada.toLowerCase()}.`

  return {
    title,
    description,
    alternates: { canonical: `https://nebbuler.com/mundial/${s.slug}` },
    openGraph: {
      title,
      description,
      url: `https://nebbuler.com/mundial/${s.slug}`,
      type: 'website',
      images: [{ url: `/api/og/mundial-pais?slug=${s.slug}`, width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image', title, description },
  }
}

export default async function MundialSeleccionPage({
  params,
}: {
  params: Promise<{ seleccion: string }>
}) {
  const { seleccion: slug } = await params
  const s = SELECCIONES_LATAM.find((x) => x.slug === slug)
  if (!s) notFound()

  const tasa = TASAS_USD[s.moneda] ?? 1
  const precioEjemploUsd = 5
  const suscriptoresEjemplo = 200
  const ingresoUsdMes = precioEjemploUsd * suscriptoresEjemplo
  const ingresoLocalMes = ingresoUsdMes * tasa
  const perdidaSubstackUsdAnual = ingresoUsdMes * 0.22 * 12

  const otrasSelecciones = SELECCIONES_LATAM.filter((x) => x.slug !== s.slug)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `Periodistas y creadores deportivos de ${s.pais} para el Mundial 2026`,
    description: `Cómo los creadores deportivos de ${s.pais} pueden monetizar durante el Mundial 2026 con el Programa La Sombra de Nebbuler.`,
    datePublished: '2026-05-21',
    dateModified: new Date().toISOString().split('T')[0],
    author: { '@type': 'Organization', name: 'Nebbuler' },
    publisher: { '@type': 'Organization', name: 'Nebbuler', url: 'https://nebbuler.com' },
    inLanguage: 'es',
    about: {
      '@type': 'SportsTeam',
      name: `Selección de fútbol de ${s.pais}`,
      sport: 'Soccer',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
      />
      <div className="min-h-screen bg-[#050505] text-white">
        <header className="border-b border-white/10">
          <div className="h-[3px] bg-[#C41C1C]" />
          <div className="py-3 px-6">
            <div className="max-w-5xl mx-auto flex items-center justify-between">
              <Link href="/" className="font-serif text-[22px] font-bold tracking-tight">
                NEBBULER
              </Link>
              <Link
                href="/mundial"
                className="text-xs text-white/60 hover:text-white tracking-[0.15em] uppercase"
              >
                ← La Sombra · Mundial 2026
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-6 py-12 md:py-20">
          <nav className="text-xs text-white/40 mb-6 tracking-wide">
            <Link href="/" className="hover:text-white">
              Nebbuler
            </Link>{' '}
            /{' '}
            <Link href="/mundial" className="hover:text-white">
              Mundial 2026
            </Link>{' '}
            / <span className="text-white/60">{s.pais}</span>
          </nav>

          <div className="mb-12">
            <p className="text-7xl mb-4">{s.bandera}</p>
            <p className="text-[#C41C1C] text-xs font-bold tracking-[0.2em] uppercase mb-3">
              Programa La Sombra · {s.pais}
            </p>
            <h1 className="font-serif text-4xl md:text-6xl leading-[1.05] tracking-tight mb-4">
              Periodistas y creadores deportivos de{' '}
              <span className="italic">{s.pais}</span>
            </h1>
            <p className="text-xl text-white/70 mb-4 italic">{s.apodo}</p>
            <p className="text-white/60 text-base leading-relaxed max-w-3xl">
              {s.audiencia_estimada} · ~{s.creadores_potenciales} creadores potenciales en el
              ecosistema deportivo de {s.pais}. Programa Nebbuler La Sombra: 0% comisión
              variable hasta el 31 de julio de 2026.
            </p>
          </div>

          <section className="grid md:grid-cols-3 gap-4 mb-16">
            <div className="border border-white/10 p-6">
              <p className="text-white/40 text-xs tracking-[0.15em] uppercase mb-2">Moneda</p>
              <p className="font-serif text-3xl">{s.moneda}</p>
              <p className="text-white/50 text-sm mt-2">Pagos directos en {s.moneda_simbolo}</p>
            </div>
            <div className="border border-white/10 p-6">
              <p className="text-white/40 text-xs tracking-[0.15em] uppercase mb-2">
                Comisión durante Mundial
              </p>
              <p className="font-serif text-3xl text-[#C41C1C]">0%</p>
              <p className="text-white/50 text-sm mt-2">Hasta el 31 de julio de 2026</p>
            </div>
            <div className="border border-white/10 p-6">
              <p className="text-white/40 text-xs tracking-[0.15em] uppercase mb-2">
                Días para el Mundial
              </p>
              <p className="font-serif text-3xl">{MUNDIAL.dias_para_inicio()}</p>
              <p className="text-white/50 text-sm mt-2">Inicio: 11 de junio de 2026</p>
            </div>
          </section>

          <section className="mb-16 pt-12 border-t border-white/10">
            <h2 className="font-serif text-3xl mb-6 tracking-tight">
              Ejemplo concreto para un creador de {s.pais}
            </h2>
            <div className="bg-white text-black p-8">
              <p className="text-sm text-black/60 mb-6">
                Caso: analista táctico de {s.pais} con 200 hinchas pagando US${precioEjemploUsd}/mes
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs tracking-[0.2em] uppercase text-black/40 mb-2">
                    Ingreso bruto mensual
                  </p>
                  <p className="font-serif text-3xl mb-1">US${ingresoUsdMes}</p>
                  <p className="text-black/60 text-sm">
                    ≈ {s.moneda_simbolo}
                    {Math.round(ingresoLocalMes).toLocaleString('es-CL')} {s.moneda}
                  </p>
                </div>
                <div>
                  <p className="text-xs tracking-[0.2em] uppercase text-[#C41C1C] mb-2">
                    Lo que pierde en Substack al año
                  </p>
                  <p className="font-serif text-3xl text-[#C41C1C] mb-1">
                    US${Math.round(perdidaSubstackUsdAnual)}
                  </p>
                  <p className="text-black/60 text-sm">22% en comisiones + FX doble</p>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-black/10">
                <p className="text-sm">
                  Durante el Mundial 2026 con Nebbuler La Sombra, ese mismo creador conserva
                  el <strong>96%</strong> del ingreso (solo paga el procesador local 3.99%). En
                  60 días recupera <strong>US${Math.round(ingresoUsdMes * 0.18 * 2)}</strong>{' '}
                  que con Substack se iban a Silicon Valley.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-16 pt-12 border-t border-white/10">
            <h2 className="font-serif text-3xl mb-6 tracking-tight">
              ¿Quiénes pueden aplicar desde {s.pais}?
            </h2>
            <ul className="space-y-3 text-white/80">
              <li className="flex gap-3 items-start">
                <span className="text-[#C41C1C] font-bold">→</span>
                Periodistas deportivos independientes con audiencia en X/LinkedIn/YouTube
              </li>
              <li className="flex gap-3 items-start">
                <span className="text-[#C41C1C] font-bold">→</span>
                Analistas tácticos con podcast o newsletter propia
              </li>
              <li className="flex gap-3 items-start">
                <span className="text-[#C41C1C] font-bold">→</span>
                Ex-jugadores de la {s.apodo} o de clubes locales con contenido propio
              </li>
              <li className="flex gap-3 items-start">
                <span className="text-[#C41C1C] font-bold">→</span>
                Cuentas dedicadas a clubes locales de {s.pais} con hinchada leal
              </li>
              <li className="flex gap-3 items-start">
                <span className="text-[#C41C1C] font-bold">→</span>
                YouTubers deportivos con contenido sobre la {s.apodo}
              </li>
            </ul>
          </section>

          <section className="mb-16 pt-12 border-t border-white/10">
            <div className="bg-gradient-to-br from-[#C41C1C]/30 to-transparent border border-[#C41C1C]/30 p-8 md:p-12">
              <p className="text-[#C41C1C] text-xs font-bold tracking-[0.2em] uppercase mb-4">
                Aplicar al programa
              </p>
              <h3 className="font-serif text-3xl md:text-4xl mb-4 tracking-tight">
                {s.bandera} Creadores de {s.pais}: 60 días, 0% comisión.
              </h3>
              <p className="text-white/80 text-lg leading-relaxed mb-6 max-w-3xl">
                Setup completo en 24 horas. Sin formularios. WhatsApp directo con el fundador
                Juan Pablo. Probás Nebbuler durante el evento futbolero más grande del año sin
                pagar nada de comisión variable.
              </p>
              <a
                href={`https://wa.me/56992551416?text=${encodeURIComponent(
                  `Hola, soy creador deportivo de ${s.pais}. Quiero aplicar al Programa La Sombra de Nebbuler.`,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 font-medium hover:bg-[#1ebd5b] transition-colors"
              >
                Aplicar por WhatsApp →
              </a>
            </div>
          </section>

          <section className="pt-12 border-t border-white/10">
            <h3 className="font-serif text-xl mb-4 text-white/80">Otras selecciones LATAM</h3>
            <div className="flex flex-wrap gap-2">
              {otrasSelecciones.map((o) => (
                <Link
                  key={o.slug}
                  href={`/mundial/${o.slug}`}
                  className="inline-flex items-center gap-2 border border-white/15 px-4 py-2 text-sm hover:border-white/40 hover:bg-white/[0.02]"
                >
                  {o.bandera} {o.pais}
                </Link>
              ))}
            </div>
          </section>
        </main>

        <footer className="border-t border-white/10 mt-16 py-8 px-6">
          <div className="max-w-5xl mx-auto text-xs text-white/40">
            <p>
              © 2026 Nebbuler · La Sombra es un programa de Nebbuler. No afiliado con FIFA ni
              con el Mundial 2026 oficial.
            </p>
          </div>
        </footer>
      </div>
    </>
  )
}
