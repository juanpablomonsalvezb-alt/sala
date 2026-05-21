// Compat: las URLs /influencers-economia-chile se redirigen a /expertos/economia/chile
// La estructura limpia /expertos/[nicho]/[pais] evita parseo de slugs compuestos.

import { redirect } from 'next/navigation'
import { NICHOS, PAISES_INF } from '@/data/programmatic/influencers-latam'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function InfluencersLegacy({ params }: PageProps) {
  const { slug } = await params
  // Buscar país al final
  for (const pais of PAISES_INF) {
    if (slug.endsWith('-' + pais.slug)) {
      const nichoSlug = slug.slice(0, -pais.slug.length - 1)
      const nicho = NICHOS.find((n) => n.slug === nichoSlug)
      if (nicho) {
        redirect(`/expertos/${nicho.slug}/${pais.slug}`)
      }
    }
  }
  // Fallback: a directorio general
  redirect('/directorio')
}
