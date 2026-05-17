import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { GUIDES } from '@/data/seo-guides'
import { COMPETITORS } from '@/data/competitors'

export const runtime = 'nodejs'
export const revalidate = 3600

const BASE = 'https://nebbuler.com'

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

type Item = {
  title: string
  link: string
  description: string
  pubDate: string
  category?: string
}

export async function GET() {
  const items: Item[] = []

  // Guías
  for (const g of GUIDES.slice(0, 50)) {
    items.push({
      title: g.title,
      link: `${BASE}/guia/${g.slug}`,
      description: g.description,
      pubDate: new Date('2026-01-01').toUTCString(),
      category: 'Guía',
    })
  }

  // Comparativas
  for (const c of COMPETITORS) {
    items.push({
      title: `Nebbuler vs ${c.name} — Comparativa para creadores LATAM`,
      link: `${BASE}/vs/${c.slug}`,
      description: c.migrationReason,
      pubDate: new Date('2026-02-01').toUTCString(),
      category: 'Comparativa',
    })
  }

  // Posts de creadores (último mes)
  try {
    const supabase = await createClient()
    const { data: posts } = await (supabase as any)
      .from('sala_posts')
      .select('title, slug, summary, published_at, sala_creators!inner(slug, plan)')
      .not('published_at', 'is', null)
      .order('published_at', { ascending: false })
      .limit(30)

    for (const p of posts ?? []) {
      if (!['creator', 'pro'].includes(p.sala_creators?.plan)) continue
      items.push({
        title: p.title,
        link: `${BASE}/${p.sala_creators.slug}/${p.slug}`,
        description: p.summary ?? p.title,
        pubDate: new Date(p.published_at).toUTCString(),
        category: 'Post de creador',
      })
    }
  } catch {
    // Sin Supabase, seguimos con lo estático
  }

  // Ordenar por fecha
  items.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Nebbuler — Membresías para creadores LATAM</title>
    <link>${BASE}</link>
    <description>Guías, comparativas y contenido para profesionales latinoamericanos que monetizan su conocimiento con membresías directas.</description>
    <language>es-419</language>
    <atom:link href="${BASE}/rss.xml" rel="self" type="application/rss+xml" />
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <generator>Nebbuler</generator>
    <image>
      <url>${BASE}/nebbuler-logo.png</url>
      <title>Nebbuler</title>
      <link>${BASE}</link>
    </image>
${items
  .slice(0, 100)
  .map(
    (it) => `    <item>
      <title>${escapeXml(it.title)}</title>
      <link>${it.link}</link>
      <guid isPermaLink="true">${it.link}</guid>
      <description>${escapeXml(it.description)}</description>
      <pubDate>${it.pubDate}</pubDate>
      ${it.category ? `<category>${escapeXml(it.category)}</category>` : ''}
      <dc:creator>Nebbuler</dc:creator>
    </item>`
  )
  .join('\n')}
  </channel>
</rss>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
