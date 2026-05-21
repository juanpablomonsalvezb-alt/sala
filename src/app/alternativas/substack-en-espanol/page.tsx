import type { Metadata } from 'next'
import Link from 'next/link'
import { ALTERNATIVES, PageHero, FinalCta, RelatedAlternatives, BreadcrumbsBar, PageFooter } from '../_shared'

const META = ALTERNATIVES.find((a) => a.slug === 'substack-en-espanol')!

export const metadata: Metadata = {
  title: META.title + ' — Nebbuler',
  description: META.description,
  alternates: { canonical: 'https://nebbuler.com/alternativas/substack-en-espanol' },
  openGraph: {
    title: META.title,
    description: META.description,
    url: 'https://nebbuler.com/alternativas/substack-en-espanol',
    type: 'article',
  },
}

export const revalidate = 86400

const FAQS = [
  {
    q: '¿Por qué Substack no funciona bien en LATAM?',
    a: 'Substack solo procesa pagos en USD mediante Stripe. Tus lectores en Chile, México, Argentina o Colombia ven el precio convertido en su moneda con tipo de cambio variable y comisiones cambiarias de su banco. Esto baja la conversión drásticamente. Además, el soporte y la interfaz están optimizados para el mercado anglo.',
  },
  {
    q: '¿Cuál es la diferencia de precio entre Nebbuler y Substack?',
    a: 'Substack cobra 10% sobre cada suscripción más ~3% del procesador. Con 100 suscriptores a US$10/mes, pagas US$130 al mes en comisiones. Nebbuler cobra US$19/mes fijo sin comisión variable: te ahorras US$111/mes desde los 100 suscriptores. Desde 50 suscriptores ya conviene migrar.',
  },
  {
    q: '¿Cómo migro mi audiencia de Substack a Nebbuler?',
    a: 'Exporta tu lista de suscriptores desde Substack (Settings → Exports → Email list). Súbela a Nebbuler en /dashboard/suscriptores. Envía un email avisando del cambio. La mayoría de tus lectores te seguirán si el contenido vale la pena.',
  },
  {
    q: '¿Puedo seguir usando mi dominio propio?',
    a: 'Sí. Nebbuler soporta dominios personalizados en planes pagos. Configuras tu CNAME y los lectores ven tu marca, no nebbuler.com.',
  },
  {
    q: '¿Nebbuler tiene editor tan bueno como Substack?',
    a: 'Sí. Nebbuler usa Tiptap, el mismo motor editor que Substack. Soporta embeds de YouTube, Twitter, Vimeo, imágenes, código, citas destacadas y todo lo que esperas de un editor profesional.',
  },
  {
    q: '¿Mis suscriptores pueden cancelar fácil?',
    a: 'Sí. Cumplimos con regulaciones SERNAC en Chile y leyes equivalentes en LATAM. Los suscriptores cancelan con 1 click desde su panel sin trabas.',
  },
]

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: META.h1,
  author: { '@type': 'Organization', name: 'Nebbuler' },
  publisher: {
    '@type': 'Organization',
    name: 'Nebbuler',
    logo: { '@type': 'ImageObject', url: 'https://nebbuler.com/nebbuler-logo.png' },
  },
  datePublished: '2026-01-15',
  dateModified: new Date().toISOString().split('T')[0],
  description: META.description,
}

export default function SubstackAlternativa() {
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
            Nebbuler vs Substack — lado a lado
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-[14px] border-collapse">
              <thead>
                <tr className="border-b-2 border-[#121212]">
                  <th className="text-left py-3 pr-4 font-sans text-[11px] uppercase tracking-[0.1em] text-[#888]"></th>
                  <th className="text-left py-3 px-4 font-serif text-[16px] text-[#121212]">Nebbuler</th>
                  <th className="text-left py-3 px-4 font-serif text-[16px] text-[#666]">Substack</th>
                </tr>
              </thead>
              <tbody className="text-[#444]">
                <tr className="border-b border-[#EEEEEE]"><td className="py-3 pr-4 font-medium text-[#121212]">Comisión por suscripción</td><td className="py-3 px-4 text-[#15803D] font-semibold">0%</td><td className="py-3 px-4">10%</td></tr>
                <tr className="border-b border-[#EEEEEE]"><td className="py-3 pr-4 font-medium text-[#121212]">Tarifa fija mensual</td><td className="py-3 px-4">US$19/mes</td><td className="py-3 px-4">US$0/mes</td></tr>
                <tr className="border-b border-[#EEEEEE]"><td className="py-3 pr-4 font-medium text-[#121212]">Monedas locales LATAM</td><td className="py-3 px-4 text-[#15803D]">CLP, MXN, COP, ARS, PEN, UYU, BRL</td><td className="py-3 px-4 text-[#C41C1C]">Solo USD</td></tr>
                <tr className="border-b border-[#EEEEEE]"><td className="py-3 pr-4 font-medium text-[#121212]">Procesador de pago</td><td className="py-3 px-4">MercadoPago + Stripe</td><td className="py-3 px-4">Solo Stripe</td></tr>
                <tr className="border-b border-[#EEEEEE]"><td className="py-3 pr-4 font-medium text-[#121212]">Soporte en español</td><td className="py-3 px-4 text-[#15803D]">Sí, nativo</td><td className="py-3 px-4 text-[#C41C1C]">Solo inglés</td></tr>
                <tr className="border-b border-[#EEEEEE]"><td className="py-3 pr-4 font-medium text-[#121212]">Editor (Tiptap)</td><td className="py-3 px-4 text-[#15803D]">Sí</td><td className="py-3 px-4 text-[#15803D]">Sí</td></tr>
                <tr className="border-b border-[#EEEEEE]"><td className="py-3 pr-4 font-medium text-[#121212]">Dominio personalizado</td><td className="py-3 px-4 text-[#15803D]">Sí</td><td className="py-3 px-4">Sí (US$50/año)</td></tr>
                <tr className="border-b border-[#EEEEEE]"><td className="py-3 pr-4 font-medium text-[#121212]">Analytics LATAM</td><td className="py-3 px-4">Por país, por moneda</td><td className="py-3 px-4">Solo USD</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="border-b border-[#DEDEDE] py-16 px-6 bg-[#FAFAF7]">
        <div className="max-w-3xl mx-auto">
          <p className="section-label mb-3">CALCULADORA</p>
          <hr className="nyt-rule mb-8" />
          <h2 className="font-serif text-[28px] md:text-[32px] font-bold text-[#121212] mb-6 leading-tight">
            Cuánto pierdes con Substack al mes
          </h2>
          <div className="space-y-3 text-[14px]">
            {[
              { subs: 50, price: 10, substack: 65, nebbuler: 19 },
              { subs: 100, price: 10, substack: 130, nebbuler: 19 },
              { subs: 200, price: 10, substack: 260, nebbuler: 19 },
              { subs: 500, price: 10, substack: 650, nebbuler: 19 },
              { subs: 1000, price: 10, substack: 1300, nebbuler: 19 },
            ].map((row) => (
              <div key={row.subs} className="grid grid-cols-4 items-center bg-white border border-[#DEDEDE] px-5 py-4">
                <div className="font-serif text-[18px] font-bold text-[#121212]">{row.subs} subs</div>
                <div className="text-[#666]">Substack: <span className="font-semibold text-[#C41C1C]">US${row.substack}/mes</span></div>
                <div className="text-[#666]">Nebbuler: <span className="font-semibold text-[#15803D]">US${row.nebbuler}/mes</span></div>
                <div className="text-right font-semibold text-[#15803D]">Ahorras US${row.substack - row.nebbuler}/mes</div>
              </div>
            ))}
          </div>
          <p className="mt-6 font-sans text-[12px] text-[#888]">Asumiendo suscripción promedio de US$10/mes por lector. Desde 50 suscriptores Nebbuler ya conviene.</p>
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
      <RelatedAlternatives currentSlug="substack-en-espanol" />
      <PageFooter />
    </main>
  )
}
