import type { Metadata } from 'next'
import ParaCreadoresClient from './_components/ParaCreadoresClient'

export const metadata: Metadata = {
  title: 'Para creadores · Newsletters profesionales de pago',
  description:
    'Abre tu sala en Nebbuler y cobra por tu conocimiento. Análisis profesionales, suscripción mensual directa, sin algoritmos. $29.990 CLP/mes — 0% de comisión.',
  alternates: { canonical: 'https://nebbuler.com/para-creadores' },
  openGraph: {
    title: 'Para creadores · Newsletters profesionales de pago',
    description:
      'Cobra mes a mes por tu expertise. Análisis profesionales, sin algoritmos, sin comisión. $29.990 CLP/mes fijo.',
    url: 'https://nebbuler.com/para-creadores',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Para creadores · Nebbuler',
    description: 'Tu conocimiento ya tiene precio. Cobra sin algoritmos, sin comisión.',
  },
}

export default function ParaCreadoresPage() {
  return <ParaCreadoresClient />
}
