import type { Metadata } from 'next'
import ParaCreadoresClient from './_components/ParaCreadoresClient'

export const metadata: Metadata = {
  title: 'Para creadores · Cobra membresías en tu moneda — Nebbuler',
  description:
    'Abre tu sala en Nebbuler y cobra membresías directas en pesos colombianos, mexicanos, argentinos o soles. Sin algoritmos, sin comisión variable. La plataforma de monetización de conocimiento para creadores LATAM.',
  alternates: { canonical: 'https://nebbuler.com/para-creadores' },
  openGraph: {
    title: 'Para creadores · Cobra membresías en tu moneda — Nebbuler',
    description:
      'Monetizá tu expertise con membresías directas. Pagos en moneda local, sin comisión, sin algoritmos. Disponible en 18 países de LATAM.',
    url: 'https://nebbuler.com/para-creadores',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Para creadores · Nebbuler',
    description: 'Tu conocimiento ya tiene precio. Cobra membresías en tu moneda, sin comisión.',
  },
}

export default function ParaCreadoresPage() {
  return <ParaCreadoresClient />
}
