import type { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

const BASE = 'https://nebbuler.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let creatorUrls: MetadataRoute.Sitemap = []
  let postUrls: MetadataRoute.Sitemap = []

  try {
    const supabase = await createClient()

    const { data: creators } = await supabase
      .from('sala_creators')
      .select('slug, created_at')
      .in('plan', ['creator', 'pro'])

    const { data: posts } = await supabase
      .from('sala_posts')
      .select('slug, creator_id, published_at, created_at')
      .not('published_at', 'is', null)
      .order('published_at', { ascending: false })

    // Map creatorId → slug para construir URLs de posts
    const { data: allCreators } = await supabase
      .from('sala_creators')
      .select('id, slug')

    const idToSlug = new Map((allCreators ?? []).map(c => [c.id, c.slug]))

    creatorUrls = (creators ?? []).map(c => ({
      url: `${BASE}/${c.slug}`,
      lastModified: new Date(c.created_at),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    postUrls = (posts ?? [])
      .filter(p => p.slug && idToSlug.has(p.creator_id))
      .map(p => ({
        url: `${BASE}/${idToSlug.get(p.creator_id)}/${p.slug}`,
        lastModified: new Date(p.published_at ?? p.created_at),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }))
  } catch {
    // Supabase no configurado en dev — sitemap solo con rutas estáticas
  }

  return [
    { url: BASE, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${BASE}/directorio`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE}/para-creadores`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/precios`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    ...creatorUrls,
    ...postUrls,
  ]
}
