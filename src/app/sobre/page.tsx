import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Sobre Nebbuler · Plataforma de newsletters profesionales de pago',
  description:
    'Nebbuler es la plataforma donde los economistas, abogados, médicos y arquitectos más rigurosos de Chile y LATAM publican y cobran directamente por sus análisis. 0% comisión.',
  alternates: { canonical: 'https://nebbuler.com/sobre' },
  openGraph: {
    title: 'Sobre Nebbuler · Plataforma de newsletters profesionales de pago',
    description:
      'Nebbuler existe porque el conocimiento profesional serio merece ser remunerado. Chile y LATAM.',
    url: 'https://nebbuler.com/sobre',
    type: 'website',
  },
}

const ORG_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Nebbuler',
  url: 'https://nebbuler.com',
  logo: 'https://nebbuler.com/icon.png',
  description:
    'Plataforma de newsletters profesionales de pago para Chile y Latinoamérica',
  foundingDate: '2025',
  areaServed: [
    'CL', 'AR', 'CO', 'MX', 'PE', 'UY', 'BO', 'EC', 'PY', 'VE',
    'GT', 'CR', 'PA', 'HN', 'SV', 'NI', 'DO', 'CU', 'PR',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'hello@nebbuler.com',
    contactType: 'customer service',
  },
  sameAs: [
    'https://linkedin.com/company/nebbuler',
    'https://instagram.com/nebbuler',
  ],
}

export default function SobrePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSONLD) }}
      />

      <main className="min-h-screen bg-white text-[#121212]">
        {/* Barra roja top */}
        <div className="h-[3px] w-full bg-[#C41C1C]" />

        {/* Header */}
        <header className="border-b border-[#F0F0F0] px-6 py-5">
          <div className="max-w-2xl mx-auto">
            <Link
              href="/"
              className="font-serif font-bold text-lg tracking-widest text-[#121212] hover:text-[#C41C1C] transition-colors"
            >
              NEBBULER
            </Link>
          </div>
        </header>

        {/* Contenido */}
        <div className="max-w-2xl mx-auto px-6 py-16 sm:py-24">

          {/* Título */}
          <div className="mb-16">
            <h1 className="font-serif text-4xl sm:text-5xl text-[#121212] mb-6 leading-tight">
              Sobre Nebbuler
            </h1>
            <p className="font-serif text-xl text-[#444] italic leading-relaxed">
              Lo que se piensa bien, dura.
            </p>
          </div>

          {/* Separador */}
          <div className="w-12 h-[2px] bg-[#C41C1C] mb-16" />

          {/* Misión */}
          <section className="mb-14" aria-labelledby="mision-heading">
            <h2
              id="mision-heading"
              className="font-sans text-xs uppercase tracking-widest text-[#999] mb-4"
            >
              Misión
            </h2>
            <div className="border-l-2 border-[#C41C1C] pl-6">
              <p className="font-serif text-lg leading-relaxed text-[#121212]">
                Nebbuler existe porque el conocimiento profesional serio merece ser remunerado. Los economistas, abogados, médicos y arquitectos más rigurosos de Chile y LATAM publican aquí y cobran directamente por sus análisis.
              </p>
            </div>
          </section>

          {/* Modelo */}
          <section className="mb-14" aria-labelledby="modelo-heading">
            <h2
              id="modelo-heading"
              className="font-sans text-xs uppercase tracking-widest text-[#999] mb-4"
            >
              El modelo
            </h2>
            <div className="bg-[#F7F7F7] border border-[#E8E8E8] p-6 mb-6">
              <p className="font-sans text-3xl font-bold text-[#C41C1C] mb-1">0%</p>
              <p className="font-sans text-sm text-[#666]">comisión sobre suscripciones</p>
            </div>
            <p className="font-sans text-base text-[#444] leading-relaxed mb-4">
              <span className="font-semibold text-[#121212]">$29.990 CLP/mes</span> tarifa plana para creadores. El 100% del precio de cada suscripción va al creador, menos los cargos propios del procesador de pagos.
            </p>
            <p className="font-sans text-sm text-[#666] leading-relaxed">
              Sin intermediarios. Sin porcentajes variables. Sin sorpresas al final del mes. El creador fija su precio y ese precio es íntegramente suyo.
            </p>
          </section>

          {/* Para lectores */}
          <section className="mb-14" aria-labelledby="lectores-heading">
            <h2
              id="lectores-heading"
              className="font-sans text-xs uppercase tracking-widest text-[#999] mb-4"
            >
              Para lectores
            </h2>
            <p className="font-sans text-base text-[#444] leading-relaxed mb-4">
              Las suscripciones son directas al profesional. No hay algoritmos que decidan qué lees, no hay ruido editorial, no hay contenido patrocinado que contamine el análisis.
            </p>
            <ul className="space-y-3">
              {[
                'Suscripciones mensuales directas al profesional',
                'Acceso inmediato a todo el archivo publicado',
                'Sin publicidad ni contenido patrocinado',
                'Cancela cuando quieras, sin letra chica',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 font-sans text-sm text-[#444]">
                  <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-[#C41C1C] flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* Para profesionales */}
          <section className="mb-14" aria-labelledby="profesionales-heading">
            <h2
              id="profesionales-heading"
              className="font-sans text-xs uppercase tracking-widest text-[#999] mb-4"
            >
              Para profesionales
            </h2>
            <p className="font-sans text-base text-[#444] leading-relaxed mb-6">
              Si tienes conocimiento especializado y una audiencia que lo valora, Nebbuler te da la infraestructura para cobrar por él. Sin depender de plataformas que te quitan la mitad, sin algoritmos que sepultan tu trabajo.
            </p>
            <Link
              href="/para-creadores"
              className="inline-block border border-[#121212] text-[#121212] font-sans text-sm px-6 py-3 hover:bg-[#121212] hover:text-white transition-colors"
            >
              Abre tu sala en Nebbuler →
            </Link>
          </section>

          {/* Separador */}
          <div className="w-full h-px bg-[#F0F0F0] my-14" />

          {/* Contacto */}
          <section className="mb-10" aria-labelledby="contacto-heading">
            <h2
              id="contacto-heading"
              className="font-sans text-xs uppercase tracking-widest text-[#999] mb-4"
            >
              Contacto
            </h2>
            <p className="font-sans text-base text-[#444] mb-2">
              Para creadores, prensa y soporte:
            </p>
            <a
              href="mailto:hello@nebbuler.com"
              className="font-sans text-base text-[#121212] underline underline-offset-4 hover:text-[#C41C1C] transition-colors"
            >
              hello@nebbuler.com
            </a>
          </section>

          {/* Legal */}
          <section aria-labelledby="legal-heading">
            <h2
              id="legal-heading"
              className="font-sans text-xs uppercase tracking-widest text-[#999] mb-4"
            >
              Legal
            </h2>
            <div className="flex gap-6">
              <Link
                href="/terminos"
                className="font-sans text-sm text-[#666] underline underline-offset-4 hover:text-[#121212] transition-colors"
              >
                Términos de servicio
              </Link>
              <Link
                href="/privacidad"
                className="font-sans text-sm text-[#666] underline underline-offset-4 hover:text-[#121212] transition-colors"
              >
                Política de privacidad
              </Link>
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="border-t border-[#F0F0F0] px-6 py-8">
          <div className="max-w-2xl mx-auto">
            <Link
              href="/"
              className="font-sans text-sm text-[#999] hover:text-[#121212] transition-colors"
            >
              ← Volver al inicio
            </Link>
          </div>
        </footer>
      </main>
    </>
  )
}
