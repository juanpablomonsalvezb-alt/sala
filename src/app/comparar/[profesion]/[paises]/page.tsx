import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { PAISES_COMP, FACTOR_PROFESION, PROFESIONES_COMP_SLUGS } from '@/data/programmatic/comparativas-pais'
import { RelatedLinks } from '@/components/related-links'

export const revalidate = 86400

interface PageProps {
  params: Promise<{ profesion: string; paises: string }>
}

interface ParsedRoute {
  profesionSlug: string
  paisASlug: string
  paisBSlug: string
}

function parsePaises(paises: string): { a: string; b: string } | null {
  const match = paises.match(/^([a-z-]+)-vs-([a-z-]+)$/)
  if (!match) return null
  return { a: match[1], b: match[2] }
}

function calcular(paisSlug: string, profesionSlug: string) {
  const pais = PAISES_COMP.find((p) => p.slug === paisSlug)
  const profMeta = FACTOR_PROFESION[profesionSlug]
  if (!pais || !profMeta) return null
  const medioUsd = Math.round(pais.salarioMedioUsd * profMeta.factor)
  const tc: Record<string, number> = {
    chile: 950,
    argentina: 1180,
    mexico: 18.5,
    colombia: 4100,
    peru: 3.75,
    uruguay: 39,
    ecuador: 1,
    bolivia: 6.96,
    paraguay: 7350,
    panama: 1,
    'costa-rica': 515,
    'republica-dominicana': 58,
  }
  const medioLocal = Math.round((medioUsd * (tc[paisSlug] ?? 1)) / 50) * 50
  const netoUsd = Math.round(medioUsd * (1 - pais.impuestoEfectivo / 100))
  const margenVida = medioUsd - pais.costoVidaUsd
  return { pais, medioUsd, medioLocal, netoUsd, margenVida }
}

export async function generateStaticParams() {
  const params: Array<{ profesion: string; paises: string }> = []
  // Top profesiones × top pares para ISR — el resto on-demand
  const topProf = [
    'economista', 'abogado', 'medico', 'ingeniero-informatico', 'consultor-negocios',
    'desarrollador', 'data-scientist', 'product-manager', 'contador', 'arquitecto',
    'programador', 'desarrollador-web', 'desarrollador-mobile', 'data-engineer',
    'ux-designer', 'scrum-master', 'trader', 'analista-financiero', 'actuario',
    'psicologo', 'nutricionista', 'dentista', 'farmaceutico', 'auditor',
  ]
  const topPares = [
    'chile-vs-argentina',
    'mexico-vs-colombia',
    'chile-vs-mexico',
    'argentina-vs-uruguay',
    'peru-vs-colombia',
    'chile-vs-peru',
    'mexico-vs-peru',
    'colombia-vs-ecuador',
    'argentina-vs-chile',
    'uruguay-vs-paraguay',
    'panama-vs-costa-rica',
    'chile-vs-panama',
    'mexico-vs-argentina',
    'colombia-vs-peru',
    'republica-dominicana-vs-panama',
    'costa-rica-vs-colombia',
    'ecuador-vs-peru',
    'bolivia-vs-paraguay',
    'chile-vs-colombia',
    'mexico-vs-ecuador',
  ]
  for (const p of topProf) for (const par of topPares) params.push({ profesion: p, paises: par })
  return params
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { profesion, paises } = await params
  const parsed = parsePaises(paises)
  const prof = FACTOR_PROFESION[profesion]
  const a = parsed && PAISES_COMP.find((p) => p.slug === parsed.a)
  const b = parsed && PAISES_COMP.find((p) => p.slug === parsed.b)
  if (!parsed || !prof || !a || !b) {
    return { title: 'Comparativa no encontrada — Nebbuler' }
  }
  return {
    title: `${prof.nombreMayus} en ${a.nombre} vs ${b.nombre}: salario y costo de vida 2026 — Nebbuler`,
    description: `Comparativa real entre ${prof.nombre}s en ${a.nombre} y ${b.nombre}: salarios, carga tributaria, costo de vida y diferencias regulatorias. Actualizado 2026.`,
    alternates: { canonical: `https://nebbuler.com/comparar/${profesion}/${paises}` },
    openGraph: {
      title: `${prof.nombreMayus}: ${a.nombre} vs ${b.nombre} — 2026`,
      description: `Quién paga mejor, dónde rinde más el sueldo, y por qué los profesionales LATAM están abriendo salas de membresía.`,
      type: 'article',
    },
  }
}

export default async function CompararPage({ params }: PageProps) {
  const { profesion, paises } = await params
  const parsed = parsePaises(paises)
  if (!parsed) notFound()
  if (parsed.a === parsed.b) notFound()

  const prof = FACTOR_PROFESION[profesion]
  if (!prof) notFound()

  const a = calcular(parsed.a, profesion)
  const b = calcular(parsed.b, profesion)
  if (!a || !b) notFound()

  const mayorSalario = a.medioUsd > b.medioUsd ? a : b
  const menorSalario = a.medioUsd > b.medioUsd ? b : a
  const diffPct = Math.round(((mayorSalario.medioUsd - menorSalario.medioUsd) / menorSalario.medioUsd) * 100)

  const mayorMargen = a.margenVida > b.margenVida ? a : b
  const menorMargen = a.margenVida > b.margenVida ? b : a

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${prof.nombreMayus} en ${a.pais.nombre} vs ${b.pais.nombre}: salario y costo de vida 2026`,
    author: { '@type': 'Organization', name: 'Nebbuler' },
    publisher: { '@type': 'Organization', name: 'Nebbuler', logo: { '@type': 'ImageObject', url: 'https://nebbuler.com/nebbuler-logo.png' } },
    datePublished: '2026-01-15',
    dateModified: new Date().toISOString().split('T')[0],
    description: `Comparativa entre ${prof.nombre}s en ${a.pais.nombre} y ${b.pais.nombre}.`,
  }

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://nebbuler.com' },
      { '@type': 'ListItem', position: 2, name: 'Comparar', item: 'https://nebbuler.com/comparar' },
      { '@type': 'ListItem', position: 3, name: prof.nombreMayus, item: `https://nebbuler.com/comparar/${profesion}/${paises}` },
    ],
  }

  return (
    <main className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <header className="border-b border-[#DEDEDE] py-12 px-6">
        <div className="max-w-3xl mx-auto">
          <nav className="text-[12px] text-[#666] mb-4 font-sans">
            <Link href="/" className="hover:underline">Inicio</Link> ·{' '}
            <Link href="/comparar" className="hover:underline">Comparar</Link> ·{' '}
            <span>{prof.nombreMayus}</span>
          </nav>
          <p className="text-[11px] uppercase tracking-[0.14em] text-[#C41C1C] font-bold mb-3">
            {prof.area} · 2026
          </p>
          <h1
            className="text-[40px] md:text-[52px] font-bold text-[#121212] tracking-tight leading-[1.05]"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Salario de {prof.nombreMayus}:<br />
            <span aria-hidden className="mr-1">{a.pais.paisEmoji}</span>{a.pais.nombre}{' '}
            <span className="text-[#C41C1C]">vs</span>{' '}
            <span aria-hidden className="mr-1">{b.pais.paisEmoji}</span>{b.pais.nombre}
          </h1>
          <p className="mt-5 text-[16px] text-[#444] leading-relaxed max-w-2xl">
            En {mayorSalario.pais.nombre} un {prof.nombre} gana aproximadamente un{' '}
            <strong>{diffPct}% más</strong> que en {menorSalario.pais.nombre},
            pero el costo de vida y la carga tributaria cambian la ecuación.
          </p>
        </div>
      </header>

      <section className="px-6 py-12 border-b border-[#DEDEDE]">
        <div className="max-w-3xl mx-auto">
          <p className="text-[11px] uppercase tracking-[0.14em] text-[#666] font-medium mb-5">
            Comparativa lado a lado
          </p>
          <div className="grid grid-cols-2 gap-px bg-[#DEDEDE] border border-[#DEDEDE]">
            {[a, b].map((row) => (
              <div key={row.pais.slug} className="bg-white p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl" aria-hidden>{row.pais.paisEmoji}</span>
                  <h2
                    className="text-[22px] font-bold text-[#121212]"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    {row.pais.nombre}
                  </h2>
                </div>
                <dl className="space-y-3 text-[14px]">
                  <div>
                    <dt className="text-[11px] uppercase tracking-wider text-[#888]">Salario bruto USD</dt>
                    <dd className="font-semibold text-[#121212] text-[20px]">${row.medioUsd.toLocaleString('en-US')}/mes</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] uppercase tracking-wider text-[#888]">En moneda local</dt>
                    <dd className="text-[#121212]">{row.pais.simbolo} {row.medioLocal.toLocaleString('es-CL')} {row.pais.moneda}</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] uppercase tracking-wider text-[#888]">Carga tributaria</dt>
                    <dd className="text-[#121212]">{row.pais.impuestoEfectivo}% efectivo</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] uppercase tracking-wider text-[#888]">Neto estimado</dt>
                    <dd className="font-semibold text-[#15803D]">${row.netoUsd.toLocaleString('en-US')}/mes</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] uppercase tracking-wider text-[#888]">Costo de vida mensual</dt>
                    <dd className="text-[#121212]">${row.pais.costoVidaUsd.toLocaleString('en-US')}/mes</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] uppercase tracking-wider text-[#888]">Margen disponible</dt>
                    <dd className={`font-semibold ${row.margenVida > 0 ? 'text-[#15803D]' : 'text-[#C41C1C]'}`}>
                      ${row.margenVida.toLocaleString('en-US')}/mes
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[11px] uppercase tracking-wider text-[#888]">Régimen profesional</dt>
                    <dd className="text-[13px] text-[#444]">{row.pais.regulacionTrabajo}</dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-12 border-b border-[#DEDEDE]">
        <div className="max-w-3xl mx-auto space-y-6">
          <p className="text-[11px] uppercase tracking-[0.14em] text-[#666] font-medium">
            Análisis
          </p>
          <h2
            className="text-[28px] font-bold text-[#121212] tracking-tight"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Quién gana más, dónde rinde mejor el sueldo
          </h2>
          <p className="text-[15px] text-[#444] leading-relaxed">
            En términos brutos, <strong>{mayorSalario.pais.nombre}</strong> paga {diffPct}% más
            a un {prof.nombre} que {menorSalario.pais.nombre}. Sin embargo, después de
            descontar carga tributaria y costo de vida, el margen disponible se inclina hacia{' '}
            <strong>{mayorMargen.pais.nombre}</strong> (${mayorMargen.margenVida}/mes vs ${menorMargen.margenVida}/mes).
          </p>
          <p className="text-[15px] text-[#444] leading-relaxed">
            La diferencia regulatoria también pesa: mientras {a.pais.nombre} usa{' '}
            <em>{a.pais.regulacionTrabajo.toLowerCase()}</em>, {b.pais.nombre} opera bajo{' '}
            <em>{b.pais.regulacionTrabajo.toLowerCase()}</em>. Para un {prof.nombre}{' '}
            independiente, esto cambia completamente la planificación tributaria del año.
          </p>
        </div>
      </section>

      <section className="px-6 py-12 border-b border-[#DEDEDE] bg-[#FAFAF7]">
        <div className="max-w-3xl mx-auto">
          <p className="text-[11px] uppercase tracking-[0.14em] text-[#C41C1C] font-bold mb-3">
            Oportunidad cross-border
          </p>
          <h2
            className="text-[28px] font-bold text-[#121212] tracking-tight mb-4"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Cobra suscripciones desde {a.pais.nombre} y {b.pais.nombre} con Nebbuler
          </h2>
          <p className="text-[15px] text-[#444] leading-relaxed mb-6">
            Si eres {prof.nombre} con audiencia en ambos países, una sala de membresías te
            permite cobrar a tus seguidores en su moneda local — sin que la fricción
            cambiaria te robe ingresos. Nebbuler cobra US$19/mes fijo y tú te quedas con el
            100% de lo que pagan tus suscriptores.
          </p>
          <Link
            href="/abrir"
            className="inline-block bg-[#121212] text-white text-[13px] font-medium px-6 py-3 hover:bg-[#2a2a2a]"
          >
            Abrir mi sala →
          </Link>
        </div>
      </section>

      <section className="px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <p className="text-[11px] uppercase tracking-[0.14em] text-[#666] font-medium mb-5">
            Sigue explorando
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Link href={`/salario/${profesion}/${a.pais.slug}`} className="block bg-white border border-[#DEDEDE] p-4 hover:border-[#121212]">
              <p className="text-[11px] text-[#888] uppercase tracking-wider">Salario detallado</p>
              <p className="text-[14px] font-medium text-[#121212] mt-1">
                {prof.nombreMayus} en {a.pais.nombre}
              </p>
            </Link>
            <Link href={`/salario/${profesion}/${b.pais.slug}`} className="block bg-white border border-[#DEDEDE] p-4 hover:border-[#121212]">
              <p className="text-[11px] text-[#888] uppercase tracking-wider">Salario detallado</p>
              <p className="text-[14px] font-medium text-[#121212] mt-1">
                {prof.nombreMayus} en {b.pais.nombre}
              </p>
            </Link>
            {PROFESIONES_COMP_SLUGS.filter((s) => s !== profesion).slice(0, 4).map((s) => {
              const p = FACTOR_PROFESION[s]
              return (
                <Link key={s} href={`/comparar/${s}/${paises}`} className="block bg-white border border-[#DEDEDE] p-4 hover:border-[#121212]">
                  <p className="text-[11px] text-[#888] uppercase tracking-wider">Otra profesión</p>
                  <p className="text-[14px] font-medium text-[#121212] mt-1">
                    {p.nombreMayus}: {a.pais.nombre} vs {b.pais.nombre}
                  </p>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <section className="px-6 pb-12">
        <div className="max-w-3xl mx-auto">
          <RelatedLinks
            currentPath={`/comparar/${profesion}/${paises}`}
            profession={profesion}
          />
        </div>
      </section>
    </main>
  )
}
