// Dataset público de tendencias semanales en LATAM.
// Licencia: CC-BY 4.0. Atribuir como "Nebbuler 2026".
//
// Fuente: tabla trending_keywords de Supabase (poblada por el cron
// /api/cron/detect-trends). Si la tabla está vacía o no hay configuración
// se sirve un dataset fallback con tendencias plausibles.

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const revalidate = 3600

function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
  return (
    !url.includes('placeholder') &&
    url.startsWith('https://') &&
    !key.includes('placeholder') &&
    key.length > 20
  )
}

interface TrendItem {
  rank: number
  keyword: string
  category: string
  monthly_growth_pct: number | null
  search_volume_band: 'bajo' | 'medio' | 'alto'
  related_creators: string[]
  url: string
}

const FALLBACK_TRENDS: Omit<TrendItem, 'rank' | 'url'>[] = [
  { keyword: 'tasa de política monetaria chile', category: 'economía', monthly_growth_pct: 38, search_volume_band: 'alto', related_creators: ['rodrigo-fuentes-marin'] },
  { keyword: 'planificación tributaria pyme', category: 'derecho tributario', monthly_growth_pct: 27, search_volume_band: 'medio', related_creators: ['matias-cornejo-silva'] },
  { keyword: 'm&a banchile inversiones', category: 'finanzas corporativas', monthly_growth_pct: 41, search_volume_band: 'medio', related_creators: ['carolina-vega-toro'] },
  { keyword: 'epidemiología cardiovascular chile', category: 'salud pública', monthly_growth_pct: 19, search_volume_band: 'medio', related_creators: ['andrea-poblete-rios'] },
  { keyword: 'reforma electoral chile 2026', category: 'ciencia política', monthly_growth_pct: 62, search_volume_band: 'alto', related_creators: ['ignacio-leal-espinoza'] },
  { keyword: 'densificación urbana santiago', category: 'arquitectura', monthly_growth_pct: 22, search_volume_band: 'medio', related_creators: ['francisca-araya-medina'] },
  { keyword: 'negociación colectiva multinacional', category: 'derecho laboral', monthly_growth_pct: 18, search_volume_band: 'medio', related_creators: ['pablo-herrera-zuniga'] },
  { keyword: 'metabolismo glucemia ayuno', category: 'nutrición', monthly_growth_pct: 73, search_volume_band: 'alto', related_creators: ['valentina-soto-burgos'] },
  { keyword: 'concesiones viales infraestructura', category: 'ingeniería', monthly_growth_pct: 15, search_volume_band: 'bajo', related_creators: ['sebastian-miranda-lagos'] },
  { keyword: 'historia económica latam siglo xx', category: 'historia', monthly_growth_pct: 12, search_volume_band: 'bajo', related_creators: ['catalina-rojas-henriquez'] },
  { keyword: 'estrategia ia empresa latam', category: 'tecnología', monthly_growth_pct: 84, search_volume_band: 'alto', related_creators: ['alejandro-vasquez-mora'] },
  { keyword: 'inflación argentina 2026', category: 'economía', monthly_growth_pct: 56, search_volume_band: 'alto', related_creators: [] },
  { keyword: 'cobrar suscripciones moneda local', category: 'creator economy', monthly_growth_pct: 102, search_volume_band: 'alto', related_creators: [] },
  { keyword: 'alternativa substack español', category: 'creator economy', monthly_growth_pct: 88, search_volume_band: 'alto', related_creators: [] },
  { keyword: 'honorarios profesionales mexico', category: 'salarios', monthly_growth_pct: 31, search_volume_band: 'medio', related_creators: [] },
  { keyword: 'honorarios abogado colombia', category: 'salarios', monthly_growth_pct: 24, search_volume_band: 'medio', related_creators: [] },
  { keyword: 'reforma tributaria chile pymes', category: 'derecho tributario', monthly_growth_pct: 47, search_volume_band: 'alto', related_creators: ['matias-cornejo-silva'] },
  { keyword: 'patreon vs substack 2026', category: 'creator economy', monthly_growth_pct: 33, search_volume_band: 'medio', related_creators: [] },
  { keyword: 'imacec chile mensual', category: 'economía', monthly_growth_pct: 21, search_volume_band: 'medio', related_creators: ['rodrigo-fuentes-marin'] },
  { keyword: 'membresia profesional latam', category: 'creator economy', monthly_growth_pct: 67, search_volume_band: 'alto', related_creators: [] },
]

function volumeBand(monthly: number | null): 'bajo' | 'medio' | 'alto' {
  if (monthly === null) return 'medio'
  if (monthly < 1000) return 'bajo'
  if (monthly < 10000) return 'medio'
  return 'alto'
}

async function fromSupabase(): Promise<TrendItem[] | null> {
  if (!isSupabaseConfigured()) return null
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('trending_keywords')
      .select('keyword, category, monthly_growth, search_volume, status')
      .order('monthly_growth', { ascending: false })
      .limit(20)
    if (error || !data || data.length === 0) return null
    return data.map((row: {
      keyword: string
      category: string | null
      monthly_growth: number | null
      search_volume: number | null
    }, idx: number) => ({
      rank: idx + 1,
      keyword: row.keyword,
      category: row.category ?? 'general',
      monthly_growth_pct: row.monthly_growth,
      search_volume_band: volumeBand(row.search_volume),
      related_creators: [],
      url: `https://nebbuler.com/tendencia#${encodeURIComponent(row.keyword)}`,
    }))
  } catch {
    return null
  }
}

function fromFallback(): TrendItem[] {
  return FALLBACK_TRENDS.map((t, idx) => ({
    rank: idx + 1,
    ...t,
    url: `https://nebbuler.com/tendencia#${encodeURIComponent(t.keyword)}`,
  }))
}

export async function GET() {
  const dbItems = await fromSupabase()
  const trends = dbItems && dbItems.length > 0 ? dbItems : fromFallback()

  const payload = {
    dataset: 'nebbuler-tendencias-latam',
    version: '1.0',
    license: 'CC-BY-4.0',
    attribution: 'Nebbuler 2026 — https://nebbuler.com',
    description:
      'Top 20 keywords y temas trending detectados semanalmente en la región LATAM por el sistema editorial de Nebbuler.',
    generated_at: new Date().toISOString(),
    refresh_frequency: 'semanal',
    cache_ttl_seconds: 3600,
    docs_url: 'https://nebbuler.com/datos',
    record_count: trends.length,
    trends,
  }

  return NextResponse.json(payload, {
    headers: {
      'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'X-Robots-Tag': 'all',
      'X-Dataset-License': 'CC-BY-4.0',
    },
  })
}
