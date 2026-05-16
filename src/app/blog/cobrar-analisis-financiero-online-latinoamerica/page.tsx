import type { Metadata } from 'next'
import Link from 'next/link'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'Cómo cobrar por tus análisis financieros online en Latinoamérica — Nebbuler',
  description: 'Aprende cómo cobrar por tus análisis financieros online en Latinoamérica. Plataformas, precios de referencia y el modelo de newsletter de pago que funciona.',
  alternates: { canonical: 'https://nebbuler.com/blog/cobrar-analisis-financiero-online-latinoamerica' },
  openGraph: {
    title: 'Cómo cobrar por tus análisis financieros online en Latinoamérica',
    description: 'El mercado de análisis financiero en español está desatendido. Esta guía te muestra cómo monetizarlo.',
    type: 'article',
    url: 'https://nebbuler.com/blog/cobrar-analisis-financiero-online-latinoamerica',
    publishedTime: '2026-05-16T00:00:00Z',
  },
}

const JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Cómo cobrar por tus análisis financieros online en Latinoamérica',
  description: 'Modelos, plataformas y precios para analistas financieros LATAM que quieren cobrar por su conocimiento.',
  datePublished: '2026-05-16',
  author: { '@type': 'Organization', name: 'Nebbuler' },
  publisher: { '@type': 'Organization', name: 'Nebbuler', url: 'https://nebbuler.com' },
  url: 'https://nebbuler.com/blog/cobrar-analisis-financiero-online-latinoamerica',
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD) }} />

      <div className="min-h-screen bg-white">
        <div className="max-w-3xl mx-auto px-6 py-16">

          <p className="text-[10px] font-sans font-bold tracking-[0.2em] uppercase text-[#999] mb-4">
            Nebbuler · Para analistas financieros
          </p>

          <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#121212] leading-tight mb-6">
            Cómo cobrar por tus análisis financieros online en Latinoamérica
          </h1>

          <p className="font-sans text-lg text-[#444] leading-relaxed mb-10 border-l-4 border-[#C41C1C] pl-5">
            Cobrar por tus análisis financieros online en Latinoamérica es hoy más viable que nunca, pero la mayoría de los economistas y analistas no saben cómo estructurar el modelo ni qué herramientas usar. El resultado es que regalan su conocimiento en LinkedIn o en grupos de WhatsApp mientras otros — muchas veces con menos rigor — monetizan audiencias similares en inglés.
          </p>

          <h2 className="font-serif text-2xl font-bold text-[#121212] mt-10 mb-4">
            El mercado que nadie está aprovechando
          </h2>
          <p className="font-sans text-base text-[#333] leading-relaxed mb-4">
            En LATAM existe una demanda enorme de análisis financiero en español, accesible y con contexto regional. Los Bloomberg, Reuters y The Economist publican en inglés y para mercados desarrollados. El inversor individual en Chile, el CFO de una pyme en Colombia, el gerente financiero en México — todos necesitan análisis riguroso de sus mercados locales.
          </p>
          <p className="font-sans text-base text-[#333] leading-relaxed mb-8">
            Muy pocas personas están cobrando por proveerlo. Eso es una oportunidad enorme para quien tiene el criterio y el rigor para hacerlo bien.
          </p>

          <h2 className="font-serif text-2xl font-bold text-[#121212] mt-10 mb-6">
            Los 3 modelos que funcionan en LATAM
          </h2>
          <div className="space-y-5 mb-10">
            {[
              {
                num: '1',
                modelo: 'Suscripción mensual con análisis recurrente',
                precio: '$19.990–$99.990 CLP/mes',
                desc: 'El más escalable. Publicas análisis periódico (semanal o mensual) y cobras suscripción recurrente. Alta retención cuando el contenido es consistentemente útil.',
              },
              {
                num: '2',
                modelo: 'Reporte único de alto valor',
                precio: '$50.000–$200.000 CLP/reporte',
                desc: 'Ideal para análisis sectoriales o de mercado: un informe profundo sobre una industria, país o activo específico. Menor recurrencia pero mayor ticket.',
              },
              {
                num: '3',
                modelo: 'Membresía con datos + análisis + comunidad',
                precio: '$79.990–$199.990 CLP/mes',
                desc: 'El de mayor ticket y mayor retención. Combina análisis escrito, acceso a modelos Excel, bases de datos y una comunidad de pares.',
              },
            ].map((m) => (
              <div key={m.num} className="border border-[#DEDEDE] p-6 flex gap-5">
                <span className="font-serif text-4xl font-bold text-[#DEDEDE] shrink-0 leading-none">{m.num}</span>
                <div>
                  <h3 className="font-sans font-bold text-[#121212] mb-1">{m.modelo}</h3>
                  <p className="text-xs font-sans text-[#C41C1C] font-bold mb-2">{m.precio}</p>
                  <p className="font-sans text-sm text-[#555] leading-relaxed">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <h2 className="font-serif text-2xl font-bold text-[#121212] mt-10 mb-4">
            Qué plataforma usar para cobrar en LATAM
          </h2>
          <p className="font-sans text-base text-[#333] leading-relaxed mb-4">
            Las plataformas globales como Substack cobran en USD y tienen fricciones para el lector latinoamericano. Pedir tarjeta en dólares a un suscriptor en Colombia o Chile reduce la conversión significativamente.
          </p>
          <p className="font-sans text-base text-[#333] leading-relaxed mb-8">
            Nebbuler está integrado con MercadoPago y permite cobrar en pesos chilenos, colombianos y mexicanos directamente, con <strong>0% de comisión de plataforma</strong>. Todo lo que generas te pertenece.
          </p>

          <div className="bg-[#F7F7F7] border border-[#DEDEDE] p-6 mb-10">
            <h3 className="font-sans font-bold text-[#121212] mb-3">Comparativa rápida de plataformas</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm font-sans">
                <thead>
                  <tr className="border-b border-[#DEDEDE]">
                    <th className="text-left py-2 text-[#666]">Plataforma</th>
                    <th className="text-left py-2 text-[#666]">Moneda</th>
                    <th className="text-left py-2 text-[#666]">Comisión</th>
                    <th className="text-left py-2 text-[#666]">LATAM</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DEDEDE]">
                  <tr><td className="py-2 font-bold text-[#C41C1C]">Nebbuler</td><td className="py-2">Pesos locales</td><td className="py-2 font-bold">0%</td><td className="py-2">✅ Nativo</td></tr>
                  <tr><td className="py-2">Substack</td><td className="py-2">USD</td><td className="py-2">10%</td><td className="py-2">❌ No</td></tr>
                  <tr><td className="py-2">Beehiiv</td><td className="py-2">USD</td><td className="py-2">0-9%</td><td className="py-2">❌ No</td></tr>
                  <tr><td className="py-2">Patreon</td><td className="py-2">USD</td><td className="py-2">8-12%</td><td className="py-2">❌ No</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="border-t-4 border-[#121212] bg-[#121212] p-8 text-center mt-12">
            <p className="font-sans text-sm text-[#999] mb-2">¿Tienes análisis financiero que el mercado necesita?</p>
            <h3 className="font-serif text-2xl font-bold text-white mb-4">
              Empieza a cobrar por tus análisis en Nebbuler.
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
