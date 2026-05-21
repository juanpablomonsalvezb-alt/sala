// POST /api/track/quote — registra cada conversión de cita a imagen compartible
// en sala_quote_shares. Alimenta el dashboard "Quotes virales" del creador.
//
// Body JSON:
//   { creatorId, postId, text, channel, aspectRatio }
//
// Validaciones:
//   - creatorId, postId: UUIDs válidos
//   - text: 20-280 chars (se almacena solo preview de 100 chars)
//   - channel: enum compatible con sala_quote_shares.channel
//   - aspectRatio: '1:1' | '9:16'
//
// Rate-limit in-memory por IP+postId (mismo patrón que /api/track/view): 1 inserción
// por 30s para evitar spam de tracking si el usuario abre/cierra el modal varias veces.

import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { createHash } from 'node:crypto'

export const runtime = 'nodejs'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const VALID_CHANNELS = new Set([
  'ig-story',
  'ig-square',
  'whatsapp',
  'twitter',
  'linkedin',
  'copy',
  'download',
])
const VALID_ASPECTS = new Set(['1:1', '9:16'])
const MIN_TEXT = 20
const MAX_TEXT = 280

const recent = new Map<string, number>()
function shouldThrottle(key: string): boolean {
  const now = Date.now()
  const last = recent.get(key) ?? 0
  if (now - last < 30_000) return true
  recent.set(key, now)
  if (recent.size > 5000) {
    const cutoff = now - 60_000
    for (const [k, t] of recent) if (t < cutoff) recent.delete(k)
  }
  return false
}

function hashIp(ip: string): string {
  return createHash('sha256').update(ip + (process.env.IP_HASH_SALT ?? 'nebbuler')).digest('hex').slice(0, 32)
}

interface TrackPayload {
  creatorId?: unknown
  postId?: unknown
  text?: unknown
  channel?: unknown
  aspectRatio?: unknown
}

export async function POST(request: NextRequest) {
  let payload: TrackPayload
  try {
    payload = (await request.json()) as TrackPayload
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 })
  }

  const creatorId = typeof payload.creatorId === 'string' ? payload.creatorId : ''
  const postId = typeof payload.postId === 'string' ? payload.postId : ''
  const text = typeof payload.text === 'string' ? payload.text : ''
  const channel = typeof payload.channel === 'string' ? payload.channel : ''
  const aspectRatio = typeof payload.aspectRatio === 'string' ? payload.aspectRatio : '1:1'

  // Si los IDs son mock (posts del fallback estático), respondemos OK silenciosamente
  if (!UUID_RE.test(creatorId) || !UUID_RE.test(postId)) {
    return NextResponse.json({ ok: true, skipped: 'mock-ids' })
  }
  if (text.length < MIN_TEXT || text.length > MAX_TEXT) {
    return NextResponse.json({ ok: false, error: 'invalid_text' }, { status: 400 })
  }
  if (!VALID_CHANNELS.has(channel)) {
    return NextResponse.json({ ok: false, error: 'invalid_channel' }, { status: 400 })
  }
  if (!VALID_ASPECTS.has(aspectRatio)) {
    return NextResponse.json({ ok: false, error: 'invalid_aspect' }, { status: 400 })
  }

  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown'
  const ua = (request.headers.get('user-agent') ?? '').slice(0, 300)
  const country = request.headers.get('x-vercel-ip-country') ?? null

  const throttleKey = `${ip}:${postId}:${channel}`
  if (shouldThrottle(throttleKey)) {
    return NextResponse.json({ ok: true, throttled: true })
  }

  try {
    const supabase = createServiceClient()
    const preview = text.slice(0, 100)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('sala_quote_shares')
      .insert({
        creator_id: creatorId,
        post_id: postId,
        text_preview: preview,
        text_length: text.length,
        channel,
        aspect_ratio: aspectRatio,
        country_code: country,
        user_agent: ua,
        ip_hash: hashIp(ip),
      })

    if (error) {
      console.error('[track/quote] insert error:', error.message)
      // No filtramos detalles al cliente
      return NextResponse.json({ ok: false }, { status: 500 })
    }

    return NextResponse.json(
      { ok: true },
      { headers: { 'Cache-Control': 'no-store, max-age=0' } },
    )
  } catch (err) {
    console.error('[track/quote] error:', err)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
