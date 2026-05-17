import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const maxDuration = 60

/**
 * Cron diario que refresca access_tokens MP próximos a expirar.
 *
 * Fix I5: sin esto, cuando el access_token de un creador expira (los de MP
 * duran 180 días), todas sus suscripciones quedan zombi: MP cobra pero
 * nuestro webhook no puede consultar el estado del preapproval.
 *
 * Estrategia: refresca cualquier token con < 14 días para expirar.
 * Best-effort: si MP rechaza el refresh, marca el token como expirado para
 * que el flujo OAuth re-conexión se dispare en el dashboard.
 */
export async function GET(req: Request) {
  const authHeader = req.headers.get('Authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const APP_ID = process.env.MP_APP_ID
  const CLIENT_SECRET = process.env.MP_CLIENT_SECRET
  if (!APP_ID || !CLIENT_SECRET) {
    return NextResponse.json({ error: 'MP credentials missing' }, { status: 500 })
  }

  const supabase = createServiceClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any

  // Threshold: tokens que expiran en los próximos 14 días
  const cutoff = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()

  // C10: refresh tokens contra sala_creator_secrets (no sala_creators)
  const { data: secrets, error } = await db
    .from('sala_creator_secrets')
    .select('creator_id, mp_refresh_token, mp_token_expires_at')
    .not('mp_refresh_token', 'is', null)
    .or(`mp_token_expires_at.is.null,mp_token_expires_at.lt.${cutoff}`)
    .limit(50)

  if (error) {
    console.error('[cron/refresh-mp-tokens] query error:', error)
    return NextResponse.json({ error: 'Query error' }, { status: 500 })
  }

  const results: Array<{ creator_id: string; ok: boolean; detail?: string }> = []

  for (const s of secrets ?? []) {
    const row = s as {
      creator_id: string
      mp_refresh_token: string | null
      mp_token_expires_at: string | null
    }
    if (!row.mp_refresh_token) continue

    try {
      const res = await fetch('https://api.mercadopago.com/oauth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id:     APP_ID,
          client_secret: CLIENT_SECRET,
          refresh_token: row.mp_refresh_token,
          grant_type:    'refresh_token',
        }),
      })

      if (!res.ok) {
        // Token revocado/expirado → borrar para forzar re-OAuth
        await db
          .from('sala_creator_secrets')
          .delete()
          .eq('creator_id', row.creator_id)
        results.push({ creator_id: row.creator_id, ok: false, detail: `refresh failed ${res.status}` })
        continue
      }

      const data = (await res.json()) as {
        access_token: string
        refresh_token: string
        expires_in: number
      }

      const expiresAt = new Date(Date.now() + data.expires_in * 1000).toISOString()
      await db
        .from('sala_creator_secrets')
        .update({
          mp_access_token:     data.access_token,
          mp_refresh_token:    data.refresh_token,
          mp_token_expires_at: expiresAt,
        })
        .eq('creator_id', row.creator_id)

      results.push({ creator_id: row.creator_id, ok: true })
    } catch (err) {
      results.push({
        creator_id: row.creator_id,
        ok: false,
        detail: err instanceof Error ? err.message.slice(0, 80) : 'unknown',
      })
    }
  }

  const okCount = results.filter((r) => r.ok).length
  const failCount = results.length - okCount
  return NextResponse.json({
    ok: failCount === 0,
    refreshed: okCount,
    failed: failCount,
    results,
  })
}
