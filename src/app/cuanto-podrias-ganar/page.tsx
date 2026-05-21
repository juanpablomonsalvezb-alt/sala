import type { Metadata } from 'next'
import Nav from '@/components/nav'
import { CalculadoraClient } from './_components/CalculadoraClient'

export const metadata: Metadata = {
  title: '¿Cuánto podrías ganar con una membresía Nebbuler?',
  description:
    'Calculadora interactiva para profesionales LATAM. Ingresa tu profesión, país, audiencia y horas semanales — descubre tu ingreso mensual estimado y compáralo con Substack y Patreon.',
  alternates: { canonical: 'https://nebbuler.com/cuanto-podrias-ganar' },
  openGraph: {
    title: '¿Cuánto podrías ganar con una membresía? — Calculadora Nebbuler',
    description:
      'Estima tus ingresos mensuales como creator profesional en LATAM. Compáralo con Substack y Patreon.',
    url: 'https://nebbuler.com/cuanto-podrias-ganar',
    type: 'website',
    images: [
      {
        url: 'https://nebbuler.com/api/og/cuanto-ganarias',
        width: 1200,
        height: 630,
        alt: 'Calculadora Nebbuler',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '¿Cuánto podrías ganar con tu sala? — Nebbuler',
    description: 'Calculadora interactiva para creators LATAM.',
    images: ['https://nebbuler.com/api/og/cuanto-ganarias'],
  },
}

export default function CuantoPodriasGanarPage() {
  return (
    <>
      <Nav />
      <main className="min-h-screen bg-white text-[#121212]">
        <section className="border-b border-[#DEDEDE]">
          <div className="max-w-5xl mx-auto px-6 py-16">
            <p className="text-[10px] uppercase tracking-[0.28em] text-[#C41C1C] font-semibold mb-6">
              Calculadora · ingresos LATAM 2026
            </p>
            <h1 className="font-serif text-5xl md:text-7xl font-bold leading-[0.95] tracking-[-0.02em] text-[#121212] max-w-4xl mb-6">
              ¿Cuánto podrías ganar con tu sala?
            </h1>
            <p className="font-serif text-xl md:text-2xl italic text-[#666] max-w-3xl leading-relaxed">
              Ingresa tu profesión, país y audiencia actual. Te mostramos tu
              ingreso mensual estimado en moneda local y lo comparamos con
              Substack y Patreon.
            </p>
          </div>
        </section>

        <CalculadoraClient />

        <section className="border-t-2 border-[#121212] bg-[#FAFAF7]">
          <div className="max-w-3xl mx-auto px-6 py-16 text-center">
            <p className="text-[10px] uppercase tracking-[0.28em] text-[#C41C1C] font-semibold mb-4">
              Sobre estos cálculos
            </p>
            <p className="font-serif text-base text-[#666] italic leading-relaxed">
              Los estimados combinan benchmarks públicos de Substack y Patreon
              LATAM 2025-2026, conversion rates típicos por profesión y pricing
              power por mercado. Son una referencia, no una promesa. Los
              creadores reales que ya están en Nebbuler suelen sobrepasar estos
              números cuando su contenido es consistente.
            </p>
          </div>
        </section>
      </main>
    </>
  )
}
