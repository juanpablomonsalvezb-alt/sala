import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { COMPETITORS } from '@/data/competitors'
import { safeJsonLd } from '@/lib/rateLimit'

export const revalidate = false

export function generateStaticParams() {
  return COMPETITORS.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const c = COMPETITORS.find((x) => x.slug === slug)
  if (!c) return {}
  return {
    title: `Nebbuler vs ${c.name} — Comparativa para creadores LATAM`,
    description: `${c.name} cobra ${c.commission} de comisión variable y solo opera en ${c.localCurrency ? 'moneda local' : 'USD'}. Nebbuler cobra tarifa fija mensual y acepta pagos en pesos colombianos, mexicanos, argentinos y soles peruanos. ${c.breakeven}.`,
    keywords: c.keywords,
    alternates: { canonical: `https://nebbuler.com/vs/${slug}` },
    openGraph: {
      title: `Nebbuler vs ${c.name} — La mejor opción para LATAM`,
      description: `Compara Nebbuler y ${c.name} en pricing, monedas locales, comisiones y experiencia para creadores hispanohablantes.`,
      url: `https://nebbuler.com/vs/${slug}`,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Nebbuler vs ${c.name}`,
      description: c.migrationReason.slice(0, 180),
    },
  }
}

export default async function VsPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const c = COMPETITORS.find((x) => x.slug === slug)
  if (!c) notFound()

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: `Nebbuler vs ${c.name} — Comparativa para creadores LATAM`,
      description: c.migrationReason,
      author: { '@type': 'Organization', name: 'Nebbuler' },
      publisher: {
        '@type': 'Organization',
        name: 'Nebbuler',
        logo: { '@type': 'ImageObject', url: 'https://nebbuler.com/nebbuler-logo.png' },
      },
      datePublished: '2026-01-01',
      dateModified: new Date().toISOString().split('T')[0],
      url: `https://nebbuler.com/vs/${slug}`,
      mainEntityOfPage: `https://nebbuler.com/vs/${slug}`,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://nebbuler.com' },
        { '@type': 'ListItem', position: 2, name: 'Comparativas', item: 'https://nebbuler.com/comparar' },
        { '@type': 'ListItem', position: 3, name: `vs ${c.name}`, item: `https://nebbuler.com/vs/${slug}` },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: `¿Qué diferencia hay entre Nebbuler y ${c.name}?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `Nebbuler es una plataforma de membresías para creadores latinoamericanos que cobra una tarifa fija mensual (sin comisión variable) y acepta pagos en monedas locales como pesos colombianos, mexicanos, argentinos y soles peruanos. ${c.name} cobra ${c.commission} de comisión variable sobre los ingresos del creador y solo opera en ${c.localCurrency ? 'moneda local' : 'USD'}, lo que genera fricciones para audiencias en América Latina.`,
          },
        },
        {
          '@type': 'Question',
          name: `¿Cuándo conviene migrar de ${c.name} a Nebbuler?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `${c.breakeven}. Además, si tu audiencia principal está en América Latina, migrar elimina la fricción de pagar en dólares (conversión, recargo internacional del banco) y reduce las cancelaciones por motivos de pago.`,
          },
        },
        {
          '@type': 'Question',
          name: `¿Cuánto cobra ${c.name} de comisión?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `${c.name} cobra ${c.commission}${c.processingFee ? ` ${c.processingFee}` : ''}. En Nebbuler, la comisión variable es 0% y solo pagás una tarifa fija mensual.`,
          },
        },
        {
          '@type': 'Question',
          name: `¿${c.name} acepta pagos en pesos o moneda local LATAM?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: c.localCurrency
              ? `${c.name} sí acepta algunas monedas locales, pero con limitaciones según el país.`
              : `No. ${c.name} cobra exclusivamente en ${c.market.includes('USD') || !c.localCurrency ? 'USD' : 'moneda extranjera'}. Esto significa que tu suscriptor latinoamericano paga conversión de moneda más recargo internacional. Nebbuler, en cambio, acepta pagos directos en COP, MXN, ARS, PEN, CLP y otras monedas locales.`,
          },
        },
      ],
    },
  ]

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }}
        />
      ))}

      <div className="min-h-screen bg-white">
        <header>
          <div className="h-[3px] bg-[#C41C1C] w-full" />
          <div className="border-b border-[#DEDEDE] py-3 px-6">
            <div className="max-w-3xl mx-auto flex items-center justify-between">
              <Link href="/" className="font-serif text-[22px] font-bold text-[#121212]">
                NEBBULER
              </Link>
              <Link
                href="/abrir"
                className="font-sans text-[12px] font-medium px-4 py-1.5 bg-[#C41C1C] text-white hover:bg-[#a01515] transition-colors"
              >
                Abrir mi sala →
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-6 py-12">
          <nav className="font-sans text-[12px] text-[#999] mb-8">
            <Link href="/" className="hover:text-[#121212]">Inicio</Link>
            <span className="mx-2">·</span>
            <Link href="/comparar" className="hover:text-[#121212]">Comparar</Link>
            <span className="mx-2">·</span>
            <span className="text-[#121212]">vs {c.name}</span>
          </nav>

          <div className="mb-10 pb-10 border-b border-[#DEDEDE]">
            <p className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-[#C41C1C] mb-3">
              Comparativa
            </p>
            <h1 className="font-serif text-[2.5rem] font-bold text-[#121212] leading-[1.15] mb-4">
              Nebbuler vs {c.name}
            </h1>
            <p className="font-sans text-[17px] text-[#555] leading-relaxed">
              {c.migrationReason}
            </p>
          </div>

          {/* Tabla comparativa */}
          <section className="mb-12">
            <h2 className="font-serif text-[1.6rem] font-bold mb-6">Comparación rápida</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-[14px] font-sans border-collapse">
                <thead>
                  <tr className="border-b-2 border-[#121212]">
                    <th className="text-left py-3 pr-4">Característica</th>
                    <th className="text-left py-3 px-4 bg-[#FFFBE6]">Nebbuler</th>
                    <th className="text-left py-3 pl-4">{c.name}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[#DEDEDE]">
                    <td className="py-3 pr-4 font-medium">Comisión variable sobre ingresos</td>
                    <td className="py-3 px-4 bg-[#FFFBE6] text-[#15803d] font-bold">0%</td>
                    <td className="py-3 pl-4">{c.commission}</td>
                  </tr>
                  <tr className="border-b border-[#DEDEDE]">
                    <td className="py-3 pr-4 font-medium">Procesamiento de pagos</td>
                    <td className="py-3 px-4 bg-[#FFFBE6]">Procesador local LATAM</td>
                    <td className="py-3 pl-4">{c.processingFee}</td>
                  </tr>
                  <tr className="border-b border-[#DEDEDE]">
                    <td className="py-3 pr-4 font-medium">Pagos en moneda local LATAM</td>
                    <td className="py-3 px-4 bg-[#FFFBE6] text-[#15803d] font-bold">Sí (COP, MXN, ARS, PEN, CLP+)</td>
                    <td className="py-3 pl-4">{c.localCurrency ? 'Limitado' : 'No (solo USD)'}</td>
                  </tr>
                  <tr className="border-b border-[#DEDEDE]">
                    <td className="py-3 pr-4 font-medium">Idioma</td>
                    <td className="py-3 px-4 bg-[#FFFBE6]">Español LATAM nativo</td>
                    <td className="py-3 pl-4">{c.language}</td>
                  </tr>
                  <tr className="border-b border-[#DEDEDE]">
                    <td className="py-3 pr-4 font-medium">Mercado objetivo</td>
                    <td className="py-3 px-4 bg-[#FFFBE6]">18 países LATAM hispanohablante</td>
                    <td className="py-3 pl-4">{c.market}</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-medium">Fundación</td>
                    <td className="py-3 px-4 bg-[#FFFBE6]">2026</td>
                    <td className="py-3 pl-4">{c.founded}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Para qué es bueno cada uno */}
          <section className="mb-12 grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-serif text-[1.3rem] font-bold mb-3">¿Para qué es bueno {c.name}?</h3>
              <p className="text-[15px] text-[#444] leading-relaxed">{c.bestFor}</p>
            </div>
            <div>
              <h3 className="font-serif text-[1.3rem] font-bold mb-3">¿Para qué es bueno Nebbuler?</h3>
              <p className="text-[15px] text-[#444] leading-relaxed">
                Profesionales y creadores hispanohablantes de América Latina que cobran por su conocimiento (análisis, opinión, guías, contenido editorial) y necesitan que su audiencia local pueda pagar en pesos sin fricción.
              </p>
            </div>
          </section>

          {/* Limitaciones */}
          <section className="mb-12">
            <h2 className="font-serif text-[1.6rem] font-bold mb-4">Limitaciones de {c.name} para LATAM</h2>
            <ul className="space-y-2 text-[15px] text-[#444]">
              {c.latamLimitations.map((lim, i) => (
                <li key={i} className="flex gap-3">
                  <span className="text-[#C41C1C] font-bold">·</span>
                  <span>{lim}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Breakeven */}
          <section className="mb-12 bg-[#FFFBE6] p-6 border-l-4 border-[#C41C1C]">
            <h3 className="font-serif text-[1.2rem] font-bold mb-2">¿Cuándo conviene migrar?</h3>
            <p className="text-[15px] text-[#222] leading-relaxed">{c.breakeven}.</p>
          </section>

          {/* CTA */}
          <section className="text-center py-12 border-t border-[#DEDEDE]">
            <h2 className="font-serif text-[1.8rem] font-bold mb-3">
              Abrí tu sala en Nebbuler en menos de 5 minutos
            </h2>
            <p className="text-[15px] text-[#555] mb-6">
              Pagos en tu moneda local, sin comisión variable, sin algoritmos.
            </p>
            <Link
              href="/abrir"
              className="inline-block font-sans text-[14px] font-medium px-8 py-3 bg-[#C41C1C] text-white hover:bg-[#a01515] transition-colors"
            >
              Abrir mi sala →
            </Link>
          </section>

          {/* Otras comparativas */}
          <section className="mt-12 pt-12 border-t border-[#DEDEDE]">
            <h3 className="font-serif text-[1.3rem] font-bold mb-4">Otras comparativas</h3>
            <ul className="grid grid-cols-2 gap-2 text-[14px]">
              {COMPETITORS.filter((x) => x.slug !== slug).map((x) => (
                <li key={x.slug}>
                  <Link href={`/vs/${x.slug}`} className="text-[#C41C1C] hover:underline">
                    Nebbuler vs {x.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </main>
      </div>
    </>
  )
}
