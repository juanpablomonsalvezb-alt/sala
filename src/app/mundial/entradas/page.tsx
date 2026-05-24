import type { Metadata } from 'next'
import { EntradasClient } from './_client'

export const metadata: Metadata = {
  title: 'Cotizador de Entradas Mundial 2026 — Precios por Partido y Categoría',
  description:
    'Calcula el precio de entradas al Mundial 2026. Precios oficiales FIFA por partido, fase y categoría. Desde US$60 hasta US$7,875.',
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
    description: 'Precios oficiales de entradas al Mundial 2026. Desde US$60 (Supporter Tier) hasta US$7,875 (Final Cat 1).',
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
        text: 'Las entradas al Mundial 2026 van desde US$60 (Supporter Tier vía federación) hasta US$7,875 (Categoría 1, Final). Fase de Grupos neutral parte en US$120 (Cat 3). Partidos de selecciones anfitrionas (USA, México, Canadá) cuestan hasta US$2,735 (Cat 1). FIFA aplica un 15% de tasa de servicio adicional.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Cuánto cuesta una entrada a la final del Mundial 2026?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'La final del Mundial 2026 cuesta desde US$1,490 (Categoría 3) hasta US$7,875 (Categoría 1). Es el Mundial más caro de la historia, con precios 4 veces superiores a Qatar 2022.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Cuál es la entrada más barata del Mundial 2026?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'La entrada más barata es de US$60 (Supporter Entry Tier), disponible solo a través de federaciones nacionales. Para público general, desde US$120 en Categoría 3 para partidos neutrales de fase de grupos.',
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
