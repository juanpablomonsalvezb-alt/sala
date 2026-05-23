import type { Metadata } from 'next'
import { ALTERNATIVES, PageHero, FinalCta, RelatedAlternatives, BreadcrumbsBar, PageFooter } from '../_shared'

const META = ALTERNATIVES.find((a) => a.slug === 'teachable-en-espanol')!

export const metadata: Metadata = {
  title: META.title + ' — Nebbuler',
  description: META.description,
  alternates: { canonical: 'https://nebbuler.com/alternativas/teachable-en-espanol' },
  openGraph: { title: META.title, description: META.description, type: 'article' },
}

export const revalidate = 86400

const FAQS = [
  { q: '¿Cuánto cobra Teachable al mes?', a: 'Teachable Basic: $59 USD/mes + 5% comisión por transacción. Teachable Pro: $159 USD/mes + 0% comisión. Para un creador LATAM emergente, ambos planes son caros antes de generar ingresos significativos.' },
  { q: '¿Teachable acepta pagos en pesos?', a: 'No. Teachable usa Stripe exclusivamente, lo cual significa USD para tus estudiantes. Los suscriptores LATAM ven precio convertido + recargo internacional del banco.' },
  { q: '¿Teachable o Nebbuler para cursos?', a: 'Si tu modelo es cursos modulares con video, quizzes y certificaciones, Teachable es más completo. Si tu modelo es contenido editorial recurrente (análisis, guías, opinión mensual), Nebbuler es la opción con menor costo y pagos locales.' },
  { q: '¿Cuánto ahorro al migrar de Teachable Basic?', a: 'Con 50 suscriptores a $10 USD/mes: Teachable Basic cobra $59 + $25 (5% comisión) = $84 USD/mes. Nebbuler cobra $19 USD/mes. Ahorro: $65 USD/mes ($780 USD/año).' },
  { q: '¿Cómo migro de Teachable a Nebbuler?', a: 'Exporta tu lista de estudiantes (CSV). Sube a Nebbuler. Republica tu mejor contenido como posts exclusivos. Anuncia la transición. Los videos puedes hostearlos en YouTube/Vimeo privado y embeber.' },
]

const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQS.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
const articleSchema = { '@context': 'https://schema.org', '@type': 'Article', headline: META.h1, author: { '@type': 'Organization', name: 'Nebbuler' }, datePublished: '2026-05-23', description: META.description }

export default function TeachableAlternativa() {
  return (
    <main className="bg-white min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <BreadcrumbsBar competitor={META.competitor} />
      <PageHero kicker={META.kicker} h1={META.h1} summary={META.summary} competitor={META.competitor} />

      <section className="border-b border-[#DEDEDE] py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="section-label mb-3">COMPARATIVA</p>
          <hr className="nyt-rule mb-8" />
          <h2 className="font-serif text-[28px] md:text-[32px] font-bold text-[#121212] mb-8 leading-tight">
            Nebbuler vs Teachable — lado a lado
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-[14px] border-collapse">
              <thead>
                <tr className="border-b-2 border-[#121212]">
                  <th className="text-left py-3 pr-4 font-sans text-[11px] uppercase tracking-[0.1em] text-[#888]"></th>
                  <th className="text-left py-3 px-4 font-serif text-[16px] text-[#121212]">Nebbuler</th>
                  <th className="text-left py-3 px-4 font-serif text-[16px] text-[#666]">Teachable</th>
                </tr>
              </thead>
              <tbody className="text-[#444]">
                <tr className="border-b border-[#EEEEEE]"><td className="py-3 pr-4 font-medium text-[#121212]">Precio mensual</td><td className="py-3 px-4 text-[#15803D] font-semibold">US$19/mes</td><td className="py-3 px-4">US$59/mes (Basic)</td></tr>
                <tr className="border-b border-[#EEEEEE]"><td className="py-3 pr-4 font-medium text-[#121212]">Comisión por venta</td><td className="py-3 px-4 text-[#15803D] font-semibold">0%</td><td className="py-3 px-4">5% (Basic) / 0% (Pro $159/mes)</td></tr>
                <tr className="border-b border-[#EEEEEE]"><td className="py-3 pr-4 font-medium text-[#121212]">Monedas locales LATAM</td><td className="py-3 px-4 text-[#15803D]">CLP, MXN, COP, ARS, PEN, UYU, BRL</td><td className="py-3 px-4 text-[#C41C1C]">Solo USD</td></tr>
                <tr className="border-b border-[#EEEEEE]"><td className="py-3 pr-4 font-medium text-[#121212]">Tipo de contenido</td><td className="py-3 px-4">Editorial recurrente (análisis, guías)</td><td className="py-3 px-4">Cursos modulares (video + quizzes)</td></tr>
                <tr className="border-b border-[#EEEEEE]"><td className="py-3 pr-4 font-medium text-[#121212]">Soporte en español</td><td className="py-3 px-4 text-[#15803D]">Sí, nativo</td><td className="py-3 px-4 text-[#C41C1C]">Solo inglés</td></tr>
                <tr className="border-b border-[#EEEEEE]"><td className="py-3 pr-4 font-medium text-[#121212]">Certificaciones</td><td className="py-3 px-4">No</td><td className="py-3 px-4 text-[#15803D]">Sí</td></tr>
                <tr className="border-b border-[#EEEEEE]"><td className="py-3 pr-4 font-medium text-[#121212]">Costo anual mínimo</td><td className="py-3 px-4 text-[#15803D] font-semibold">US$228/año</td><td className="py-3 px-4">US$708/año (Basic)</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="border-b border-[#DEDEDE] py-16 px-6 bg-[#FAFAF7]">
        <div className="max-w-3xl mx-auto">
          <p className="section-label mb-3">CALCULADORA</p>
          <hr className="nyt-rule mb-8" />
          <h2 className="font-serif text-[28px] md:text-[32px] font-bold text-[#121212] mb-6">Cuánto pierdes con Teachable Basic</h2>
          <div className="space-y-3 text-[14px]">
            {[
              { subs: 20, price: 10, teachable: 69, nebbuler: 19 },
              { subs: 50, price: 10, teachable: 84, nebbuler: 19 },
              { subs: 100, price: 10, teachable: 109, nebbuler: 19 },
              { subs: 200, price: 10, teachable: 159, nebbuler: 19 },
              { subs: 500, price: 10, teachable: 309, nebbuler: 19 },
            ].map((row) => (
              <div key={row.subs} className="grid grid-cols-4 items-center bg-white border border-[#DEDEDE] px-5 py-4">
                <div className="font-serif text-[18px] font-bold text-[#121212]">{row.subs} subs</div>
                <div className="text-[#666]">Teachable: <span className="font-semibold text-[#C41C1C]">US${row.teachable}/mes</span></div>
                <div className="text-[#666]">Nebbuler: <span className="font-semibold text-[#15803D]">US${row.nebbuler}/mes</span></div>
                <div className="text-right font-semibold text-[#15803D]">Ahorras US${row.teachable - row.nebbuler}/mes</div>
              </div>
            ))}
          </div>
          <p className="mt-6 font-sans text-[12px] text-[#888]">Asumiendo suscripción promedio US$10/mes. Teachable Basic: $59/mes fijo + 5% comisión.</p>
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
      <RelatedAlternatives currentSlug="teachable-en-espanol" />
      <PageFooter />
    </main>
  )
}
