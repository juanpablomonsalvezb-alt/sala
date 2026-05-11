/**
 * Módulos de descubrimiento para la homepage.
 * Surfacean las secciones clave que de otro modo quedarían ocultas en el nav.
 * Server Component — sin hydration extra.
 */

import Link from 'next/link'
import { creators } from '@/data/creators'

// ─── 1. Lo más leído esta semana ─────────────────────────────────────────────

const TRENDING_POSTS = [
  {
    rank: 1,
    title: 'TPM en pausa: por qué el Banco Central no recortará antes del Q3',
    creator: 'Rodrigo Fuentes Marín',
    specialty: 'Macroeconomía',
    slug: '/rodrigo-fuentes-marin',
    views: 1247,
    discipline: 'economia',
  },
  {
    rank: 2,
    title: 'IVA crédito fiscal: el error que más caro le sale a las SpA en Chile',
    creator: 'Matías Cornejo Silva',
    specialty: 'Derecho Tributario',
    slug: '/matias-cornejo-silva',
    views: 983,
    discipline: 'derecho',
  },
  {
    rank: 3,
    title: 'DCF vs múltiplos: cuándo usar cada método para valorar una empresa',
    creator: 'Carolina Vega Toro',
    specialty: 'Finanzas Corporativas',
    slug: '/carolina-vega-toro',
    views: 841,
    discipline: 'finanzas',
  },
]

export function TrendingModule() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="font-sans text-[10px] font-bold tracking-[0.25em] uppercase text-[#C41C1C] mb-2">
            Esta semana
          </p>
          <h2 className="font-serif text-[32px] font-bold text-[#121212] leading-tight">
            Lo más leído
          </h2>
        </div>
        <Link
          href="/trending"
          className="hidden md:inline-block font-sans text-[11px] font-bold tracking-[0.1em] uppercase text-[#666] hover:text-[#C41C1C] transition-colors"
        >
          Ver todo →
        </Link>
      </div>

      <div className="divide-y divide-[#EEEEEE]">
        {TRENDING_POSTS.map((post) => (
          <Link
            key={post.rank}
            href={post.slug}
            className="flex items-start gap-6 py-6 group"
          >
            <span className="font-serif text-[36px] font-bold text-[#EEEEEE] leading-none w-10 flex-shrink-0 group-hover:text-[#C41C1C] transition-colors">
              {post.rank}
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-serif text-[17px] font-bold text-[#121212] leading-snug mb-2 group-hover:text-[#C41C1C] transition-colors">
                {post.title}
              </p>
              <p className="font-sans text-[12px] text-[#999] uppercase tracking-wide">
                {post.creator} · {post.specialty}
              </p>
            </div>
            <span className="hidden md:block font-sans text-[11px] text-[#BBBBBB] flex-shrink-0 self-center">
              {post.views.toLocaleString()} lecturas
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-6 md:hidden">
        <Link
          href="/trending"
          className="font-sans text-[11px] font-bold tracking-[0.1em] uppercase text-[#C41C1C]"
        >
          Ver todo →
        </Link>
      </div>
    </section>
  )
}

// ─── 2. El Observatorio ───────────────────────────────────────────────────────

const OBSERVATORIO_ARTICLES = [
  {
    slug: '/observatorio/substack-en-espanol-2026',
    tag: 'Plataformas',
    title: 'Substack en Español 2026: Alternativas y el Auge del Newsletter Profesional',
    excerpt: 'Por qué Substack no escala para América Latina y qué plataformas están ganando terreno en Chile, Colombia y México.',
  },
  {
    slug: '/observatorio/economistas-chile-2026',
    tag: 'Economía',
    title: 'Economistas Chilenos que Publican Newsletters en 2026',
    excerpt: 'Ex-Banco Central, PhDs y consultores independientes que decidieron cobrar directamente por sus análisis.',
  },
  {
    slug: '/observatorio/derecho-tributario-latam',
    tag: 'Derecho',
    title: 'Newsletters de Derecho Tributario en América Latina',
    excerpt: 'Los abogados tributaristas más rigurosos de la región y cómo monetizan su expertise fuera de los estudios.',
  },
]

export function ObservatorioModule() {
  return (
    <section className="bg-[#F7F7F7] py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="font-sans text-[10px] font-bold tracking-[0.25em] uppercase text-[#C41C1C] mb-2">
              Análisis del mercado
            </p>
            <h2 className="font-serif text-[32px] font-bold text-[#121212] leading-tight">
              Observatorio Nebbuler
            </h2>
          </div>
          <Link
            href="/observatorio"
            className="hidden md:inline-block font-sans text-[11px] font-bold tracking-[0.1em] uppercase text-[#666] hover:text-[#C41C1C] transition-colors"
          >
            Ver todo →
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {OBSERVATORIO_ARTICLES.map((art) => (
            <Link
              key={art.slug}
              href={art.slug}
              className="bg-white border border-[#EEEEEE] p-6 hover:border-[#C41C1C] transition-colors group"
            >
              <span className="inline-block font-sans text-[9px] font-bold tracking-[0.2em] uppercase text-[#C41C1C] border border-[#C41C1C] px-2 py-0.5 mb-4">
                {art.tag}
              </span>
              <h3 className="font-serif text-[16px] font-bold text-[#121212] leading-snug mb-3 group-hover:text-[#C41C1C] transition-colors">
                {art.title}
              </h3>
              <p className="font-sans text-[13px] text-[#666] leading-relaxed">
                {art.excerpt}
              </p>
              <p className="font-sans text-[11px] font-bold tracking-[0.1em] uppercase text-[#C41C1C] mt-4">
                Leer →
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-6 md:hidden">
          <Link
            href="/observatorio"
            className="font-sans text-[11px] font-bold tracking-[0.1em] uppercase text-[#C41C1C]"
          >
            Ver todo →
          </Link>
        </div>
      </div>
    </section>
  )
}

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
