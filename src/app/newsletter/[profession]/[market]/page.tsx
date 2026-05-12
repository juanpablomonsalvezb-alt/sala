import { safeJsonLd } from "@/lib/rateLimit"
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PROFESSIONS, MARKETS } from '@/data/seo-matrix'
import { creators } from '@/data/creators'

export const revalidate = false // SSG puro

export async function generateStaticParams() {
  const params = []
  for (const prof of PROFESSIONS) {
    for (const market of MARKETS) {
      params.push({ profession: prof.slug, market: market.slug })
    }
  }
  return params
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ profession: string; market: string }>
}): Promise<Metadata> {
  const { profession, market: marketSlug } = await params
  const prof = PROFESSIONS.find(p => p.slug === profession)
  const market = MARKETS.find(m => m.slug === marketSlug)
  if (!prof || !market) return {}

  const title = `Newsletter de ${prof.label} en ${market.label} 2026 — Nebbuler`
  const profSpecialtyMeta = prof.specialty ?? prof.description
  const description = `Los mejores newsletters de ${prof.label.toLowerCase()} en ${market.label}. Análisis de ${profSpecialtyMeta.toLowerCase()}, publicados por profesionales verificados que cobran suscripción directa. Sin algoritmos, sin intermediarios.`

  return {
    title,
    description,
    alternates: { canonical: `https://nebbuler.com/newsletter/${profession}/${marketSlug}` },
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://nebbuler.com/newsletter/${profession}/${marketSlug}`,
    },
  }
}

export default async function NewsletterProfessionMarketPage({
  params,
}: {
  params: Promise<{ profession: string; market: string }>
}) {
  const { profession, market: marketSlug } = await params
  const prof = PROFESSIONS.find(p => p.slug === profession)
  const market = MARKETS.find(m => m.slug === marketSlug)

  if (!prof || !market) return notFound()

  // Filtrar creadores relevantes de esta disciplina
  const relevantCreators = creators.filter(c => c.discipline === prof.discipline).slice(0, 4)

  // Otras profesiones y mercados para links internos
  const relatedProfessions = PROFESSIONS.filter(p => p.slug !== prof.slug).slice(0, 4)
  const relatedMarkets = MARKETS.filter(m => m.slug !== market.slug).slice(0, 4)

  const profSpecialty = prof.specialty ?? prof.description

  const priceRange =
    market.currency === 'CLP'
      ? '$9.990 a $24.990 CLP'
      : market.currency === 'ARS'
        ? '$4.000 a $12.000 ARS'
        : market.currency === 'COP'
          ? '$40.000 a $100.000 COP'
          : market.currency === 'MXN'
            ? '$200 a $500 MXN'
            : 'equivalente a $10-25 USD'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Newsletter de ${prof.label} en ${market.label}`,
    description: `Directorio de newsletters profesionales de ${prof.label.toLowerCase()} en ${market.label}`,
    url: `https://nebbuler.com/newsletter/${profession}/${marketSlug}`,
    publisher: { '@type': 'Organization', name: 'Nebbuler', url: 'https://nebbuler.com' },
    about: [
      { '@type': 'Thing', name: profSpecialty },
      { '@type': 'Place', name: market.label },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />

      <div className="min-h-screen bg-white">
        {/* Banda roja superior */}
        <div className="h-[3px] bg-[#C41C1C] w-full" />
        <div className="border-b border-[#DEDEDE] py-3 px-6">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <Link href="/" className="font-serif text-[22px] font-bold text-[#121212]">
              NEBBULER
            </Link>
            <Link href="/directorio" className="font-sans text-[12px] text-[#666] hover:text-[#121212]">
              Ver directorio →
            </Link>
          </div>
        </div>

        <main className="max-w-4xl mx-auto px-6 py-16">
          {/* Breadcrumb */}
          <nav className="font-sans text-[11px] text-[#999] mb-8">
            <Link href="/" className="hover:text-[#121212]">Nebbuler</Link>
            <span className="mx-2">›</span>
            <Link href="/newsletter" className="hover:text-[#121212]">Newsletters</Link>
            <span className="mx-2">›</span>
            <span>{prof.label}</span>
            <span className="mx-2">›</span>
            <span>{market.label}</span>
          </nav>

          {/* H1 */}
          <p className="font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-[#999] mb-3">
            {market.flag ?? ''} {market.label} · {prof.discipline}
          </p>
          <h1 className="font-serif text-[36px] md:text-[44px] font-bold text-[#121212] leading-tight mb-4">
            Newsletter de {prof.label} en {market.label}
          </h1>
          <p className="font-sans text-[16px] text-[#666] leading-relaxed mb-12 max-w-2xl">
            Análisis de {profSpecialty.toLowerCase()} publicados por profesionales verificados en {market.label}.
            Suscripción directa en {market.currency}. Sin algoritmos, sin intermediarios.
          </p>

          {/* Qué encontrarás */}
          <div className="bg-[#FAFAFA] border-l-2 border-[#C41C1C] p-6 mb-12">
            <h2 className="font-serif text-[18px] font-bold text-[#121212] mb-3">
              ¿Qué es un newsletter de {prof.label.toLowerCase()}?
            </h2>
            <p className="font-sans text-[14px] text-[#444] leading-relaxed mb-3">
              Un newsletter de {prof.label.toLowerCase()} es una publicación de pago donde un profesional experto en{' '}
              {profSpecialty.toLowerCase()} comparte análisis, opiniones y conocimiento directamente con sus
              suscriptores, sin pasar por medios masivos ni instituciones.
            </p>
            <p className="font-sans text-[14px] text-[#444] leading-relaxed">
              En {market.label}, este modelo está creciendo rápidamente porque permite a los lectores acceder a
              análisis de nivel institucional a una fracción del costo de una consultoría tradicional. El precio
              típico es {priceRange} por mes.
            </p>
          </div>

          {/* Creadores relevantes */}
          {relevantCreators.length > 0 && (
            <section className="mb-16">
              <h2 className="font-serif text-[26px] font-bold text-[#121212] mb-2">
                {prof.label}s en Nebbuler
              </h2>
              <p className="font-sans text-[13px] text-[#666] mb-8">
                Profesionales verificados publicando newsletters de {profSpecialty.toLowerCase()}.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                {relevantCreators.map(c => (
                  <Link
                    key={c.slug}
                    href={`/${c.slug}`}
                    className="border border-[#DEDEDE] p-5 hover:border-[#C41C1C] transition-colors group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-[#F7F7F7] border border-[#DEDEDE] flex items-center justify-center font-serif font-bold text-[14px] text-[#121212]">
                        {c.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-serif text-[14px] font-bold text-[#121212] group-hover:text-[#C41C1C] transition-colors">
                          {c.name}
                        </p>
                        <p className="font-sans text-[11px] text-[#999] uppercase tracking-wide mb-2">
                          {c.specialty}
                        </p>
                        <p className="font-sans text-[12px] text-[#666]">
                          ${c.price_clp.toLocaleString('es-CL')} CLP/mes · {c.subscriber_count.toLocaleString()} suscriptores
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="mt-6">
                <Link
                  href={`/directorio?discipline=${prof.discipline}`}
                  className="inline-block border border-[#121212] font-sans text-[11px] font-bold tracking-[0.1em] uppercase px-6 py-3 hover:bg-[#121212] hover:text-white transition-colors"
                >
                  Ver todos los {prof.label}s →
                </Link>
              </div>
            </section>
          )}

          {/* Por qué Nebbuler para este mercado */}
          <section className="mb-16">
            <h2 className="font-serif text-[24px] font-bold text-[#121212] mb-6">
              Por qué Nebbuler para newsletters en {market.label}
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: `Pagos en ${market.currency}`,
                  desc: `Sin conversión de divisas. El lector paga en ${market.currency}, el creador recibe en ${market.currency}.`,
                },
                {
                  title: '0% de comisión',
                  desc: 'El 100% del precio de tu suscripción va al creador. Nebbuler cobra tarifa fija mensual al creador, no porcentaje.',
                },
                {
                  title: 'Profesionales verificados',
                  desc: 'Todos los creadores son profesionales con credenciales verificadas. No hay contenido anónimo.',
                },
              ].map(item => (
                <div key={item.title} className="border-t-2 border-[#C41C1C] pt-4">
                  <p className="font-serif text-[15px] font-bold text-[#121212] mb-2">{item.title}</p>
                  <p className="font-sans text-[13px] text-[#666] leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTAs dobles */}
          <section className="bg-[#F7F7F7] p-8 mb-16">
            <div className="flex flex-col md:flex-row gap-4 items-start">
              <div className="flex-1">
                <h3 className="font-serif text-[20px] font-bold text-[#121212] mb-2">
                  ¿Eres {prof.label.toLowerCase()} en {market.label}?
                </h3>
                <p className="font-sans text-[13px] text-[#666] mb-4">
                  Publica tu análisis y cobra directamente. Tarifa fija, sin comisión.
                </p>
                <Link
                  href="/abrir"
                  className="inline-block bg-[#C41C1C] text-white font-sans text-[11px] font-bold tracking-[0.1em] uppercase px-6 py-3 hover:bg-[#121212] transition-colors"
                >
                  Abrir mi sala →
                </Link>
              </div>
              <div className="flex-1">
                <h3 className="font-serif text-[20px] font-bold text-[#121212] mb-2">
                  ¿Buscas análisis de {prof.label.toLowerCase()}?
                </h3>
                <p className="font-sans text-[13px] text-[#666] mb-4">
                  Explora el directorio de profesionales verificados en Nebbuler.
                </p>
                <Link
                  href="/directorio"
                  className="inline-block bg-[#121212] text-white font-sans text-[11px] font-bold tracking-[0.1em] uppercase px-6 py-3 hover:bg-[#C41C1C] transition-colors"
                >
                  Ver directorio →
                </Link>
              </div>
            </div>
          </section>

          {/* Links internos para SEO */}
          <section className="mb-12">
            <h3 className="font-serif text-[16px] font-bold text-[#121212] mb-4">
              Otros newsletters en {market.label}
            </h3>
            <div className="flex flex-wrap gap-2">
              {relatedProfessions.map(p => (
                <Link
                  key={p.slug}
                  href={`/newsletter/${p.slug}/${market.slug}`}
                  className="font-sans text-[12px] text-[#666] border border-[#DEDEDE] px-3 py-1 hover:border-[#C41C1C] hover:text-[#C41C1C] transition-colors"
                >
                  {p.label} en {market.label}
                </Link>
              ))}
            </div>
          </section>

          <section>
            <h3 className="font-serif text-[16px] font-bold text-[#121212] mb-4">
              Newsletter de {prof.label} en otros países
            </h3>
            <div className="flex flex-wrap gap-2">
              {relatedMarkets.map(m => (
                <Link
                  key={m.slug}
                  href={`/newsletter/${prof.slug}/${m.slug}`}
                  className="font-sans text-[12px] text-[#666] border border-[#DEDEDE] px-3 py-1 hover:border-[#C41C1C] hover:text-[#C41C1C] transition-colors"
                >
                  {m.flag ?? ''} {prof.label} en {m.label}
                </Link>
              ))}
            </div>
          </section>

          <div className="mt-16 pt-8 border-t border-[#DEDEDE]">
            <Link href="/" className="font-sans text-[13px] text-[#666] hover:text-[#121212]">
              ← Volver a Nebbuler
            </Link>
          </div>
        </main>
      </div>
    </>
  )
}
