import type { Metadata } from 'next'
import { ALTERNATIVES, PageHero, FinalCta, RelatedAlternatives, BreadcrumbsBar, PageFooter } from '../_shared'

const META = ALTERNATIVES.find((a) => a.slug === 'hotmart-vs-nebbuler')!

export const metadata: Metadata = {
  title: META.title + ' — Nebbuler',
  description: META.description,
  alternates: { canonical: 'https://nebbuler.com/alternativas/hotmart-vs-nebbuler' },
  openGraph: { title: META.title, description: META.description, type: 'article' },
}

export const revalidate = 86400

const FAQS = [
  { q: '¿Cuánto cobra Hotmart de comisión?', a: 'Hotmart cobra 9.99% de comisión sobre cada venta + comisión del procesador de pago (1.49-3.5% según el método). Con 100 suscriptores a $30.000 CLP/mes, eso son ~$30.000 CLP en comisiones por ciclo. Nebbuler cobra tarifa fija mensual sin comisión variable.' },
  { q: '¿Hotmart sirve para membresías?', a: 'Hotmart tiene un producto de suscripción, pero su ADN es vender cursos y productos digitales con lanzamientos masivos y afiliados. Para membresías editoriales recurrentes (análisis, opinión, guías), Nebbuler está diseñado específicamente.' },
  { q: '¿Puedo usar Hotmart para cursos y Nebbuler para membresías?', a: 'Sí. Es un modelo híbrido válido: Hotmart para cursos completos one-time con sistema de afiliados, y Nebbuler para tu membresía editorial mensual con contenido recurrente. Muchos creadores LATAM usan este esquema.' },
  { q: '¿Los afiliados de Hotmart son un beneficio?', a: 'Depende. Los afiliados ayudan a vender cursos masivos, pero también pueden competir contigo con tu propio producto, crear confusión de marca y reducir márgenes. En Nebbuler no hay intermediarios: vendes directo a tu audiencia.' },
  { q: '¿Desde cuántos suscriptores conviene Nebbuler vs Hotmart?', a: 'Desde el primer suscriptor, porque Hotmart cobra porcentaje sobre cada venta. Con 10 membresías a $30.000 CLP/mes, Hotmart cobra ~$30.000 CLP; Nebbuler cobra una tarifa fija mensual sin importar cuánto vendas.' },
]

const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQS.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
const articleSchema = { '@context': 'https://schema.org', '@type': 'Article', headline: META.h1, author: { '@type': 'Organization', name: 'Nebbuler' }, datePublished: '2026-05-23', description: META.description }

export default function HotmartAlternativa() {
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
            Nebbuler vs Hotmart — lado a lado
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-[14px] border-collapse">
              <thead>
                <tr className="border-b-2 border-[#121212]">
                  <th className="text-left py-3 pr-4 font-sans text-[11px] uppercase tracking-[0.1em] text-[#888]"></th>
                  <th className="text-left py-3 px-4 font-serif text-[16px] text-[#121212]">Nebbuler</th>
                  <th className="text-left py-3 px-4 font-serif text-[16px] text-[#666]">Hotmart</th>
                </tr>
              </thead>
              <tbody className="text-[#444]">
                <tr className="border-b border-[#EEEEEE]"><td className="py-3 pr-4 font-medium text-[#121212]">Comisión por venta</td><td className="py-3 px-4 text-[#15803D] font-semibold">0%</td><td className="py-3 px-4">9.99% + procesamiento</td></tr>
                <tr className="border-b border-[#EEEEEE]"><td className="py-3 pr-4 font-medium text-[#121212]">Modelo de negocio</td><td className="py-3 px-4">Membresía editorial recurrente</td><td className="py-3 px-4">Cursos + lanzamientos + afiliados</td></tr>
                <tr className="border-b border-[#EEEEEE]"><td className="py-3 pr-4 font-medium text-[#121212]">Monedas locales LATAM</td><td className="py-3 px-4 text-[#15803D]">CLP, MXN, COP, ARS, PEN, UYU, BRL</td><td className="py-3 px-4 text-[#15803D]">Sí (fuerte en BRL)</td></tr>
                <tr className="border-b border-[#EEEEEE]"><td className="py-3 pr-4 font-medium text-[#121212]">Sistema de afiliados</td><td className="py-3 px-4">No (venta directa)</td><td className="py-3 px-4 text-[#15803D]">Sí (marketplace)</td></tr>
                <tr className="border-b border-[#EEEEEE]"><td className="py-3 pr-4 font-medium text-[#121212]">Editor editorial</td><td className="py-3 px-4 text-[#15803D]">Tiptap (profesional)</td><td className="py-3 px-4">Básico (orientado a video)</td></tr>
                <tr className="border-b border-[#EEEEEE]"><td className="py-3 pr-4 font-medium text-[#121212]">Idioma nativo</td><td className="py-3 px-4">Español LATAM</td><td className="py-3 px-4">Portugués (español secundario)</td></tr>
                <tr className="border-b border-[#EEEEEE]"><td className="py-3 pr-4 font-medium text-[#121212]">Control de pricing</td><td className="py-3 px-4 text-[#15803D]">100% del creador</td><td className="py-3 px-4">Creador + marketplace</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="border-b border-[#DEDEDE] py-16 px-6 bg-[#FAFAF7]">
        <div className="max-w-3xl mx-auto">
          <p className="section-label mb-3">CALCULADORA DE COMISIONES</p>
          <hr className="nyt-rule mb-8" />
          <h2 className="font-serif text-[28px] md:text-[32px] font-bold text-[#121212] mb-6">Cuánto pierdes con Hotmart</h2>
          <div className="space-y-3 text-[14px]">
            {[
              { subs: 20, price: 30, hotmart: 66, nebbuler: 19 },
              { subs: 50, price: 30, hotmart: 165, nebbuler: 19 },
              { subs: 100, price: 30, hotmart: 330, nebbuler: 19 },
              { subs: 200, price: 30, hotmart: 660, nebbuler: 19 },
              { subs: 500, price: 30, hotmart: 1650, nebbuler: 19 },
            ].map((row) => (
              <div key={row.subs} className="grid grid-cols-4 items-center bg-white border border-[#DEDEDE] px-5 py-4">
                <div className="font-serif text-[18px] font-bold text-[#121212]">{row.subs} subs</div>
                <div className="text-[#666]">Hotmart: <span className="font-semibold text-[#C41C1C]">US${row.hotmart}/mes</span></div>
                <div className="text-[#666]">Nebbuler: <span className="font-semibold text-[#15803D]">US${row.nebbuler}/mes</span></div>
                <div className="text-right font-semibold text-[#15803D]">Ahorras US${row.hotmart - row.nebbuler}/mes</div>
              </div>
            ))}
          </div>
          <p className="mt-6 font-sans text-[12px] text-[#888]">Asumiendo membresía promedio de US$30/mes. Hotmart: 9.99% comisión + ~2.5% procesamiento = ~11% efectivo.</p>
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
      <RelatedAlternatives currentSlug="hotmart-vs-nebbuler" />
      <PageFooter />
    </main>
  )
}
