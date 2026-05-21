import type { Metadata } from 'next'
import { ALTERNATIVES, PageHero, FinalCta, RelatedAlternatives, BreadcrumbsBar, PageFooter } from '../_shared'

const META = ALTERNATIVES.find((a) => a.slug === 'gumroad-para-creadores-latam')!

export const metadata: Metadata = {
  title: META.title + ' — Nebbuler',
  description: META.description,
  alternates: { canonical: 'https://nebbuler.com/alternativas/gumroad-para-creadores-latam' },
  openGraph: { title: META.title, description: META.description, type: 'article' },
}

export const revalidate = 86400

const FAQS = [
  { q: '¿Cuánto cobra Gumroad por venta?', a: 'Gumroad cobra 10% sobre cada venta + ~3.5% del procesador de pagos. Para creadores LATAM vendiendo en USD esto significa perder ~14% de cada transacción. Para productos digitales recurrentes, el costo se compone mes a mes.' },
  { q: '¿Por qué membresías recurrentes ganan a productos one-shot?', a: 'Ingresos predecibles. Con 100 suscriptores a US$10/mes generas US$12.000/año estables. Con productos one-shot necesitas re-vender cada mes para mantener ingresos. Es la diferencia entre MRR (Monthly Recurring Revenue) y ventas episódicas.' },
  { q: '¿Puedo vender productos digitales en Nebbuler?', a: 'Nebbuler está optimizado para membresías recurrentes con contenido publicado en cadencia. Si quieres vender un PDF o curso one-shot, Gumroad sigue siendo apropiado. Si tu modelo es "suscripción mensual a mi expertise", Nebbuler gana.' },
  { q: '¿Cuándo conviene migrar de Gumroad a Nebbuler?', a: 'Si tu producto evoluciona de "lo escribí una vez" a "publico análisis o contenido continuamente", el modelo membresía multiplica tus ingresos. Convertir 100 compradores one-shot en 100 suscriptores recurrentes a US$10/mes = US$12K/año vs US$1K una sola vez.' },
  { q: '¿Cómo migro de Gumroad a Nebbuler?', a: 'Exporta lista de compradores desde Gumroad. Súbela como invitaciones VIP en Nebbuler con primer mes gratis. Anuncia el cambio por email destacando el nuevo modelo (acceso continuo vs un solo PDF).' },
]

const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQS.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
const articleSchema = { '@context': 'https://schema.org', '@type': 'Article', headline: META.h1, author: { '@type': 'Organization', name: 'Nebbuler' }, datePublished: '2026-01-15', description: META.description }

export default function GumroadAlternativa() {
  return (
    <main className="bg-white min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <BreadcrumbsBar competitor={META.competitor} />
      <PageHero kicker={META.kicker} h1={META.h1} summary={META.summary} competitor={META.competitor} />

      <section className="border-b border-[#DEDEDE] py-16 px-6 bg-[#FAFAF7]">
        <div className="max-w-3xl mx-auto">
          <p className="section-label mb-3">ONE-SHOT VS RECURRENTE</p>
          <hr className="nyt-rule mb-8" />
          <div className="space-y-5 text-[15px] text-[#444] leading-[1.7]">
            <p>Gumroad es una herramienta sólida para vender un producto digital una sola vez: un PDF, un template, un curso. El problema es el modelo: <strong className="text-[#121212]">tienes que re-vender constantemente</strong> para mantener ingresos.</p>
            <p>Con 100 compradores one-shot a US$10 generas US$1.000. Una sola vez. Para repetir el ingreso necesitas conseguir otros 100 compradores el mes siguiente, y otros 100 al mes siguiente.</p>
            <p>El modelo membresía invierte la ecuación: 100 suscriptores a US$10/mes generan <strong className="text-[#15803D]">US$12.000 al año, automático</strong>. La métrica no es "ventas del mes" sino MRR (Monthly Recurring Revenue), la métrica favorita de inversores y la única que escala sin re-trabajo constante.</p>
          </div>
        </div>
      </section>

      <section className="border-b border-[#DEDEDE] py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="section-label mb-3">CALCULADORA A 12 MESES</p>
          <hr className="nyt-rule mb-8" />
          <div className="grid md:grid-cols-2 gap-5">
            <div className="border border-[#DEDEDE] p-6">
              <p className="font-sans text-[11px] uppercase tracking-[0.14em] text-[#C41C1C] mb-2">GUMROAD ONE-SHOT</p>
              <p className="font-serif text-[24px] font-bold text-[#121212] mb-3">US$1.000</p>
              <p className="font-sans text-[13px] text-[#666] leading-[1.6]">100 ventas × US$10 — 14% comisión = US$860 reales. Necesitas re-vender cada mes para mantener este ingreso.</p>
            </div>
            <div className="border-2 border-[#121212] p-6 bg-[#FAFAF7]">
              <p className="font-sans text-[11px] uppercase tracking-[0.14em] text-[#15803D] mb-2">NEBBULER MEMBRESÍA</p>
              <p className="font-serif text-[24px] font-bold text-[#121212] mb-3">US$12.000</p>
              <p className="font-sans text-[13px] text-[#666] leading-[1.6]">100 suscriptores × US$10/mes × 12 — US$228 tarifa anual = US$11.772 reales. Predecible, automático, escalable.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#DEDEDE] py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="section-label mb-3">FAQ</p>
          <hr className="nyt-rule mb-8" />
          <div className="space-y-7">
            {FAQS.map((f) => (
              <div key={f.q}>
                <h3 className="font-serif text-[19px] font-bold text-[#121212] mb-2 leading-tight">{f.q}</h3>
                <p className="font-sans text-[14px] text-[#555] leading-[1.65]">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FinalCta competitor={META.competitor} />
      <RelatedAlternatives currentSlug="gumroad-para-creadores-latam" />
      <PageFooter />
    </main>
  )
}
