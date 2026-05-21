import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import fs from 'fs'
import path from 'path'

export const runtime = 'nodejs'
export const maxDuration = 10

interface CheckResult {
  ok: boolean
  latency_ms?: number
  error?: string
  tables?: string[]
  href?: string
  count?: number
}

interface HealthResponse {
  ok: boolean
  timestamp: string
  checks: {
    database: CheckResult
    supabase_auth: CheckResult
    resend_email: CheckResult
    mp_webhook_secret: CheckResult
    mp_access_token: CheckResult
    mp_app_credentials: CheckResult
    cron_secret: CheckResult
    social_tables: CheckResult
    payment_tables: CheckResult
    precios_cta: CheckResult
    pages_count: CheckResult
  }
}

async function checkDatabase(): Promise<CheckResult> {
  try {
    const supabase = createServiceClient()
    const start = Date.now()
    const { error } = await Promise.race([
      supabase.from('sala_creators').select('id').limit(1),
      new Promise<{ error: Error }>((_res, rej) =>
        setTimeout(() => rej(new Error('timeout')), 3000)
      ),
    ]) as { data?: unknown; error?: unknown }

    const latency_ms = Date.now() - start
    if (error) return { ok: false, latency_ms, error: (error as { message?: string })?.message ?? JSON.stringify(error) }
    return { ok: true, latency_ms }
  } catch (e) {
    return { ok: false, error: String(e) }
  }
}

async function checkSupabaseAuth(): Promise<CheckResult> {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !key) return { ok: false, error: 'Missing Supabase env vars' }
    return { ok: true }
  } catch (e) {
    return { ok: false, error: String(e) }
  }
}

function checkResend(): CheckResult {
  const key = process.env.RESEND_API_KEY
  if (!key) return { ok: false, error: 'RESEND_API_KEY no definida' }
  if (!key.startsWith('re_')) return { ok: false, error: 'RESEND_API_KEY no tiene formato válido (debe empezar con re_)' }
  return { ok: true }
}

function checkEnvVar(name: string): CheckResult {
  const val = process.env[name]
  if (!val || val.trim() === '') return { ok: false, error: `${name} no definida o vacía` }
  return { ok: true }
}

function checkMpAppCredentials(): CheckResult {
  const appId = process.env.MP_APP_ID
  const clientSecret = process.env.MP_CLIENT_SECRET
  const missingVars: string[] = []
  if (!appId || appId.trim() === '') missingVars.push('MP_APP_ID')
  if (!clientSecret || clientSecret.trim() === '') missingVars.push('MP_CLIENT_SECRET')
  if (missingVars.length > 0) return { ok: false, error: `Variables vacías: ${missingVars.join(', ')}` }
  return { ok: true }
}

async function checkSocialTables(): Promise<CheckResult> {
  try {
    const supabase = createServiceClient()
    const tables = ['social_images', 'social_opportunities', 'social_posted_content']
    const okTables: string[] = []
    const failedTables: string[] = []

    await Promise.all(
      tables.map(async (table) => {
        const { error } = await supabase.from(table as never).select('id').limit(1)
        if (error) failedTables.push(table)
        else okTables.push(table)
      })
    )

    if (failedTables.length > 0) {
      return { ok: false, tables: okTables, error: `Tablas no accesibles: ${failedTables.join(', ')}` }
    }
    return { ok: true, tables: okTables }
  } catch (e) {
    return { ok: false, error: String(e) }
  }
}

async function checkPaymentTables(): Promise<CheckResult> {
  try {
    const supabase = createServiceClient()
    const tables = ['sala_subscriptions', 'sala_creators', 'sala_profiles']
    const okTables: string[] = []
    const failedTables: string[] = []

    await Promise.all(
      tables.map(async (table) => {
        const { error } = await supabase.from(table as never).select('id').limit(1)
        if (error) failedTables.push(table)
        else okTables.push(table)
      })
    )

    if (failedTables.length > 0) {
      return { ok: false, tables: okTables, error: `Tablas no accesibles: ${failedTables.join(', ')}` }
    }
    return { ok: true, tables: okTables }
  } catch (e) {
    return { ok: false, error: String(e) }
  }
}

function checkPrecios(): CheckResult {
  try {
    const filePath = path.join(process.cwd(), 'src/app/precios/_components/PreciosClient.tsx')
    const content = fs.readFileSync(filePath, 'utf-8')

    // Buscar el ctaHref en el archivo
    const match = content.match(/ctaHref['":\s]+['"]([^'"]+)['"]/i)
    const href = match?.[1] ?? 'no encontrado'

    if (content.includes('/abrir')) {
      return { ok: false, href, error: 'El CTA de precios aún apunta a /abrir — debe apuntar a /registro o /entrar' }
    }
    return { ok: true, href }
  } catch (e) {
    return { ok: false, error: `No se pudo leer PreciosClient.tsx: ${String(e)}` }
  }
}

async function checkPagesCount(): Promise<CheckResult> {
  try {
    const supabase = createServiceClient()
    const { count, error } = await supabase
      .from('generated_pages' as never)
      .select('id', { count: 'exact', head: true })

    if (error) return { ok: false, error: (error as { message?: string })?.message ?? JSON.stringify(error) }
    const total = count ?? 0
    return { ok: true, count: total }
  } catch (e) {
    return { ok: false, error: String(e) }
  }
}

function hasAdminAuth(request: Request): boolean {
  const secret = process.env.CRON_SECRET
  if (!secret) return false
  const header = request.headers.get('authorization') ?? request.headers.get('Authorization') ?? ''
  if (!header.startsWith('Bearer ')) return false
  const provided = header.slice('Bearer '.length).trim()
  return provided.length === secret.length && provided === secret
}

async function isSuperadminSession(): Promise<boolean> {
  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return false
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase as any)
      .from('sala_profiles')
      .select('is_superadmin')
      .eq('id', user.id)
      .maybeSingle()
    return Boolean((data as { is_superadmin?: boolean } | null)?.is_superadmin)
  } catch {
    return false
  }
}

export async function GET(request: Request) {
  const isAdmin = hasAdminAuth(request) || (await isSuperadminSession())

  const [
    database,
    supabase_auth,
    social_tables,
    payment_tables,
    pages_count,
  ] = await Promise.all([
    checkDatabase(),
    checkSupabaseAuth(),
    checkSocialTables(),
    checkPaymentTables(),
    checkPagesCount(),
  ])

  const resend_email = checkResend()
  const mp_webhook_secret = checkEnvVar('MERCADOPAGO_WEBHOOK_SECRET')
  const mp_access_token = checkEnvVar('MERCADOPAGO_ACCESS_TOKEN')
  const mp_app_credentials = checkMpAppCredentials()
  const cron_secret = checkEnvVar('CRON_SECRET')
  const precios_cta = checkPrecios()

  // Críticos: database, mp_webhook_secret, mp_access_token, payment_tables
  const allOk =
    database.ok &&
    mp_webhook_secret.ok &&
    mp_access_token.ok &&
    payment_tables.ok

  // Respuesta pública minimalista (no expone schema interno ni env vars).
  // Solo {ok, timestamp}. Llamadas sin Bearer reciben este shape.
  if (!isAdmin) {
    return NextResponse.json(
      { ok: allOk, timestamp: new Date().toISOString() },
      {
        status: allOk ? 200 : 503,
        headers: { 'Cache-Control': 'no-store' },
      }
    )
  }

  // Respuesta detallada solo para llamadas autorizadas (cron, monitoreo
  // interno, superadmin). Incluye nombres de tablas y estado de env vars.
  const response: HealthResponse = {
    ok: allOk,
    timestamp: new Date().toISOString(),
    checks: {
      database,
      supabase_auth,
      resend_email,
      mp_webhook_secret,
      mp_access_token,
      mp_app_credentials,
      cron_secret,
      social_tables,
      payment_tables,
      precios_cta,
      pages_count,
    },
  }

  return NextResponse.json(response, {
    status: allOk ? 200 : 503,
    headers: { 'Cache-Control': 'no-store' },
  })
}
