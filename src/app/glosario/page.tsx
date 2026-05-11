import { safeJsonLd } from "@/lib/rateLimit"
import type { Metadata } from 'next'
import Link from 'next/link'
import { glossaryTerms, disciplineLabels, disciplineColors } from '@/data/glossary'

export const metadata: Metadata = {
  title: 'Glosario Profesional · Economía, Derecho y Finanzas | Nebbuler',
  description:
    'Glosario de términos profesionales de economía, derecho tributario, finanzas corporativas y política monetaria. Definiciones rigurosas escritas por expertos de Nebbuler.',
  alternates: { canonical: 'https://nebbuler.com/glosario' },
  openGraph: {
    title: 'Glosario Profesional · Economía, Derecho y Finanzas | Nebbuler',
    description:
      'Glosario de términos profesionales de economía, derecho tributario, finanzas corporativas y política monetaria. Definiciones rigurosas escritas por expertos de Nebbuler.',
    url: 'https://nebbuler.com/glosario',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Glosario Profesional · Nebbuler',
    description: 'Definiciones rigurosas de economía, derecho y finanzas por profesionales verificados.',
  },
}

const disciplines = ['economia', 'finanzas', 'derecho', 'medicina'] as const

const JSONLD_DEFINEDTERMSET = {
  '@context': 'https://schema.org',
  '@type': 'DefinedTermSet',
  name: 'Glosario Profesional Nebbuler',
  description:
    'Términos de economía, derecho tributario, finanzas corporativas y política monetaria. Definiciones rigurosas por profesionales verificados de Nebbuler.',
  url: 'https://nebbuler.com/glosario',
  inLanguage: 'es',
  publisher: {
    '@type': 'Organization',
    name: 'Nebbuler',
    url: 'https://nebbuler.com',
  },
  hasDefinedTerm: glossaryTerms.map((t) => ({
    '@type': 'DefinedTerm',
    name: t.term,
    description: t.shortDef,
    url: `https://nebbuler.com/glosario/${t.slug}`,
    inDefinedTermSet: 'https://nebbuler.com/glosario',
  })),
}

// Obtener letras del alfabeto presentes en los términos
function getAlphabetIndex() {
  const letters = new Set(
    glossaryTerms.map((t) => t.term[0].toUpperCase())
  )
  return Array.from(letters).sort()
}

// Agrupar por letra inicial
function groupByLetter() {
  const map: Record<string, typeof glossaryTerms> = {}
  for (const term of glossaryTerms) {
    const letter = term.term[0].toUpperCase()
    if (!map[letter]) map[letter] = []
    map[letter].push(term)
  }
  return map
}

export default function GlosarioPage() {
  const letters = getAlphabetIndex()
  const grouped = groupByLetter()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(JSONLD_DEFINEDTERMSET) }}
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
              <Link href="/observatorio" className="hover:text-[#121212] transition-colors">Observatorio</Link>
              <Link href="/pregunta" className="hover:text-[#121212] transition-colors">Pregunta</Link>
              <Link href="/para-creadores" className="hover:text-[#C41C1C] font-medium transition-colors">Para creadores</Link>
            </nav>
          </div>
        </header>

        <main>
          {/* Hero */}
          <section className="max-w-6xl mx-auto px-6 pt-16 pb-10">
            <div className="max-w-3xl">
              <p className="font-sans text-xs tracking-[0.2em] uppercase text-[#C41C1C] mb-4">
                Referencia profesional
              </p>
              <h1 className="font-serif text-4xl md:text-5xl font-bold leading-tight text-[#121212] mb-6">
                Glosario Profesional
              </h1>
              <p className="font-sans text-lg text-[#121212]/70 leading-relaxed max-w-2xl">
                Términos de economía, derecho, finanzas y política monetaria. Definiciones rigurosas
                citando a los profesionales verificados de Nebbuler.
              </p>
            </div>
          </section>

          {/* Filtros por disciplina */}
          <section className="max-w-6xl mx-auto px-6 pb-8">
            <div className="flex flex-wrap gap-3">
              {disciplines.map((disc) => {
                const count = glossaryTerms.filter((t) => t.discipline === disc).length
                return (
                  <a
                    key={disc}
                    href={`#${disc}`}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-sans font-medium border transition-colors hover:opacity-80 ${disciplineColors[disc]}`}
                  >
                    {disciplineLabels[disc]}
                    <span className="opacity-60">({count})</span>
                  </a>
                )
              })}
            </div>
          </section>

          {/* Navegación A-Z */}
          <section className="max-w-6xl mx-auto px-6 pb-10">
            <div className="border-t border-b border-[#121212]/10 py-3">
              <div className="flex flex-wrap gap-1">
                {letters.map((letter) => (
                  <a
                    key={letter}
                    href={`#letra-${letter}`}
                    className="w-8 h-8 flex items-center justify-center text-sm font-sans font-medium text-[#121212]/50 hover:text-[#C41C1C] hover:bg-[#C41C1C]/5 rounded transition-colors"
                  >
                    {letter}
                  </a>
                ))}
              </div>
            </div>
          </section>

          {/* Grid de términos por letra */}
          <section className="max-w-6xl mx-auto px-6 pb-20">
            {Object.entries(grouped)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([letter, terms]) => (
                <div key={letter} id={`letra-${letter}`} className="mb-14">
                  <div className="flex items-center gap-4 mb-6">
                    <span
                      id={letter}
                      className="font-serif text-3xl font-bold text-[#C41C1C] leading-none"
                    >
                      {letter}
                    </span>
                    <div className="flex-1 h-px bg-[#121212]/10" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {terms
                      .sort((a, b) => a.term.localeCompare(b.term))
                      .map((t) => (
                        <article
                          key={t.slug}
                          className="border border-[#121212]/10 rounded-lg p-5 hover:border-[#C41C1C]/40 hover:shadow-sm transition-all group bg-white"
                        >
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <h2 className="font-serif text-base font-bold leading-snug text-[#121212] group-hover:text-[#C41C1C] transition-colors">
                              {t.term}
                            </h2>
                            <span
                              className={`shrink-0 text-xs font-sans font-medium px-2 py-1 rounded-full border ${disciplineColors[t.discipline]}`}
                            >
                              {disciplineLabels[t.discipline]}
                            </span>
                          </div>
                          <p className="font-sans text-sm text-[#121212]/60 leading-relaxed mb-4 line-clamp-2">
                            {t.shortDef}
                          </p>
                          <Link
                            href={`/glosario/${t.slug}`}
                            className="inline-flex items-center gap-1 text-sm font-sans font-medium text-[#C41C1C] hover:gap-2 transition-all"
                          >
                            Ver definición <span aria-hidden="true">→</span>
                          </Link>
                        </article>
                      ))}
                  </div>
                </div>
              ))}
          </section>

          {/* CTA final */}
          <section className="border-t border-[#121212]/10 bg-[#FAFAFA]">
            <div className="max-w-6xl mx-auto px-6 py-16 text-center">
              <p className="font-sans text-xs tracking-[0.2em] uppercase text-[#C41C1C] mb-4">
                ¿Eres profesional?
              </p>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#121212] mb-4">
                Abre tu sala en Nebbuler
              </h2>
              <p className="font-sans text-[#121212]/60 mb-8 max-w-lg mx-auto">
                Comparte tu conocimiento con suscriptores que pagan directamente por él. 0% de comisión.
              </p>
              <Link
                href="/para-creadores"
                className="inline-flex items-center gap-2 bg-[#C41C1C] text-white font-sans font-medium px-6 py-3 rounded hover:bg-[#a01515] transition-colors"
              >
                Comenzar como creador <span aria-hidden="true">→</span>
              </Link>
            </div>
          </section>
        </main>
      </div>
    </>
  )
}
