import type { Metadata } from 'next'
import Link from 'next/link'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'La mejor plataforma de newsletter de pago en español — Nebbuler',
  description: 'Nebbuler es la plataforma de newsletter de pago en español pensada para profesionales LATAM. Cobra por tu análisis en pesos o dólares desde hoy.',
  alternates: { canonical: 'https://nebbuler.com/blog/plataforma-newsletter-de-pago-espanol' },
  openGraph: {
    title: 'La mejor plataforma de newsletter de pago en español para profesionales',
    description: 'Cobra por tu conocimiento en tu moneda local. 0% comisión. Hecho para LATAM.',
    type: 'article',
    url: 'https://nebbuler.com/blog/plataforma-newsletter-de-pago-espanol',
    publishedTime: '2026-05-16T00:00:00Z',
  },
}

const JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'La mejor plataforma de newsletter de pago en español para profesionales',
  description: 'Guía para profesionales LATAM que buscan cobrar por su conocimiento con newsletters de pago.',
  datePublished: '2026-05-16',
  author: { '@type': 'Organization', name: 'Nebbuler' },
  publisher: { '@type': 'Organization', name: 'Nebbuler', url: 'https://nebbuler.com' },
  url: 'https://nebbuler.com/blog/plataforma-newsletter-de-pago-espanol',
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD) }} />

      <div className="min-h-screen bg-white">
        <div className="max-w-3xl mx-auto px-6 py-16">

          <p className="text-[10px] font-sans font-bold tracking-[0.2em] uppercase text-[#999] mb-4">
            Nebbuler · Guía para creadores
          </p>

          <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#121212] leading-tight mb-6">
            La mejor plataforma de newsletter de pago en español para profesionales
          </h1>

          <p className="font-sans text-lg text-[#444] leading-relaxed mb-10 border-l-4 border-[#C41C1C] pl-5">
            Si buscas una plataforma de newsletter de pago en español que entienda cómo trabajan los profesionales en Latinoamérica, la mayoría de las opciones disponibles te van a decepcionar. Substack está en inglés, cobra en dólares y fue diseñado para escritores estadounidenses. Beehiiv tampoco tiene soporte regional. Nebbuler nació específicamente para que economistas, abogados, médicos y contadores en Chile, México, Colombia y Argentina puedan cobrar por su conocimiento, en su moneda, sin complicaciones técnicas.
          </p>

          <div className="bg-[#F7F7F7] border border-[#DEDEDE] p-6 mb-10 text-center">
            <p className="font-sans text-sm text-[#666] mb-1">Un profesional con 100 suscriptores genera:</p>
            <p className="font-serif text-4xl font-bold text-[#C41C1C]">$2.999.000</p>
            <p className="font-sans text-sm text-[#666]">CLP mensuales recurrentes · 0% comisión</p>
          </div>

          <h2 className="font-serif text-2xl font-bold text-[#121212] mt-10 mb-4">
            Por qué las plataformas en inglés no funcionan para profesionales LATAM
          </h2>
          <p className="font-sans text-base text-[#333] leading-relaxed mb-4">
            Las grandes plataformas como Substack o Beehiiv fueron diseñadas para el mercado anglosajón. Sus sistemas de cobro operan en dólares, su soporte es en inglés y no tienen en cuenta las particularidades fiscales ni bancarias de Chile, México, Colombia o Argentina. Para un economista chileno que quiere cobrar en pesos a sus lectores, esto genera fricción real en cada paso: desde la configuración del cobro hasta la experiencia de pago del suscriptor.
          </p>
          <p className="font-sans text-base text-[#333] leading-relaxed mb-8">
            Además, el contenido que produce un abogado laboralista colombiano o un médico mexicano especialista en salud pública no tiene el mismo contexto que el de un escritor de tecnología en San Francisco. Las plataformas globales no fueron diseñadas para ese tipo de análisis técnico especializado con audiencia regional.
          </p>

          <h2 className="font-serif text-2xl font-bold text-[#121212] mt-10 mb-4">
            Qué necesita una plataforma de newsletter de pago en español
          </h2>
          <ul className="space-y-3 mb-8">
            {[
              'Pagos en moneda local — un lector en Colombia que paga en pesos convierte mejor que uno al que le piden tarjeta en dólares',
              'Editor pensado para análisis técnicos con soporte para datos y documentos de largo aliento',
              'Gestión de suscriptores simple, sin tecnicismos que alejen a un profesional que no es desarrollador',
              'Soporte en español y comunidad de creadores LATAM',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 font-sans text-base text-[#333]">
                <span className="text-[#C41C1C] font-bold mt-0.5">→</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <h2 className="font-serif text-2xl font-bold text-[#121212] mt-10 mb-4">
            Nebbuler: la plataforma construida para LATAM
          </h2>
          <p className="font-sans text-base text-[#333] leading-relaxed mb-4">
            Nebbuler es la única plataforma diseñada específicamente para profesionales hispanohablantes que quieren monetizar su conocimiento. Cobras en pesos o dólares, sin comisión de plataforma (<strong>0%</strong>), con una interfaz en español y con procesamiento de pagos adaptado a la región vía MercadoPago.
          </p>
          <p className="font-sans text-base text-[#333] leading-relaxed mb-8">
            Economistas, abogados, médicos y contadores ya publican en Nebbuler y generan ingresos recurrentes desde su primer mes, sin necesidad de conocimientos técnicos y sin pagar comisiones.
          </p>

          <h2 className="font-serif text-2xl font-bold text-[#121212] mt-10 mb-6">
            Preguntas frecuentes
          </h2>
          <div className="space-y-6 mb-10">
            {[
              {
                q: '¿Puedo cobrar en pesos colombianos, chilenos o mexicanos?',
                a: 'Sí. Nebbuler está integrado con MercadoPago, lo que permite recibir pagos en las principales monedas de LATAM sin conversión a dólares.',
              },
              {
                q: '¿Necesito saber de tecnología para lanzar mi newsletter?',
                a: 'No. Nebbuler gestiona el cobro, la entrega y la lista de suscriptores automáticamente. Solo necesitas escribir y publicar.',
              },
              {
                q: '¿Cuántos suscriptores necesito para ganar dinero?',
                a: 'Con 50 suscriptores a $19.990 CLP ya generas $999.500 mensuales recurrentes. Con 100 suscriptores a $29.990 CLP, $2.999.000 al mes.',
              },
            ].map((faq, i) => (
              <div key={i} className="border-l-2 border-[#DEDEDE] pl-5">
                <p className="font-sans font-semibold text-[#121212] mb-2">{faq.q}</p>
                <p className="font-sans text-sm text-[#555] leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>

          <div className="border-t-4 border-[#121212] bg-[#121212] p-8 text-center mt-12">
            <p className="font-sans text-sm text-[#999] mb-2">¿Eres economista, abogado, médico o contador?</p>
            <h3 className="font-serif text-2xl font-bold text-white mb-4">
              Crea tu newsletter de pago hoy. 0% comisión.
            </h3>
            <Link
              href="/para-creadores"
              className="inline-block bg-[#C41C1C] text-white font-sans font-bold text-sm tracking-[0.1em] uppercase px-8 py-3 hover:bg-[#A01515] transition-colors"
            >
              Empezar en Nebbuler →
            </Link>
          </div>

        </div>
      </div>
    </>
  )
}
