import type { Metadata } from 'next'
import { ALTERNATIVES, PageHero, FinalCta, RelatedAlternatives, BreadcrumbsBar, PageFooter } from '../_shared'

const META = ALTERNATIVES.find((a) => a.slug === 'ko-fi-alternativa-latam')!

export const metadata: Metadata = {
  title: META.title + ' — Nebbuler',
  description: META.description,
  alternates: { canonical: 'https://nebbuler.com/alternativas/ko-fi-alternativa-latam' },
  openGraph: { title: META.title, description: META.description, type: 'article' },
}

export const revalidate = 86400

const FAQS = [
  { q: '¿Ko-fi cobra comisión?', a: 'Ko-fi Free: 0% en donaciones, pero funcionalidades limitadas. Ko-fi Gold ($6 USD/mes): membresías con comisión 0% pero procesamiento de Stripe/PayPal (2.9-5%). Nebbuler: US$19/mes con 0% comisión y procesamiento local en moneda LATAM.' },
  { q: '¿Ko-fi acepta pagos en pesos?', a: 'No. Ko-fi procesa pagos vía Stripe y PayPal, ambos en USD. Para suscriptores LATAM, esto significa conversión de moneda + recargo internacional en cada donación o membresía.' },
  { q: '¿Cuál es la diferencia entre donaciones y membresías?', a: 'Las donaciones (Ko-fi) son esporádicas e impredecibles. Las membresías (Nebbuler) son cobros recurrentes mensuales que generan ingreso predecible. Para construir un negocio sostenible, las membresías ganan.' },
  { q: '¿Puedo usar Ko-fi para propinas y Nebbuler para membresías?', a: 'Es una opción, pero complica la experiencia. Te recomendamos centralizar todo en Nebbuler: los que quieren apoyarte puntualmente pueden suscribirse un mes, y los que quieren acceso continuo mantienen su membresía.' },
  { q: '¿Ko-fi Gold vale la pena para LATAM?', a: 'Para audiencia LATAM, no. $6 USD/mes por una plataforma de propinas en dólares no resuelve el problema de la fricción de pago. Nebbuler a US$19/mes da membresías profesionales en moneda local.' },
]

const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQS.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
const articleSchema = { '@context': 'https://schema.org', '@type': 'Article', headline: META.h1, author: { '@type': 'Organization', name: 'Nebbuler' }, datePublished: '2026-05-23', description: META.description }

export default function KofiAlternativa() {
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
            Nebbuler vs Ko-fi — lado a lado
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-[14px] border-collapse">
              <thead>
                <tr className="border-b-2 border-[#121212]">
                  <th className="text-left py-3 pr-4 font-sans text-[11px] uppercase tracking-[0.1em] text-[#888]"></th>
                  <th className="text-left py-3 px-4 font-serif text-[16px] text-[#121212]">Nebbuler</th>
                  <th className="text-left py-3 px-4 font-serif text-[16px] text-[#666]">Ko-fi</th>
                </tr>
              </thead>
              <tbody className="text-[#444]">
                <tr className="border-b border-[#EEEEEE]"><td className="py-3 pr-4 font-medium text-[#121212]">Modelo de negocio</td><td className="py-3 px-4 text-[#15803D] font-semibold">Membresía recurrente</td><td className="py-3 px-4">Donaciones + membresía básica</td></tr>
                <tr className="border-b border-[#EEEEEE]"><td className="py-3 pr-4 font-medium text-[#121212]">Comisión por transacción</td><td className="py-3 px-4 text-[#15803D] font-semibold">0%</td><td className="py-3 px-4">0% (donaciones) / Gold $6/mes</td></tr>
                <tr className="border-b border-[#EEEEEE]"><td className="py-3 pr-4 font-medium text-[#121212]">Monedas locales LATAM</td><td className="py-3 px-4 text-[#15803D]">CLP, MXN, COP, ARS, PEN, UYU, BRL</td><td className="py-3 px-4 text-[#C41C1C]">Solo USD (Stripe/PayPal)</td></tr>
                <tr className="border-b border-[#EEEEEE]"><td className="py-3 pr-4 font-medium text-[#121212]">Editor de contenido</td><td className="py-3 px-4 text-[#15803D]">Tiptap (profesional)</td><td className="py-3 px-4">Básico</td></tr>
                <tr className="border-b border-[#EEEEEE]"><td className="py-3 pr-4 font-medium text-[#121212]">Soporte en español</td><td className="py-3 px-4 text-[#15803D]">Sí, nativo</td><td className="py-3 px-4 text-[#C41C1C]">Solo inglés</td></tr>
                <tr className="border-b border-[#EEEEEE]"><td className="py-3 pr-4 font-medium text-[#121212]">Paywall de contenido</td><td className="py-3 px-4 text-[#15803D]">Nativo</td><td className="py-3 px-4">Limitado</td></tr>
                <tr className="border-b border-[#EEEEEE]"><td className="py-3 pr-4 font-medium text-[#121212]">Percepción profesional</td><td className="py-3 px-4 text-[#15803D]">Plataforma profesional</td><td className="py-3 px-4">Plataforma de propinas</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="border-b border-[#DEDEDE] py-16 px-6 bg-[#FAFAF7]">
        <div className="max-w-3xl mx-auto">
          <p className="section-label mb-3">EL PROBLEMA DE LAS PROPINAS</p>
          <hr className="nyt-rule mb-8" />
          <h2 className="font-serif text-[28px] md:text-[32px] font-bold text-[#121212] mb-6">
            Las propinas no construyen un negocio
          </h2>
          <div className="space-y-4 text-[15px] text-[#444] leading-relaxed">
            <p>El modelo de Ko-fi es brillante para su propósito: permitir que fans apoyen a creadores con donaciones puntuales. Pero para un profesional serio, las propinas tienen tres problemas fundamentales:</p>
            <div className="grid md:grid-cols-3 gap-4 mt-6">
              <div className="border border-[#DEDEDE] bg-white p-5">
                <p className="font-serif text-[18px] font-bold text-[#C41C1C] mb-2">Impredecibles</p>
                <p className="text-[13px]">No puedes planificar tu negocio con ingresos que varían de $5 a $50/mes sin patrón</p>
              </div>
              <div className="border border-[#DEDEDE] bg-white p-5">
                <p className="font-serif text-[18px] font-bold text-[#C41C1C] mb-2">Devalúan</p>
                <p className="text-[13px]">Pedir "un café" por tu trabajo profesional envía un mensaje de que tu contenido vale $3</p>
              </div>
              <div className="border border-[#DEDEDE] bg-white p-5">
                <p className="font-serif text-[18px] font-bold text-[#C41C1C] mb-2">No escalan</p>
                <p className="text-[13px]">Con membresías, 100 suscriptores = ingreso fijo mensual. Con propinas, 100 fans = $0-$200 aleatorios</p>
              </div>
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
      <RelatedAlternatives currentSlug="ko-fi-alternativa-latam" />
      <PageFooter />
    </main>
  )
}
