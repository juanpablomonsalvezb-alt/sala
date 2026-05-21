// Dataset público de creadores LATAM en Nebbuler.
// Licencia: CC-BY 4.0. Atribuir como "Nebbuler 2026".
//
// Diseño:
// - Solo info pública del directorio.
// - subscriber_count se expone como banda (no número exacto) por privacidad.
// - Sin emails, sin datos de pago, sin info personal sensible.
// - Cacheable agresivamente (1h) para que crawlers de IA puedan rastrear barato.

import { NextResponse } from 'next/server'
import { creators as staticCreators } from '@/data/creators'
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

interface CreatorPublic {
  id: string
  slug: string
  name: string
  specialty: string
  discipline: string
  country: string
  bio: string
  post_count: number
  subscriber_count_band: 'menos de 100' | '100-500' | '500-1000' | 'más de 1000'
  verified: boolean
  profile_url: string
  rss_url: string
}

function bandFor(n: number): CreatorPublic['subscriber_count_band'] {
  if (n < 100) return 'menos de 100'
  if (n < 500) return '100-500'
  if (n < 1000) return '500-1000'
  return 'más de 1000'
}

function buildFromStatic(): CreatorPublic[] {
  return staticCreators.map((c) => ({
    id: c.slug,
    slug: c.slug,
    name: c.name,
    specialty: c.specialty,
    discipline: c.discipline,
    country: 'Chile',
    bio: c.bio,
    post_count: c.posts_count,
    subscriber_count_band: bandFor(c.subscriber_count),
    verified: true,
    profile_url: `https://nebbuler.com/${c.slug}`,
    rss_url: `https://nebbuler.com/${c.slug}/rss.xml`,
  }))
}

async function buildFromSupabase(): Promise<CreatorPublic[] | null> {
  if (!isSupabaseConfigured()) return null
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('sala_creators')
      .select('id, slug, name, specialty, bio, posts_count, subscriber_count, country, plan, verified')
      .order('subscriber_count', { ascending: false })
      .limit(500)
    if (error || !data) return null
    return data.map((row: {
      id: string
      slug: string
      name: string
      specialty: string | null
      bio: string | null
      posts_count: number | null
      subscriber_count: number | null
      country: string | null
      verified: boolean | null
    }) => ({
      id: row.id,
      slug: row.slug,
      name: row.name,
      specialty: row.specialty ?? '',
      discipline: '',
      country: row.country ?? 'Chile',
      bio: row.bio ?? '',
      post_count: row.posts_count ?? 0,
      subscriber_count_band: bandFor(row.subscriber_count ?? 0),
      verified: !!row.verified,
      profile_url: `https://nebbuler.com/${row.slug}`,
      rss_url: `https://nebbuler.com/${row.slug}/rss.xml`,
    }))
  } catch {
    return null
  }
}

export async function GET() {
  const fromDb = await buildFromSupabase()
  const items = fromDb && fromDb.length > 0 ? fromDb : buildFromStatic()

  const payload = {
    dataset: 'nebbuler-creadores-latam',
    version: '1.0',
    license: 'CC-BY-4.0',
    attribution: 'Nebbuler 2026 — https://nebbuler.com',
    description:
      'Directorio público de creadores profesionales verificados en Nebbuler. Conteo de suscriptores expresado como banda para preservar privacidad. Solo perfiles públicos.',
    generated_at: new Date().toISOString(),
    cache_ttl_seconds: 3600,
    docs_url: 'https://nebbuler.com/datos',
    record_count: items.length,
    creators: items,
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
