import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ESPECIALIDADES } from '@/data/programmatic/especialidades-honorarios'
import { CIUDADES } from '@/data/programmatic/ciudades-latam'
import { calcularHonorarios } from '@/data/programmatic/honorarios-base'
import { safeJsonLd } from '@/lib/rateLimit'

export const revalidate = 86400

const ANIO = 2026

export async function generateStaticParams(): Promise<{ especialidad: string; ciudad: string }[]> {
  const params: { especialidad: string; ciudad: string }[] = []
  for (const esp of ESPECIALIDADES) {
    for (const ciudad of CIUDADES) {
      params.push({ especialidad: esp.slug, ciudad: ciudad.slug })
    }
  }
  return params
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ especialidad: string; ciudad: string }>
}): Promise<Metadata> {
  const { especialidad: espSlug, ciudad: ciudadSlug } = await params
  const esp = ESPECIALIDADES.find(e => e.slug === espSlug)
  const ciudad = CIUDADES.find(c => c.slug === ciudadSlug)
  if (!esp || !ciudad) return {}

  const honorarios = calcularHonorarios(espSlug, ciudad.paisSlug, ciudad.factor, ciudad.moneda, ciudad.simbolo)
  const promedio = honorarios
    ? `${ciudad.simbolo}${honorarios.medio.toLocaleString('es-CL')} ${ciudad.moneda} ${honorarios.unidadLabel}`
    : ''

  const title = `Honorarios de ${esp.nombre} en ${ciudad.nombre} ${ANIO}`
  const description = `¿Cuánto cobra un ${esp.nombre} en ${ciudad.nombre}? Tarifas reales ${ANIO}: ${promedio}. Rangos por experiencia, comparativa regional y cómo subir tus honorarios.`
  const url = `https://nebbuler.com/honorarios/${espSlug}/${ciudadSlug}`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      type: 'article',
      url,
      images: [{ url: `/api/og/salario?profesion=${espSlug}&pais=${ciudad.paisSlug}`, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`/api/og/salario?profesion=${espSlug}&pais=${ciudad.paisSlug}`],
    },
  }
}

export default async function HonorariosPage({
  params,
}: {
  params: Promise<{ especialidad: string; ciudad: string }>
}) {
  const { especialidad: espSlug, ciudad: ciudadSlug } = await params
  const esp = ESPECIALIDADES.find(e => e.slug === espSlug)
  const ciudad = CIUDADES.find(c => c.slug === ciudadSlug)
  if (!esp || !ciudad) notFound()

  const h = calcularHonorarios(espSlug, ciudad.paisSlug, ciudad.factor, ciudad.moneda, ciudad.simbolo)
  if (!h) notFound()

  const fmt = (n: number) => `${ciudad.simbolo}${n.toLocaleString('es-CL')}`
  const canonical = `https://nebbuler.com/honorarios/${espSlug}/${ciudadSlug}`

  // 5 ciudades del mismo país (excluyendo la actual)
  const ciudadesPais = CIUDADES.filter(c => c.paisSlug === ciudad.paisSlug && c.slug !== ciudad.slug).slice(0, 5)

  // 5 cross-links a otras especialidades en la misma ciudad
  const otrasEsp = ESPECIALIDADES.filter(e => e.slug !== espSlug).slice(0, 5)

  const faqs = [
    {
      q: `¿Cuánto cobra un ${esp.nombre} en ${ciudad.nombre}?`,
      a: `Un ${esp.nombre} en ${ciudad.nombre} cobra en promedio ${fmt(h.medio)} ${ciudad.moneda} ${h.unidadLabel}. El rango va desde ${fmt(h.min)} (junior) hasta ${fmt(h.max)} (senior).`,
    },
    {
      q: `¿Cuál es la tarifa de un ${esp.nombre} junior en ${ciudad.nombre}?`,
      a: `Un ${esp.nombre} con menos de 3 años de experiencia en ${ciudad.nombre} cobra alrededor de ${fmt(h.min)} ${ciudad.moneda} ${h.unidadLabel}.`,
    },
    {
      q: `¿Cuánto cobra un ${esp.nombre} senior en ${ciudad.nombre}?`,
      a: `Un ${esp.nombre} con más de 7 años de experiencia en ${ciudad.nombre} cobra entre ${fmt(h.max)} y ${fmt(h.top10)} ${ciudad.moneda} ${h.unidadLabel}. El top 10% supera estos montos.`,
    },
    {
      q: `¿Cómo cobrar más como ${esp.nombre} en ${ciudad.nombre}?`,
      a: `Las tres palancas que más impactan: especialización (nicho dentro de ${esp.area}), reputación pública (publicar contenido propio) y diversificación de ingresos (productos digitales, suscripciones recurrentes, consultorías retainer).`,
    },
    {
      q: `¿Es mejor cobrar por ${h.unidad} o tener tarifa plana?`,
      a: `Depende del perfil del cliente. Para ${esp.area}, lo común es cobrar ${h.unidadLabel} para servicios puntuales y pasar a retainer mensual o paquete cerrado cuando hay relación continua.`,
    },
    {
      q: `¿Qué impuestos pago como ${esp.nombre} independiente en ${ciudad.pais}?`,
      a: `En ${ciudad.pais} los ${esp.nombre}s independientes tributan bajo el régimen profesional vigente. Te recomendamos revisar los regímenes simplificados disponibles para honorarios profesionales.`,
    },
    {
      q: `¿Puedo cobrar diferente según el cliente?`,
      a: `Sí. Es común ajustar la tarifa según urgencia, complejidad del proyecto y capacidad de pago del cliente. Sin embargo, mantén un piso mínimo no negociable basado en tu costo-hora real.`,
    },
    {
      q: `¿Cómo monetizar mi expertise como ${esp.nombre} más allá de cobrar por ${h.unidad}?`,
      a: `Hoy muchos ${esp.nombre}s en ${ciudad.nombre} publican análisis y guías de pago en Nebbuler — una sala de suscripción mensual donde tus clientes pagan por acceder a tu conocimiento, sin que cambies tu hora por dinero.`,
    },
  ]

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `Honorarios de ${esp.nombre} en ${ciudad.nombre} ${ANIO}`,
    description: `Tarifas profesionales de ${esp.nombre} en ${ciudad.nombre}. Promedio ${fmt(h.medio)} ${ciudad.moneda} ${h.unidadLabel}.`,
    author: { '@type': 'Organization', name: 'Nebbuler' },
    publisher: {
      '@type': 'Organization',
      name: 'Nebbuler',
      logo: { '@type': 'ImageObject', url: 'https://nebbuler.com/nebbuler-logo.png' },
    },
    datePublished: `${ANIO}-01-15`,
    dateModified: new Date().toISOString().split('T')[0],
    inLanguage: 'es',
    mainEntityOfPage: canonical,
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://nebbuler.com' },
      { '@type': 'ListItem', position: 2, name: 'Honorarios', item: 'https://nebbuler.com/honorarios' },
      { '@type': 'ListItem', position: 3, name: esp.nombreMayus, item: `https://nebbuler.com/honorarios/${espSlug}` },
      { '@type': 'ListItem', position: 4, name: ciudad.nombre, item: canonical },
    ],
  }

  const jsonLd = [faqJsonLd, articleJsonLd, breadcrumbJsonLd]

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }} />
      ))}
      <div className="min-h-screen bg-white">
        <header>
          <div className="h-[3px] bg-[#C41C1C] w-full" />
          <div className="border-b border-[#DEDEDE] py-3 px-6">
            <div className="max-w-3xl mx-auto flex items-center justify-between">
              <Link href="/" className="font-serif text-[22px] font-bold text-[#121212]">NEBBULER</Link>
              <Link href="/registro" className="font-sans text-[12px] font-medium px-4 py-1.5 bg-[#C41C1C] text-white hover:bg-[#a01515] transition-colors">
                Crear cuenta
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-6 py-12">
          <nav className="font-sans text-[12px] text-[#999] mb-8">
            <Link href="/" className="hover:text-[#121212]">Inicio</Link>
            <span className="mx-2">·</span>
            <Link href="/honorarios" className="hover:text-[#121212]">Honorarios</Link>
            <span className="mx-2">·</span>
            <span className="text-[#121212]">{esp.nombreMayus} en {ciudad.nombre}</span>
          </nav>

          {/* Hero */}
          <div className="mb-10 pb-10 border-b border-[#DEDEDE]">
            <p className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-[#C41C1C] mb-3">
              {esp.area} · {ciudad.nombre}, {ciudad.pais} {ciudad.paisEmoji}
            </p>
            <h1 className="font-serif text-[2.5rem] font-bold text-[#121212] leading-[1.15] mb-6">
              Honorarios de {esp.nombre} en {ciudad.nombre} {ANIO}
            </h1>

            <div className="bg-[#F7F7F7] border border-[#E0E0E0] p-8 mb-6">
              <p className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-[#999] mb-2">
                Tarifa promedio {h.unidadLabel}
              </p>
              <p className="font-serif text-5xl font-bold text-[#121212] mb-2">
                {fmt(h.medio)}
              </p>
              <p className="font-sans text-[14px] text-[#666]">
                {ciudad.moneda} {h.unidadLabel} · Moda del mercado profesional
              </p>
            </div>

            <p className="font-sans text-[16px] text-[#555] leading-relaxed">
              Un <strong>{esp.nombre}</strong> en {ciudad.nombre} cobra entre{' '}
              <strong>{fmt(h.min)}</strong> (perfil junior) y <strong>{fmt(h.max)}</strong> (perfil senior){' '}
              {h.unidadLabel} {ciudad.moneda}. El top 10% del mercado supera los <strong>{fmt(h.top10)}</strong>.
              {' '}{esp.descripcionCorta}
            </p>
          </div>

          {/* Tabla por nivel */}
          <section className="mb-12">
            <h2 className="font-serif text-[1.75rem] font-bold text-[#121212] mb-6">
              Tarifa por nivel de experiencia
            </h2>
            <div className="border border-[#DEDEDE] overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#F7F7F7] border-b border-[#DEDEDE]">
                    <th className="font-sans text-[11px] font-bold tracking-[0.1em] uppercase text-[#666] text-left px-5 py-3">Nivel</th>
                    <th className="font-sans text-[11px] font-bold tracking-[0.1em] uppercase text-[#666] text-left px-5 py-3">Experiencia</th>
                    <th className="font-sans text-[11px] font-bold tracking-[0.1em] uppercase text-[#666] text-right px-5 py-3">Tarifa {h.unidadLabel}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[#F0F0F0]">
                    <td className="font-sans text-[14px] text-[#121212] px-5 py-4 font-medium">Junior</td>
                    <td className="font-sans text-[13px] text-[#666] px-5 py-4">0–3 años</td>
                    <td className="font-sans text-[15px] text-[#121212] font-bold text-right px-5 py-4">{fmt(h.min)}</td>
                  </tr>
                  <tr className="border-b border-[#F0F0F0] bg-[#FAFAFA]">
                    <td className="font-sans text-[14px] text-[#121212] px-5 py-4 font-medium">Semi-senior</td>
                    <td className="font-sans text-[13px] text-[#666] px-5 py-4">3–7 años</td>
                    <td className="font-sans text-[15px] text-[#C41C1C] font-bold text-right px-5 py-4">{fmt(h.medio)}</td>
                  </tr>
                  <tr className="border-b border-[#F0F0F0]">
                    <td className="font-sans text-[14px] text-[#121212] px-5 py-4 font-medium">Senior</td>
                    <td className="font-sans text-[13px] text-[#666] px-5 py-4">7+ años</td>
                    <td className="font-sans text-[15px] text-[#121212] font-bold text-right px-5 py-4">{fmt(h.max)}</td>
                  </tr>
                  <tr className="bg-[#121212]">
                    <td className="font-sans text-[14px] text-white px-5 py-4 font-medium">Top 10%</td>
                    <td className="font-sans text-[13px] text-[#AAA] px-5 py-4">Posicionados</td>
                    <td className="font-sans text-[15px] text-[#C41C1C] font-bold text-right px-5 py-4">{fmt(h.top10)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="font-sans text-[12px] text-[#999] mt-3">
              {h.fuente}. Estimado para profesionales en {ciudad.nombre} ({ciudad.poblacion}).
            </p>
          </section>

          {/* Cómo cobrar más */}
          <section className="mb-12">
            <h2 className="font-serif text-[1.75rem] font-bold text-[#121212] mb-2">
              ¿Cómo cobrar más como {esp.nombre} en {ciudad.nombre}?
            </h2>
            <p className="font-sans text-[15px] text-[#555] leading-relaxed mb-6">
              La diferencia entre cobrar {fmt(h.min)} y cobrar {fmt(h.top10)} {h.unidadLabel} no es solo experiencia.
              Es posicionamiento. Los tres caminos que más impactan tus honorarios:
            </p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="border border-[#DEDEDE] p-5">
                <p className="font-sans text-[11px] font-bold tracking-[0.15em] uppercase text-[#999] mb-3">01</p>
                <h3 className="font-serif text-[17px] font-bold text-[#121212] mb-2">Nicho específico</h3>
                <p className="font-sans text-[13px] text-[#666] leading-relaxed">
                  En lugar de ser un {esp.nombre} generalista, especialízate en un sub-nicho de {esp.area}.
                  Tarifas suben 2–3x cuando el cliente percibe expertise único.
                </p>
              </div>
              <div className="border border-[#DEDEDE] p-5">
                <p className="font-sans text-[11px] font-bold tracking-[0.15em] uppercase text-[#999] mb-3">02</p>
                <h3 className="font-serif text-[17px] font-bold text-[#121212] mb-2">Reputación pública</h3>
                <p className="font-sans text-[13px] text-[#666] leading-relaxed">
                  Publica análisis, casos y guías visibles. El {esp.nombre} más conocido del mercado
                  no es el más barato — es el que cobra el doble que sus pares.
                </p>
              </div>
              <div className="border border-[#121212] bg-[#121212] p-5">
                <p className="font-sans text-[11px] font-bold tracking-[0.15em] uppercase text-[#C41C1C] mb-3">03</p>
                <h3 className="font-serif text-[17px] font-bold text-white mb-2">Ingresos recurrentes</h3>
                <p className="font-sans text-[13px] text-[#AAA] leading-relaxed mb-4">
                  Suma una sala de suscripción mensual en Nebbuler. 100 suscriptores a 5.000 {ciudad.moneda}/mes
                  es una segunda línea de ingresos sin sumar más horas.
                </p>
                <Link href="/registro" className="inline-block font-sans text-[11px] font-bold tracking-[0.1em] uppercase px-4 py-2 bg-[#C41C1C] text-white hover:bg-[#a01515] transition-colors">
                  Abrir mi sala
                </Link>
              </div>
            </div>
          </section>

          {/* Comparación otras ciudades del país */}
          {ciudadesPais.length > 0 && (
            <section className="mb-12 border-t border-[#DEDEDE] pt-10">
              <h2 className="font-serif text-[1.75rem] font-bold text-[#121212] mb-6">
                Honorarios en otras ciudades de {ciudad.pais}
              </h2>
              <div className="grid gap-2">
                {ciudadesPais.map(c => {
                  const otro = calcularHonorarios(espSlug, c.paisSlug, c.factor, c.moneda, c.simbolo)
                  if (!otro) return null
                  return (
                    <Link
                      key={c.slug}
                      href={`/honorarios/${espSlug}/${c.slug}`}
                      className="flex items-center justify-between border border-[#DEDEDE] px-5 py-4 hover:border-[#C41C1C] hover:bg-[#FAFAFA] transition-colors group"
                    >
                      <span className="font-sans text-[14px] text-[#121212] group-hover:text-[#C41C1C] transition-colors">
                        {esp.nombreMayus} en {c.nombre}
                      </span>
                      <span className="font-sans text-[14px] font-bold text-[#121212]">
                        {c.simbolo}{otro.medio.toLocaleString('es-CL')} {c.moneda}
                      </span>
                    </Link>
                  )
                })}
              </div>
            </section>
          )}

          {/* Otras especialidades en esta ciudad */}
          <section className="mb-12 border-t border-[#DEDEDE] pt-10">
            <h2 className="font-serif text-[1.75rem] font-bold text-[#121212] mb-6">
              Otros profesionales en {ciudad.nombre}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {otrasEsp.map(e => (
                <Link
                  key={e.slug}
                  href={`/honorarios/${e.slug}/${ciudad.slug}`}
                  className="border border-[#DEDEDE] px-5 py-4 hover:border-[#C41C1C] hover:bg-[#FAFAFA] transition-colors"
                >
                  <span className="font-sans text-[14px] text-[#121212]">{e.nombreMayus} en {ciudad.nombre}</span>
                </Link>
              ))}
            </div>
          </section>

          {/* Link cruzado a salario */}
          <section className="mb-12 border-t border-[#DEDEDE] pt-10">
            <h2 className="font-serif text-[1.75rem] font-bold text-[#121212] mb-4">
              ¿Y como empleado? Sueldo de {esp.nombreMayus} en {ciudad.pais}
            </h2>
            <p className="font-sans text-[15px] text-[#555] leading-relaxed mb-4">
              Si trabajas como dependiente y no por honorarios, los rangos cambian. Consulta los sueldos
              promedio en {ciudad.pais}.
            </p>
            <Link
              href={`/salario/${(['economista','abogado','contador','medico','arquitecto','psicologo','nutricionista'].includes(espSlug) ? espSlug : 'economista')}/${ciudad.paisSlug}`}
              className="inline-block font-sans text-[12px] font-bold tracking-[0.1em] uppercase px-6 py-3 border border-[#121212] text-[#121212] hover:bg-[#121212] hover:text-white transition-colors"
            >
              Ver sueldos en {ciudad.pais}
            </Link>
          </section>

          {/* FAQ */}
          <section className="mb-12 border-t border-[#DEDEDE] pt-10">
            <h2 className="font-serif text-[1.75rem] font-bold text-[#121212] mb-6">Preguntas frecuentes</h2>
            <div className="grid gap-6">
              {faqs.map((f, i) => (
                <div key={i}>
                  <h3 className="font-sans text-[15px] font-bold text-[#121212] mb-2">{f.q}</h3>
                  <p className="font-sans text-[14px] text-[#555] leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA final */}
          <div className="bg-[#F7F7F7] border border-[#E0E0E0] p-8 text-center">
            <p className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-[#999] mb-4">
              Para {esp.nombre}s en {ciudad.nombre}
            </p>
            <h2 className="font-serif text-[28px] font-bold text-[#121212] mb-4">
              Cobra por tu expertise, no solo por tu hora.
            </h2>
            <p className="font-sans text-[15px] text-[#555] mb-6 leading-relaxed max-w-lg mx-auto">
              Nebbuler te da una sala donde publicas análisis y guías de pago en {ciudad.moneda} —
              sin comisión, suscripciones directas, 100% para ti.
            </p>
            <Link href="/registro" className="inline-block font-sans text-[12px] font-bold tracking-[0.1em] uppercase px-8 py-3 bg-[#121212] text-white hover:bg-[#333] transition-colors">
              Abrir mi sala en Nebbuler
            </Link>
          </div>
        </main>
      </div>
    </>
  )
}
