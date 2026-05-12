import type { Metadata } from 'next'
import Link from 'next/link'

let faqs: Record<string, { slug: string; title: string; content: string; category?: string; generatedAt: string }> = {}

try {
  const faqsData = require('@/data/generated-content/faqs.json')
  faqs = faqsData
} catch (e) {
  faqs = {}
}

const FAQ_SLUGS = Object.keys(faqs)

export const metadata: Metadata = {
  title: 'Preguntas frecuentes — Nebbuler',
  description: 'Respuestas a preguntas comunes sobre cómo monetizar expertise, invertir, gestionar finanzas personales y emprender en Latinoamérica.',
  alternates: { canonical: 'https://nebbuler.com/faq' },
}

export default function FAQIndexPage() {
  // Group FAQs by category
  const categories: Record<string, typeof faqs[string][]> = {}
  FAQ_SLUGS.forEach(slug => {
    const faq = faqs[slug]
    const category = faq.category || 'Preguntas generales'
    if (!categories[category]) categories[category] = []
    categories[category].push(faq)
  })

  return (
    <div className="min-h-screen bg-white">
      <div className="h-[3px] bg-[#C41C1C] w-full" />
      <div className="border-b border-[#DEDEDE] py-3 px-6">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-serif text-[22px] font-bold text-[#121212]">
            NEBBULER
          </Link>
          <Link
            href="/abrir"
            className="font-sans text-[12px] font-medium px-4 py-1.5 bg-[#C41C1C] text-white hover:bg-[#a01515] transition-colors"
          >
            Abrir mi sala →
          </Link>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <nav className="font-sans text-[12px] text-[#999] mb-8">
          <Link href="/" className="hover:text-[#121212]">Inicio</Link>
          <span className="mx-2">·</span>
          <span className="text-[#121212]">FAQ</span>
        </nav>

        <div className="mb-12 pb-10 border-b border-[#DEDEDE]">
          <p className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-[#C41C1C] mb-3">
            Preguntas frecuentes
          </p>
          <h1 className="font-serif text-[2.5rem] font-bold text-[#121212] leading-[1.15] mb-4">
            Respuestas a tus dudas
          </h1>
          <p className="font-sans text-[17px] text-[#555] leading-relaxed">
            Encuentra respuestas sobre inversión, monetización, finanzas personales y emprendimiento en Latinoamérica.
          </p>
        </div>

        {/* FAQs by category */}
        {Object.entries(categories).map(([category, categoryFaqs]) => (
          <section key={category} className="mb-12">
            <h2 className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-[#999] mb-6 pb-2 border-b border-[#DEDEDE]">
              {category}
            </h2>
            <div className="space-y-3">
              {categoryFaqs.map(faq => (
                <Link
                  key={faq.slug}
                  href={`/faq/${faq.slug}`}
                  className="block border border-[#DEDEDE] p-4 hover:border-[#C41C1C] hover:bg-[#FAFAFA] transition-colors group"
                >
                  <p className="font-serif text-[16px] font-bold text-[#121212] group-hover:text-[#C41C1C] transition-colors">
                    {faq.title}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        ))}

        {/* Cross-links to related content */}
        <section className="mt-12 pt-12 border-t border-[#DEDEDE]">
          <h2 className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-[#999] mb-6">
            Profundiza más
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/guia"
              className="border border-[#DEDEDE] p-6 text-center hover:border-[#C41C1C] hover:bg-[#FAFAFA] transition-colors group"
            >
              <p className="font-serif text-[18px] font-bold text-[#121212] group-hover:text-[#C41C1C] mb-2">
                Guías
              </p>
              <p className="font-sans text-[13px] text-[#666]">Cómo monetizar tu expertise</p>
            </Link>
            <Link
              href="/analisis"
              className="border border-[#DEDEDE] p-6 text-center hover:border-[#C41C1C] hover:bg-[#FAFAFA] transition-colors group"
            >
              <p className="font-serif text-[18px] font-bold text-[#121212] group-hover:text-[#C41C1C] mb-2">
                Análisis
              </p>
              <p className="font-sans text-[13px] text-[#666]">Expertos analizando mercados</p>
            </Link>
            <Link
              href="/caso-estudio"
              className="border border-[#DEDEDE] p-6 text-center hover:border-[#C41C1C] hover:bg-[#FAFAFA] transition-colors group"
            >
              <p className="font-serif text-[18px] font-bold text-[#121212] group-hover:text-[#C41C1C] mb-2">
                Casos
              </p>
              <p className="font-sans text-[13px] text-[#666]">Historias reales de éxito</p>
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}
