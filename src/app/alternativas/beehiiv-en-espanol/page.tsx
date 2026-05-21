import type { Metadata } from 'next'
import { ALTERNATIVES, PageHero, FinalCta, RelatedAlternatives, BreadcrumbsBar, PageFooter } from '../_shared'

const META = ALTERNATIVES.find((a) => a.slug === 'beehiiv-en-espanol')!

export const metadata: Metadata = {
  title: META.title + ' — Nebbuler',
  description: META.description,
  alternates: { canonical: 'https://nebbuler.com/alternativas/beehiiv-en-espanol' },
  openGraph: { title: META.title, description: META.description, type: 'article' },
}

export const revalidate = 86400

const FAQS = [
  { q: '¿Beehiiv funciona en español?', a: 'La interfaz, soporte y documentación de Beehiiv están en inglés. Puedes escribir tu newsletter en español, pero todo el panel de control y comunicación con el equipo es en inglés.' },
  { q: '¿Cuánto cuesta Beehiiv?', a: 'Beehiiv tiene plan gratuito hasta 2.500 suscriptores. Pero Beehiiv Grow (US$49/mes) y Scale (US$99/mes) son necesarios para newsletters serios. Solo procesa pagos en USD.' },
  { q: '¿Por qué Nebbuler conviene a creadores hispanohablantes?', a: 'Tu audiencia paga en su moneda local (CLP, MXN, COP, ARS). Eso reduce la fricción de pago hasta 40%. Soporte en español. Una tarifa fija US$19/mes desde el día 1, sin escalones.' },
  { q: '¿Puedo importar mi lista de Beehiiv?', a: 'Sí. Beehiiv permite export de suscriptores. Súbela a Nebbuler como CSV en /dashboard/suscriptores. Mantienes a tus lectores.' },
  { q: '¿Nebbuler tiene automaciones como Beehiiv?', a: 'Beehiiv tiene automaciones avanzadas (welcome series, segmentación profunda). Nebbuler prioriza simplicidad editorial: un newsletter recurrente, suscripciones pagas, sin sobre-ingeniería.' },
]

const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQS.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
const articleSchema = { '@context': 'https://schema.org', '@type': 'Article', headline: META.h1, author: { '@type': 'Organization', name: 'Nebbuler' }, datePublished: '2026-01-15', description: META.description }

export default function BeehiivAlternativa() {
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
          <h2 className="font-serif text-[28px] md:text-[32px] font-bold text-[#121212] mb-8 leading-tight">Nebbuler vs Beehiiv — para audiencias hispanohablantes</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-[14px] border-collapse">
              <thead><tr className="border-b-2 border-[#121212]"><th className="text-left py-3 pr-4 font-sans text-[11px] uppercase tracking-[0.1em] text-[#888]"></th><th className="text-left py-3 px-4 font-serif text-[16px] text-[#121212]">Nebbuler</th><th className="text-left py-3 px-4 font-serif text-[16px] text-[#666]">Beehiiv</th></tr></thead>
              <tbody className="text-[#444]">
                <tr className="border-b border-[#EEEEEE]"><td className="py-3 pr-4 font-medium text-[#121212]">Idioma del soporte</td><td className="py-3 px-4 text-[#15803D]">Español nativo</td><td className="py-3 px-4 text-[#C41C1C]">Solo inglés</td></tr>
                <tr className="border-b border-[#EEEEEE]"><td className="py-3 pr-4 font-medium text-[#121212]">Tarifa mensual</td><td className="py-3 px-4">US$19 fijo</td><td className="py-3 px-4">US$0–99 según subs</td></tr>
                <tr className="border-b border-[#EEEEEE]"><td className="py-3 pr-4 font-medium text-[#121212]">Pago en moneda local</td><td className="py-3 px-4 text-[#15803D]">CLP, MXN, COP, ARS, etc.</td><td className="py-3 px-4 text-[#C41C1C]">Solo USD</td></tr>
                <tr className="border-b border-[#EEEEEE]"><td className="py-3 pr-4 font-medium text-[#121212]">Mercado nativo</td><td className="py-3 px-4">LATAM</td><td className="py-3 px-4">EE.UU./EU</td></tr>
                <tr className="border-b border-[#EEEEEE]"><td className="py-3 pr-4 font-medium text-[#121212]">Editor</td><td className="py-3 px-4">Tiptap (premium)</td><td className="py-3 px-4">Editor propio</td></tr>
                <tr className="border-b border-[#EEEEEE]"><td className="py-3 pr-4 font-medium text-[#121212]">Automaciones avanzadas</td><td className="py-3 px-4">Simple</td><td className="py-3 px-4 text-[#15803D]">Sí (en plan pago)</td></tr>
                <tr className="border-b border-[#EEEEEE]"><td className="py-3 pr-4 font-medium text-[#121212]">Procesamiento de pagos</td><td className="py-3 px-4">MercadoPago + Stripe</td><td className="py-3 px-4">Stripe</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="border-b border-[#DEDEDE] py-16 px-6 bg-[#FAFAF7]">
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
      <RelatedAlternatives currentSlug="beehiiv-en-espanol" />
      <PageFooter />
    </main>
  )
}
