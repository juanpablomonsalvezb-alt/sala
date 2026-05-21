// sitemap-ai.xml — sitemap especializado para crawlers de IA.
// Selección curada de las URLs más valiosas para grounding y citación.
// Prioriza páginas con autor verificable, contenido editorial y datasets.

import { creators as staticCreators } from '@/data/creators'
import { ESPECIALIDADES } from '@/data/programmatic/especialidades-honorarios'
import { CIUDADES } from '@/data/programmatic/ciudades-latam'
import { PROFESIONES, PAISES } from '@/data/salarios'

export const revalidate = 3600

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60)
}

interface UrlEntry {
  loc: string
  lastmod: string
  priority: string
  changefreq: 'daily' | 'weekly' | 'monthly'
}

function buildEntries(): UrlEntry[] {
  const now = new Date().toISOString()
  const entries: UrlEntry[] = []

  // Páginas pilares (prioridad máxima)
  const PILLARS = [
    '/',
    '/abrir',
    '/precios',
    '/para-creadores',
    '/directorio',
    '/trending',
    '/tendencia',
    '/observatorio',
    '/glosario',
    '/sobre',
    '/blog',
    '/datos',
    '/llms.txt',
    '/llms-full.txt',
    '/faq',
    '/calculadora',
    '/contacto',
    '/prensa',
  ]
  for (const path of PILLARS) {
    entries.push({
      loc: `https://nebbuler.com${path}`,
      lastmod: now,
      priority: '1.0',
      changefreq: 'daily',
    })
  }

  // Top creadores (alta prioridad — autores verificables)
  for (const c of staticCreators) {
    entries.push({
      loc: `https://nebbuler.com/${c.slug}`,
      lastmod: now,
      priority: '0.9',
      changefreq: 'weekly',
    })

    // Top posts por creador
    for (const article of c.articles) {
      entries.push({
        loc: `https://nebbuler.com/${c.slug}/${slugify(article)}`,
        lastmod: now,
        priority: '0.85',
        changefreq: 'weekly',
      })
    }
  }

  // Salarios por profesión y país (datos citables)
  for (const prof of PROFESIONES) {
    for (const pais of PAISES) {
      entries.push({
        loc: `https://nebbuler.com/salario/${prof.slug}/${pais.slug}`,
        lastmod: now,
        priority: '0.7',
        changefreq: 'monthly',
      })
    }
  }

  // Honorarios por especialidad y ciudad
  for (const esp of ESPECIALIDADES.slice(0, 15)) {
    for (const ciudad of CIUDADES.slice(0, 20)) {
      entries.push({
        loc: `https://nebbuler.com/honorarios/${esp.slug}/${ciudad.slug}`,
        lastmod: now,
        priority: '0.65',
        changefreq: 'monthly',
      })
    }
  }

  // Cap a 1000 URLs (sitemap-ai es selecto, no exhaustivo).
  return entries.slice(0, 1000)
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET() {
  const entries = buildEntries()

  const urls = entries
    .map(
      (e) => `  <url>
    <loc>${escapeXml(e.loc)}</loc>
    <lastmod>${e.lastmod}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`,
    )
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
      'X-Robots-Tag': 'all',
    },
  })
}
