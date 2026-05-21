// Pixel 1x1 transparente para email open tracking.
// GET ?sub_id=&stage= → registra opened_at en sala_onboarding_log y devuelve PNG.
// Idempotente: solo se setea la primera vez.

import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

// PNG transparente 1x1 (43 bytes)
const PIXEL_BASE64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
const PIXEL_BYTES = Buffer.from(PIXEL_BASE64, 'base64')

const VALID_STAGES = new Set([
  'welcome',
  'tips_day_3',
  'survey_day_7',
  'viral_day_14',
  'nps_day_30',
])
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

async function markOpened(subscriptionId: string, stage: string): Promise<void> {
  if (!UUID_RE.test(subscriptionId)) return
  if (!VALID_STAGES.has(stage)) return

  let supabase
  try {
    supabase = createServiceClient()
  } catch {
    return
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any

  try {
    const { data: existing } = await db
      .from('sala_onboarding_log')
      .select('id, opened_at')
      .eq('subscription_id', subscriptionId)
      .eq('stage', stage)
      .maybeSingle()

    if (!existing || existing.opened_at) return

    await db
      .from('sala_onboarding_log')
      .update({ opened_at: new Date().toISOString() })
      .eq('id', existing.id)
  } catch (err) {
    console.warn('[onboarding/pixel] update failed (non-fatal):', (err as Error).message)
  }
}

export async function GET(request: NextRequest) {
  const u = new URL(request.url)
  const subscriptionId = u.searchParams.get('sub_id') ?? ''
  const stage = u.searchParams.get('stage') ?? ''

  // Disparar update sin bloquear la respuesta del pixel.
  markOpened(subscriptionId, stage).catch(() => undefined)

  return new NextResponse(new Uint8Array(PIXEL_BYTES), {
    status: 200,
    headers: {
      'Content-Type': 'image/png',
      'Content-Length': String(PIXEL_BYTES.length),
      'Cache-Control': 'no-store, no-cache, must-revalidate, private',
      Pragma: 'no-cache',
    },
  })
}
