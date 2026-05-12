import type { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'
import { creators as staticCreators } from '@/data/creators'
import { PROFESSIONS, MARKETS } from '@/data/seo-matrix'
import { TOPICS } from '@/data/seo-topics'
import { GUIDES } from '@/data/seo-guides'

export const revalidate = 3600

const BASE = 'https://nebbuler.com'

const MONTH_MAP: Record<string, string> = {
  enero: '01', febrero: '02', marzo: '03', abril: '04',
  mayo: '05', junio: '06', julio: '07', agosto: '08',
  septiembre: '09', octubre: '10', noviembre: '11', diciembre: '12',
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60)
}

// Fallback: usa los static creators de creators.ts cuando Supabase no devuelve perfiles
function getStaticSitemapEntries(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []

  for (const c of staticCreators) {
    const [mes, anio] = c.since.toLowerCase().split(' ')
    const baseDate = new Date(`${anio}-${MONTH_MAP[mes] ?? '01'}-01T00:00:00Z`)

    entries.push({
      url: `${BASE}/${c.slug}`,
      lastModified: baseDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })

    c.articles.forEach((title, i) => {
      const pub = new Date(baseDate)
      pub.setDate(pub.getDate() + i * 14 + 7)
      entries.push({
        url: `${BASE}/${c.slug}/${slugify(title)}`,
        lastModified: pub,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      })
    })
  }

  return entries
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let dbEntries: MetadataRoute.Sitemap = []

  try {
    const supabase = await createClient()

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

    dbEntries = (creators ?? []).map((c: { slug: string; created_at: string }) => ({
      url: `${BASE}/${c.slug}`,
      lastModified: new Date(c.created_at),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    const dbPosts = (posts ?? [])
      .filter((p: { slug: string; sala_creators: { plan: string } }) =>
        p.slug && ['creator', 'pro'].includes(p.sala_creators?.plan)
      )
      .map((p: { slug: string; published_at: string; created_at: string; sala_creators: { slug: string } }) => ({
        url: `${BASE}/${p.sala_creators.slug}/${p.slug}`,
        lastModified: new Date(p.published_at ?? p.created_at),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }))

    dbEntries = [...dbEntries, ...dbPosts]
  } catch {
    // Supabase no responde — usaremos solo static
  }

  // Si Supabase no devolvió perfiles, usamos los static (creators.ts)
  // De lo contrario priorizamos DB sobre static, pero unimos para que ambos aparezcan
  const sitemapUrls = new Set(dbEntries.map((e) => e.url))
  const staticEntries = getStaticSitemapEntries().filter((e) => !sitemapUrls.has(e.url))

  // Rutas SSG de newsletter (20 profesiones × 15 mercados = 300)
  const newsletterRoutes: MetadataRoute.Sitemap = PROFESSIONS.flatMap(prof =>
    MARKETS.map(market => ({
      url: `${BASE}/newsletter/${prof.slug}/${market.slug}`,
      lastModified: new Date('2026-01-01'),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))
  )

  // Rutas SSG de análisis por tema/país (15 × 15 = 225)
  const analisisRoutes: MetadataRoute.Sitemap = TOPICS.flatMap(topic =>
    MARKETS.map(market => ({
      url: `${BASE}/analisis/${topic.slug}/${market.slug}`,
      lastModified: new Date('2026-01-01'),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))
  )

  // Hubs por tema de análisis (15 rutas)
  const analisisHubRoutes: MetadataRoute.Sitemap = TOPICS.map(topic => ({
    url: `${BASE}/analisis/${topic.slug}`,
    lastModified: new Date('2026-01-01'),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // Rutas de guías (8)
  const guiaRoutes: MetadataRoute.Sitemap = GUIDES.map(g => ({
    url: `${BASE}/guia/${g.slug}`,
    lastModified: new Date('2026-01-01'),
    changeFrequency: 'monthly' as const,
    priority: 0.65,
  }))

  return [
    { url: BASE, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${BASE}/directorio`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE}/analisis`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/guia`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.75 },
    { url: `${BASE}/para-creadores`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/precios`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/demo`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/terminos`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },
    { url: `${BASE}/privacidad`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },
    ...newsletterRoutes,
    ...analisisHubRoutes,
    ...analisisRoutes,
    ...guiaRoutes,
    ...dbEntries,
    ...staticEntries,
  ]
}
