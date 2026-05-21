import { Resend } from 'resend'
import { createServiceClient } from '@/lib/supabase/server'
import { stripHtml } from '@/lib/sanitize'
import { randomBytes } from 'crypto'

// Lazy init: Resend valida en su constructor que RESEND_API_KEY existe.
// Esto rompe `next build > Collecting page data` si el env var no está en
// build time. Inicializamos en runtime.
let _resend: Resend | null = null
export function getResend(): Resend {
  if (_resend) return _resend
  const key = process.env.RESEND_API_KEY
  if (!key) throw new Error('RESEND_API_KEY missing')
  _resend = new Resend(key)
  return _resend
}

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://nebbuler.com'

// ─── Template HTML ────────────────────────────────────────────────────────────

function buildEmailHtml(params: {
  creatorName: string
  creatorSlug: string
  publicationName: string
  postTitle: string
  postSlug: string
  postExcerpt: string
  postDate: string
  isFree: boolean
  price_clp: number
  unsubscribeToken: string
}): string {
  const postUrl = `${BASE_URL}/${params.creatorSlug}/${params.postSlug}`
  const unsubscribeUrl = `${BASE_URL}/api/unsubscribe?token=${params.unsubscribeToken}`
  const creatorUrl = `${BASE_URL}/${params.creatorSlug}`

  const accessBadge = params.isFree
    ? `<span style="display:inline-block;font-family:Arial,sans-serif;font-size:10px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;background:#121212;color:#ffffff;padding:4px 10px;">ACCESO LIBRE</span>`
    : `<div style="background:#FAFAFA;border-left:3px solid #C41C1C;padding:14px 18px;margin:0 0 20px;">
        <p style="margin:0;font-family:Arial,sans-serif;font-size:13px;color:#555555;line-height:1.5;">Análisis exclusivo para suscriptores &nbsp;·&nbsp; <strong>$${params.price_clp.toLocaleString('es-CL')} CLP/mes</strong></p>
       </div>`

  const ctaLabel = params.isFree ? 'LEER AHORA &rarr;' : 'LEER ANÁLISIS COMPLETO &rarr;'

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${params.postTitle}</title>
</head>
<body style="margin:0;padding:0;background:#F7F7F7;font-family:'Georgia',Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F7F7F7;padding:40px 20px;">
    <tr><td>
      <table width="600" cellpadding="0" cellspacing="0" align="center"
             style="background:#FFFFFF;max-width:600px;width:100%;border:1px solid #E8E8E8;">

        <!-- Barra roja top -->
        <tr><td style="background:#C41C1C;height:4px;font-size:0;line-height:0;">&nbsp;</td></tr>

        <!-- Header -->
        <tr><td style="padding:22px 40px 18px;border-bottom:1px solid #EEEEEE;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td>
                <a href="${creatorUrl}" style="display:block;font-family:Arial,sans-serif;font-size:10px;font-weight:bold;color:#888888;text-decoration:none;letter-spacing:3px;text-transform:uppercase;margin-bottom:2px;">${params.publicationName.toUpperCase()}</a>
                <a href="${BASE_URL}" style="font-family:Arial,sans-serif;font-size:10px;color:#CCCCCC;text-decoration:none;letter-spacing:1px;">EN NEBBULER</a>
              </td>
              <td align="right">
                <a href="${BASE_URL}" style="font-family:Georgia,serif;font-size:14px;font-weight:bold;color:#121212;text-decoration:none;letter-spacing:3px;">NEBBULER</a>
              </td>
            </tr>
          </table>
        </td></tr>

        <!-- Cuerpo del post -->
        <tr><td style="padding:36px 40px 28px;">
          <p style="margin:0 0 10px;font-family:Arial,sans-serif;font-size:10px;color:#999999;letter-spacing:2px;text-transform:uppercase;">${params.postDate}</p>
          <h1 style="margin:0 0 20px;font-family:Georgia,serif;font-size:26px;font-weight:bold;color:#121212;line-height:1.25;">${params.postTitle}</h1>
          <p style="margin:0 0 24px;font-family:Arial,sans-serif;font-size:15px;color:#444444;line-height:1.75;">${params.postExcerpt}</p>

          ${params.isFree ? accessBadge + '<br>' : accessBadge}

          <!-- CTA Button -->
          <table cellpadding="0" cellspacing="0" style="margin-top:8px;">
            <tr>
              <td style="background:#121212;">
                <a href="${postUrl}"
                   style="display:inline-block;background:#121212;color:#FFFFFF;font-family:Arial,sans-serif;font-size:10px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;padding:13px 26px;text-decoration:none;">
                  ${ctaLabel}
                </a>
              </td>
            </tr>
          </table>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:20px 40px;border-top:1px solid #EEEEEE;background:#FAFAFA;">
          <p style="margin:0 0 6px;font-family:Arial,sans-serif;font-size:11px;color:#999999;line-height:1.6;">
            Recibes este correo porque estás suscrito a <strong>${params.publicationName}</strong> en Nebbuler.
          </p>
          <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;color:#BBBBBB;">
            <a href="${unsubscribeUrl}" style="color:#C41C1C;text-decoration:underline;">Cancelar suscripción</a>
            &nbsp;&middot;&nbsp;
            <a href="${BASE_URL}" style="color:#AAAAAA;text-decoration:none;">nebbuler.com</a>
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function buildSubject(publicationName: string, postTitle: string): string {
  const prefix = publicationName.split(' ')[0]
  const maxTitle = 70 - prefix.length - 2
  const title = postTitle.length > maxTitle ? postTitle.slice(0, maxTitle - 1) + '…' : postTitle
  return `${prefix}: ${title}`
}

// ─── Función principal de notificación ───────────────────────────────────────

export async function sendNewPostNotification(params: {
  subscriberEmails: string[]
  creatorName: string
  creatorSlug: string
  publicationName: string
  postTitle: string
  postExcerpt: string
  postSlug: string
  isFree: boolean
  // Campos extendidos (opcionales para compatibilidad con _actions.ts existente)
  creatorId?: string
  price_clp?: number
}): Promise<{ sent: number; failed: number; skipped: number }> {
  if (!params.subscriberEmails.length) return { sent: 0, failed: 0, skipped: 0 }

  if (!process.env.RESEND_API_KEY) {
    console.warn('[email] RESEND_API_KEY no configurada — emails omitidos')
    return { sent: 0, failed: 0, skipped: 0 }
  }

  const postDate = new Date().toLocaleDateString('es-CL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const price_clp = params.price_clp ?? 14990
  const subject = buildSubject(params.publicationName, params.postTitle)

  let sent = 0
  let failed = 0
  let skipped = 0

  // Resend: máx 2 req/seg en free, enviamos de a 1 por suscriptor para personalizar
  // En batches de 50 con pausa de 1s entre batches para respetar rate limit
  const BATCH = 50

  for (let i = 0; i < params.subscriberEmails.length; i += BATCH) {
    const batch = params.subscriberEmails.slice(i, i + BATCH)

    await Promise.all(
      batch.map(async (email) => {
        if (!email) { skipped++; return }

        // Generar token único de unsubscribe
        const token = randomBytes(24).toString('hex')

        // Persistir token si tenemos supabase disponible y creatorId
        if (params.creatorId) {
          try {
            const supabase = createServiceClient()
            // Recuperar subscriber_id desde sala_profiles
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data: profile } = await (supabase as any)
              .from('sala_profiles')
              .select('id')
              .eq('email', email)
              .maybeSingle()

            if (profile?.id) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              await (supabase as any)
                .from('sala_unsubscribe_tokens')
                .upsert(
                  {
                    token,
                    subscriber_id: profile.id,
                    creator_id: params.creatorId,
                    expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                  },
                  { onConflict: 'subscriber_id,creator_id' }
                )
            }
          } catch (err) {
            console.warn('[email] No se pudo persistir unsubscribe token:', err)
          }
        }

        try {
          await getResend().emails.send({
            from: `${params.publicationName} via Nebbuler <notificaciones@nebbuler.com>`,
            to: email,
            subject,
            html: buildEmailHtml({
              creatorName: params.creatorName,
              creatorSlug: params.creatorSlug,
              publicationName: params.publicationName,
              postTitle: params.postTitle,
              postSlug: params.postSlug,
              postExcerpt: params.postExcerpt,
              postDate,
              isFree: params.isFree,
              price_clp,
              unsubscribeToken: token,
            }),
            headers: {
              'List-Unsubscribe': `<${BASE_URL}/api/unsubscribe?token=${token}>`,
              'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
            },
          })
          sent++
        } catch (err) {
          console.error(`[email] Error enviando a ${email}:`, err)
          failed++
        }
      })
    )

    // Pausa entre batches para respetar rate limit de Resend
    if (i + BATCH < params.subscriberEmails.length) {
      await new Promise<void>((r) => setTimeout(r, 1100))
    }
  }

  console.log(
    `[email] "${params.postTitle}": ${sent} enviados, ${failed} fallidos, ${skipped} omitidos`
  )
  return { sent, failed, skipped }
}

// ─── Función de diagnóstico (strip HTML para excerpt) ────────────────────────

export function buildExcerpt(html: string, words = 150): string {
  const plain = stripHtml(html).trim().split(/\s+/)
  return plain.slice(0, words).join(' ') + (plain.length > words ? '…' : '')
}
