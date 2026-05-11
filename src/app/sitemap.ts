import type { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export const revalidate = 3600 // refresca cada hora

const BASE = 'https://nebbuler.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let creatorUrls: MetadataRoute.Sitemap = []
  let postUrls: MetadataRoute.Sitemap = []

  try {
    const supabase = await createClient()

    // Una sola query con join — antes eran 3
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: posts } = await (supabase as any)
      .from('sala_posts')
      .select('slug, published_at, created_at, sala_creators!inner(slug, plan)')
      .not('published_at', 'is', null)
      .order('published_at', { ascending: false })

    const { data: creators } = await supabase
      .from('sala_creators')
      .select('slug, created_at')
      .in('plan', ['creator', 'pro'])

    creatorUrls = (creators ?? []).map((c: { slug: string; created_at: string }) => ({
      url: `${BASE}/${c.slug}`,
      lastModified: new Date(c.created_at),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    postUrls = (posts ?? [])
      .filter((p: { slug: string; sala_creators: { plan: string } }) =>
        p.slug && ['creator', 'pro'].includes(p.sala_creators?.plan)
      )
      .map((p: { slug: string; published_at: string; created_at: string; sala_creators: { slug: string } }) => ({
        url: `${BASE}/${p.sala_creators.slug}/${p.slug}`,
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
    { url: `${BASE}/precios`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/demo`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/terminos`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },
    { url: `${BASE}/privacidad`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },
    ...creatorUrls,
    ...postUrls,
  ]
}
