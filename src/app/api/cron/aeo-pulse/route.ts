import { NextResponse } from 'next/server'
import { COMPETITORS } from '@/data/competitors'
import { GUIDES } from '@/data/seo-guides'

export const runtime = 'nodejs'
export const maxDuration = 60

const BASE = 'https://nebbuler.com'
const INDEXNOW_KEY = 'nebbuler-indexnow-2026'

// URLs prioritarias para AEO/GEO — las que más impacto tienen
// en visibilidad orgánica e indexación por IAs
const PRIORITY_URLS: string[] = [
  BASE,
  `${BASE}/monetizar`,
  `${BASE}/comparar`,
  `${BASE}/llms.txt`,
  `${BASE}/faq`,
  ...COMPETITORS.map((c) => `${BASE}/vs/${c.slug}`),
  ...GUIDES.map((g) => `${BASE}/guia/${g.slug}`),
]

// Submit a IndexNow (Bing, Yandex, Seznam — protocolo unificado)
async function submitIndexNow(urls: string[]) {
  const body = {
    host: 'nebbuler.com',
    key: process.env.BING_INDEXNOW_KEY ?? INDEXNOW_KEY,
    keyLocation: `${BASE}/${INDEXNOW_KEY}.txt`,
    urlList: urls,
  }

  const endpoints = [
    'https://api.indexnow.org/IndexNow',
    'https://www.bing.com/indexnow',
    'https://yandex.com/indexnow',
  ]

  const results = await Promise.allSettled(
    endpoints.map((ep) =>
      fetch(ep, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify(body),
      }).then((r) => ({ endpoint: ep, status: r.status }))
    )
  )
  return results.map((r) =>
    r.status === 'fulfilled' ? r.value : { endpoint: 'unknown', status: 0, error: String(r.reason) }
  )
}

// Submit URLs a Wayback Machine para crear snapshots indexables
// Genera backlinks naturales desde archive.org (alta autoridad)
async function submitToWayback(urls: string[]) {
  const results = await Promise.allSettled(
    urls.slice(0, 10).map((url) =>
      fetch(`https://web.archive.org/save/${url}`, {
        method: 'GET',
        headers: { 'User-Agent': 'NebbulerBot/1.0 (+https://nebbuler.com)' },
      }).then((r) => ({ url, status: r.status }))
    )
  )
  return results.map((r) =>
    r.status === 'fulfilled' ? r.value : { url: 'unknown', status: 0, error: String(r.reason) }
  )
}

// Ping a Google y Bing sitemaps (best effort, ya no oficialmente soportado pero
// algunos crawlers todavía lo respetan)
async function pingSitemaps() {
  const sitemap = encodeURIComponent(`${BASE}/sitemap.xml`)
  const endpoints = [
    `https://www.google.com/ping?sitemap=${sitemap}`,
    `https://www.bing.com/ping?sitemap=${sitemap}`,
  ]
  const results = await Promise.allSettled(
    endpoints.map((u) => fetch(u, { method: 'GET' }).then((r) => ({ url: u, status: r.status })))
  )
  return results.map((r) =>
    r.status === 'fulfilled' ? r.value : { url: 'unknown', status: 0, error: String(r.reason) }
  )
}

export async function GET(req: Request) {
  const authHeader = req.headers.get('Authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const [indexNowResults, waybackResults, sitemapPings] = await Promise.all([
    submitIndexNow(PRIORITY_URLS),
    submitToWayback(PRIORITY_URLS),
    pingSitemaps(),
  ])

  return NextResponse.json({
    ok: true,
    urlsSubmitted: PRIORITY_URLS.length,
    indexNow: indexNowResults,
    wayback: waybackResults,
    sitemapPings,
    submittedAt: new Date().toISOString(),
  })
}
