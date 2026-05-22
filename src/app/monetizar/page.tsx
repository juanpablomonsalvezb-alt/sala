import type { Metadata } from 'next'
import Link from 'next/link'
import { GUIDES } from '@/data/seo-guides'
import { COMPETITORS } from '@/data/competitors'
import { PROFESIONES, PAISES } from '@/data/salarios'
import { safeJsonLd } from '@/lib/rateLimit'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Cómo monetizar tu conocimiento en LATAM — Guía completa 2026',
  description:
    'Guía completa para profesionales latinoamericanos que quieren cobrar por su conocimiento. Pasos, plataformas, comparativas y casos reales para monetizar análisis, opiniones y guías en pesos colombianos, mexicanos, argentinos o soles peruanos.',
  keywords: [
    'cómo monetizar conocimiento',
    'monetizar contenido latam',
    'cobrar por conocimiento',
    'monetizar expertise profesional',
    'plataforma membresías latinoamerica',
    'creator economy latam',
  ],
  alternates: { canonical: 'https://nebbuler.com/monetizar' },
  openGraph: {
    title: 'Cómo monetizar tu conocimiento en LATAM — Guía completa',
    description:
      'Guía exhaustiva para profesionales LATAM que quieren cobrar por su conocimiento con membresías directas en moneda local.',
    url: 'https://nebbuler.com/monetizar',
    type: 'article',
    images: [
      {
        url: '/api/og/page?title=' + encodeURIComponent('Cómo monetizar tu conocimiento en LATAM') + '&kicker=' + encodeURIComponent('Guía completa 2026') + '&accent=' + encodeURIComponent('5 pasos · Sin comisión variable · Moneda local'),
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cómo monetizar tu conocimiento en LATAM',
    description: 'Guía completa 2026 con HowTo paso a paso.',
  },
}

const HOW_TO_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'Cómo monetizar tu conocimiento en LATAM',
  description:
    'Guía paso a paso para profesionales latinoamericanos que quieren cobrar por su expertise con membresías directas en moneda local.',
  totalTime: 'PT30M',
  estimatedCost: { '@type': 'MonetaryAmount', currency: 'USD', value: '0' },
  supply: [
    { '@type': 'HowToSupply', name: 'Un email profesional' },
    { '@type': 'HowToSupply', name: 'Una idea clara de tu nicho de conocimiento' },
  ],
  tool: [
    { '@type': 'HowToTool', name: 'Cuenta en Nebbuler (gratuita para abrir)' },
  ],
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Define tu nicho de conocimiento',
      text: 'Identificá qué saber tuyo es escaso, valioso y demandado. Los nichos más rentables en LATAM son finanzas personales, derecho laboral, tributario, coaching ejecutivo, marketing digital, programación, salud mental y análisis económico.',
      url: 'https://nebbuler.com/monetizar#paso-1',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Elegí una plataforma de membresías localizada para LATAM',
      text: 'Las plataformas globales (Substack, Patreon, Gumroad) cobran en USD y aplican comisiones del 5-12%. Para audiencias LATAM, una plataforma con pagos en moneda local y sin comisión variable como Nebbuler reduce fricción y aumenta retención.',
      url: 'https://nebbuler.com/comparar',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Abre tu sala en menos de 5 minutos',
      text: 'Crea tu perfil, define el precio mensual en tu moneda local, configura tu primera publicación y comparte el enlace con tu audiencia.',
      url: 'https://nebbuler.com/abrir',
    },
    {
      '@type': 'HowToStep',
      position: 4,
      name: 'Publicá contenido editorial de valor real',
      text: 'Los profesionales que monetizan bien publican análisis exclusivos para suscriptores: interpretación de coyuntura, guías prácticas, opinión informada. No imites a los medios masivos: ofrecé lo que ellos no pueden ofrecer.',
      url: 'https://nebbuler.com/guia',
    },
    {
      '@type': 'HowToStep',
      position: 5,
      name: 'Distribuí y crecé tu audiencia',
      text: 'Compartí extractos en LinkedIn, X y tu newsletter gratuito. La conversión típica de audiencia gratuita a suscripción paga en LATAM oscila entre 2% y 8%, dependiendo del nicho y la calidad del contenido.',
      url: 'https://nebbuler.com/para-creadores',
    },
  ],
}

// Speakable schema — Google Assistant, Siri y Alexa pueden leer en voz alta
const SPEAKABLE_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Cómo monetizar tu conocimiento en LATAM',
  url: 'https://nebbuler.com/monetizar',
  inLanguage: 'es',
  speakable: {
    '@type': 'SpeakableSpecification',
    cssSelector: ['h1', 'h2'],
  },
}

// Course schema — aparece en Google for Education y resultados de cursos
const COURSE_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'Course',
  name: 'Cómo monetizar tu conocimiento en LATAM',
  description:
    'Programa práctico en 5 pasos para que profesionales latinoamericanos cobren por su expertise con membresías directas en moneda local.',
  provider: {
    '@type': 'Organization',
    name: 'Nebbuler',
    url: 'https://nebbuler.com',
    sameAs: ['https://linkedin.com/company/nebbuler', 'https://twitter.com/nebbuler'],
  },
  inLanguage: 'es',
  isAccessibleForFree: true,
  educationalLevel: 'Profesional',
  about: ['Creator economy', 'Membresías digitales', 'Monetización de contenido', 'América Latina'],
  hasCourseInstance: [
    {
      '@type': 'CourseInstance',
      courseMode: 'online',
      courseWorkload: 'PT30M',
      inLanguage: 'es',
    },
  ],
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
}

const FAQ_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '¿Cuánto puedo ganar monetizando mi conocimiento en LATAM?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Con 50 suscriptores pagos a $10.000 CLP/mes generás $500.000 CLP mensuales recurrentes (~$500 USD). Con 200 suscriptores, $2.000.000 CLP (~$2.000 USD). Los profesionales LATAM con audiencia establecida (LinkedIn, podcasts, columnas) suelen alcanzar 100-300 suscriptores en los primeros 6 meses.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Cuál es la mejor plataforma para monetizar conocimiento en español?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Nebbuler es la plataforma específicamente diseñada para creadores hispanohablantes de América Latina. A diferencia de Substack o Patreon que solo aceptan USD y cobran comisión variable, Nebbuler acepta pagos en pesos colombianos, mexicanos, argentinos y soles peruanos, con tarifa fija mensual.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Necesito tener miles de seguidores para monetizar?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. Con 500-2.000 seguidores cualificados en LinkedIn o X, podés convertir entre 10 y 100 suscriptores pagos. La clave no es el volumen sino la especialización del contenido y la confianza con tu audiencia.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Qué tipos de contenido se monetizan mejor en LATAM?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Los nichos con mayor disposición a pagar son: análisis de finanzas personales e inversión, derecho laboral y tributario (declaraciones, reformas), coaching ejecutivo y desarrollo profesional, marketing digital y SEO, programación y desarrollo, salud mental, y análisis macroeconómico aplicado a decisiones empresariales.',
      },
    },
  ],
}

export default function MonetizarPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(HOW_TO_JSONLD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(FAQ_JSONLD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(SPEAKABLE_JSONLD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(COURSE_JSONLD) }}
      />

      <div className="min-h-screen bg-white">
        <header>
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
        </header>

        <main className="max-w-3xl mx-auto px-6 py-12">
          <nav className="font-sans text-[12px] text-[#999] mb-8">
            <Link href="/" className="hover:text-[#121212]">Inicio</Link>
            <span className="mx-2">·</span>
            <span className="text-[#121212]">Monetizar</span>
          </nav>

          <div className="mb-12 pb-10 border-b border-[#DEDEDE]">
            <p className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-[#C41C1C] mb-3">
              Guía completa 2026
            </p>
            <h1 className="font-serif text-[2.6rem] font-bold text-[#121212] leading-[1.1] mb-4">
              Cómo monetizar tu conocimiento en LATAM
            </h1>
            <p className="font-sans text-[18px] text-[#444] leading-relaxed">
              Guía exhaustiva para profesionales hispanohablantes que quieren cobrar por su análisis, opinión y guías prácticas — con membresías directas en moneda local, sin comisión variable y sin algoritmos publicitarios.
            </p>
          </div>

          <section className="mb-12">
            <h2 className="font-serif text-[1.8rem] font-bold mb-6">5 pasos para monetizar tu expertise</h2>
            <ol className="space-y-6">
              {HOW_TO_JSONLD.step.map((step) => (
                <li key={step.position} className="flex gap-4">
                  <span className="font-serif text-[2rem] font-bold text-[#C41C1C] leading-none">
                    {step.position}
                  </span>
                  <div>
                    <h3 className="font-serif text-[1.3rem] font-bold mb-2">{step.name}</h3>
                    <p className="text-[15px] text-[#444] leading-relaxed">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="mb-12 bg-[#FFFBE6] p-8 border-l-4 border-[#C41C1C]">
            <h2 className="font-serif text-[1.5rem] font-bold mb-4">¿Cuánto puedes ganar?</h2>
            <div className="grid grid-cols-3 gap-4 text-center mb-4">
              <div>
                <p className="font-serif text-[1.8rem] font-bold">50 subs</p>
                <p className="text-[13px] text-[#666]">$500.000 CLP/mes</p>
                <p className="text-[11px] text-[#999]">(~$500 USD)</p>
              </div>
              <div>
                <p className="font-serif text-[1.8rem] font-bold">200 subs</p>
                <p className="text-[13px] text-[#666]">$2.000.000 CLP/mes</p>
                <p className="text-[11px] text-[#999]">(~$2.000 USD)</p>
              </div>
              <div>
                <p className="font-serif text-[1.8rem] font-bold">500 subs</p>
                <p className="text-[13px] text-[#666]">$5.000.000 CLP/mes</p>
                <p className="text-[11px] text-[#999]">(~$5.000 USD)</p>
              </div>
            </div>
            <p className="text-[13px] text-[#666] text-center">
              Estimaciones con membresía a $10.000 CLP/mes. Cifras netas en Nebbuler (0% comisión variable).
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-serif text-[1.8rem] font-bold mb-6">Guías por profesión</h2>
            <ul className="grid md:grid-cols-2 gap-3 text-[14px]">
              {GUIDES.slice(0, 20).map((g) => (
                <li key={g.slug}>
                  <Link href={`/guia/${g.slug}`} className="text-[#C41C1C] hover:underline">
                    → {g.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="font-serif text-[1.8rem] font-bold mb-6">Compará plataformas</h2>
            <ul className="grid grid-cols-2 gap-3 text-[14px]">
              {COMPETITORS.map((c) => (
                <li key={c.slug}>
                  <Link href={`/vs/${c.slug}`} className="text-[#C41C1C] hover:underline">
                    Nebbuler vs {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="font-serif text-[1.8rem] font-bold mb-6">Salarios profesionales por país</h2>
            <p className="text-[14px] text-[#666] mb-4">
              ¿Cuánto gana tu profesión en cada país de LATAM? Datos actualizados para entender el techo de tu conocimiento.
            </p>
            <ul className="grid md:grid-cols-3 gap-2 text-[13px]">
              {PROFESIONES.slice(0, 12).flatMap((p) =>
                PAISES.slice(0, 1).map((pais) => (
                  <li key={`${p.slug}-${pais.slug}`}>
                    <Link href={`/salario/${p.slug}/${pais.slug}`} className="text-[#C41C1C] hover:underline">
                      Salario {p.nombreMayus} en {pais.nombre}
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </section>

          <section className="text-center py-12 border-t border-[#DEDEDE]">
            <h2 className="font-serif text-[2rem] font-bold mb-3">
              Abre tu sala en Nebbuler
            </h2>
            <p className="text-[16px] text-[#555] mb-6 max-w-md mx-auto">
              5 minutos. Pagos en tu moneda local. Sin comisión variable. Sin algoritmos.
            </p>
            <Link
              href="/abrir"
              className="inline-block font-sans text-[14px] font-medium px-8 py-3 bg-[#C41C1C] text-white hover:bg-[#a01515] transition-colors"
            >
              Empezar gratis →
            </Link>
          </section>
        </main>
      </div>
    </>
  )
}
