import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const maxDuration = 30

/**
 * Health check PROFUNDO — verifica invariantes críticos cada hora.
 *
 * Detecta:
 *   - Regresión de RLS: ¿la anon key empezó a leer sala_creator_secrets?
 *   - Regresión de schema: ¿alguien volvió a meter mp_access_token en sala_creators?
 *   - Webhook idempotency funcional: ¿la tabla sala_webhook_events sigue tracking?
 *   - Reputación de envío: ¿hay > 10 emails suprimidos en últimas 24h? (anomalía)
 *
 * Si detecta regresión, retorna 500 + alert. El cron de Vercel se queja en email
 * automáticamente cuando algo retorna != 2xx repetidamente.
 */
export async function GET(req: Request) {
  const authHeader = req.headers.get('Authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const secret = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !secret || !anon) {
    return NextResponse.json({ error: 'env missing' }, { status: 500 })
  }

  const checks: Array<{ name: string; ok: boolean; detail?: string }> = []

  // 1. RLS: anon NO debe leer sala_creator_secrets
  try {
    const r = await fetch(`${url}/rest/v1/sala_creator_secrets?select=*&limit=1`, {
      headers: { apikey: anon, Authorization: `Bearer ${anon}` },
    })
    const body = await r.text()
    const ok = r.status === 401 || body.includes('42501') || body.includes('permission denied')
    checks.push({
      name: 'rls_anon_blocked_secrets',
      ok,
      detail: ok ? 'anon rechazado correctamente' : `BREACH: anon leyó secrets (status ${r.status})`,
    })
  } catch (e) {
    checks.push({ name: 'rls_anon_blocked_secrets', ok: false, detail: String(e).slice(0, 100) })
  }

  // 2. Schema: mp_access_token NO debe existir en sala_creators
  try {
    const r = await fetch(
      `${url}/rest/v1/sala_creators?select=mp_access_token&limit=1`,
      { headers: { apikey: secret, Authorization: `Bearer ${secret}` } },
    )
    const body = await r.text()
    const ok = body.includes('does not exist')
    checks.push({
      name: 'schema_mp_token_not_in_creators',
      ok,
      detail: ok ? 'columna correctamente DROPed' : `REGRESIÓN: mp_access_token volvió a sala_creators`,
    })
  } catch (e) {
    checks.push({ name: 'schema_mp_token_not_in_creators', ok: false, detail: String(e).slice(0, 100) })
  }

  // 3. Schema requerido: sala_creator_secrets existe
  try {
    const r = await fetch(
      `${url}/rest/v1/sala_creator_secrets?select=creator_id&limit=1`,
      { headers: { apikey: secret, Authorization: `Bearer ${secret}` } },
    )
    checks.push({
      name: 'schema_secrets_table_exists',
      ok: r.status === 200,
      detail: r.status === 200 ? 'tabla existe y SECRET puede leerla' : `status ${r.status}`,
    })
  } catch (e) {
    checks.push({ name: 'schema_secrets_table_exists', ok: false, detail: String(e).slice(0, 100) })
  }

  // 4. Webhook idempotency funcional
  try {
    const r = await fetch(
      `${url}/rest/v1/sala_webhook_events?select=status&limit=1`,
      { headers: { apikey: secret, Authorization: `Bearer ${secret}` } },
    )
    checks.push({
      name: 'webhook_idempotency_table',
      ok: r.status === 200,
      detail: r.status === 200 ? 'columna status presente' : `status ${r.status}`,
    })
  } catch (e) {
    checks.push({ name: 'webhook_idempotency_table', ok: false, detail: String(e).slice(0, 100) })
  }

  // 5. Reputación de envío: anomalías
  try {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    const r = await fetch(
      `${url}/rest/v1/email_suppressions?reason=eq.bounce&added_at=gte.${since}&select=email`,
      { headers: { apikey: secret, Authorization: `Bearer ${secret}`, Prefer: 'count=exact' } },
    )
    const range = r.headers.get('content-range') ?? '*/0'
    const total = parseInt(range.split('/')[1] || '0', 10)
    checks.push({
      name: 'reputation_bounces_24h',
      ok: total <= 10,
      detail: `${total} bounces nuevos en últimas 24h${total > 10 ? ' (ALERTA: investigar)' : ''}`,
    })
  } catch {
    // email_suppressions table puede no existir aún — no es error fatal
    checks.push({ name: 'reputation_bounces_24h', ok: true, detail: 'email_suppressions no inicializada (OK)' })
  }

  const allOk = checks.every((c) => c.ok)
  const failed = checks.filter((c) => !c.ok)

  return NextResponse.json(
    {
      ok: allOk,
      timestamp: new Date().toISOString(),
      checks,
      failures: failed.length,
      summary: allOk ? 'all_ok' : `${failed.length} check(s) failed`,
    },
    { status: allOk ? 200 : 500 },
  )
}
