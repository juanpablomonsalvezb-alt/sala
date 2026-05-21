import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { INDUSTRIAS, PAISES_REG, REG_PAIS_BASE } from '@/data/programmatic/regulaciones-2026'
import { safeJsonLd } from '@/lib/rateLimit'

export const revalidate = 86400
const ANIO = 2026

export async function generateStaticParams(): Promise<{ industria: string; pais: string }[]> {
  const params: { industria: string; pais: string }[] = []
  for (const ind of INDUSTRIAS) {
    for (const pais of PAISES_REG) {
      params.push({ industria: ind.slug, pais: pais.slug })
    }
  }
  return params
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ industria: string; pais: string }>
}): Promise<Metadata> {
  const { industria: indSlug, pais: paisSlug } = await params
  const ind = INDUSTRIAS.find(i => i.slug === indSlug)
  const pais = PAISES_REG.find(p => p.slug === paisSlug)
  if (!ind || !pais) return {}
  const title = `Regulaciones ${ind.nombre} en ${pais.nombre} ${ANIO}: lo esencial`
  const description = `Marco normativo ${ANIO} para ${ind.nombre} en ${pais.nombre}. Leyes vigentes, cambios recientes y qué deben saber los profesionales del sector.`
  const url = `https://nebbuler.com/regulaciones/${indSlug}/${paisSlug}/2026`
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, type: 'article', url },
    twitter: { card: 'summary_large_image', title, description },
  }
}

export default async function RegulacionesPage({
  params,
}: {
  params: Promise<{ industria: string; pais: string }>
}) {
  const { industria: indSlug, pais: paisSlug } = await params
  const ind = INDUSTRIAS.find(i => i.slug === indSlug)
  const pais = PAISES_REG.find(p => p.slug === paisSlug)
  if (!ind || !pais) notFound()
  const regPais = REG_PAIS_BASE[paisSlug]
  if (!regPais) notFound()

  const canonical = `https://nebbuler.com/regulaciones/${indSlug}/${paisSlug}/2026`

  // Otras industrias en el mismo país
  const otrasIndustrias = INDUSTRIAS.filter(i => i.slug !== indSlug).slice(0, 6)
  // Misma industria en otros países
  const otrosPaises = PAISES_REG.filter(p => p.slug !== paisSlug).slice(0, 5)

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `Regulaciones ${ind.nombre} en ${pais.nombre} ${ANIO}`,
    description: `Marco normativo ${ANIO} para profesionales del sector ${ind.nombre} en ${pais.nombre}.`,
    author: { '@type': 'Organization', name: 'Nebbuler' },
    publisher: { '@type': 'Organization', name: 'Nebbuler', logo: { '@type': 'ImageObject', url: 'https://nebbuler.com/nebbuler-logo.png' } },
    datePublished: `${ANIO}-01-15`,
    dateModified: new Date().toISOString().split('T')[0],
    inLanguage: 'es',
    mainEntityOfPage: canonical,
    about: { '@type': 'Thing', name: ind.nombre },
    spatialCoverage: { '@type': 'Place', name: pais.nombre },
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://nebbuler.com' },
      { '@type': 'ListItem', position: 2, name: 'Regulaciones', item: 'https://nebbuler.com/regulaciones' },
      { '@type': 'ListItem', position: 3, name: ind.nombreMayus, item: `https://nebbuler.com/regulaciones/${indSlug}` },
      { '@type': 'ListItem', position: 4, name: `${pais.nombre} ${ANIO}`, item: canonical },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbJsonLd) }} />
      <div className="min-h-screen bg-white">
        <header>
          <div className="h-[3px] bg-[#C41C1C] w-full" />
          <div className="border-b border-[#DEDEDE] py-3 px-6">
            <div className="max-w-3xl mx-auto flex items-center justify-between">
              <Link href="/" className="font-serif text-[22px] font-bold text-[#121212]">NEBBULER</Link>
              <Link href="/registro" className="font-sans text-[12px] font-medium px-4 py-1.5 bg-[#C41C1C] text-white hover:bg-[#a01515] transition-colors">Crear cuenta</Link>
            </div>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-6 py-12">
          <nav className="font-sans text-[12px] text-[#999] mb-8">
            <Link href="/" className="hover:text-[#121212]">Inicio</Link>
            <span className="mx-2">·</span>
            <Link href="/regulaciones" className="hover:text-[#121212]">Regulaciones</Link>
            <span className="mx-2">·</span>
            <span className="text-[#121212]">{ind.nombreMayus} en {pais.nombre} {ANIO}</span>
          </nav>

          <div className="mb-10 pb-10 border-b border-[#DEDEDE]">
            <p className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-[#C41C1C] mb-3">
              {pais.emoji} {pais.nombre} · {ANIO} · Regulación profesional
            </p>
            <h1 className="font-serif text-[2.5rem] font-bold text-[#121212] leading-[1.15] mb-6">
              Regulaciones {ind.nombre} en {pais.nombre} {ANIO}: lo esencial
            </h1>
            <p className="font-sans text-[16px] text-[#555] leading-relaxed mb-4">
              {regPais.contextoBase} En el sector <strong>{ind.nombre}</strong>, esto se traduce en
              cambios concretos para los profesionales que asesoran, operan o invierten en la industria.
            </p>
            <p className="font-sans text-[15px] text-[#777] leading-relaxed italic">
              {ind.descripcion}
            </p>
          </div>

          {/* Normas vigentes */}
          <section className="mb-12">
            <h2 className="font-serif text-[1.75rem] font-bold text-[#121212] mb-6">
              Marco normativo vigente {ANIO}
            </h2>
            <div className="grid gap-4">
              {regPais.normasGenerales.map((norma, i) => (
                <div key={i} className="border-l-4 border-[#C41C1C] bg-[#F7F7F7] p-5">
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="font-sans text-[11px] font-bold tracking-[0.15em] uppercase text-[#999]">{norma.ano}</span>
                    <h3 className="font-serif text-[17px] font-bold text-[#121212]">{norma.nombre}</h3>
                  </div>
                  <p className="font-sans text-[14px] text-[#555] leading-relaxed">
                    {norma.resumen}
                  </p>
                </div>
              ))}
            </div>
            <p className="font-sans text-[12px] text-[#999] mt-4">
              Este resumen tiene fines informativos y periodísticos. No constituye asesoría legal.
              Para casos específicos, consulta con un profesional habilitado en {pais.nombre}.
            </p>
          </section>

          {/* Impacto para profesionales */}
          <section className="mb-12">
            <h2 className="font-serif text-[1.75rem] font-bold text-[#121212] mb-6">
              Impacto para profesionales del sector {ind.nombre}
            </h2>
            <ul className="space-y-4">
              <li className="font-sans text-[15px] text-[#555] leading-relaxed flex gap-3">
                <span className="text-[#C41C1C] font-bold flex-shrink-0">01</span>
                <span>
                  <strong>Cumplimiento documental.</strong> Las nuevas normas en {pais.nombre} elevan los estándares
                  de registro y reporte para quienes operan en {ind.nombre}. Profesionales independientes deben revisar
                  obligaciones formales antes de fin de {ANIO}.
                </span>
              </li>
              <li className="font-sans text-[15px] text-[#555] leading-relaxed flex gap-3">
                <span className="text-[#C41C1C] font-bold flex-shrink-0">02</span>
                <span>
                  <strong>Oportunidad de consultoría.</strong> Cada cambio normativo genera demanda inmediata de asesoría.
                  Profesionales que dominen el nuevo marco pueden posicionarse como referentes y cobrar honorarios premium.
                </span>
              </li>
              <li className="font-sans text-[15px] text-[#555] leading-relaxed flex gap-3">
                <span className="text-[#C41C1C] font-bold flex-shrink-0">03</span>
                <span>
                  <strong>Educación de clientes.</strong> La mayoría de los actores del sector {ind.nombre} en {pais.nombre}
                  no leen las normas originales. Necesitan que alguien las traduzca a acción concreta.
                </span>
              </li>
            </ul>
          </section>

          {/* Creadores Nebbuler que explican esto */}
          <section className="mb-12 border-t border-[#DEDEDE] pt-10">
            <h2 className="font-serif text-[1.75rem] font-bold text-[#121212] mb-2">
              Profesionales que explican esto en Nebbuler
            </h2>
            <p className="font-sans text-[15px] text-[#555] leading-relaxed mb-6">
              Estos creadores publican análisis recurrente sobre regulación {ind.nombre} en {pais.nombre}:
            </p>
            <div className="border border-[#DEDEDE] p-8 text-center bg-[#FAFAFA]">
              <p className="font-sans text-[13px] text-[#666] mb-4">
                Esta sección se actualiza con creadores reales de la plataforma.
              </p>
              <Link
                href={`/directorio?industria=${indSlug}&pais=${paisSlug}`}
                className="inline-block font-sans text-[12px] font-bold tracking-[0.1em] uppercase px-6 py-3 border border-[#121212] text-[#121212] hover:bg-[#121212] hover:text-white transition-colors"
              >
                Ver directorio de creadores
              </Link>
            </div>
          </section>

          {/* Cross-links */}
          <section className="mb-12 border-t border-[#DEDEDE] pt-10">
            <h2 className="font-serif text-[1.75rem] font-bold text-[#121212] mb-6">
              Otras regulaciones en {pais.nombre} {ANIO}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {otrasIndustrias.map(i => (
                <Link
                  key={i.slug}
                  href={`/regulaciones/${i.slug}/${paisSlug}/2026`}
                  className="border border-[#DEDEDE] px-5 py-4 hover:border-[#C41C1C] hover:bg-[#FAFAFA] transition-colors"
                >
                  <span className="font-sans text-[14px] text-[#121212]">{i.nombreMayus}</span>
                </Link>
              ))}
            </div>
          </section>

          <section className="mb-12 border-t border-[#DEDEDE] pt-10">
            <h2 className="font-serif text-[1.75rem] font-bold text-[#121212] mb-6">
              {ind.nombreMayus} en otros países LATAM
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {otrosPaises.map(p => (
                <Link
                  key={p.slug}
                  href={`/regulaciones/${indSlug}/${p.slug}/2026`}
                  className="border border-[#DEDEDE] px-5 py-4 hover:border-[#C41C1C] hover:bg-[#FAFAFA] transition-colors"
                >
                  <span className="font-sans text-[14px] text-[#121212]">{p.emoji} {p.nombre}</span>
                </Link>
              ))}
            </div>
          </section>

          <div className="bg-[#121212] p-8 text-center">
            <p className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-[#C41C1C] mb-4">
              Profesionales del sector {ind.nombre}
            </p>
            <h2 className="font-serif text-[28px] font-bold text-white mb-4">
              Publica tu análisis regulatorio en Nebbuler.
            </h2>
            <p className="font-sans text-[15px] text-[#AAA] mb-6 leading-relaxed max-w-lg mx-auto">
              Tus clientes pagarían por leer tu interpretación de cada nueva ley. Abre una sala de suscripción
              y cóbrala mensualmente, en {pais.nombre} y todo LATAM.
            </p>
            <Link href="/registro" className="inline-block font-sans text-[12px] font-bold tracking-[0.1em] uppercase px-8 py-3 bg-[#C41C1C] text-white hover:bg-[#a01515] transition-colors">
              Abrir mi sala
            </Link>
          </div>
        </main>
      </div>
    </>
  )
}
