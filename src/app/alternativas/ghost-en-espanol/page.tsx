import type { Metadata } from 'next'
import { ALTERNATIVES, PageHero, FinalCta, RelatedAlternatives, BreadcrumbsBar, PageFooter } from '../_shared'

const META = ALTERNATIVES.find((a) => a.slug === 'ghost-en-espanol')!

export const metadata: Metadata = {
  title: META.title + ' — Nebbuler',
  description: META.description,
  alternates: { canonical: 'https://nebbuler.com/alternativas/ghost-en-espanol' },
  openGraph: { title: META.title, description: META.description, type: 'article' },
}

export const revalidate = 86400

const FAQS = [
  { q: '¿Ghost es gratis?', a: 'Ghost es open-source, así que puedes auto-hostearlo gratis — pero necesitas servidor, mantenimiento y conocimientos técnicos. Ghost Pro (hosting administrado) cuesta desde $9 hasta $199 USD/mes según tráfico y miembros.' },
  { q: '¿Ghost acepta pagos en pesos o moneda local?', a: 'No. Ghost usa Stripe exclusivamente para membresías de pago, lo cual significa USD/EUR/GBP. No hay opción de cobrar en CLP, MXN, COP, ARS o PEN directamente.' },
  { q: '¿El editor de Nebbuler es comparable al de Ghost?', a: 'Ambos son editores modernos de alto nivel. Ghost usa Koenig (editor propio); Nebbuler usa Tiptap. Para contenido editorial (texto, imágenes, embeds), son equiparables. Ghost tiene cards nativos para booking, productos, etc.' },
  { q: '¿Necesito saber programar para usar Ghost?', a: 'Para Ghost Pro, no. Para self-hosted, sí — necesitas Docker, Node.js, gestión de servidor. Para Nebbuler, no necesitas conocimientos técnicos de ningún tipo.' },
  { q: '¿Cuándo conviene Ghost sobre Nebbuler?', a: 'Si eres desarrollador, quieres control total del código, tu audiencia paga en USD y prefieres open-source. Si eres profesional LATAM que quiere publicar y cobrar sin complejidad técnica, Nebbuler es la opción.' },
]

const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQS.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
const articleSchema = { '@context': 'https://schema.org', '@type': 'Article', headline: META.h1, author: { '@type': 'Organization', name: 'Nebbuler' }, datePublished: '2026-05-23', description: META.description }

export default function GhostAlternativa() {
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
            Nebbuler vs Ghost — lado a lado
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-[14px] border-collapse">
              <thead>
                <tr className="border-b-2 border-[#121212]">
                  <th className="text-left py-3 pr-4 font-sans text-[11px] uppercase tracking-[0.1em] text-[#888]"></th>
                  <th className="text-left py-3 px-4 font-serif text-[16px] text-[#121212]">Nebbuler</th>
                  <th className="text-left py-3 px-4 font-serif text-[16px] text-[#666]">Ghost</th>
                </tr>
              </thead>
              <tbody className="text-[#444]">
                <tr className="border-b border-[#EEEEEE]"><td className="py-3 pr-4 font-medium text-[#121212]">Precio mensual</td><td className="py-3 px-4">US$19/mes</td><td className="py-3 px-4">$0 (self-hosted) / $9-$199 (Pro)</td></tr>
                <tr className="border-b border-[#EEEEEE]"><td className="py-3 pr-4 font-medium text-[#121212]">Comisión por suscripción</td><td className="py-3 px-4 text-[#15803D] font-semibold">0%</td><td className="py-3 px-4">0%</td></tr>
                <tr className="border-b border-[#EEEEEE]"><td className="py-3 pr-4 font-medium text-[#121212]">Monedas locales LATAM</td><td className="py-3 px-4 text-[#15803D]">CLP, MXN, COP, ARS, PEN, UYU, BRL</td><td className="py-3 px-4 text-[#C41C1C]">Solo USD (Stripe)</td></tr>
                <tr className="border-b border-[#EEEEEE]"><td className="py-3 pr-4 font-medium text-[#121212]">Requiere servidor</td><td className="py-3 px-4 text-[#15803D]">No</td><td className="py-3 px-4">Sí (self-hosted) / No (Pro)</td></tr>
                <tr className="border-b border-[#EEEEEE]"><td className="py-3 pr-4 font-medium text-[#121212]">Soporte en español</td><td className="py-3 px-4 text-[#15803D]">Sí, nativo</td><td className="py-3 px-4 text-[#C41C1C]">Solo inglés</td></tr>
                <tr className="border-b border-[#EEEEEE]"><td className="py-3 pr-4 font-medium text-[#121212]">Open source</td><td className="py-3 px-4">No</td><td className="py-3 px-4 text-[#15803D]">Sí (MIT)</td></tr>
                <tr className="border-b border-[#EEEEEE]"><td className="py-3 pr-4 font-medium text-[#121212]">Configuración inicial</td><td className="py-3 px-4 text-[#15803D]">5 minutos</td><td className="py-3 px-4">30 min (Pro) / horas (self-hosted)</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="border-b border-[#DEDEDE] py-16 px-6 bg-[#FAFAF7]">
        <div className="max-w-3xl mx-auto">
          <p className="section-label mb-3">PARA QUIÉN ES CADA UNO</p>
          <hr className="nyt-rule mb-8" />
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white border border-[#DEDEDE] p-6">
              <h3 className="font-serif text-[20px] font-bold text-[#121212] mb-3">Ghost es para ti si...</h3>
              <ul className="space-y-2 text-[14px] text-[#444]">
                <li className="flex gap-2"><span className="text-[#666]">→</span>Eres desarrollador o tienes equipo técnico</li>
                <li className="flex gap-2"><span className="text-[#666]">→</span>Quieres control total del código y la data</li>
                <li className="flex gap-2"><span className="text-[#666]">→</span>Tu audiencia paga en USD/EUR/GBP</li>
                <li className="flex gap-2"><span className="text-[#666]">→</span>Prefieres software open-source</li>
              </ul>
            </div>
            <div className="bg-white border border-[#DEDEDE] p-6">
              <h3 className="font-serif text-[20px] font-bold text-[#121212] mb-3">Nebbuler es para ti si...</h3>
              <ul className="space-y-2 text-[14px] text-[#444]">
                <li className="flex gap-2"><span className="text-[#15803D]">→</span>Eres profesional, no desarrollador</li>
                <li className="flex gap-2"><span className="text-[#15803D]">→</span>Tu audiencia es LATAM y paga en pesos</li>
                <li className="flex gap-2"><span className="text-[#15803D]">→</span>Quieres publicar y cobrar sin configurar servidores</li>
                <li className="flex gap-2"><span className="text-[#15803D]">→</span>Necesitas soporte en español</li>
              </ul>
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
      <RelatedAlternatives currentSlug="ghost-en-espanol" />
      <PageFooter />
    </main>
  )
}
