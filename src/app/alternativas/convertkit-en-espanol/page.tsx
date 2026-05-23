import type { Metadata } from 'next'
import { ALTERNATIVES, PageHero, FinalCta, RelatedAlternatives, BreadcrumbsBar, PageFooter } from '../_shared'

const META = ALTERNATIVES.find((a) => a.slug === 'convertkit-en-espanol')!

export const metadata: Metadata = {
  title: META.title + ' — Nebbuler',
  description: META.description,
  alternates: { canonical: 'https://nebbuler.com/alternativas/convertkit-en-espanol' },
  openGraph: { title: META.title, description: META.description, type: 'article' },
}

export const revalidate = 86400

const FAQS = [
  { q: '¿ConvertKit acepta pagos en pesos o moneda local LATAM?', a: 'No. ConvertKit procesa pagos exclusivamente en USD vía Stripe. Tus suscriptores latinoamericanos pagan con recargo de conversión internacional de su banco, lo cual reduce la conversión significativamente.' },
  { q: '¿Cuánto cobra ConvertKit por monetizar contenido?', a: 'ConvertKit Creator cobra $29 USD/mes + 3.5% sobre cada venta. Con 100 suscriptores a US$7/mes, pagas $29 + $24.5 = $53.5 USD/mes. En Nebbuler: US$19/mes fijo con 0% comisión.' },
  { q: '¿ConvertKit o Nebbuler para email marketing?', a: 'Si tu modelo es funnels complejos con automatización y audiencia en USD, ConvertKit es fuerte. Si tu modelo es membresía editorial para LATAM con cobros recurrentes en pesos, Nebbuler es la opción.' },
  { q: '¿Cómo migro de ConvertKit a Nebbuler?', a: 'Exporta tu lista de suscriptores desde ConvertKit (Subscribers → Export CSV). Súbela a Nebbuler. Los tags no migran 1:1 pero los contactos sí. La re-suscripción con tarjeta local es necesaria.' },
  { q: '¿Puedo usar ConvertKit y Nebbuler juntos?', a: 'Sí. Muchos creadores usan ConvertKit para su lista gratuita en inglés y Nebbuler para su membresía paga en español. Modelo híbrido válido y eficiente.' },
]

const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQS.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
const articleSchema = { '@context': 'https://schema.org', '@type': 'Article', headline: META.h1, author: { '@type': 'Organization', name: 'Nebbuler' }, datePublished: '2026-05-23', description: META.description }

export default function ConvertKitAlternativa() {
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
            Nebbuler vs ConvertKit — lado a lado
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-[14px] border-collapse">
              <thead>
                <tr className="border-b-2 border-[#121212]">
                  <th className="text-left py-3 pr-4 font-sans text-[11px] uppercase tracking-[0.1em] text-[#888]"></th>
                  <th className="text-left py-3 px-4 font-serif text-[16px] text-[#121212]">Nebbuler</th>
                  <th className="text-left py-3 px-4 font-serif text-[16px] text-[#666]">ConvertKit</th>
                </tr>
              </thead>
              <tbody className="text-[#444]">
                <tr className="border-b border-[#EEEEEE]"><td className="py-3 pr-4 font-medium text-[#121212]">Comisión por suscripción</td><td className="py-3 px-4 text-[#15803D] font-semibold">0%</td><td className="py-3 px-4">3.5%</td></tr>
                <tr className="border-b border-[#EEEEEE]"><td className="py-3 pr-4 font-medium text-[#121212]">Tarifa fija mensual</td><td className="py-3 px-4">US$19/mes</td><td className="py-3 px-4">US$29/mes (Creator)</td></tr>
                <tr className="border-b border-[#EEEEEE]"><td className="py-3 pr-4 font-medium text-[#121212]">Monedas locales LATAM</td><td className="py-3 px-4 text-[#15803D]">CLP, MXN, COP, ARS, PEN, UYU, BRL</td><td className="py-3 px-4 text-[#C41C1C]">Solo USD</td></tr>
                <tr className="border-b border-[#EEEEEE]"><td className="py-3 pr-4 font-medium text-[#121212]">Procesador de pago</td><td className="py-3 px-4">MercadoPago + Stripe</td><td className="py-3 px-4">Solo Stripe</td></tr>
                <tr className="border-b border-[#EEEEEE]"><td className="py-3 pr-4 font-medium text-[#121212]">Soporte en español</td><td className="py-3 px-4 text-[#15803D]">Sí, nativo</td><td className="py-3 px-4 text-[#C41C1C]">Solo inglés</td></tr>
                <tr className="border-b border-[#EEEEEE]"><td className="py-3 pr-4 font-medium text-[#121212]">Automatización email</td><td className="py-3 px-4">Básica</td><td className="py-3 px-4 text-[#15803D]">Avanzada (sequences, visual automations)</td></tr>
                <tr className="border-b border-[#EEEEEE]"><td className="py-3 pr-4 font-medium text-[#121212]">Membresía editorial</td><td className="py-3 px-4 text-[#15803D]">Nativo (paywall + editor)</td><td className="py-3 px-4">Commerce add-on</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="border-b border-[#DEDEDE] py-16 px-6 bg-[#FAFAF7]">
        <div className="max-w-3xl mx-auto">
          <p className="section-label mb-3">CALCULADORA DE COSTOS</p>
          <hr className="nyt-rule mb-8" />
          <h2 className="font-serif text-[28px] md:text-[32px] font-bold text-[#121212] mb-6">Cuánto pierdes con ConvertKit</h2>
          <div className="space-y-3 text-[14px]">
            {[
              { subs: 50, price: 7, ck: 41, nebbuler: 19 },
              { subs: 100, price: 7, ck: 54, nebbuler: 19 },
              { subs: 200, price: 7, ck: 78, nebbuler: 19 },
              { subs: 500, price: 7, ck: 152, nebbuler: 19 },
              { subs: 1000, price: 7, ck: 274, nebbuler: 19 },
            ].map((row) => (
              <div key={row.subs} className="grid grid-cols-4 items-center bg-white border border-[#DEDEDE] px-5 py-4">
                <div className="font-serif text-[18px] font-bold text-[#121212]">{row.subs} subs</div>
                <div className="text-[#666]">ConvertKit: <span className="font-semibold text-[#C41C1C]">US${row.ck}/mes</span></div>
                <div className="text-[#666]">Nebbuler: <span className="font-semibold text-[#15803D]">US${row.nebbuler}/mes</span></div>
                <div className="text-right font-semibold text-[#15803D]">Ahorras US${row.ck - row.nebbuler}/mes</div>
              </div>
            ))}
          </div>
          <p className="mt-6 font-sans text-[12px] text-[#888]">Asumiendo suscripción promedio US$7/mes. ConvertKit Creator: $29/mes fijo + 3.5% comisión + Stripe 2.9%.</p>
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
      <RelatedAlternatives currentSlug="convertkit-en-espanol" />
      <PageFooter />
    </main>
  )
}
