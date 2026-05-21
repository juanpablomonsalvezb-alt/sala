import type { Metadata } from 'next'
import { ALTERNATIVES, PageHero, FinalCta, RelatedAlternatives, BreadcrumbsBar, PageFooter } from '../_shared'

const META = ALTERNATIVES.find((a) => a.slug === 'patreon-en-latam')!

export const metadata: Metadata = {
  title: META.title + ' — Nebbuler',
  description: META.description,
  alternates: { canonical: 'https://nebbuler.com/alternativas/patreon-en-latam' },
  openGraph: { title: META.title, description: META.description, type: 'article' },
}

export const revalidate = 86400

const FAQS = [
  { q: '¿Cuánto cobra Patreon por suscripción?', a: 'Patreon Pro: 8% sobre cada suscripción. Patreon Premium: 12%. A esto se suma ~5% del procesador de pagos. Para creadores LATAM, esto reduce ingresos entre 13% y 17%.' },
  { q: '¿Patreon acepta pagos en pesos chilenos, mexicanos o argentinos?', a: 'No. Patreon cobra exclusivamente en USD. Tus suscriptores latinoamericanos ven el precio convertido por su banco con comisiones adicionales, lo cual reduce conversión significativamente.' },
  { q: '¿Desde cuántos suscriptores conviene Nebbuler vs Patreon?', a: 'A partir de 25 suscriptores activos. Con 50 suscriptores a US$5/mes, Patreon te cobra US$20/mes en comisiones; Nebbuler cobra US$19 fijo y queda igual. Desde 100 subs, Nebbuler ahorra US$21/mes mínimo.' },
  { q: '¿Puedo ofrecer tiers como en Patreon?', a: 'Nebbuler está optimizado para suscripciones simples de un tier. Si tu modelo es 5 niveles con beneficios distintos, Patreon sigue siendo más adecuado. Si quieres simpleza editorial, Nebbuler gana.' },
  { q: '¿Cómo migro mi base de Patreon a Nebbuler?', a: 'Exporta tu lista de patrons activos desde Patreon. Súbelos a Nebbuler como invitaciones VIP (sin pagar plan inicial). Envía un email anunciando el cambio con incentivo (ej: primer mes gratis).' },
]

const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQS.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
const articleSchema = { '@context': 'https://schema.org', '@type': 'Article', headline: META.h1, author: { '@type': 'Organization', name: 'Nebbuler' }, datePublished: '2026-01-15', description: META.description }

export default function PatreonAlternativa() {
  return (
    <main className="bg-white min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <BreadcrumbsBar competitor={META.competitor} />
      <PageHero kicker={META.kicker} h1={META.h1} summary={META.summary} competitor={META.competitor} />

      <section className="border-b border-[#DEDEDE] py-16 px-6 bg-[#FAFAF7]">
        <div className="max-w-3xl mx-auto">
          <p className="section-label mb-3">CALCULADORA DE COMISIONES</p>
          <hr className="nyt-rule mb-8" />
          <h2 className="font-serif text-[28px] md:text-[32px] font-bold text-[#121212] mb-6">Cuánto pierdes con Patreon</h2>
          <div className="space-y-3 text-[14px]">
            {[
              { subs: 50, price: 5, patreon: 25, nebbuler: 19 },
              { subs: 100, price: 5, patreon: 50, nebbuler: 19 },
              { subs: 200, price: 5, patreon: 100, nebbuler: 19 },
              { subs: 500, price: 5, patreon: 250, nebbuler: 19 },
              { subs: 1000, price: 5, patreon: 500, nebbuler: 19 },
            ].map((row) => (
              <div key={row.subs} className="grid grid-cols-4 items-center bg-white border border-[#DEDEDE] px-5 py-4">
                <div className="font-serif text-[18px] font-bold text-[#121212]">{row.subs} subs</div>
                <div className="text-[#666]">Patreon Pro: <span className="font-semibold text-[#C41C1C]">US${row.patreon}/mes</span></div>
                <div className="text-[#666]">Nebbuler: <span className="font-semibold text-[#15803D]">US${row.nebbuler}/mes</span></div>
                <div className="text-right font-semibold text-[#15803D]">{row.patreon > row.nebbuler ? `+US$${row.patreon - row.nebbuler}/mes` : `−US$${row.nebbuler - row.patreon}/mes`}</div>
              </div>
            ))}
          </div>
          <p className="mt-6 font-sans text-[12px] text-[#888]">Asumiendo suscripción promedio US$5/mes. Patreon Pro: 8% comisión variable + 5% procesador = 13% efectivo.</p>
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
      <RelatedAlternatives currentSlug="patreon-en-latam" />
      <PageFooter />
    </main>
  )
}
