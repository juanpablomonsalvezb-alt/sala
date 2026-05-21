import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { Resend } from 'resend'
import { captureError, captureMessage, setTag } from '@/lib/observability'

export const runtime = 'nodejs'
export const maxDuration = 60

function getResend(): Resend {
  const key = process.env.RESEND_API_KEY
  if (!key) throw new Error('RESEND_API_KEY missing')
  return new Resend(key)
}

const CRITICAL_CHECKS = ['database', 'mp_webhook_secret', 'mp_access_token', 'payment_tables'] as const

const CHECK_LABELS: Record<string, string> = {
  database: 'Base de datos (sala_creators)',
  supabase_auth: 'Supabase Auth',
  resend_email: 'Resend (email)',
  mp_webhook_secret: 'MercadoPago — Webhook Secret',
  mp_access_token: 'MercadoPago — Access Token',
  mp_app_credentials: 'MercadoPago — App Credentials',
  cron_secret: 'CRON_SECRET',
  social_tables: 'Tablas sociales',
  payment_tables: 'Tablas de pago',
  precios_cta: 'CTA de precios',
  pages_count: 'Páginas generadas',
}

const FIX_INSTRUCTIONS: Record<string, string> = {
  database: 'Verifica que SUPABASE_SERVICE_ROLE_KEY sea válida y que la tabla sala_creators exista.',
  supabase_auth: 'Agrega NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY en Vercel.',
  resend_email: 'Agrega RESEND_API_KEY en Vercel (debe empezar con "re_").',
  mp_webhook_secret: 'Agrega MP_WEBHOOK_SECRET en Vercel → Settings → Environment Variables.',
  mp_access_token: 'Agrega MP_ACCESS_TOKEN en Vercel → Settings → Environment Variables.',
  mp_app_credentials: 'Agrega MP_APP_ID y MP_CLIENT_SECRET en Vercel para activar OAuth de MercadoPago.',
  cron_secret: 'Agrega CRON_SECRET en Vercel para proteger los endpoints de cron.',
  social_tables: 'Ejecuta la migration 20260514000000_social_monitor.sql en Supabase.',
  payment_tables: 'Verifica que las tablas sala_subscriptions, sala_creators y sala_profiles existan en Supabase.',
  precios_cta: 'Actualiza el ctaHref en PreciosClient.tsx — reemplaza /abrir por /registro o /entrar.',
  pages_count: 'Verifica que la tabla generated_pages exista y que el cron /api/cron/generate-pages funcione.',
}

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
  checks: Record<string, CheckResult>
}

function buildEmailHtml(failedChecks: string[], details: Record<string, CheckResult>): string {
  const rows = failedChecks.map((key) => {
    const check = details[key]
    const label = CHECK_LABELS[key] ?? key
    const fix = FIX_INSTRUCTIONS[key] ?? 'Revisar logs en Vercel.'
    const errorMsg = check.error ? `<br/><span style="color:#666;font-size:13px;">${check.error}</span>` : ''
    return `
      <tr>
        <td style="padding:12px 16px;border-bottom:1px solid #f0f0f0;vertical-align:top;">
          <strong style="color:#C41C1C;">❌ ${label}</strong>${errorMsg}
        </td>
        <td style="padding:12px 16px;border-bottom:1px solid #f0f0f0;color:#444;font-size:14px;vertical-align:top;">
          ${fix}
        </td>
      </tr>`
  }).join('')

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/></head>
<body style="font-family:Inter,sans-serif;max-width:640px;margin:0 auto;padding:32px 16px;color:#121212;background:#fff;">
  <h1 style="font-size:22px;font-weight:700;margin-bottom:4px;">⚠️ Nebbuler Health Check</h1>
  <p style="color:#666;font-size:14px;margin-top:0;">
    ${new Date().toLocaleString('es-CL', { timeZone: 'America/Santiago' })} (Santiago)
  </p>
  <p style="font-size:15px;margin:16px 0;">
    Se detectaron <strong>${failedChecks.length} sistema${failedChecks.length > 1 ? 's' : ''} con problemas</strong>:
  </p>
  <table style="width:100%;border-collapse:collapse;background:#fafafa;border:1px solid #eee;border-radius:8px;overflow:hidden;">
    <thead>
      <tr style="background:#f5f5f5;">
        <th style="padding:12px 16px;text-align:left;font-size:13px;color:#888;font-weight:600;border-bottom:1px solid #eee;">Sistema</th>
        <th style="padding:12px 16px;text-align:left;font-size:13px;color:#888;font-weight:600;border-bottom:1px solid #eee;">Cómo arreglarlo</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>
  <div style="margin-top:24px;padding:16px;background:#f9f9f9;border-left:3px solid #C41C1C;">
    <p style="margin:0;font-size:13px;color:#666;">
      Ver panel completo en:
      <a href="https://nebbuler.com/dashboard/salud" style="color:#C41C1C;">nebbuler.com/dashboard/salud</a>
    </p>
  </div>
  <p style="margin-top:24px;font-size:12px;color:#999;">
    Este email fue enviado automáticamente por el sistema de health check de Nebbuler (06:00 UTC diario).
  </p>
</body>
</html>`
}

export async function GET(request: Request) {
  setTag('cron', 'health-check')
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Llamar al endpoint de health internamente
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://nebbuler.com'
  let healthData: HealthResponse

  try {
    const res = await fetch(`${baseUrl}/api/health`, { cache: 'no-store' })
    healthData = await res.json()
  } catch (e) {
    captureError(e, { cron: 'health-check', stage: 'fetch-health' })
    return NextResponse.json({ error: `No se pudo llamar /api/health: ${String(e)}` }, { status: 500 })
  }

  const checks = healthData.checks
  const failedChecks = Object.keys(checks).filter((key) => !checks[key].ok)
  const criticalFailed = failedChecks.filter((key) =>
    (CRITICAL_CHECKS as readonly string[]).includes(key)
  )

  const supabase = createServiceClient()

  // Guardar en health_check_log
  const { error: insertError } = await supabase
    .from('health_check_log' as never)
    .insert({
      all_ok: healthData.ok,
      failed_checks: failedChecks,
      details: healthData.checks,
      alerted: false,
    } as never)

  if (insertError) {
    console.error('[health-check] Error guardando en health_check_log:', insertError)
  }

  // Enviar email si hay críticos fallando
  let alerted = false
  if (criticalFailed.length > 0 || failedChecks.length > 0) {
    const subject = `⚠️ Nebbuler: ${failedChecks.length} sistema${failedChecks.length > 1 ? 's' : ''} con problemas`

    try {
      await getResend().emails.send({
        from: 'Nebbuler Health <hola@nebbuler.com>',
        to: 'juanpablo.monsalvezb@gmail.com',
        subject,
        html: buildEmailHtml(failedChecks, checks),
      })
      alerted = true

      // Actualizar alerted en el log
      await supabase
        .from('health_check_log' as never)
        .update({ alerted: true } as never)
        .eq('checked_at', healthData.timestamp)
    } catch (emailError) {
      console.error('[health-check] Error enviando email:', emailError)
      captureError(emailError, { cron: 'health-check', stage: 'alert-email' })
    }
  }

  // Si hubo checks críticos fallando, reportar como mensaje (no exception).
  // Sirve para que el dashboard de Sentry tenga histórico de degradaciones.
  if (criticalFailed.length > 0) {
    captureMessage(
      `[health-check] checks críticos fallando: ${criticalFailed.join(', ')}`,
      'error',
      { cron: 'health-check', failed: failedChecks, critical: criticalFailed }
    )
  }

  return NextResponse.json({
    ok: healthData.ok,
    timestamp: healthData.timestamp,
    failed_checks: failedChecks,
    critical_failed: criticalFailed,
    alerted,
    log_saved: !insertError,
  })
}
