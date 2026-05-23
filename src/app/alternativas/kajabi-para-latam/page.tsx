import type { Metadata } from 'next'
import { ALTERNATIVES, PageHero, FinalCta, RelatedAlternatives, BreadcrumbsBar, PageFooter } from '../_shared'

const META = ALTERNATIVES.find((a) => a.slug === 'kajabi-para-latam')!

export const metadata: Metadata = {
  title: META.title + ' — Nebbuler',
  description: META.description,
  alternates: { canonical: 'https://nebbuler.com/alternativas/kajabi-para-latam' },
  openGraph: { title: META.title, description: META.description, type: 'article' },
}

export const revalidate = 86400

const FAQS = [
  { q: '¿Cuánto cuesta Kajabi al mes?', a: 'El plan más barato de Kajabi es $149 USD/mes (~$141.000 CLP). No hay plan gratuito real. Para un creador LATAM en etapa de crecimiento, esto es prohibitivo antes de generar ingresos significativos.' },
  { q: '¿Kajabi acepta pagos en pesos?', a: 'No. Kajabi usa Stripe exclusivamente, que procesa en USD. Tus suscriptores latinoamericanos pagan en dólares con recargo de conversión y cargo internacional.' },
  { q: '¿Qué tiene Kajabi que Nebbuler no?', a: 'Kajabi tiene pipeline builder, landing pages avanzadas, webinars nativos, quizzes y coaching tools. Si dependes de esas funcionalidades específicas, Kajabi es más completo. Nebbuler se enfoca en lo esencial: publicar contenido editorial, cobrar membresías, distribuir — simple y en moneda local.' },
  { q: '¿Desde cuántos suscriptores conviene Nebbuler vs Kajabi?', a: 'Desde el primer suscriptor. Kajabi cuesta $149 USD/mes antes de cobrar a nadie. Nebbuler cuesta US$19/mes. La diferencia de $130 USD/mes es ingreso neto que ganas o pierdes.' },
  { q: '¿Cómo migro de Kajabi a Nebbuler?', a: 'Exporta tu lista de contactos desde Kajabi. Sube el CSV a Nebbuler. Republica tu mejor contenido. Anuncia la transición. El proceso toma menos de 2 horas.' },
]

const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQS.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
const articleSchema = { '@context': 'https://schema.org', '@type': 'Article', headline: META.h1, author: { '@type': 'Organization', name: 'Nebbuler' }, datePublished: '2026-05-23', description: META.description }

export default function KajabiAlternativa() {
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
            Nebbuler vs Kajabi — lado a lado
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-[14px] border-collapse">
              <thead>
                <tr className="border-b-2 border-[#121212]">
                  <th className="text-left py-3 pr-4 font-sans text-[11px] uppercase tracking-[0.1em] text-[#888]"></th>
                  <th className="text-left py-3 px-4 font-serif text-[16px] text-[#121212]">Nebbuler</th>
                  <th className="text-left py-3 px-4 font-serif text-[16px] text-[#666]">Kajabi</th>
                </tr>
              </thead>
              <tbody className="text-[#444]">
                <tr className="border-b border-[#EEEEEE]"><td className="py-3 pr-4 font-medium text-[#121212]">Precio mensual</td><td className="py-3 px-4 text-[#15803D] font-semibold">US$19/mes</td><td className="py-3 px-4">US$149/mes mínimo</td></tr>
                <tr className="border-b border-[#EEEEEE]"><td className="py-3 pr-4 font-medium text-[#121212]">Comisión por suscripción</td><td className="py-3 px-4 text-[#15803D] font-semibold">0%</td><td className="py-3 px-4">0% (incluido en el plan)</td></tr>
                <tr className="border-b border-[#EEEEEE]"><td className="py-3 pr-4 font-medium text-[#121212]">Monedas locales LATAM</td><td className="py-3 px-4 text-[#15803D]">CLP, MXN, COP, ARS, PEN, UYU, BRL</td><td className="py-3 px-4 text-[#C41C1C]">Solo USD</td></tr>
                <tr className="border-b border-[#EEEEEE]"><td className="py-3 pr-4 font-medium text-[#121212]">Soporte en español</td><td className="py-3 px-4 text-[#15803D]">Sí, nativo</td><td className="py-3 px-4 text-[#C41C1C]">Solo inglés</td></tr>
                <tr className="border-b border-[#EEEEEE]"><td className="py-3 pr-4 font-medium text-[#121212]">Pipeline builder</td><td className="py-3 px-4">No</td><td className="py-3 px-4 text-[#15803D]">Sí</td></tr>
                <tr className="border-b border-[#EEEEEE]"><td className="py-3 pr-4 font-medium text-[#121212]">Editor editorial</td><td className="py-3 px-4 text-[#15803D]">Tiptap (profesional)</td><td className="py-3 px-4">Sí</td></tr>
                <tr className="border-b border-[#EEEEEE]"><td className="py-3 pr-4 font-medium text-[#121212]">Costo anual mínimo</td><td className="py-3 px-4 text-[#15803D] font-semibold">US$228/año</td><td className="py-3 px-4">US$1,788/año</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="border-b border-[#DEDEDE] py-16 px-6 bg-[#FAFAF7]">
        <div className="max-w-3xl mx-auto">
          <p className="section-label mb-3">LA MATEMÁTICA</p>
          <hr className="nyt-rule mb-8" />
          <h2 className="font-serif text-[28px] md:text-[32px] font-bold text-[#121212] mb-6">Kajabi te cuesta $130 USD/mes más que Nebbuler</h2>
          <div className="bg-white border border-[#DEDEDE] p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <p className="text-[12px] uppercase tracking-wider text-[#666] mb-2">Con Kajabi pagas</p>
                <p className="font-serif text-[2.5rem] font-bold text-[#C41C1C]">US$149<span className="text-[1rem] text-[#888]">/mes</span></p>
                <p className="text-[13px] text-[#666] mt-1">Antes de cobrar un solo suscriptor</p>
              </div>
              <div>
                <p className="text-[12px] uppercase tracking-wider text-[#666] mb-2">Con Nebbuler pagas</p>
                <p className="font-serif text-[2.5rem] font-bold text-[#15803D]">US$19<span className="text-[1rem] text-[#888]">/mes</span></p>
                <p className="text-[13px] text-[#666] mt-1">Con todo incluido desde el día 1</p>
              </div>
            </div>
            <p className="mt-6 text-[14px] text-[#444] border-t border-[#EEEEEE] pt-6">
              La diferencia de <strong>US$130/mes</strong> (US$1,560/año) es dinero que podrías invertir en contenido, marketing o simplemente quedarte como ingreso neto.
            </p>
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
      <RelatedAlternatives currentSlug="kajabi-para-latam" />
      <PageFooter />
    </main>
  )
}
