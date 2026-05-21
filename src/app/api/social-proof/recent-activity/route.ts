// Endpoint público de social proof real-time.
// Devuelve los últimos 20 eventos anonimizados (creadores, suscripciones, VIP)
// de las últimas 24h. Cache CDN agresivo (30s) para limitar carga a Supabase.
//
// Privacy: jamás se exponen emails, apellidos completos, UUIDs ni precios.

import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { rateLimit } from '@/lib/rateLimit'
import { anonymizeName, countryToFlag, countryToName, timestampToAge } from '@/lib/social-proof/anonymize'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type EventType = 'new_creator' | 'new_subscription' | 'vip_activated'

type ActivityEvent = {
  type: EventType
  actor_initial: string
  country_flag?: string
  country_name?: string
  target?: string
  target_slug?: string
  timestamp: string
  age_text: string
}

type CreatorRow = {
  created_at: string
  name: string | null
  slug: string | null
  user_id: string | null
  sala_profiles: { full_name: string | null } | { full_name: string | null }[] | null
}

type SubscriptionRow = {
  created_at: string
  subscriber_id: string | null
  sala_profiles: { full_name: string | null } | { full_name: string | null }[] | null
  sala_creators: { name: string | null; slug: string | null } | { name: string | null; slug: string | null }[] | null
}

type RedemptionRow = {
  redeemed_at: string
  redeemed_by: string | null
  sala_profiles: { full_name: string | null } | { full_name: string | null }[] | null
}

function flattenJoin<T>(value: T | T[] | null | undefined): T | null {
  if (!value) return null
  if (Array.isArray(value)) return value[0] ?? null
  return value
}

export async function GET(request: Request) {
  // Rate limit por IP — generoso porque es público y cacheado por CDN.
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  const rl = rateLimit(`social-proof:${ip}`, 60, 60_000) // 60 req/min por IP
  if (!rl.allowed) {
    return NextResponse.json(
      { events: [], error: 'rate_limited' },
      {
        status: 429,
        headers: {
          'Retry-After': String(rl.retryAfter),
          'Cache-Control': 'no-store',
        },
      }
    )
  }

  try {
    const supabase = createServiceClient()
    const sinceIso = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

    const [creatorsRes, subsRes, redemptionsRes] = await Promise.all([
      supabase
        .from('sala_creators')
        .select('created_at, name, slug, user_id, sala_profiles!user_id(full_name)')
        .gte('created_at', sinceIso)
        .order('created_at', { ascending: false })
        .limit(10),
      supabase
        .from('sala_subscriptions')
        .select(
          'created_at, subscriber_id, sala_profiles!subscriber_id(full_name), sala_creators!creator_id(name, slug)'
        )
        .eq('status', 'active')
        .gte('created_at', sinceIso)
        .order('created_at', { ascending: false })
        .limit(10),
      supabase
        .from('sala_invite_redemptions')
        .select('redeemed_at, redeemed_by, sala_profiles!redeemed_by(full_name)')
        .gte('redeemed_at', sinceIso)
        .order('redeemed_at', { ascending: false })
        .limit(10),
    ])

    const events: ActivityEvent[] = []

    if (!creatorsRes.error && creatorsRes.data) {
      for (const row of creatorsRes.data as unknown as CreatorRow[]) {
        const profile = flattenJoin(row.sala_profiles)
        const displayName = anonymizeName(profile?.full_name ?? row.name ?? null)
        events.push({
          type: 'new_creator',
          actor_initial: displayName,
          timestamp: row.created_at,
          age_text: timestampToAge(row.created_at),
          target: row.name ?? undefined,
          target_slug: row.slug ?? undefined,
        })
      }
    }

    if (!subsRes.error && subsRes.data) {
      for (const row of subsRes.data as unknown as SubscriptionRow[]) {
        const profile = flattenJoin(row.sala_profiles)
        const creator = flattenJoin(row.sala_creators)
        events.push({
          type: 'new_subscription',
          actor_initial: anonymizeName(profile?.full_name ?? null),
          timestamp: row.created_at,
          age_text: timestampToAge(row.created_at),
          target: creator?.name ?? undefined,
          target_slug: creator?.slug ?? undefined,
        })
      }
    }

    if (!redemptionsRes.error && redemptionsRes.data) {
      for (const row of redemptionsRes.data as unknown as RedemptionRow[]) {
        const profile = flattenJoin(row.sala_profiles)
        events.push({
          type: 'vip_activated',
          actor_initial: anonymizeName(profile?.full_name ?? null),
          timestamp: row.redeemed_at,
          age_text: timestampToAge(row.redeemed_at),
        })
      }
    }

    // El esquema actual no tiene `country` en sala_profiles —
    // las banderas/nombres de país se omiten automáticamente.
    // Cuando se añada la columna, basta con poblarlos aquí.
    void countryToFlag
    void countryToName

    events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    const trimmed = events.slice(0, 20)

    return NextResponse.json(
      { events: trimmed, count: trimmed.length },
      {
        headers: {
          'Cache-Control': 'public, max-age=30, s-maxage=30, stale-while-revalidate=60',
        },
      }
    )
  } catch (err) {
    console.error('[social-proof] recent-activity error', err)
    return NextResponse.json(
      { events: [], error: 'internal_error' },
      {
        status: 500,
        headers: { 'Cache-Control': 'no-store' },
      }
    )
  }
}
