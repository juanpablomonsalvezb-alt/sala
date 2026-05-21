import type { Metadata } from 'next'
import { ALTERNATIVES, PageHero, FinalCta, RelatedAlternatives, BreadcrumbsBar, PageFooter } from '../_shared'

const META = ALTERNATIVES.find((a) => a.slug === 'medium-pago-espanol')!

export const metadata: Metadata = {
  title: META.title + ' — Nebbuler',
  description: META.description,
  alternates: { canonical: 'https://nebbuler.com/alternativas/medium-pago-espanol' },
  openGraph: { title: META.title, description: META.description, type: 'article' },
}

export const revalidate = 86400

const FAQS = [
  { q: '¿Cuánto paga realmente Medium Partner Program en español?', a: 'La mediana de ingresos para escritores hispanohablantes en Medium ronda los USD 10-50 al mes. El algoritmo prioriza lectores Medium membership en EE.UU., así que tu contenido en español pierde alcance frente al inglés.' },
  { q: '¿Por qué el modelo de Medium no funciona para escritores LATAM?', a: 'Medium paga por tiempo leído por miembros pagos, no por suscriptores tuyos. Tu audiencia no te paga directo — paga a Medium, que distribuye según un algoritmo opaco. Resultado: ingresos impredecibles e impossibles de escalar.' },
  { q: '¿Es mejor el modelo de suscripción directa que el de Medium?', a: 'Sí, para audiencias nicho profesionales. Con 100 lectores pagando US$10/mes generas US$1.000 estables al mes. En Medium, necesitarías miles de "members" leyéndote para llegar a esa cifra.' },
  { q: '¿Puedo importar mis posts de Medium a Nebbuler?', a: 'Sí. Medium exporta tu archivo completo en HTML/Markdown. En Nebbuler el editor Tiptap importa Markdown directo. Los posts mantienen formato, imágenes y embeds.' },
  { q: '¿Qué pasa con mi SEO si dejo Medium?', a: 'Si tienes posts indexados en Medium, configurá un 301 redirect a las URLs equivalentes en Nebbuler/tu dominio. Mantienes autoridad y rankings. Nebbuler te da control total de URLs canónicas.' },
]

const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQS.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
const articleSchema = { '@context': 'https://schema.org', '@type': 'Article', headline: META.h1, author: { '@type': 'Organization', name: 'Nebbuler' }, datePublished: '2026-01-15', description: META.description }

export default function MediumAlternativa() {
  return (
    <main className="bg-white min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <BreadcrumbsBar competitor={META.competitor} />
      <PageHero kicker={META.kicker} h1={META.h1} summary={META.summary} competitor={META.competitor} />

      <section className="border-b border-[#DEDEDE] py-16 px-6 bg-[#FAFAF7]">
        <div className="max-w-3xl mx-auto">
          <p className="section-label mb-3">EL PROBLEMA DE MEDIUM</p>
          <hr className="nyt-rule mb-8" />
          <div className="space-y-5 text-[15px] text-[#444] leading-[1.7]">
            <p>El Medium Partner Program no fue diseñado para escritores en español. La mediana de ingresos para escritores hispanohablantes es <strong className="text-[#C41C1C]">US$10-50/mes</strong>, sin importar la calidad del contenido. El algoritmo prioriza lectores Medium membership en EE.UU. — y la mayoría de tu audiencia no es member.</p>
            <p>El cálculo de pago es opaco: depende del "tiempo leído por miembros pagos", una métrica que tú no controlas. Un post que recibe 10.000 visitas orgánicas puede pagarte US$3 si los visitantes no son members.</p>
            <p>Nebbuler invierte el modelo: <strong className="text-[#121212]">tus lectores te pagan directamente a ti</strong>. Sin algoritmo intermediando. Sin distribución basada en métricas opacas. 100 lectores a US$10/mes = US$1.000/mes predecibles.</p>
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
      <RelatedAlternatives currentSlug="medium-pago-espanol" />
      <PageFooter />
    </main>
  )
}
