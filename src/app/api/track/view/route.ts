import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// Rate-limit in-memory por IP+postId (1 vista por minuto)
const recentViews = new Map<string, number>()
function shouldThrottle(key: string): boolean {
  const now = Date.now()
  const last = recentViews.get(key) ?? 0
  if (now - last < 60_000) return true
  recentViews.set(key, now)
  // Limpieza periódica del Map (evita memory leak)
  if (recentViews.size > 5000) {
    const cutoff = now - 60_000
    for (const [k, t] of recentViews) if (t < cutoff) recentViews.delete(k)
  }
  return false
}

export async function POST(request: NextRequest) {
  try {
    const { postId } = await request.json()

    if (typeof postId !== 'string') {
      return NextResponse.json({ ok: false }, { status: 400 })
    }

    // IDs mock (posts del fallback estático en creators.ts) — no se trackean
    // pero respondemos OK para no llenar la consola del cliente de errores
    if (!UUID_RE.test(postId)) {
      return NextResponse.json({ ok: true, skipped: 'mock-post' })
    }

    // Rate-limit por IP + postId
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      ?? request.headers.get('x-real-ip')
      ?? 'unknown'
    const key = `${ip}:${postId}`
    if (shouldThrottle(key)) {
      return NextResponse.json({ ok: true, throttled: true })
    }

    const supabase = createServiceClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).rpc('increment_post_view', { post_id: postId })

    return NextResponse.json(
      { ok: true },
      { headers: { 'Cache-Control': 'no-store, max-age=0' } }
    )
  } catch (err) {
    console.error('[track/view] error:', err)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
