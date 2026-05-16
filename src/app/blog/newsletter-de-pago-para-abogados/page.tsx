import type { Metadata } from 'next'
import Link from 'next/link'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'Newsletter de pago para abogados: cobra por tu conocimiento jurídico — Nebbuler',
  description: 'Crea tu newsletter de pago como abogado y cobra por tu análisis jurídico. Guía paso a paso para abogados en México, Colombia y LATAM con Nebbuler.',
  alternates: { canonical: 'https://nebbuler.com/blog/newsletter-de-pago-para-abogados' },
  openGraph: {
    title: 'Newsletter de pago para abogados: cómo cobrar por tu conocimiento jurídico',
    description: 'El modelo de ingreso recurrente para abogados LATAM que ya funciona. Sin dejar tu firma.',
    type: 'article',
    url: 'https://nebbuler.com/blog/newsletter-de-pago-para-abogados',
    publishedTime: '2026-05-16T00:00:00Z',
  },
}

const JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Newsletter de pago para abogados: cómo cobrar por tu conocimiento jurídico',
  description: 'Guía para abogados en LATAM que quieren monetizar su análisis jurídico con newsletters de pago.',
  datePublished: '2026-05-16',
  author: { '@type': 'Organization', name: 'Nebbuler' },
  publisher: { '@type': 'Organization', name: 'Nebbuler', url: 'https://nebbuler.com' },
  url: 'https://nebbuler.com/blog/newsletter-de-pago-para-abogados',
}

const CONTENIDOS = [
  { icon: '⚖️', titulo: 'Análisis de reformas legales', desc: 'Cada reforma tributaria, laboral o corporativa tiene impacto inmediato en empresas. Tu análisis de esos cambios tiene fecha de caducidad comercial — quien lo lee primero toma mejores decisiones.' },
  { icon: '📋', titulo: 'Guías de cumplimiento normativo', desc: 'Las pymes no tienen departamento legal interno. Un abogado que explica claramente cómo cumplir con nuevas regulaciones tiene una audiencia natural de miles de empresas.' },
  { icon: '🏛️', titulo: 'Interpretación de sentencias', desc: 'La jurisprudencia cambia constantemente. Abogados corporativos, de RRHH y financieros necesitan entender las implicancias prácticas de cada fallo relevante.' },
  { icon: '🚨', titulo: 'Alertas legales semanales', desc: 'El formato más valorado por empresas: un resumen semanal de lo que cambió legalmente y qué deben hacer. Alta retención, alta disposición a pagar.' },
]

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD) }} />

      <div className="min-h-screen bg-white">
        <div className="max-w-3xl mx-auto px-6 py-16">

          <p className="text-[10px] font-sans font-bold tracking-[0.2em] uppercase text-[#999] mb-4">
            Nebbuler · Para abogados
          </p>

          <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#121212] leading-tight mb-6">
            Newsletter de pago para abogados: cómo cobrar por tu conocimiento jurídico
          </h1>

          <p className="font-sans text-lg text-[#444] leading-relaxed mb-10 border-l-4 border-[#C41C1C] pl-5">
            Una newsletter de pago para abogados no es solo una tendencia: es un modelo de negocio que ya genera ingresos recurrentes para juristas en México, Colombia y Argentina que supieron posicionarse como referentes en su especialidad. A diferencia de la consultoría por hora, una newsletter te permite escalar tu conocimiento — el mismo análisis que escribiste una vez lo pagan cien suscriptores.
          </p>

          <h2 className="font-serif text-2xl font-bold text-[#121212] mt-10 mb-4">
            Por qué los abogados son perfectos para este modelo
          </h2>
          <p className="font-sans text-base text-[#333] leading-relaxed mb-4">
            Los abogados producen análisis que tiene valor inmediato y tangible: una reforma laboral que afecta a todas las empresas, una sentencia que cambia la jurisprudencia, un nuevo régimen tributario que nadie en el mercado ha explicado bien todavía. Ese conocimiento tiene <strong>fecha de caducidad comercial</strong> — quien lo lee primero toma mejores decisiones. Eso es exactamente lo que alguien paga.
          </p>
          <p className="font-sans text-base text-[#333] leading-relaxed mb-8">
            Además, el derecho cambia constantemente en LATAM. Las empresas necesitan estar al día con regulaciones laborales, tributarias, corporativas y sectoriales. No todas pueden pagar un abogado de planta. Una newsletter de pago resuelve ese problema a escala.
          </p>

          <h2 className="font-serif text-2xl font-bold text-[#121212] mt-10 mb-6">
            Qué contenido paga un suscriptor a un abogado
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            {CONTENIDOS.map((c, i) => (
              <div key={i} className="border border-[#DEDEDE] p-5">
                <span className="text-2xl mb-3 block">{c.icon}</span>
                <h3 className="font-sans font-bold text-[#121212] mb-2 text-sm">{c.titulo}</h3>
                <p className="font-sans text-xs text-[#555] leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>

          <h2 className="font-serif text-2xl font-bold text-[#121212] mt-10 mb-4">
            Cómo fijar el precio correcto según tu mercado
          </h2>
          <div className="space-y-4 mb-8">
            {[
              { mercado: 'Abogados corporativos · México / Colombia', precio: '$300.000–$500.000 COP/mes', nota: 'Si el contenido ahorra tiempo o reduce riesgo legal para empresas, el precio premium está justificado.' },
              { mercado: 'Abogados laborales · Audiencia de RRHH', precio: '$50.000–$150.000 CLP/mes', nota: 'Mayor volumen de suscriptores a ticket más bajo. Ideal para empresas medianas y contadores de RRHH.' },
              { mercado: 'Abogados tributarios · PYMES', precio: '$29.990–$99.990 CLP/mes', nota: 'Las pymes necesitan orientación tributaria constante pero no pueden pagar consultoría mensual.' },
            ].map((r, i) => (
              <div key={i} className="border-l-2 border-[#C41C1C] pl-5 py-1">
                <p className="font-sans font-bold text-sm text-[#121212]">{r.mercado}</p>
                <p className="font-sans text-lg font-bold text-[#C41C1C]">{r.precio}</p>
                <p className="font-sans text-xs text-[#666] mt-1">{r.nota}</p>
              </div>
            ))}
          </div>

          <div className="bg-[#F7F7F7] border border-[#DEDEDE] p-6 mb-10 text-center">
            <p className="font-sans text-sm text-[#666] mb-1">150 empresas suscriptas a $100.000 COP =</p>
            <p className="font-serif text-4xl font-bold text-[#C41C1C]">$15.000.000 COP/mes</p>
            <p className="font-sans text-xs text-[#999] mt-1">Sin nuevos clientes. Sin reuniones adicionales. Sin juicios.</p>
          </div>

          <div className="border-t-4 border-[#121212] bg-[#121212] p-8 text-center mt-12">
            <p className="font-sans text-sm text-[#999] mb-2">¿Eres abogado con expertise en alguna especialidad?</p>
            <h3 className="font-serif text-2xl font-bold text-white mb-4">
              Lanza tu newsletter jurídica de pago. 0% comisión.
            </h3>
            <Link
              href="/para-creadores"
              className="inline-block bg-[#C41C1C] text-white font-sans font-bold text-sm tracking-[0.1em] uppercase px-8 py-3 hover:bg-[#A01515] transition-colors"
            >
              Crear mi newsletter en Nebbuler →
            </Link>
          </div>

        </div>
      </div>
    </>
  )
}
