import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { glossaryTerms, disciplineLabels, disciplineColors } from '@/data/glossary'
import { creators } from '@/data/creators'

interface PageProps {
  params: Promise<{ term: string }>
}

export async function generateStaticParams() {
  return glossaryTerms.map((t) => ({ term: t.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { term: termSlug } = await params
  const termData = glossaryTerms.find((t) => t.slug === termSlug)

  if (!termData) {
    return { title: 'Término no encontrado · Nebbuler Glosario' }
  }

  return {
    title: `${termData.term} · Definición | Nebbuler Glosario`,
    description: termData.shortDef,
    alternates: { canonical: `https://nebbuler.com/glosario/${termData.slug}` },
    openGraph: {
      title: `${termData.term} · Definición | Nebbuler Glosario`,
      description: termData.shortDef,
      url: `https://nebbuler.com/glosario/${termData.slug}`,
      type: 'article',
    },
    twitter: {
      card: 'summary',
      title: `${termData.term} · Nebbuler Glosario`,
      description: termData.shortDef,
    },
  }
}

export default async function GlossaryTermPage({ params }: PageProps) {
  const { term: termSlug } = await params
  const termData = glossaryTerms.find((t) => t.slug === termSlug)

  if (!termData) {
    notFound()
  }

  const relatedCreators = (termData.relatedCreatorSlugs ?? [])
    .map((slug) => creators.find((c) => c.slug === slug))
    .filter(Boolean)

  const relatedTerms = (termData.relatedTermSlugs ?? [])
    .map((slug) => glossaryTerms.find((t) => t.slug === slug))
    .filter(Boolean)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: termData.term,
    description: termData.shortDef,
    url: `https://nebbuler.com/glosario/${termData.slug}`,
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      name: 'Glosario Profesional Nebbuler',
      url: 'https://nebbuler.com/glosario',
    },
    inLanguage: 'es',
  }

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Nebbuler', item: 'https://nebbuler.com' },
      { '@type': 'ListItem', position: 2, name: 'Glosario', item: 'https://nebbuler.com/glosario' },
      {
        '@type': 'ListItem',
        position: 3,
        name: termData.term,
        item: `https://nebbuler.com/glosario/${termData.slug}`,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <div className="min-h-screen bg-white text-[#121212]">
        {/* Header editorial */}
        <header className="border-b border-[#121212]/10">
          <div className="h-[3px] bg-[#C41C1C] w-full" />
          <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
            <Link href="/" className="font-serif text-xl font-bold tracking-widest text-[#121212]">
              NEBBULER
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm font-sans text-[#121212]/60">
              <Link href="/directorio" className="hover:text-[#121212] transition-colors">Directorio</Link>
              <Link href="/glosario" className="hover:text-[#121212] transition-colors text-[#121212] font-medium">Glosario</Link>
              <Link href="/observatorio" className="hover:text-[#121212] transition-colors">Observatorio</Link>
              <Link href="/pregunta" className="hover:text-[#121212] transition-colors">Pregunta</Link>
            </nav>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-6 py-12">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm font-sans text-[#121212]/40 mb-8">
            <Link href="/" className="hover:text-[#121212] transition-colors">Nebbuler</Link>
            <span>/</span>
            <Link href="/glosario" className="hover:text-[#121212] transition-colors">Glosario</Link>
            <span>/</span>
            <span className="text-[#121212]/70">{termData.term}</span>
          </nav>

          {/* Discipline badge */}
          <div className="mb-4">
            <span
              className={`inline-flex items-center text-xs font-sans font-medium px-3 py-1 rounded-full border ${disciplineColors[termData.discipline]}`}
            >
              {disciplineLabels[termData.discipline]}
            </span>
          </div>

          {/* H1 */}
          <h1 className="font-serif text-3xl md:text-4xl font-bold leading-tight text-[#121212] mb-8">
            {termData.term}
          </h1>

          {/* Definición corta destacada */}
          <div className="bg-[#FAFAFA] border-l-2 border-[#C41C1C] p-5 mb-8">
            <p className="font-sans text-base md:text-lg text-[#121212]/80 leading-relaxed">
              {termData.shortDef}
            </p>
          </div>

          {/* Definición completa */}
          <div
            className="prose prose-lg max-w-none font-sans text-[#121212]/80 leading-relaxed mb-12 [&>p]:mb-5 [&>p:last-child]:mb-0"
            dangerouslySetInnerHTML={{ __html: termData.fullDef }}
          />

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Creadores relacionados */}
            {relatedCreators.length > 0 && (
              <div>
                <h2 className="font-serif text-lg font-bold text-[#121212] mb-4 pb-2 border-b border-[#121212]/10">
                  Creadores de Nebbuler que escriben sobre esto
                </h2>
                <div className="flex flex-col gap-4">
                  {relatedCreators.map((creator) => (
                    creator && (
                      <Link
                        key={creator.slug}
                        href={`/c/${creator.slug}`}
                        className="group flex items-start gap-3 p-3 rounded-lg border border-[#121212]/10 hover:border-[#C41C1C]/30 hover:bg-[#FAFAFA] transition-all"
                      >
                        <div className="shrink-0 w-9 h-9 rounded-full bg-[#121212] flex items-center justify-center text-white font-serif text-sm font-bold">
                          {creator.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-sans font-medium text-sm text-[#121212] group-hover:text-[#C41C1C] transition-colors leading-snug">
                            {creator.name}
                          </p>
                          <p className="font-sans text-xs text-[#121212]/50 uppercase tracking-wide mt-0.5">
                            {creator.specialty}
                          </p>
                        </div>
                        <span className="ml-auto text-[#C41C1C] opacity-0 group-hover:opacity-100 transition-opacity text-sm">
                          →
                        </span>
                      </Link>
                    )
                  ))}
                </div>
              </div>
            )}

            {/* Términos relacionados */}
            {relatedTerms.length > 0 && (
              <div>
                <h2 className="font-serif text-lg font-bold text-[#121212] mb-4 pb-2 border-b border-[#121212]/10">
                  Términos relacionados
                </h2>
                <div className="flex flex-col gap-2">
                  {relatedTerms.map((rt) => (
                    rt && (
                      <Link
                        key={rt.slug}
                        href={`/glosario/${rt.slug}`}
                        className="group flex items-center gap-2 p-3 rounded-lg border border-[#121212]/10 hover:border-[#C41C1C]/30 hover:bg-[#FAFAFA] transition-all"
                      >
                        <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-[#C41C1C] opacity-50 group-hover:opacity-100 transition-opacity" />
                        <span className="font-sans text-sm text-[#121212]/70 group-hover:text-[#121212] transition-colors">
                          {rt.term}
                        </span>
                        <span
                          className={`ml-auto text-xs font-sans font-medium px-2 py-0.5 rounded-full border shrink-0 ${disciplineColors[rt.discipline]}`}
                        >
                          {disciplineLabels[rt.discipline]}
                        </span>
                      </Link>
                    )
                  ))}
                </div>

                {/* Ver también */}
                {termData.seeAlso && termData.seeAlso.length > 0 && (
                  <div className="mt-5">
                    <p className="font-sans text-xs text-[#121212]/40 uppercase tracking-wider mb-2">
                      Ver también
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {termData.seeAlso.map((item) => (
                        <span
                          key={item}
                          className="font-sans text-xs px-2 py-1 bg-[#F7F7F7] border border-[#121212]/10 rounded text-[#121212]/60"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="border-t border-[#121212]/10 pt-8">
            <div className="bg-[#FAFAFA] rounded-lg p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="font-serif text-base font-bold text-[#121212] mb-1">
                  ¿Eres profesional en esta área?
                </p>
                <p className="font-sans text-sm text-[#121212]/60">
                  Abre tu sala en Nebbuler y cobra directamente por tu análisis.
                </p>
              </div>
              <Link
                href="/para-creadores"
                className="shrink-0 inline-flex items-center gap-2 bg-[#C41C1C] text-white font-sans font-medium text-sm px-5 py-2.5 rounded hover:bg-[#a01515] transition-colors"
              >
                Comenzar <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>

          {/* Volver al glosario */}
          <div className="mt-8">
            <Link
              href="/glosario"
              className="inline-flex items-center gap-2 font-sans text-sm text-[#121212]/50 hover:text-[#121212] transition-colors"
            >
              <span aria-hidden="true">←</span> Volver al glosario
            </Link>
          </div>
        </main>
      </div>
    </>
  )
}
