import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { COMPETITORS } from '@/data/competitors'
import { GUIDES } from '@/data/seo-guides'

export const runtime = 'nodejs'
export const maxDuration = 60

const INDEXNOW_FALLBACK_KEY = 'nebbuler-indexnow-2026'
const BASE_URL = 'https://nebbuler.com'
const SITEMAP_URL = `${BASE_URL}/sitemap.xml`

// URLs estáticas hardcoded + páginas pillar + comparativas + guías
const STATIC_URLS: string[] = [
  BASE_URL,
  `${BASE_URL}/monetizar`,
  `${BASE_URL}/comparar`,
  `${BASE_URL}/para-creadores`,
  `${BASE_URL}/precios`,
  `${BASE_URL}/faq`,
  `${BASE_URL}/blog/plataforma-newsletter-de-pago-espanol`,
  `${BASE_URL}/blog/como-monetizar-conocimientos-economia`,
  `${BASE_URL}/blog/newsletter-de-pago-para-abogados`,
  `${BASE_URL}/blog/cobrar-analisis-financiero-online-latinoamerica`,
  `${BASE_URL}/blog/crear-newsletter-pago-sin-conocimientos-tecnicos`,
  `${BASE_URL}/tendencia`,
  // Comparativas /vs/*
  ...COMPETITORS.map((c) => `${BASE_URL}/vs/${c.slug}`),
  // Guías profesionales
  ...GUIDES.map((g) => `${BASE_URL}/guia/${g.slug}`),
]

// ---------------------------------------------------------------------------
// Obtener las últimas 20 páginas generadas de Supabase
// ---------------------------------------------------------------------------
async function getDynamicUrls(): Promise<string[]> {
  try {
    const supabase = createServiceClient()
    const { data, error } = await supabase
      .from('generated_pages')
      .select('slug')
      .order('created_at', { ascending: false })
      .limit(20)

    if (error) {
      console.warn('[index-new-pages] Error obteniendo generated_pages:', error.message)
      return []
    }

    return (data ?? [])
      .filter((row: { slug?: string }) => !!row.slug)
      .map((row: { slug: string }) => `${BASE_URL}/tendencia/${row.slug}`)
  } catch (err) {
    console.warn('[index-new-pages] Excepción obteniendo generated_pages:', err)
    return []
  }
}

// ---------------------------------------------------------------------------
// Enviar URLs a IndexNow (Bing)
// ---------------------------------------------------------------------------
async function submitIndexNow(urls: string[]): Promise<{ ok: boolean; status?: number; error?: string }> {
  const key = process.env.BING_INDEXNOW_KEY ?? INDEXNOW_FALLBACK_KEY
  const host = 'nebbuler.com'
  const keyLocation = `${BASE_URL}/${INDEXNOW_FALLBACK_KEY}.txt`

  const body = {
    host,
    key,
    keyLocation,
    urlList: urls,
  }

  try {
    const res = await fetch('https://www.bing.com/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(body),
    })
    return { ok: res.status < 300, status: res.status }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return { ok: false, error: msg }
  }
}

// ---------------------------------------------------------------------------
// Ping al sitemap de Google
// ---------------------------------------------------------------------------
async function pingGoogleSitemap(): Promise<{ ok: boolean; status?: number; error?: string }> {
  try {
    const url = `https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`
    const res = await fetch(url, { method: 'GET' })
    return { ok: res.status < 400, status: res.status }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return { ok: false, error: msg }
  }
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------
export async function GET(req: Request) {
  const authHeader = req.headers.get('Authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  // Construir lista de URLs
  const dynamicUrls = await getDynamicUrls()
  const allUrls = [...new Set([...STATIC_URLS, ...dynamicUrls])]

  // Enviar en paralelo a IndexNow y Google
  const [indexNowResult, googleResult] = await Promise.all([
    submitIndexNow(allUrls),
    pingGoogleSitemap(),
  ])

  const ok = indexNowResult.ok || googleResult.ok

  return NextResponse.json(
    {
      ok,
      urlsSubmitted: allUrls.length,
      urls: allUrls,
      indexNow: indexNowResult,
      googleSitemap: googleResult,
      submittedAt: new Date().toISOString(),
    },
    { status: ok ? 200 : 500 }
  )
}
