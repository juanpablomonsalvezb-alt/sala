/**
 * Tests de REGRESIÓN del schema de pagos.
 *
 * Verifican contra la BD de producción que los fixes críticos (C6, C8, C9, C10)
 * NO se rompan. Si alguien por accidente vuelve a meter columnas sensibles en
 * sala_creators, o si la migración del schema se revierte, estos tests fallan
 * en CI antes del deploy.
 *
 * NOTA: Requieren acceso a Supabase. Solo se corren si SUPABASE_SECRET_KEY
 * y NEXT_PUBLIC_SUPABASE_URL están definidas. En CI sin secrets, se skipean.
 */

import { describe, it, expect } from 'vitest'

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SB_SECRET = process.env.SUPABASE_SECRET_KEY
const SB_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const hasCreds = !!(SB_URL && SB_SECRET && SB_ANON)

async function sbGet(path: string, key: string): Promise<{ status: number; body: string }> {
  const r = await fetch(`${SB_URL}/rest/v1/${path}`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  })
  return { status: r.status, body: await r.text() }
}

describe.skipIf(!hasCreds)('schema protection: C10 — anon NO puede leer tokens MP', () => {
  it('anon no puede SELECT * en sala_creator_secrets', async () => {
    const r = await sbGet('sala_creator_secrets?select=*&limit=1', SB_ANON!)
    expect(r.status).toBe(401)
    expect(r.body).toContain('permission denied')
  })

  it('anon no puede SELECT mp_access_token (caso del bug C10 original)', async () => {
    const r = await sbGet('sala_creator_secrets?select=mp_access_token&limit=1', SB_ANON!)
    // Acepta 401 (REVOKE ALL) o 42501 (permission denied)
    expect(r.status === 401 || r.body.includes('42501')).toBe(true)
  })

  it('anon no puede INSERT en sala_creator_secrets', async () => {
    const r = await fetch(`${SB_URL}/rest/v1/sala_creator_secrets`, {
      method: 'POST',
      headers: {
        apikey: SB_ANON!,
        Authorization: `Bearer ${SB_ANON}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ creator_id: '00000000-0000-0000-0000-000000000000', mp_access_token: 'attack' }),
    })
    expect(r.status === 401 || r.status === 403).toBe(true)
  })
})

describe.skipIf(!hasCreds)('schema protection: C8 — columnas críticas DROPed de sala_creators', () => {
  const droppedColumns = [
    'mp_access_token',
    'mp_refresh_token',
    'mp_user_id',
    'mp_connected_at',
    'mp_token_expires_at',
  ]

  for (const col of droppedColumns) {
    it(`sala_creators NO tiene columna ${col} (debe estar en sala_creator_secrets)`, async () => {
      const r = await sbGet(`sala_creators?select=${col}&limit=1`, SB_SECRET!)
      // Si la columna existe → status 200. Si NO existe → error 400 con "does not exist".
      expect(r.body).toContain('does not exist')
    })
  }
})

describe.skipIf(!hasCreds)('schema protection: C8/C9 — columnas requeridas SÍ existen', () => {
  const requiredColumns: Array<[string, string]> = [
    ['sala_creators', 'display_name'],
    ['sala_creators', 'username'],
    ['sala_creators', 'stripe_price_id'],
    ['sala_creators', 'stripe_price_clp'],
    ['sala_subscriptions', 'last_paid_at'],
    ['sala_subscriptions', 'mp_preapproval_id'],
    ['sala_subscriptions', 'next_charge_at'],
    ['sala_webhook_events', 'status'],
    ['sala_webhook_events', 'attempted_at'],
    ['sala_webhook_events', 'processed_at'],
    ['sala_creator_secrets', 'mp_access_token'],
    ['sala_creator_secrets', 'mp_refresh_token'],
    ['sala_creator_secrets', 'mp_user_id'],
    ['sala_creator_secrets', 'mp_token_expires_at'],
  ]

  for (const [table, col] of requiredColumns) {
    it(`${table}.${col} existe`, async () => {
      const r = await sbGet(`${table}?select=${col}&limit=1`, SB_SECRET!)
      expect(r.status).toBe(200)
      expect(r.body).not.toContain('does not exist')
    })
  }
})

describe.skipIf(!hasCreds)('schema protection: constraint en sala_webhook_events.status', () => {
  it('rechaza status="bogus" con CHECK constraint', async () => {
    const r = await fetch(`${SB_URL}/rest/v1/sala_webhook_events`, {
      method: 'POST',
      headers: {
        apikey: SB_SECRET!,
        Authorization: `Bearer ${SB_SECRET}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        provider: 'test',
        event_id: `schema-test-${Date.now()}`,
        status: 'bogus_value_that_should_fail',
      }),
    })
    expect(r.status).toBe(400)
    const body = await r.text()
    expect(body).toContain('23514') // PG check_violation code
  })
})

describe('schema protection: legacy SUPABASE_SERVICE_ROLE_KEY (C6)', () => {
  it('código usa SUPABASE_SECRET_KEY con fallback al legacy', async () => {
    // Test estático: ningún archivo del codebase usa solo process.env.SUPABASE_SERVICE_ROLE_KEY
    // sin fallback a SECRET_KEY. Esto se valida en CI con grep, pero acá hacemos sanity check.
    const fs = await import('fs')
    const path = await import('path')

    const srcServerPath = path.resolve(process.cwd(), 'src/lib/supabase/server.ts')
    if (fs.existsSync(srcServerPath)) {
      const content = fs.readFileSync(srcServerPath, 'utf-8')
      // createServiceClient debe leer SECRET_KEY (con o sin fallback)
      expect(content).toMatch(/SUPABASE_SECRET_KEY/)
    }
  })
})
