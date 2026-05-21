// POST /api/migrate/substack/analyze
// Scrapea posts públicos de un Substack (o dominio custom) leyendo su
// sitemap.xml + meta tags HTML. 100% público, sin API privada, sin auth ajeno.
//
// Body: { substackUrl: string }
// Response: { found, creator_name, posts: [], total_posts, sample_html_first_post }

import { NextRequest, NextResponse } from 'next/server'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

export const runtime = 'nodejs'
export const maxDuration = 30

const MAX_POSTS = 50
const FETCH_TIMEOUT_MS = 10_000
const USER_AGENT = 'Nebbuler/1.0 (+https://nebbuler.com)'

// Cache en memoria del proceso (best-effort, expira en 1h)
type CacheEntry = { ts: number; payload: unknown }
const cache = new Map<string, CacheEntry>()
const CACHE_TTL_MS = 60 * 60 * 1000

interface ScrapedPost {
  title: string
  excerpt: string
  slug: string
  published_at: string | null
  original_url: string
}

interface AnalyzeOk {
  found: true
  creator_name: string
  posts: ScrapedPost[]
  total_posts: number
  sample_html_first_post: string | null
  source_url: string
}

interface AnalyzeFail {
  found: false
  reason: 'invalid_url' | 'no_sitemap' | 'no_posts' | 'blocked' | 'timeout'
  message: string
}

function normalizeUrl(input: string): URL | null {
  try {
    let raw = input.trim()
    if (!raw) return null
    if (!/^https?:\/\//i.test(raw)) raw = `https://${raw}`
    const url = new URL(raw)
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return null

    // Anti-SSRF — bloquear IPs locales / privadas
    const host = url.hostname.toLowerCase()
    if (
      host === 'localhost' ||
      host === '127.0.0.1' ||
      host === '0.0.0.0' ||
      host === '::1' ||
      host.endsWith('.local') ||
      host.endsWith('.internal') ||
      /^10\./.test(host) ||
      /^192\.168\./.test(host) ||
      /^172\.(1[6-9]|2\d|3[0-1])\./.test(host) ||
      /^169\.254\./.test(host)
    ) {
      return null
    }

    // Limpiar trailing slash + forzar https
    url.protocol = 'https:'
    url.pathname = url.pathname.replace(/\/+$/, '') || '/'
    url.hash = ''
    url.search = ''
    return url
  } catch {
    return null
  }
}

async function fetchWithTimeout(url: string, init?: RequestInit): Promise<Response> {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS)
  try {
    return await fetch(url, {
      ...init,
      signal: ctrl.signal,
      headers: {
        'User-Agent': USER_AGENT,
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        ...(init?.headers ?? {}),
      },
    })
  } finally {
    clearTimeout(timer)
  }
}

function extractMeta(html: string, names: string[]): string | null {
  for (const name of names) {
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const patterns = [
      new RegExp(`<meta\\s+property=["']${escaped}["']\\s+content=["']([^"']+)["']`, 'i'),
      new RegExp(`<meta\\s+name=["']${escaped}["']\\s+content=["']([^"']+)["']`, 'i'),
      new RegExp(`<meta\\s+content=["']([^"']+)["']\\s+property=["']${escaped}["']`, 'i'),
      new RegExp(`<meta\\s+content=["']([^"']+)["']\\s+name=["']${escaped}["']`, 'i'),
    ]
    for (const re of patterns) {
      const m = html.match(re)
      if (m && m[1]) return decodeEntities(m[1].trim())
    }
  }
  return null
}

function extractTitle(html: string): string | null {
  const m = html.match(/<title[^>]*>([^<]+)<\/title>/i)
  if (m && m[1]) return decodeEntities(m[1].trim())
  return null
}

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, n) => {
      try { return String.fromCharCode(parseInt(n, 10)) } catch { return '' }
    })
}

function extractSitemapUrls(xml: string): string[] {
  const urls: string[] = []
  const re = /<loc>\s*([^<\s]+)\s*<\/loc>/g
  let m: RegExpExecArray | null
  while ((m = re.exec(xml)) !== null) {
    urls.push(m[1].trim())
  }
  return urls
}

function isPostUrl(url: string): boolean {
  try {
    const u = new URL(url)
    // Substack format: /p/SLUG
    return /\/p\/[a-z0-9\-]+/i.test(u.pathname)
  } catch {
    return false
  }
}

function slugFromUrl(url: string): string {
  try {
    const u = new URL(url)
    const parts = u.pathname.split('/').filter(Boolean)
    return (parts[parts.length - 1] ?? '').toLowerCase().slice(0, 120)
  } catch {
    return ''
  }
}

function creatorNameFromUrl(url: URL): string {
  const host = url.hostname.toLowerCase()
  if (host.endsWith('.substack.com')) {
    return host.replace('.substack.com', '')
  }
  return host
}

async function fetchSitemap(baseUrl: URL): Promise<string[]> {
  const candidates = [
    `${baseUrl.origin}/sitemap.xml`,
    `${baseUrl.origin}/sitemap_index.xml`,
  ]
  for (const sm of candidates) {
    try {
      const res = await fetchWithTimeout(sm)
      if (!res.ok) continue
      const xml = await res.text()
      const urls = extractSitemapUrls(xml)
      if (urls.length === 0) continue

      // Si es un índice (apunta a sub-sitemaps), expandimos uno nivel
      const isIndex = /<sitemapindex/i.test(xml)
      if (isIndex) {
        const expanded: string[] = []
        for (const childSm of urls.slice(0, 5)) {
          try {
            const r = await fetchWithTimeout(childSm)
            if (!r.ok) continue
            const childXml = await r.text()
            expanded.push(...extractSitemapUrls(childXml))
          } catch {
            // continuar con siguiente
          }
        }
        return expanded
      }
      return urls
    } catch {
      // probar siguiente candidato
    }
  }
  return []
}

async function fetchFeedXml(baseUrl: URL): Promise<string[]> {
  const candidates = [
    `${baseUrl.origin}/feed`,
    `${baseUrl.origin}/feed.xml`,
    `${baseUrl.origin}/rss`,
    `${baseUrl.origin}/rss.xml`,
  ]
  for (const feedUrl of candidates) {
    try {
      const res = await fetchWithTimeout(feedUrl)
      if (!res.ok) continue
      const xml = await res.text()
      const links: string[] = []
      const re = /<link[^>]*>([^<]+)<\/link>|<link[^>]*href=["']([^"']+)["']/gi
      let m: RegExpExecArray | null
      while ((m = re.exec(xml)) !== null) {
        const link = (m[1] ?? m[2] ?? '').trim()
        if (link && isPostUrl(link)) links.push(link)
      }
      if (links.length > 0) return links
    } catch {
      // probar siguiente
    }
  }
  return []
}

async function scrapePost(postUrl: string): Promise<ScrapedPost | null> {
  try {
    const res = await fetchWithTimeout(postUrl)
    if (!res.ok) return null
    const html = await res.text()

    const title =
      extractMeta(html, ['og:title', 'twitter:title']) ??
      extractTitle(html) ??
      'Sin título'

    const excerpt =
      extractMeta(html, ['og:description', 'twitter:description', 'description']) ?? ''

    const publishedAt =
      extractMeta(html, ['article:published_time', 'og:article:published_time']) ?? null

    return {
      title: title.replace(/\s*\|\s*[^|]+$/, '').slice(0, 300),
      excerpt: excerpt.slice(0, 500),
      slug: slugFromUrl(postUrl),
      published_at: publishedAt,
      original_url: postUrl,
    }
  } catch {
    return null
  }
}

async function scrapeFirstHtml(postUrl: string): Promise<string | null> {
  try {
    const res = await fetchWithTimeout(postUrl)
    if (!res.ok) return null
    const html = await res.text()
    // Sample limitado a 8KB para preview
    return html.slice(0, 8000)
  } catch {
    return null
  }
}

export async function POST(request: NextRequest) {
  // Rate limit anti-abuse: 5 req/min por IP
  const ip = getClientIp(request)
  const rl = await rateLimit({
    bucket: 'migrate-substack-analyze',
    key: ip,
    limit: 5,
    windowSec: 60,
  })
  if (!rl.ok) {
    return NextResponse.json(
      { found: false, reason: 'blocked', message: 'Demasiadas peticiones. Espera un minuto.' } satisfies AnalyzeFail,
      { status: 429 }
    )
  }

  let body: { substackUrl?: string } = {}
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { found: false, reason: 'invalid_url', message: 'JSON inválido.' } satisfies AnalyzeFail,
      { status: 400 }
    )
  }

  const url = normalizeUrl(body.substackUrl ?? '')
  if (!url) {
    return NextResponse.json(
      { found: false, reason: 'invalid_url', message: 'URL inválida o no permitida.' } satisfies AnalyzeFail,
      { status: 400 }
    )
  }

  // Cache hit
  const cacheKey = url.origin
  const cached = cache.get(cacheKey)
  if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
    return NextResponse.json(cached.payload, {
      headers: { 'Cache-Control': 'public, max-age=3600, s-maxage=3600' },
    })
  }

  // 1. Sitemap (preferido)
  let postUrls: string[] = []
  try {
    postUrls = await fetchSitemap(url)
  } catch {
    postUrls = []
  }

  // 2. Fallback feed RSS
  if (postUrls.length === 0) {
    try {
      postUrls = await fetchFeedXml(url)
    } catch {
      postUrls = []
    }
  }

  // Filtrar a URLs de post y deduplicar
  const filtered = Array.from(new Set(postUrls.filter(isPostUrl)))

  if (filtered.length === 0) {
    const fail: AnalyzeFail = {
      found: false,
      reason: 'no_posts',
      message: 'No encontramos posts públicos en este Substack. Verifica la URL o súbelos manualmente.',
    }
    return NextResponse.json(fail, { status: 200 })
  }

  // Limitar a MAX_POSTS
  const toScrape = filtered.slice(0, MAX_POSTS)

  // Scraping en paralelo con límite de concurrencia (lotes de 6)
  const posts: ScrapedPost[] = []
  const BATCH = 6
  for (let i = 0; i < toScrape.length; i += BATCH) {
    const batch = toScrape.slice(i, i + BATCH)
    const results = await Promise.all(batch.map(scrapePost))
    for (const r of results) {
      if (r) posts.push(r)
    }
  }

  // Ordenar por fecha desc cuando exista
  posts.sort((a, b) => {
    if (!a.published_at && !b.published_at) return 0
    if (!a.published_at) return 1
    if (!b.published_at) return -1
    return b.published_at.localeCompare(a.published_at)
  })

  // Sample HTML del primer post (para validación manual del usuario)
  const sampleHtml = posts[0] ? await scrapeFirstHtml(posts[0].original_url) : null

  const payload: AnalyzeOk = {
    found: true,
    creator_name: creatorNameFromUrl(url),
    posts,
    total_posts: filtered.length,
    sample_html_first_post: sampleHtml,
    source_url: url.origin,
  }

  cache.set(cacheKey, { ts: Date.now(), payload })

  return NextResponse.json(payload, {
    headers: { 'Cache-Control': 'public, max-age=3600, s-maxage=3600' },
  })
}
