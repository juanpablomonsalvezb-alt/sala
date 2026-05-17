import type { Metadata } from 'next'
import Link from 'next/link'
import { safeJsonLd } from '@/lib/rateLimit'
import { CalculadoraClient } from './_client'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Calculadora de ingresos para creadores LATAM — Nebbuler',
  description:
    'Calculá cuánto podés ganar mes a mes con membresías de pago en LATAM. Compará Nebbuler (0% comisión variable) vs Substack (10%) vs Patreon (12%). Pesos, dólares, suscriptores y crecimiento real.',
  keywords: [
    'calculadora ingresos creador',
    'cuanto puedo ganar membresias',
    'simulador substack vs patreon',
    'calculadora suscripciones latam',
    'cuanto gana un creador de contenido',
  ],
  alternates: { canonical: 'https://nebbuler.com/calculadora' },
  openGraph: {
    title: 'Calculadora de ingresos para creadores LATAM',
    description: 'Cuánto podés ganar con membresías. Compará Nebbuler vs Substack vs Patreon en tiempo real.',
    url: 'https://nebbuler.com/calculadora',
    type: 'website',
    images: [
      {
        url: '/api/og/page?title=Calculadora%20de%20ingresos%20para%20creadores%20LATAM&kicker=Herramienta%20gratis&accent=Compará%20Nebbuler%20vs%20Substack%20vs%20Patreon',
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Calculadora de ingresos para creadores LATAM',
    description: 'Cuánto podés ganar con membresías de pago en moneda local.',
  },
}

const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Calculadora de ingresos para creadores LATAM',
  description:
    'Herramienta interactiva gratuita para estimar ingresos mensuales de creadores con membresías de pago en América Latina. Compara comisiones de Nebbuler, Substack y Patreon.',
  url: 'https://nebbuler.com/calculadora',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  inLanguage: 'es',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  publisher: { '@type': 'Organization', name: 'Nebbuler', url: 'https://nebbuler.com' },
}

const FAQ_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '¿Cuánto puedo ganar con 100 suscriptores en LATAM?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Con 100 suscriptores pagando $10.000 CLP/mes (~$10 USD), generás $1.000.000 CLP brutos mensuales (~$1.000 USD). En Nebbuler conservás el 100% (menos cargos del procesador). En Substack/Patreon perderías $100-120/mes en comisiones.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Cuál es la diferencia real entre Nebbuler y Substack en pesos?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A partir de 4 suscriptores pagos de $10.000 CLP/mes, Nebbuler te resulta más barato que Substack. Con 50 suscriptores, Substack te cobra $50.000 CLP/mes en comisiones; Nebbuler solo la tarifa fija. La diferencia se amplía exponencialmente al crecer.',
      },
    },
  ],
}

export default function CalculadoraPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(JSON_LD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(FAQ_JSONLD) }}
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
                href="/abrir"
                className="font-sans text-[12px] font-medium px-4 py-1.5 bg-[#C41C1C] text-white hover:bg-[#a01515] transition-colors"
              >
                Abrir mi sala →
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-6 py-12">
          <nav className="font-sans text-[12px] text-[#999] mb-8">
            <Link href="/" className="hover:text-[#121212]">Inicio</Link>
            <span className="mx-2">·</span>
            <span className="text-[#121212]">Calculadora</span>
          </nav>

          <div className="mb-12">
            <p className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-[#C41C1C] mb-3">
              Herramienta gratis
            </p>
            <h1 className="font-serif text-[2.5rem] font-bold text-[#121212] leading-[1.1] mb-4">
              Calculá cuánto podés ganar con membresías
            </h1>
            <p className="font-sans text-[17px] text-[#555] leading-relaxed max-w-2xl">
              Ajustá los suscriptores, el precio mensual y la moneda. Comparamos en tiempo real cuánto te quedaría neto en Nebbuler, Substack y Patreon.
            </p>
          </div>

          <CalculadoraClient />

          <section className="mt-16 pt-12 border-t border-[#DEDEDE]">
            <h2 className="font-serif text-[1.6rem] font-bold mb-6">¿Cómo funciona el cálculo?</h2>
            <ul className="space-y-3 text-[15px] text-[#444] leading-relaxed">
              <li>
                <strong>Nebbuler:</strong> tarifa fija mensual (~$29.990 CLP equivalente). 0% comisión variable sobre ingresos. Pagos directos en moneda local.
              </li>
              <li>
                <strong>Substack:</strong> 10% sobre ingresos + ~2.9% + $0.30 USD del procesador (Stripe). Solo USD.
              </li>
              <li>
                <strong>Patreon Pro:</strong> 8% sobre ingresos + ~5% de procesamiento. Solo USD principalmente.
              </li>
            </ul>
            <p className="mt-6 text-[13px] text-[#888]">
              * Estimaciones referenciales para LATAM. Tasa de cambio 1 USD ≈ $1.000 CLP. Cifras netas antes de impuestos del país.
            </p>
          </section>

          <section className="mt-12 bg-[#FFFBE6] p-8 border-l-4 border-[#C41C1C]">
            <h2 className="font-serif text-[1.4rem] font-bold mb-3">¿Listo para empezar?</h2>
            <p className="text-[15px] text-[#444] mb-4">
              Abrí tu sala en Nebbuler en menos de 5 minutos. Pagos en tu moneda local, sin comisión variable.
            </p>
            <Link
              href="/abrir"
              className="inline-block font-sans text-[14px] font-medium px-6 py-3 bg-[#C41C1C] text-white hover:bg-[#a01515] transition-colors"
            >
              Empezar gratis →
            </Link>
          </section>
        </main>
      </div>
    </>
  )
}
