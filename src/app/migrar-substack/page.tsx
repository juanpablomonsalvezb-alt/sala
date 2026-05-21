import type { Metadata } from 'next'
import { SubstackWizard } from './SubstackWizard'

export const metadata: Metadata = {
  title: 'Migrar de Substack a Nebbuler en 5 minutos | Nebbuler',
  description:
    'Trae tu newsletter de Substack a Nebbuler. 0% de comisión, pagos en tu moneda local, soporte en español. Importa posts y suscriptores en minutos.',
  alternates: { canonical: 'https://nebbuler.com/migrar-substack' },
  openGraph: {
    title: 'Migrar de Substack a Nebbuler — 0% comisión',
    description:
      'Importa tus posts públicos y suscriptores de Substack en 5 minutos. Sin comisiones, en tu moneda local, soporte en español.',
    url: 'https://nebbuler.com/migrar-substack',
    type: 'article',
    siteName: 'Nebbuler',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Migrar de Substack a Nebbuler en 5 minutos',
    description: 'Importa tus posts y suscriptores. 0% comisión.',
  },
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Cómo migrar de Substack a Nebbuler en 5 minutos',
  description:
    'Guía oficial para importar posts y suscriptores de Substack a Nebbuler sin perder tu audiencia ni pagar comisión.',
  author: { '@type': 'Organization', name: 'Nebbuler' },
  publisher: {
    '@type': 'Organization',
    name: 'Nebbuler',
    logo: { '@type': 'ImageObject', url: 'https://nebbuler.com/icon.png' },
  },
  datePublished: '2026-05-21',
  dateModified: '2026-05-21',
  mainEntityOfPage: 'https://nebbuler.com/migrar-substack',
}

export default function MigrarSubstackPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <SubstackWizard />
    </>
  )
}
