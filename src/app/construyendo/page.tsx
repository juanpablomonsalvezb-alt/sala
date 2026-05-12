import type { Metadata } from 'next'
import Link from 'next/link'
import { safeJsonLd } from '@/lib/rateLimit'

export const metadata: Metadata = {
  title: 'Construyendo Nebbuler — Newsletter del Fundador',
  description:
    'Newsletter semanal donde Juan Pablo Monsalvez comparte cómo se construye Nebbuler: decisiones de producto, lecciones aprendidas, y el viaje de crear una plataforma de conocimiento profesional en Latinoamérica.',
  alternates: { canonical: 'https://nebbuler.com/construyendo' },
  openGraph: {
    title: 'Construyendo Nebbuler — Newsletter del Fundador',
    description:
      'El viaje de crear Nebbuler contado por Juan Pablo. Decisiones de producto, lecciones y reflexiones sobre construir en Latinoamérica.',
    type: 'website',
    url: 'https://nebbuler.com/construyendo',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'NewsArticle',
  name: 'Construyendo Nebbuler',
  description:
    'Newsletter semanal del fundador de Nebbuler compartiendo el viaje de construir la plataforma.',
  url: 'https://nebbuler.com/construyendo',
  author: {
    '@type': 'Person',
    name: 'Juan Pablo Monsalvez',
    url: 'https://nebbuler.com',
  },
  publisher: {
    '@type': 'Organization',
    name: 'Nebbuler',
    url: 'https://nebbuler.com',
  },
}

export default function ConstruyendoPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
      />
      <div className="min-h-screen bg-white">
        <header>
          <div className="h-[3px] bg-[#C41C1C] w-full" />
          <div className="border-b border-[#DEDEDE] py-3 px-6">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
              <Link href="/" className="font-serif text-[22px] font-bold text-[#121212]">
                NEBBULER
              </Link>
              <Link
                href="/directorio"
                className="font-sans text-[12px] font-medium text-[#666] hover:text-[#121212] transition-colors"
              >
                Ver directorio →
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-6 py-12">
          {/* Breadcrumb */}
          <nav className="font-sans text-[12px] text-[#999] mb-8">
            <Link href="/" className="hover:text-[#121212]">
              Inicio
            </Link>
            <span className="mx-2">·</span>
            <span className="text-[#121212]">Construyendo Nebbuler</span>
          </nav>

          {/* Hero */}
          <div className="mb-12 pb-10 border-b border-[#DEDEDE]">
            <p className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-[#C41C1C] mb-3">
              Newsletter del Fundador
            </p>
            <h1 className="font-serif text-[2.5rem] font-bold text-[#121212] leading-[1.15] mb-4">
              Construyendo Nebbuler
            </h1>
            <p className="font-sans text-[17px] text-[#555] leading-relaxed">
              El viaje de crear una plataforma de conocimiento profesional para Latinoamérica. Decisiones de producto, lecciones aprendidas y reflexiones sobre construir en la región.
            </p>
          </div>

          {/* Newsletter signup form */}
          <section className="mb-16">
            <div className="bg-[#F7F7F7] border border-[#E0E0E0] p-8">
              <h2 className="font-serif text-[24px] font-bold text-[#121212] mb-3">
                Suscribirse
              </h2>
              <p className="font-sans text-[14px] text-[#666] mb-6 leading-relaxed">
                Recibe cada semana insights directos sobre cómo se construye Nebbuler. Sin spam. Solo historias reales y lecciones.
              </p>

              <form
                action="/api/newsletter/construyendo"
                method="POST"
                className="space-y-4"
              >
                <div>
                  <label className="block font-sans text-[13px] font-bold text-[#121212] mb-2">
                    Tu email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full font-sans text-[14px] px-4 py-3 border border-[#DEDEDE] focus:border-[#C41C1C] focus:outline-none"
                    placeholder="tu@email.com"
                  />
                </div>

                <div>
                  <label className="block font-sans text-[13px] font-bold text-[#121212] mb-2">
                    Nombre (opcional)
                  </label>
                  <input
                    type="text"
                    name="name"
                    className="w-full font-sans text-[14px] px-4 py-3 border border-[#DEDEDE] focus:border-[#C41C1C] focus:outline-none"
                    placeholder="Tu nombre"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full font-sans text-[12px] font-bold tracking-[0.1em] uppercase px-8 py-3 bg-[#C41C1C] text-white hover:bg-[#a01515] transition-colors"
                >
                  Suscribirse →
                </button>

                <p className="font-sans text-[11px] text-[#999] text-center">
                  Respetamos tu privacidad. Puedes desuscribirse en cualquier momento.
                </p>
              </form>
            </div>
          </section>

          {/* What to expect */}
          <section className="mb-16 pb-16 border-b border-[#DEDEDE]">
            <h2 className="font-serif text-[24px] font-bold text-[#121212] mb-8">
              Qué esperar
            </h2>

            <div className="space-y-8">
              <div>
                <p className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-[#999] mb-2">
                  Cada semana
                </p>
                <h3 className="font-serif text-[18px] font-bold text-[#121212] mb-2">
                  Decisiones de Producto
                </h3>
                <p className="font-sans text-[14px] text-[#666] leading-relaxed">
                  Por qué tomamos ciertas decisiones en Nebbuler. Desde arquitectura de features hasta posicionamiento de mercado.
                </p>
              </div>

              <div>
                <p className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-[#999] mb-2">
                  Historias reales
                </p>
                <h3 className="font-serif text-[18px] font-bold text-[#121212] mb-2">
                  Lecciones Aprendidas
                </h3>
                <p className="font-sans text-[14px] text-[#666] leading-relaxed">
                  Lo que funcionó, lo que no, y cómo pivotamos. Sin filtros. El lado real de construir un producto.
                </p>
              </div>

              <div>
                <p className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-[#999] mb-2">
                  Perspectiva
                </p>
                <h3 className="font-serif text-[18px] font-bold text-[#121212] mb-2">
                  Reflexiones sobre el Mercado
                </h3>
                <p className="font-sans text-[14px] text-[#666] leading-relaxed">
                  Análisis de tendencias en educación profesional, plataformas digitales y el futuro de la industria en LATAM.
                </p>
              </div>
            </div>
          </section>

          {/* About author */}
          <section className="mb-16 pb-16 border-b border-[#DEDEDE]">
            <div className="bg-[#F7F7F7] border border-[#E0E0E0] p-6">
              <h3 className="font-serif text-[18px] font-bold text-[#121212] mb-2">
                Juan Pablo Monsalvez
              </h3>
              <p className="font-sans text-[12px] text-[#999] mb-3">
                Fundador de Nebbuler
              </p>
              <p className="font-sans text-[13px] text-[#666] leading-relaxed">
                Construyendo plataformas de conocimiento profesional para conectar expertos con audiencias en toda Latinoamérica. Apasionado por educación, tecnología y hacer las cosas de manera diferente.
              </p>
            </div>
          </section>

          {/* CTA back to platform */}
          <section className="text-center">
            <p className="font-sans text-[14px] text-[#666] mb-6">
              ¿Busca expertos en una disciplina específica?
            </p>
            <Link
              href="/directorio"
              className="inline-block font-sans text-[12px] font-bold tracking-[0.1em] uppercase px-8 py-3 bg-[#C41C1C] text-white hover:bg-[#a01515] transition-colors"
            >
              Explorar Nebbuler →
            </Link>
          </section>
        </main>
      </div>
    </>
  )
}
