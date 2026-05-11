import type { Metadata } from 'next'
import PreciosClient from './_components/PreciosClient'

export const metadata: Metadata = {
  title: 'Precios · Plan único $29.990 CLP/mes · 0% comisión',
  description:
    'Cobra por tu conocimiento sin comisiones. Nebbuler cuesta $29.990 CLP fijo al mes y te quedas con el 100% de lo que cobran tus suscriptores.',
  alternates: { canonical: 'https://nebbuler.com/precios' },
  openGraph: {
    title: 'Precios · Plan único $29.990 CLP/mes · 0% comisión',
    description:
      'Cobra por tu conocimiento sin comisiones. $29.990 CLP fijo al mes — te quedas con el 100% de tus suscripciones.',
    url: 'https://nebbuler.com/precios',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nebbuler · Precios',
    description: '$29.990 CLP/mes fijo. 0% comisión. Tú te quedas con el 100%.',
  },
}

export default function PreciosPage() {
  return <PreciosClient />
}
