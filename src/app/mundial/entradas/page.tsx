import type { Metadata } from 'next'
import { EntradasClient } from './_client'

export const metadata: Metadata = {
  title: 'Cotizador de Entradas Mundial 2026 — Precios por Partido y Categoría',
  description:
    'Calcula el precio de entradas al Mundial 2026. Consulta precios oficiales por partido, fase, categoría y ciudad. Desde US$60 hasta US$6,370.',
  keywords: [
    'entradas mundial 2026',
    'precios entradas mundial',
    'tickets world cup 2026',
    'cuanto cuestan entradas mundial',
    'cotizador entradas mundial',
    'precios boletos mundial 2026',
    'entradas final mundial 2026',
    'FIFA World Cup 2026 tickets',
  ],
  openGraph: {
    title: 'Cotizador de Entradas — Mundial 2026',
    description: 'Precios oficiales de entradas al Mundial 2026. Desde US$60 (Fase de Grupos) hasta US$6,370 (Final Cat 1).',
    url: 'https://nebbuler.com/mundial/entradas',
    type: 'website',
  },
  alternates: { canonical: 'https://nebbuler.com/mundial/entradas' },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '¿Cuánto cuestan las entradas al Mundial 2026?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Las entradas al Mundial 2026 van desde US$60 (Categoría 4, Fase de Grupos vía federación) hasta US$6,370 (Categoría 1, Final). Los precios varían según fase, categoría de asiento y demanda del partido.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Cuánto cuesta una entrada a la final del Mundial 2026?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'La final del Mundial 2026 tiene precios desde US$2,030 (Categoría 4) hasta US$6,370 (Categoría 1). Son los boletos más caros en la historia de los Mundiales.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Cuál es la entrada más barata del Mundial 2026?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'La entrada más barata es de US$60 (Supporter Entry Tier, Categoría 4, Fase de Grupos), disponible solo a través de federaciones nacionales. Para público general, desde US$120 en Categoría 3.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Los precios incluyen tasas de servicio?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. FIFA cobra una tasa de servicio del 15% adicional al precio de la entrada. El cotizador de Nebbuler muestra el precio base y el total con tasa incluida.',
      },
    },
  ],
}

export default function EntradasPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <EntradasClient />
    </>
  )
}
