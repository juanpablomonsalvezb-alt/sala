import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const revalidate = 1800

const BASE = 'https://nebbuler.com'

// Google News sitemap — solo URLs de los últimos 2 días
export async function GET() {
  const items: { url: string; title: string; pubDate: string }[] = []
  const cutoff = Date.now() - 2 * 24 * 60 * 60 * 1000

  try {
    const supabase = await createClient()
    const { data: posts } = await (supabase as any)
      .from('sala_posts')
      .select('title, slug, published_at, sala_creators!inner(slug, plan)')
      .not('published_at', 'is', null)
      .gte('published_at', new Date(cutoff).toISOString())
      .order('published_at', { ascending: false })
      .limit(1000)

    for (const p of posts ?? []) {
      if (!['creator', 'pro'].includes(p.sala_creators?.plan)) continue
      items.push({
        url: `${BASE}/${p.sala_creators.slug}/${p.slug}`,
        title: p.title,
        pubDate: new Date(p.published_at).toISOString(),
      })
    }

    // También páginas /tendencia generadas en últimos 2 días
    const { data: trending } = await supabase
      .from('generated_pages')
      .select('keyword, created_at')
      .gte('created_at', new Date(cutoff).toISOString())
      .order('created_at', { ascending: false })
      .limit(500)

    for (const t of trending ?? []) {
      items.push({
        url: `${BASE}/tendencia/${encodeURIComponent(t.keyword.toLowerCase().replace(/\s+/g, '-'))}`,
        title: t.keyword,
        pubDate: new Date(t.created_at).toISOString(),
      })
    }
  } catch {
    // Si no hay supabase, devolvemos sitemap vacío válido
  }

  const escape = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${items
  .map(
    (it) => `  <url>
    <loc>${it.url}</loc>
    <news:news>
      <news:publication>
        <news:name>Nebbuler</news:name>
        <news:language>es</news:language>
      </news:publication>
      <news:publication_date>${it.pubDate}</news:publication_date>
      <news:title>${escape(it.title)}</news:title>
    </news:news>
  </url>`
  )
  .join('\n')}
</urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=1800, s-maxage=1800',
    },
  })
}
