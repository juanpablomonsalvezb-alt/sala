import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { Resend } from 'resend'
import crypto from 'crypto'

export const runtime = 'nodejs'
export const maxDuration = 300

const resend = new Resend(process.env.RESEND_API_KEY)

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getWeekOf(): string {
  const now = new Date()
  const day = now.getDay()
  const diff = now.getDate() - day + (day === 0 ? -6 : 1) // lunes
  const monday = new Date(now.setDate(diff))
  return monday.toISOString().split('T')[0]
}

function formatWeekLabel(weekOf: string): string {
  const date = new Date(weekOf + 'T12:00:00Z')
  return date.toLocaleDateString('es-CL', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

function generateToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

// ─── Template HTML ────────────────────────────────────────────────────────────

interface TrendingKeyword {
  keyword: string
  search_volume: number
  monthly_growth: number
}

interface Creator {
  id: string
  name: string
  slug: string
  specialty?: string
  bio?: string
}

function buildEmailHtml(params: {
  trends: TrendingKeyword[]
  creator: Creator | null
  unsubscribeUrl: string
  weekLabel: string
}): string {
  const { trends, creator, unsubscribeUrl, weekLabel } = params

  const trendsHtml = trends
    .map(
      (t, i) => `
    <tr>
      <td style="padding:0 0 20px 0;">
        <table cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            <td style="width:28px;padding:0 14px 0 0;vertical-align:top;">
              <div style="width:28px;height:28px;background:#C41C1C;border-radius:50%;text-align:center;line-height:28px;font-family:Arial,sans-serif;font-size:11px;font-weight:bold;color:#FFFFFF;">${i + 1}</div>
            </td>
            <td style="vertical-align:top;">
              <p style="margin:0 0 4px;font-family:Georgia,'Times New Roman',serif;font-size:16px;font-weight:bold;color:#121212;text-transform:capitalize;">${t.keyword}</p>
              <p style="margin:0;font-family:Arial,sans-serif;font-size:12px;color:#888888;">
                Volumen estimado: <strong style="color:#121212;">${t.search_volume.toLocaleString('es-CL')}</strong> búsquedas
                &nbsp;·&nbsp; Crecimiento: <strong style="color:#2A7A47;">+${t.monthly_growth}%</strong> mensual
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>`
    )
    .join('')

  const creatorHtml = creator
    ? `
    <!-- Sección creador destacado -->
    <tr>
      <td style="padding:32px 0 0 0;">
        <div style="height:1px;background:#EBEBEB;margin-bottom:32px;"></div>
        <p style="margin:0 0 6px;font-family:Arial,sans-serif;font-size:9px;font-weight:bold;letter-spacing:3px;color:#C41C1C;text-transform:uppercase;">Creador Destacado</p>
        <h2 style="margin:0 0 10px;font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:normal;color:#121212;">${creator.name}</h2>
        ${creator.specialty ? `<p style="margin:0 0 12px;font-family:Arial,sans-serif;font-size:12px;color:#888888;text-transform:uppercase;letter-spacing:1px;">${creator.specialty}</p>` : ''}
        ${creator.bio ? `<p style="margin:0 0 20px;font-family:Arial,sans-serif;font-size:14px;color:#444444;line-height:1.7;">${creator.bio}</p>` : ''}
        <a href="https://nebbuler.com/${creator.slug}"
           style="display:inline-block;background:#121212;color:#FFFFFF;font-family:Arial,sans-serif;font-size:10px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;padding:12px 24px;text-decoration:none;">
          Ver perfil &rarr;
        </a>
      </td>
    </tr>`
    : ''

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Boletín Profesional Nebbuler</title>
</head>
<body style="margin:0;padding:0;background:#F7F7F7;font-family:Arial,sans-serif;">
  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#F7F7F7;padding:32px 16px;">
    <tr>
      <td align="center">
        <table cellpadding="0" cellspacing="0" border="0" width="600" style="max-width:600px;background:#FFFFFF;">

          <!-- Barra superior roja -->
          <tr>
            <td style="height:4px;background:#C41C1C;"></td>
          </tr>

          <!-- Header -->
          <tr>
            <td style="padding:36px 48px 28px;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td>
                    <p style="margin:0 0 4px;font-family:Arial,sans-serif;font-size:9px;font-weight:bold;letter-spacing:3px;color:#888888;text-transform:uppercase;">Nebbuler</p>
                    <h1 style="margin:0 0 8px;font-family:Georgia,'Times New Roman',serif;font-size:28px;font-weight:normal;color:#121212;line-height:1.2;">Boletín Profesional</h1>
                    <p style="margin:0;font-family:Arial,sans-serif;font-size:12px;color:#AAAAAA;text-transform:capitalize;">${weekLabel}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divisor -->
          <tr>
            <td style="padding:0 48px;">
              <div style="height:1px;background:#EBEBEB;"></div>
            </td>
          </tr>

          <!-- Intro -->
          <tr>
            <td style="padding:28px 48px 24px;">
              <p style="margin:0;font-family:Arial,sans-serif;font-size:14px;color:#555555;line-height:1.7;">
                Estas son las <strong style="color:#121212;">5 tendencias profesionales</strong> más relevantes de la semana en Latinoamérica, detectadas automáticamente por Nebbuler a partir de medios económicos y legales de la región.
              </p>
            </td>
          </tr>

          <!-- Tendencias -->
          <tr>
            <td style="padding:0 48px 0;">
              <p style="margin:0 0 20px;font-family:Arial,sans-serif;font-size:9px;font-weight:bold;letter-spacing:3px;color:#C41C1C;text-transform:uppercase;">Tendencias de la Semana</p>
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                ${trendsHtml}
              </table>
            </td>
          </tr>

          ${creatorHtml}

          <!-- CTA principal -->
          <tr>
            <td style="padding:32px 48px;">
              <div style="height:1px;background:#EBEBEB;margin-bottom:32px;"></div>
              <p style="margin:0 0 16px;font-family:Arial,sans-serif;font-size:14px;color:#555555;line-height:1.7;">
                Descubre el conocimiento profesional de los mejores expertos de Latinoamérica. Análisis, tendencias y perspectivas directo a tu correo.
              </p>
              <a href="https://nebbuler.com"
                 style="display:inline-block;background:#C41C1C;color:#FFFFFF;font-family:Arial,sans-serif;font-size:10px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;padding:14px 28px;text-decoration:none;">
                Explorar Nebbuler &rarr;
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 48px;background:#F7F7F7;">
              <p style="margin:0 0 8px;font-family:Arial,sans-serif;font-size:11px;color:#AAAAAA;line-height:1.6;">
                Recibes este Boletín Profesional porque tienes una cuenta en Nebbuler.
              </p>
              <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;color:#AAAAAA;line-height:1.6;">
                <a href="${unsubscribeUrl}" style="color:#AAAAAA;text-decoration:underline;">Cancelar suscripción al boletín</a>
                &nbsp;·&nbsp;
                <a href="https://nebbuler.com" style="color:#AAAAAA;text-decoration:underline;">nebbuler.com</a>
              </p>
            </td>
          </tr>

          <!-- Barra inferior -->
          <tr>
            <td style="height:2px;background:#EBEBEB;"></td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServiceClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any

  const weekOf = getWeekOf()

  // 1. Verificar que no se haya enviado el boletín esta semana
  const { data: existingLog } = await db
    .from('boletin_sent_log')
    .select('id')
    .eq('week_of', weekOf)
    .maybeSingle()

  if (existingLog) {
    return NextResponse.json({
      ok: false,
      message: `Boletín ya enviado para la semana del ${weekOf}`,
      week_of: weekOf,
    })
  }

  // 2. Top 5 keywords de los últimos 7 días
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const { data: trends } = await db
    .from('trending_keywords')
    .select('keyword, search_volume, monthly_growth')
    .gte('created_at', sevenDaysAgo)
    .order('search_volume', { ascending: false })
    .limit(5)

  const topTrends: TrendingKeyword[] = trends ?? []

  if (topTrends.length === 0) {
    return NextResponse.json({
      ok: false,
      message: 'No hay keywords en trending_keywords de los últimos 7 días. Ejecutar detect-trends primero.',
    })
  }

  // 3. Creador aleatorio con featured: true
  const { data: creators } = await db
    .from('sala_creators')
    .select('id, name, slug, specialty, bio')
    .eq('featured', true)
    .limit(20)

  let featuredCreator: Creator | null = null
  if (creators && creators.length > 0) {
    featuredCreator = creators[Math.floor(Math.random() * creators.length)] as Creator
  }

  // 4. Todos los usuarios con boletín activo y email
  const { data: profiles } = await db
    .from('sala_profiles')
    .select('id, email')
    .not('email', 'is', null)
    .neq('email', '')
    .or('boletin_activo.is.null,boletin_activo.eq.true')

  const recipients: Array<{ id: string; email: string }> = profiles ?? []

  if (recipients.length === 0) {
    return NextResponse.json({
      ok: false,
      message: 'No hay destinatarios con email y boletín activo.',
    })
  }

  const weekLabel = formatWeekLabel(weekOf)
  let sentCount = 0
  const errors: string[] = []

  // 5. Enviar en lotes de 50
  const BATCH_SIZE = 50
  for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
    const batch = recipients.slice(i, i + BATCH_SIZE)

    const emailPromises = batch.map(async (user) => {
      // Obtener o crear token de desuscripción del boletín
      const { data: existingToken } = await db
        .from('boletin_unsubscribe_tokens')
        .select('token')
        .eq('user_id', user.id)
        .maybeSingle()

      let token: string
      if (existingToken?.token) {
        token = existingToken.token
      } else {
        token = generateToken()
        await db.from('boletin_unsubscribe_tokens').insert({
          token,
          user_id: user.id,
        })
      }

      const unsubscribeUrl = `https://nebbuler.com/desuscribir-boletin?token=${token}`

      const html = buildEmailHtml({
        trends: topTrends,
        creator: featuredCreator,
        unsubscribeUrl,
        weekLabel,
      })

      return resend.emails.send({
        from: 'Boletín Profesional Nebbuler <boletin@nebbuler.com>',
        to: user.email,
        subject: `Boletín Profesional Nebbuler — ${weekLabel}`,
        html,
        headers: {
          'List-Unsubscribe': `<${unsubscribeUrl}>`,
          'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
        },
      })
    })

    const results = await Promise.allSettled(emailPromises)
    results.forEach((result, idx) => {
      if (result.status === 'fulfilled') {
        sentCount++
      } else {
        errors.push(`${batch[idx]?.email ?? 'unknown'}: ${String(result.reason)}`)
      }
    })

    // Pausa entre lotes para respetar rate limits de Resend
    if (i + BATCH_SIZE < recipients.length) {
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }
  }

  // 6. Registrar envío en boletin_sent_log
  await db.from('boletin_sent_log').insert({
    week_of: weekOf,
    recipients_count: sentCount,
  })

  return NextResponse.json({
    ok: true,
    week_of: weekOf,
    trends_used: topTrends.length,
    creator_featured: featuredCreator?.name ?? null,
    recipients_total: recipients.length,
    sent: sentCount,
    errors: errors.length > 0 ? errors.slice(0, 10) : undefined,
  })
}
