import { NextResponse } from 'next/server'
import { SELECCIONES_LATAM, MUNDIAL } from '@/data/mundial-bootstrap'
import mundialData from '@/data/mundial-2026.json'

export const revalidate = 3600

type Grupo = { id: string }
const GRUPOS: Grupo[] = (mundialData as { grupos: Grupo[] }).grupos

const BASE = 'https://nebbuler.com'

// Sitemap dedicado al Mundial 2026 con news:news para Google News
// y prioridades agresivas. Indexación rápida vía /robots.txt (ya lo lista)
// + IndexNow ping automatizable.
export async function GET() {
  const now = new Date().toISOString()
  const pubDate = MUNDIAL.fecha_inicio + 'T00:00:00Z'

  const urls: string[] = []

  // Landing principal
  urls.push(`
    <url>
      <loc>${BASE}/mundial</loc>
      <lastmod>${now}</lastmod>
      <changefreq>daily</changefreq>
      <priority>1.0</priority>
      <news:news>
        <news:publication>
          <news:name>Nebbuler</news:name>
          <news:language>es</news:language>
        </news:publication>
        <news:publication_date>${pubDate}</news:publication_date>
        <news:title>La Sombra · Programa Mundial 2026 para creadores deportivos LATAM</news:title>
      </news:news>
    </url>`)

  // Quiniela
  urls.push(`
    <url>
      <loc>${BASE}/mundial/quiniela</loc>
      <lastmod>${now}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.9</priority>
    </url>`)

  // Selecciones LATAM
  for (const s of SELECCIONES_LATAM) {
    urls.push(`
    <url>
      <loc>${BASE}/mundial/${s.slug}</loc>
      <lastmod>${now}</lastmod>
      <changefreq>daily</changefreq>
      <priority>0.9</priority>
      <news:news>
        <news:publication>
          <news:name>Nebbuler</news:name>
          <news:language>es</news:language>
        </news:publication>
        <news:publication_date>${pubDate}</news:publication_date>
        <news:title>Periodistas y creadores deportivos de ${s.pais} en el Mundial 2026</news:title>
      </news:news>
    </url>`)

    // Widget embebible
    urls.push(`
    <url>
      <loc>${BASE}/widget/mundial/${s.slug}</loc>
      <lastmod>${now}</lastmod>
      <changefreq>daily</changefreq>
      <priority>0.6</priority>
    </url>`)
  }

  // Grupos
  for (const g of GRUPOS) {
    urls.push(`
    <url>
      <loc>${BASE}/mundial/grupo/${g.id.toLowerCase()}</loc>
      <lastmod>${now}</lastmod>
      <changefreq>daily</changefreq>
      <priority>0.85</priority>
      <news:news>
        <news:publication>
          <news:name>Nebbuler</news:name>
          <news:language>es</news:language>
        </news:publication>
        <news:publication_date>${pubDate}</news:publication_date>
        <news:title>Grupo ${g.id} del Mundial 2026</news:title>
      </news:news>
    </url>`)
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urls.join('\n')}
</urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
