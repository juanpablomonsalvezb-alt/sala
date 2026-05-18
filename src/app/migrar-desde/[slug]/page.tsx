import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { MIGRATIONS } from '@/data/migrations'
import { safeJsonLd } from '@/lib/rateLimit'

export const revalidate = false

export function generateStaticParams() {
  return MIGRATIONS.map((m) => ({ slug: m.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const m = MIGRATIONS.find((x) => x.slug === slug)
  if (!m) return {}
  return {
    title: `Cómo migrar de ${m.source} a Nebbuler — Guía paso a paso 2026`,
    description: `Guía completa para migrar tu newsletter o membresía desde ${m.source} a Nebbuler en menos de 2 horas. Mantén tus suscriptores, cobra en pesos y ahorra ${m.source === 'Substack' ? '10%' : m.source === 'Patreon' ? '8-12%' : 'comisión'} de comisión variable.`,
    keywords: m.keywords,
    alternates: { canonical: `https://nebbuler.com/migrar-desde/${slug}` },
    openGraph: {
      title: `Migrar de ${m.source} a Nebbuler — Guía paso a paso`,
      description: `Exportá tu lista, conservá a tus suscriptores, empezá a cobrar en moneda local en menos de 2 horas.`,
      url: `https://nebbuler.com/migrar-desde/${slug}`,
      type: 'article',
      images: [
        {
          url: `/api/og/page?title=${encodeURIComponent(`Migrar de ${m.source} a Nebbuler`)}&kicker=${encodeURIComponent('Guía paso a paso')}&accent=${encodeURIComponent(`Sin perder suscriptores`)}`,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `Migrar de ${m.source} a Nebbuler`,
      description: 'Guía paso a paso. Sin perder suscriptores. En menos de 2 horas.',
    },
  }
}

export default async function MigrarDesdePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const m = MIGRATIONS.find((x) => x.slug === slug)
  if (!m) notFound()

  const totalMinutes = m.steps.reduce((acc, s) => acc + s.estimatedMinutes, 0)
  const canonical = `https://nebbuler.com/migrar-desde/${slug}`

  // HowTo schema completo — aparece en Google AI Overview con pasos
  const howToJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `Cómo migrar de ${m.source} a Nebbuler`,
    description: `Guía paso a paso para migrar tu newsletter o membresía desde ${m.source}, manteniendo tus suscriptores y empezando a cobrar en moneda local LATAM.`,
    totalTime: `PT${totalMinutes}M`,
    estimatedCost: { '@type': 'MonetaryAmount', currency: 'USD', value: '0' },
    supply: [
      { '@type': 'HowToSupply', name: `Acceso a tu cuenta de ${m.source}` },
      { '@type': 'HowToSupply', name: 'Email + cuenta bancaria local LATAM (para Nebbuler)' },
    ],
    tool: [
      { '@type': 'HowToTool', name: 'Cuenta gratuita en Nebbuler' },
      { '@type': 'HowToTool', name: 'Archivo CSV exportable desde ' + m.source },
    ],
    step: m.steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.title,
      text: s.detail,
      timeRequired: `PT${s.estimatedMinutes}M`,
    })),
  }

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: m.faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://nebbuler.com' },
      { '@type': 'ListItem', position: 2, name: 'Migrar', item: 'https://nebbuler.com/migrar-desde' },
      { '@type': 'ListItem', position: 3, name: `Desde ${m.source}`, item: canonical },
    ],
  }

  const fmtUSD = (n: number) => `US$${Math.round(n).toLocaleString('en-US')}`

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(howToJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbJsonLd) }} />

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
            <span className="text-[#121212]">Migrar desde {m.source}</span>
          </nav>

          <div className="mb-10 pb-10 border-b border-[#DEDEDE]">
            <p className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-[#C41C1C] mb-3">
              Guía paso a paso · ~{totalMinutes} min
            </p>
            <h1 className="font-serif text-[2.5rem] font-bold text-[#121212] leading-[1.1] mb-4">
              Cómo migrar de {m.source} a Nebbuler
            </h1>
            <p className="font-sans text-[17px] text-[#444] leading-relaxed">
              {m.source} es {m.sourceTagline}. Si tu audiencia es mayoritariamente latinoamericana,
              migrar a Nebbuler elimina la fricción de cobrar en USD y reduce comisiones. Esta guía
              te lleva de la mano sin perder suscriptores.
            </p>
          </div>

          {/* Comparativa de pricing real */}
          <section className="mb-12 bg-[#FFFBE6] p-8 border-l-4 border-[#C41C1C]">
            <h2 className="font-serif text-[1.4rem] font-bold mb-4">
              Con {m.pricingExample.subscribers} suscriptores a ${m.pricingExample.monthlyPriceUSD} USD/mes
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-[12px] uppercase tracking-wider text-[#666] mb-1">En {m.source}, te queda</p>
                <p className="font-serif text-[2.2rem] font-bold text-[#666]">{fmtUSD(m.pricingExample.sourceNet)}/mes</p>
              </div>
              <div>
                <p className="text-[12px] uppercase tracking-wider text-[#666] mb-1">En Nebbuler, te queda</p>
                <p className="font-serif text-[2.2rem] font-bold text-[#15803d]">{fmtUSD(m.pricingExample.nebbulerNet)}/mes</p>
              </div>
            </div>
            <p className="text-[13px] text-[#666] mt-4">
              Diferencia: <strong>{fmtUSD(m.pricingExample.nebbulerNet - m.pricingExample.sourceNet)} más por mes</strong>
              {' '}({fmtUSD((m.pricingExample.nebbulerNet - m.pricingExample.sourceNet) * 12)} al año).
              Y eso sin contar el aumento típico de conversión por desaparecer la fricción de pago en USD.
            </p>
          </section>

          {/* Pasos */}
          <section className="mb-12">
            <h2 className="font-serif text-[1.8rem] font-bold mb-6">Los pasos</h2>
            <ol className="space-y-8">
              {m.steps.map((step, i) => (
                <li key={i} className="flex gap-5">
                  <span className="flex-shrink-0 font-serif text-[2rem] font-bold text-[#C41C1C] leading-none">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-3 mb-2">
                      <h3 className="font-serif text-[1.3rem] font-bold">{step.title}</h3>
                      <span className="text-[11px] uppercase tracking-wider text-[#999]">
                        ~{step.estimatedMinutes} min
                      </span>
                    </div>
                    <p className="text-[15px] text-[#444] leading-relaxed">{step.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* Qué se conserva / qué se pierde */}
          <section className="mb-12 grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-serif text-[1.2rem] font-bold mb-3 text-[#15803d]">Qué conservás</h3>
              <ul className="space-y-2 text-[14px] text-[#444]">
                {m.preserves.map((p, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-[#15803d]">✓</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-serif text-[1.2rem] font-bold mb-3 text-[#C41C1C]">Qué pierdes si no migras</h3>
              <ul className="space-y-2 text-[14px] text-[#444]">
                {m.losesIfYouDont.map((l, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-[#C41C1C]">·</span>
                    <span>{l}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* FAQs */}
          <section className="mb-12">
            <h2 className="font-serif text-[1.6rem] font-bold mb-6">Preguntas frecuentes</h2>
            <div className="space-y-6">
              {m.faqs.map((f, i) => (
                <div key={i} className="border-b border-[#DEDEDE] pb-6">
                  <h3 className="font-serif text-[1.05rem] font-bold mb-2">{f.q}</h3>
                  <p className="text-[15px] text-[#444] leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="text-center py-12 border-t border-[#DEDEDE]">
            <h2 className="font-serif text-[1.8rem] font-bold mb-3">
              Listo para migrar desde {m.source}
            </h2>
            <p className="text-[15px] text-[#555] mb-6">
              Abrí tu sala en menos de 5 minutos. El import del CSV viene después.
            </p>
            <Link
              href="/abrir"
              className="inline-block font-sans text-[14px] font-medium px-8 py-3 bg-[#C41C1C] text-white hover:bg-[#a01515] transition-colors"
            >
              Empezar →
            </Link>
          </section>

          {/* Otras migraciones */}
          <section className="mt-12 pt-12 border-t border-[#DEDEDE]">
            <h3 className="font-serif text-[1.2rem] font-bold mb-4">¿Vienes de otra plataforma?</h3>
            <ul className="grid grid-cols-2 gap-2 text-[14px]">
              {MIGRATIONS.filter((x) => x.slug !== slug).map((x) => (
                <li key={x.slug}>
                  <Link href={`/migrar-desde/${x.slug}`} className="text-[#C41C1C] hover:underline">
                    Migrar desde {x.source} →
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
