import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { PAISES_COMP, FACTOR_PROFESION, PROFESIONES_COMP_SLUGS } from '@/data/programmatic/comparativas-pais'
import { safeJsonLd } from '@/lib/rateLimit'

export const revalidate = 86400
const ANIO = 2026

function parsePaises(slug: string): { a: string; b: string } | null {
  const m = slug.match(/^(.+)-vs-(.+)$/)
  if (!m) return null
  return { a: m[1], b: m[2] }
}

export async function generateStaticParams(): Promise<{ profesion: string; paises: string }[]> {
  const params: { profesion: string; paises: string }[] = []
  for (const profesion of PROFESIONES_COMP_SLUGS) {
    for (let i = 0; i < PAISES_COMP.length; i++) {
      for (let j = i + 1; j < PAISES_COMP.length; j++) {
        const a = PAISES_COMP[i].slug
        const b = PAISES_COMP[j].slug
        params.push({ profesion, paises: `${a}-vs-${b}` })
      }
    }
  }
  return params
}

function calcularSalario(paisSlug: string, profesionSlug: string): { medioUsd: number; medioLocal: number; pais: typeof PAISES_COMP[0] } | null {
  const pais = PAISES_COMP.find(p => p.slug === paisSlug)
  const profMeta = FACTOR_PROFESION[profesionSlug]
  if (!pais || !profMeta) return null
  const factor = profMeta.factor
  const medioUsd = Math.round(pais.salarioMedioUsd * factor)
  // Tipos de cambio aproximados
  const tc: Record<string, number> = {
    chile: 950, argentina: 1180, mexico: 18.5, colombia: 4100,
    peru: 3.75, uruguay: 39, ecuador: 1, bolivia: 6.96, paraguay: 7350,
  }
  const medioLocal = Math.round((medioUsd * (tc[paisSlug] ?? 1)) / 50) * 50
  return { medioUsd, medioLocal, pais }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ profesion: string; paises: string }>
}): Promise<Metadata> {
  const { profesion, paises } = await params
  const parsed = parsePaises(paises)
  if (!parsed) return {}
  const fp = FACTOR_PROFESION[profesion]
  const paisA = PAISES_COMP.find(p => p.slug === parsed.a)
  const paisB = PAISES_COMP.find(p => p.slug === parsed.b)
  if (!fp || !paisA || !paisB) return {}

  const title = `Salario de ${fp.nombre}: ${paisA.nombre} vs ${paisB.nombre} ${ANIO}`
  const description = `Comparativa real ${ANIO}: salario, impuestos, costo de vida y regulación profesional para ${fp.nombre} entre ${paisA.nombre} y ${paisB.nombre}. ¿Dónde se gana más en términos reales?`
  const url = `https://nebbuler.com/comparar-${profesion}/${paises}`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      type: 'article',
      url,
      images: [{ url: `/api/og/salario?profesion=${profesion}&pais=${paisA.slug}`, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [`/api/og/salario?profesion=${profesion}&pais=${paisA.slug}`] },
  }
}

export default async function CompararPage({
  params,
}: {
  params: Promise<{ profesion: string; paises: string }>
}) {
  const { profesion, paises } = await params
  const parsed = parsePaises(paises)
  if (!parsed) notFound()
  const fp = FACTOR_PROFESION[profesion]
  const dataA = calcularSalario(parsed.a, profesion)
  const dataB = calcularSalario(parsed.b, profesion)
  if (!fp || !dataA || !dataB) notFound()

  const paisA = dataA.pais
  const paisB = dataB.pais
  const canonical = `https://nebbuler.com/comparar-${profesion}/${paises}`

  // Ingreso real = salario - costo de vida - impuestos
  const ingresoRealA = Math.round(dataA.medioUsd * (1 - paisA.impuestoEfectivo / 100) - paisA.costoVidaUsd)
  const ingresoRealB = Math.round(dataB.medioUsd * (1 - paisB.impuestoEfectivo / 100) - paisB.costoVidaUsd)

  const ganador = ingresoRealA > ingresoRealB ? paisA : paisB
  const perdedor = ingresoRealA > ingresoRealB ? paisB : paisA
  const diferenciaPct = Math.abs(Math.round(((ingresoRealA - ingresoRealB) / ((ingresoRealA + ingresoRealB) / 2)) * 100))

  // Otras combinaciones populares
  const otrasComparativas = PAISES_COMP
    .filter(p => p.slug !== parsed.a && p.slug !== parsed.b)
    .slice(0, 5)

  const faqs = [
    {
      q: `¿Dónde gana más un ${fp.nombre}, ${paisA.nombre} o ${paisB.nombre}?`,
      a: `En términos nominales, un ${fp.nombre} en ${dataA.medioUsd > dataB.medioUsd ? paisA.nombre : paisB.nombre} gana más (USD ${Math.max(dataA.medioUsd, dataB.medioUsd).toLocaleString('es-CL')}/mes). En términos reales descontando impuestos y costo de vida, ${ganador.nombre} deja ${diferenciaPct}% más libre.`,
    },
    {
      q: `¿Cuánto gana un ${fp.nombre} en ${paisA.nombre}?`,
      a: `El salario promedio de un ${fp.nombre} en ${paisA.nombre} es de USD ${dataA.medioUsd.toLocaleString('es-CL')}/mes (~${paisA.simbolo}${dataA.medioLocal.toLocaleString('es-CL')} ${paisA.moneda}). Carga tributaria efectiva ~${paisA.impuestoEfectivo}%.`,
    },
    {
      q: `¿Cuánto gana un ${fp.nombre} en ${paisB.nombre}?`,
      a: `El salario promedio de un ${fp.nombre} en ${paisB.nombre} es de USD ${dataB.medioUsd.toLocaleString('es-CL')}/mes (~${paisB.simbolo}${dataB.medioLocal.toLocaleString('es-CL')} ${paisB.moneda}). Carga tributaria efectiva ~${paisB.impuestoEfectivo}%.`,
    },
    {
      q: `¿Conviene migrar de ${paisA.nombre} a ${paisB.nombre} si soy ${fp.nombre}?`,
      a: `Solo si tu objetivo prioritario es ingreso real. ${ganador.nombre} ofrece ${diferenciaPct}% más capacidad de ahorro a igualdad de perfil, pero la migración implica costos no monetarios (red, idioma local de mercado, validación de título). Una opción intermedia: trabajar remoto para el país que paga más sin mudarte.`,
    },
    {
      q: `¿Cómo trabajar como ${fp.nombre} cross-border entre ${paisA.nombre} y ${paisB.nombre}?`,
      a: `Lo más común es facturar como independiente desde tu país y atender clientes del otro mercado. En ${paisA.nombre} aplicas: ${paisA.regulacionTrabajo}. En ${paisB.nombre}: ${paisB.regulacionTrabajo}. El cobro en USD o cripto-stablecoins evita pérdida cambiaria.`,
    },
    {
      q: `¿Cómo monetizar contenido profesional cross-border?`,
      a: `Plataformas como Nebbuler permiten cobrar suscripciones mensuales a clientes de ambos países en moneda local, sin comisión. Útil para profesionales que quieren ingresos pasivos sin atarse a un solo mercado laboral.`,
    },
  ]

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `Salario de ${fp.nombre}: ${paisA.nombre} vs ${paisB.nombre} ${ANIO}`,
    description: `Comparativa salarial, fiscal y de costo de vida.`,
    author: { '@type': 'Organization', name: 'Nebbuler' },
    publisher: { '@type': 'Organization', name: 'Nebbuler', logo: { '@type': 'ImageObject', url: 'https://nebbuler.com/nebbuler-logo.png' } },
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
      { '@type': 'ListItem', position: 2, name: 'Comparativas', item: 'https://nebbuler.com/comparar' },
      { '@type': 'ListItem', position: 3, name: `${fp.nombreMayus}: ${paisA.nombre} vs ${paisB.nombre}`, item: canonical },
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
            <div className="max-w-4xl mx-auto flex items-center justify-between">
              <Link href="/" className="font-serif text-[22px] font-bold text-[#121212]">NEBBULER</Link>
              <Link href="/registro" className="font-sans text-[12px] font-medium px-4 py-1.5 bg-[#C41C1C] text-white hover:bg-[#a01515] transition-colors">
                Crear cuenta
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-6 py-12">
          <nav className="font-sans text-[12px] text-[#999] mb-8">
            <Link href="/" className="hover:text-[#121212]">Inicio</Link>
            <span className="mx-2">·</span>
            <Link href="/comparar" className="hover:text-[#121212]">Comparativas</Link>
            <span className="mx-2">·</span>
            <span className="text-[#121212]">{fp.nombreMayus}: {paisA.nombre} vs {paisB.nombre}</span>
          </nav>

          <div className="mb-10 pb-10 border-b border-[#DEDEDE]">
            <p className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-[#C41C1C] mb-3">
              {fp.area} · Comparativa internacional
            </p>
            <h1 className="font-serif text-[2.5rem] font-bold text-[#121212] leading-[1.15] mb-6">
              Salario de {fp.nombre}: {paisA.nombre} {paisA.paisEmoji} vs {paisB.nombre} {paisB.paisEmoji} {ANIO}
            </h1>
            <p className="font-sans text-[16px] text-[#555] leading-relaxed">
              En términos nominales, gana más un <strong>{fp.nombre}</strong> en{' '}
              <strong>{dataA.medioUsd > dataB.medioUsd ? paisA.nombre : paisB.nombre}</strong>.
              {' '}Pero descontando impuestos y costo de vida, el ingreso real disponible es{' '}
              <strong>{diferenciaPct}% mayor en {ganador.nombre}</strong>.
            </p>
          </div>

          {/* Tabla comparativa */}
          <section className="mb-12">
            <h2 className="font-serif text-[1.75rem] font-bold text-[#121212] mb-6">Comparativa lado a lado</h2>
            <div className="border border-[#DEDEDE] overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#F7F7F7] border-b border-[#DEDEDE]">
                    <th className="font-sans text-[11px] font-bold tracking-[0.1em] uppercase text-[#666] text-left px-5 py-3">Indicador</th>
                    <th className="font-sans text-[11px] font-bold tracking-[0.1em] uppercase text-[#666] text-right px-5 py-3">{paisA.paisEmoji} {paisA.nombre}</th>
                    <th className="font-sans text-[11px] font-bold tracking-[0.1em] uppercase text-[#666] text-right px-5 py-3">{paisB.paisEmoji} {paisB.nombre}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[#F0F0F0]">
                    <td className="font-sans text-[14px] text-[#121212] px-5 py-4 font-medium">Salario medio (USD/mes)</td>
                    <td className="font-sans text-[15px] text-[#121212] font-bold text-right px-5 py-4">USD {dataA.medioUsd.toLocaleString('es-CL')}</td>
                    <td className="font-sans text-[15px] text-[#121212] font-bold text-right px-5 py-4">USD {dataB.medioUsd.toLocaleString('es-CL')}</td>
                  </tr>
                  <tr className="border-b border-[#F0F0F0] bg-[#FAFAFA]">
                    <td className="font-sans text-[14px] text-[#121212] px-5 py-4 font-medium">Salario medio (moneda local)</td>
                    <td className="font-sans text-[14px] text-[#666] text-right px-5 py-4">{paisA.simbolo}{dataA.medioLocal.toLocaleString('es-CL')} {paisA.moneda}</td>
                    <td className="font-sans text-[14px] text-[#666] text-right px-5 py-4">{paisB.simbolo}{dataB.medioLocal.toLocaleString('es-CL')} {paisB.moneda}</td>
                  </tr>
                  <tr className="border-b border-[#F0F0F0]">
                    <td className="font-sans text-[14px] text-[#121212] px-5 py-4 font-medium">Costo de vida (USD/mes)</td>
                    <td className="font-sans text-[14px] text-[#666] text-right px-5 py-4">USD {paisA.costoVidaUsd.toLocaleString('es-CL')}</td>
                    <td className="font-sans text-[14px] text-[#666] text-right px-5 py-4">USD {paisB.costoVidaUsd.toLocaleString('es-CL')}</td>
                  </tr>
                  <tr className="border-b border-[#F0F0F0] bg-[#FAFAFA]">
                    <td className="font-sans text-[14px] text-[#121212] px-5 py-4 font-medium">Carga tributaria efectiva</td>
                    <td className="font-sans text-[14px] text-[#666] text-right px-5 py-4">{paisA.impuestoEfectivo}%</td>
                    <td className="font-sans text-[14px] text-[#666] text-right px-5 py-4">{paisB.impuestoEfectivo}%</td>
                  </tr>
                  <tr className="border-b border-[#F0F0F0]">
                    <td className="font-sans text-[14px] text-[#121212] px-5 py-4 font-medium">Régimen profesional</td>
                    <td className="font-sans text-[13px] text-[#666] text-right px-5 py-4">{paisA.regulacionTrabajo}</td>
                    <td className="font-sans text-[13px] text-[#666] text-right px-5 py-4">{paisB.regulacionTrabajo}</td>
                  </tr>
                  <tr className="bg-[#121212]">
                    <td className="font-sans text-[14px] text-white px-5 py-4 font-medium">Ingreso real disponible</td>
                    <td className={`font-sans text-[15px] font-bold text-right px-5 py-4 ${ingresoRealA > ingresoRealB ? 'text-[#C41C1C]' : 'text-white'}`}>
                      USD {ingresoRealA.toLocaleString('es-CL')}
                    </td>
                    <td className={`font-sans text-[15px] font-bold text-right px-5 py-4 ${ingresoRealB > ingresoRealA ? 'text-[#C41C1C]' : 'text-white'}`}>
                      USD {ingresoRealB.toLocaleString('es-CL')}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="font-sans text-[12px] text-[#999] mt-3">
              Ingreso real = salario neto (después de impuestos) menos costo de vida básico mensual. Estimado para 2026.
            </p>
          </section>

          {/* Análisis */}
          <section className="mb-12">
            <h2 className="font-serif text-[1.75rem] font-bold text-[#121212] mb-4">
              ¿Quién paga más a un {fp.nombre}?
            </h2>
            <p className="font-sans text-[16px] text-[#555] leading-relaxed mb-4">
              Mirar solo el sueldo bruto en USD es engañoso. La pregunta correcta es: <em>¿cuánto sobra al final de mes?</em>
              {' '}En esta comparativa, <strong>{ganador.nombre} {ganador.paisEmoji}</strong> deja a un {fp.nombre} con USD {(ingresoRealA > ingresoRealB ? ingresoRealA : ingresoRealB).toLocaleString('es-CL')} libres,
              frente a USD {(ingresoRealA > ingresoRealB ? ingresoRealB : ingresoRealA).toLocaleString('es-CL')} en {perdedor.nombre}.
              Un <strong>{diferenciaPct}%</strong> de diferencia que se acumula año a año.
            </p>
            <p className="font-sans text-[16px] text-[#555] leading-relaxed">
              Las palancas que más mueven la aguja: carga tributaria efectiva ({paisA.impuestoEfectivo}% vs {paisB.impuestoEfectivo}%)
              y costo de vivienda en zonas profesionales. La diferencia salarial nominal queda en segundo plano.
            </p>
          </section>

          {/* Cómo aprovechar */}
          <section className="mb-12 border-t border-[#DEDEDE] pt-10">
            <h2 className="font-serif text-[1.75rem] font-bold text-[#121212] mb-2">
              Cómo aprovechar la diferencia con suscripciones cross-border
            </h2>
            <p className="font-sans text-[15px] text-[#555] leading-relaxed mb-6">
              Si tu mercado profesional natural es {paisA.nombre} pero {paisB.nombre} paga mejor,
              no necesitas mudarte. Hoy un {fp.nombre} puede atender a clientes de ambos países simultáneamente
              vía contenido y consultoría a distancia. Las claves:
            </p>
            <ul className="space-y-3 mb-6">
              <li className="font-sans text-[15px] text-[#555] leading-relaxed flex gap-3">
                <span className="text-[#C41C1C] font-bold">·</span>
                <span>Publica una sala de suscripción en Nebbuler con análisis profesional. Cobras en la moneda local de cada suscriptor — captas clientes de los dos países al mismo tiempo.</span>
              </li>
              <li className="font-sans text-[15px] text-[#555] leading-relaxed flex gap-3">
                <span className="text-[#C41C1C] font-bold">·</span>
                <span>Define una vertical clara: ej. "{fp.nombreMayus} para empresas {paisA.nombre}–{paisB.nombre}" — y vives del diferencial cambiario que ya existe.</span>
              </li>
              <li className="font-sans text-[15px] text-[#555] leading-relaxed flex gap-3">
                <span className="text-[#C41C1C] font-bold">·</span>
                <span>Sé el referente público — quien aparece primero en LinkedIn cuando alguien busca tu especialidad en ambos mercados.</span>
              </li>
            </ul>
            <Link href="/registro" className="inline-block font-sans text-[12px] font-bold tracking-[0.1em] uppercase px-8 py-3 bg-[#C41C1C] text-white hover:bg-[#a01515] transition-colors">
              Abrir mi sala
            </Link>
          </section>

          {/* Otras comparativas */}
          <section className="mb-12 border-t border-[#DEDEDE] pt-10">
            <h2 className="font-serif text-[1.75rem] font-bold text-[#121212] mb-6">
              Otras comparativas para {fp.nombre}s
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {otrasComparativas.map(otroPais => (
                <Link
                  key={otroPais.slug}
                  href={`/comparar-${profesion}/${paisA.slug}-vs-${otroPais.slug}`}
                  className="border border-[#DEDEDE] px-5 py-4 hover:border-[#C41C1C] hover:bg-[#FAFAFA] transition-colors"
                >
                  <span className="font-sans text-[14px] text-[#121212]">
                    {paisA.paisEmoji} {paisA.nombre} vs {otroPais.paisEmoji} {otroPais.nombre}
                  </span>
                </Link>
              ))}
            </div>
          </section>

          {/* Links a salario y honorarios */}
          <section className="mb-12 border-t border-[#DEDEDE] pt-10">
            <h2 className="font-serif text-[1.75rem] font-bold text-[#121212] mb-6">
              Ver detalle por país
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href={`/salario/${profesion === 'desarrollador' || profesion === 'consultor-negocios' || profesion === 'product-manager' || profesion === 'data-scientist' || profesion === 'auditor' ? 'economista' : profesion}/${paisA.slug}`} className="border border-[#DEDEDE] p-5 hover:border-[#C41C1C] hover:bg-[#FAFAFA] transition-colors">
                <p className="font-sans text-[11px] font-bold tracking-[0.15em] uppercase text-[#999] mb-2">Detalle</p>
                <p className="font-sans text-[15px] text-[#121212] font-bold">Sueldo en {paisA.nombre}</p>
              </Link>
              <Link href={`/salario/${profesion === 'desarrollador' || profesion === 'consultor-negocios' || profesion === 'product-manager' || profesion === 'data-scientist' || profesion === 'auditor' ? 'economista' : profesion}/${paisB.slug}`} className="border border-[#DEDEDE] p-5 hover:border-[#C41C1C] hover:bg-[#FAFAFA] transition-colors">
                <p className="font-sans text-[11px] font-bold tracking-[0.15em] uppercase text-[#999] mb-2">Detalle</p>
                <p className="font-sans text-[15px] text-[#121212] font-bold">Sueldo en {paisB.nombre}</p>
              </Link>
            </div>
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
              Para {fp.nombre}s LATAM
            </p>
            <h2 className="font-serif text-[28px] font-bold text-[#121212] mb-4">
              Tu mercado no es un país. Es LATAM completo.
            </h2>
            <p className="font-sans text-[15px] text-[#555] mb-6 leading-relaxed max-w-lg mx-auto">
              En Nebbuler abres una sala donde tus suscriptores de {paisA.nombre}, {paisB.nombre} y el resto de LATAM
              pagan en su moneda local. Sin comisión. Tú decides la tarifa.
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
