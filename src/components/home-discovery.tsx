/**
 * Módulos de descubrimiento para la homepage.
 * Surfacean las secciones clave que de otro modo quedarían ocultas en el nav.
 * Server Component — sin hydration extra.
 */

import Link from 'next/link'

// ─── 3. Pregunta al Observatorio ─────────────────────────────────────────────

const SAMPLE_QUESTIONS = [
  '¿Qué es la TPM y cómo afecta mi hipoteca?',
  '¿Cómo tributa una SpA en Chile?',
  '¿Cuál es la diferencia entre EBITDA y flujo de caja?',
  '¿Qué está pasando con la inflación en América Latina?',
]

export function PreguntaModule() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        <div>
          <p className="font-sans text-[10px] font-bold tracking-[0.25em] uppercase text-[#C41C1C] mb-2">
            Respuestas de profesionales verificados
          </p>
          <h2 className="font-serif text-[32px] font-bold text-[#121212] leading-tight mb-4">
            Pregunta al Observatorio
          </h2>
          <p className="font-sans text-[15px] text-[#666] leading-relaxed mb-8">
            Economistas, abogados y médicos de Nebbuler responden tus preguntas. Sin jerga innecesaria, con ejemplos de América Latina.
          </p>
          <Link
            href="/pregunta"
            className="inline-block bg-[#121212] text-white font-sans text-[11px] font-bold tracking-[0.15em] uppercase px-8 py-4 hover:bg-[#C41C1C] transition-colors"
          >
            Hacer una pregunta →
          </Link>
        </div>

        <div className="space-y-3">
          {SAMPLE_QUESTIONS.map((q) => (
            <Link
              key={q}
              href={`/pregunta?q=${encodeURIComponent(q)}`}
              className="flex items-center gap-3 p-4 border border-[#EEEEEE] hover:border-[#C41C1C] transition-colors group"
            >
              <span className="font-serif text-[18px] text-[#C41C1C] leading-none flex-shrink-0">"</span>
              <span className="font-sans text-[13px] text-[#444] group-hover:text-[#121212] transition-colors leading-snug">
                {q}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── 4. Glosario ─────────────────────────────────────────────────────────────

const FEATURED_TERMS = [
  { slug: 'tasa-de-politica-monetaria-tpm', term: 'TPM', discipline: 'Economía' },
  { slug: 'ebitda', term: 'EBITDA', discipline: 'Finanzas' },
  { slug: 'base-imponible', term: 'Base Imponible', discipline: 'Derecho' },
  { slug: 'inflacion-subyacente', term: 'Inflación Subyacente', discipline: 'Economía' },
  { slug: 'wacc-costo-promedio-ponderado-de-capital', term: 'WACC', discipline: 'Finanzas' },
  { slug: 'impuesto-de-primera-categoria-idpc', term: 'IDPC', discipline: 'Derecho' },
  { slug: 'pib-potencial', term: 'PIB Potencial', discipline: 'Economía' },
  { slug: 'due-diligence', term: 'Due Diligence', discipline: 'Finanzas' },
]

export function GlosarioModule() {
  return (
    <section className="border-t border-[#EEEEEE] py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="font-sans text-[10px] font-bold tracking-[0.25em] uppercase text-[#999] mb-2">
              Economía · Derecho · Finanzas
            </p>
            <h2 className="font-serif text-[24px] font-bold text-[#121212]">
              Glosario profesional
            </h2>
          </div>
          <Link
            href="/glosario"
            className="font-sans text-[11px] font-bold tracking-[0.1em] uppercase text-[#666] hover:text-[#C41C1C] transition-colors"
          >
            Ver todos →
          </Link>
        </div>

        <div className="flex flex-wrap gap-2">
          {FEATURED_TERMS.map((t) => (
            <Link
              key={t.slug}
              href={`/glosario/${t.slug}`}
              className="group inline-flex items-center gap-2 border border-[#DEDEDE] px-4 py-2 hover:border-[#C41C1C] transition-colors"
            >
              <span className="font-sans text-[9px] font-bold tracking-[0.15em] uppercase text-[#999] group-hover:text-[#C41C1C] transition-colors">
                {t.discipline}
              </span>
              <span className="font-serif text-[14px] font-bold text-[#121212]">
                {t.term}
              </span>
            </Link>
          ))}
          <Link
            href="/glosario"
            className="inline-flex items-center border border-dashed border-[#DEDEDE] px-4 py-2 hover:border-[#C41C1C] transition-colors"
          >
            <span className="font-sans text-[11px] text-[#999] hover:text-[#C41C1C] transition-colors">
              +200 términos →
            </span>
          </Link>
        </div>
      </div>
    </section>
  )
}
