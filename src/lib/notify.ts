/**
 * Unified multi-channel notification dispatcher.
 *
 * Lee `channel_preference` por suscripción (email | whatsapp | both) y
 * envía el mensaje al canal adecuado. Stub-safe: si una credencial falta,
 * degrada limpiamente sin romper el flujo principal.
 *
 * Diseño:
 *   - Una sola función pública `notifySubscribers` invocada desde el flujo
 *     de publicación. NO se llama desde el cliente.
 *   - Usa el cliente de servicio (service role) — bypassa RLS de manera
 *     intencional: la app ya autorizó el contexto en la capa superior.
 *   - Hace logging fila-a-fila en `sala_notification_log` para que cada
 *     fila de la tabla represente UN intento por canal y subscriber.
 *   - Footer viral en cada mensaje (cumple el playbook de Nebbuler).
 *   - NUNCA loguea phones completos ni emails completos.
 */

import { createServiceClient } from '@/lib/supabase/server'
import { getResend } from '@/lib/email'
import {
  isWhatsAppConfigured,
  sendWhatsAppMessage,
  buildNewPostTemplateParams,
  buildViralFooter,
  normalizeE164,
} from '@/lib/whatsapp'
import { randomBytes } from 'crypto'

// ─── Tipos públicos ──────────────────────────────────────────────────────────

export interface NotifyArgs {
  creatorId: string
  postId: string
  postTitle: string
  postSlug: string
  isFree: boolean
}

export interface NotifyResult {
  sent: number
  failed: number
}

// ─── Internos ────────────────────────────────────────────────────────────────

interface SubscriberRow {
  subscriber_id: string
  channel_preference: 'email' | 'whatsapp' | 'both'
  sala_profiles: {
    email: string | null
    phone_number: string | null
    phone_verified: boolean | null
  } | null
}

interface CreatorRow {
  id: string
  name: string | null
  display_name: string | null
  slug: string | null
  username: string | null
  publication_name: string | null
}

function maskEmail(e: string | null | undefined): string {
  if (!e) return '<none>'
  const [u, d] = e.split('@')
  if (!d) return '<masked>'
  return `${u.slice(0, 2)}***@${d}`
}

function maskPhone(p: string | null | undefined): string {
  if (!p) return '<none>'
  if (p.length <= 5) return '****'
  return `${p.slice(0, p.length - 4)}****`
}

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://nebbuler.com'

// ─── Logger interno (best-effort, no rompe el flujo) ─────────────────────────

async function logAttempt(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  db: any,
  payload: {
    subscriber_id: string
    creator_id: string
    post_id: string | null
    channel: 'email' | 'whatsapp'
    status: 'sent' | 'failed' | 'opted_out' | 'queued'
    provider_id?: string | null
    error?: string | null
  }
): Promise<void> {
  try {
    await db.from('sala_notification_log').insert({
      subscriber_id: payload.subscriber_id,
      creator_id: payload.creator_id,
      post_id: payload.post_id,
      channel: payload.channel,
      status: payload.status,
      provider_id: payload.provider_id ?? null,
      error: payload.error ?? null,
    })
  } catch (err) {
    console.warn('[notify] log insert failed (non-fatal):', (err as Error).message)
  }
}

// ─── Función principal ───────────────────────────────────────────────────────

export async function notifySubscribers(args: NotifyArgs): Promise<NotifyResult> {
  let sent = 0
  let failed = 0

  let serviceClient
  try {
    serviceClient = createServiceClient()
  } catch (err) {
    console.error('[notify] service client init failed:', (err as Error).message)
    return { sent: 0, failed: 0 }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = serviceClient as any

  // ── 1. Cargar metadatos del creador ─────────────────────────────────────
  const { data: creatorRaw } = await db
    .from('sala_creators')
    .select('id, name, display_name, slug, username, publication_name')
    .eq('id', args.creatorId)
    .maybeSingle()

  const creator = creatorRaw as CreatorRow | null
  if (!creator) {
    console.warn('[notify] creator not found id=%s', args.creatorId)
    return { sent: 0, failed: 0 }
  }

  const creatorName = creator.display_name ?? creator.name ?? 'Tu creador'
  const creatorSlug = creator.slug ?? creator.username ?? ''
  const publicationName = creator.publication_name ?? creatorName

  // ── 2. Cargar suscriptores activos + sus preferencias y datos de canal ──
  const { data: subsRaw } = await db
    .from('sala_subscriptions')
    .select(
      'subscriber_id, channel_preference, sala_profiles!inner ( email, phone_number, phone_verified )'
    )
    .eq('creator_id', args.creatorId)
    .eq('status', 'active')

  const subs = (subsRaw as SubscriberRow[] | null) ?? []
  if (subs.length === 0) {
    return { sent: 0, failed: 0 }
  }

  // ── 3. Particionar por canal ────────────────────────────────────────────
  const emailRecipients: { subscriber_id: string; email: string }[] = []
  const whatsappRecipients: { subscriber_id: string; phone: string }[] = []

  for (const s of subs) {
    const profile = s.sala_profiles
    const pref = s.channel_preference ?? 'email'
    if (!profile) continue

    const wantEmail = pref === 'email' || pref === 'both'
    const wantWhats = pref === 'whatsapp' || pref === 'both'

    if (wantEmail && profile.email) {
      emailRecipients.push({ subscriber_id: s.subscriber_id, email: profile.email })
    }
    if (wantWhats) {
      const p = profile.phone_number
      if (p && profile.phone_verified) {
        const norm = normalizeE164(p)
        if (norm) {
          whatsappRecipients.push({ subscriber_id: s.subscriber_id, phone: norm })
        }
      } else {
        // Quería WhatsApp pero no tiene teléfono verificado → fallback a email
        if (profile.email && !wantEmail) {
          emailRecipients.push({ subscriber_id: s.subscriber_id, email: profile.email })
        }
      }
    }
  }

  // ── 4. Enviar por email vía Resend (best-effort, no rompe si falta key) ──
  if (emailRecipients.length > 0) {
    if (!process.env.RESEND_API_KEY) {
      console.warn('[notify] RESEND_API_KEY missing — email skipped')
    } else {
      // Generar tokens individuales de unsubscribe
      const postUrl = `${BASE_URL}/${creatorSlug}/${args.postSlug}`
      const viralFooter = buildViralFooter(creatorSlug)
      const subject = `${publicationName}: ${args.postTitle}`.slice(0, 120)

      // Resend en lotes pequeños para respetar rate limit free (2 req/s)
      const BATCH = 10
      for (let i = 0; i < emailRecipients.length; i += BATCH) {
        const slice = emailRecipients.slice(i, i + BATCH)
        await Promise.all(
          slice.map(async (r) => {
            const token = randomBytes(24).toString('hex')
            const unsubUrl = `${BASE_URL}/api/unsubscribe?token=${token}`
            try {
              // Persistir token (mismo patrón que email.ts)
              await db
                .from('sala_unsubscribe_tokens')
                .upsert(
                  {
                    token,
                    subscriber_id: r.subscriber_id,
                    creator_id: args.creatorId,
                    expires_at: new Date(
                      Date.now() + 30 * 24 * 60 * 60 * 1000
                    ).toISOString(),
                  },
                  { onConflict: 'subscriber_id,creator_id' }
                )
            } catch {
              /* token persist failure is non-fatal */
            }

            try {
              const resp = await getResend().emails.send({
                from: `${publicationName} via Nebbuler <notificaciones@nebbuler.com>`,
                to: r.email,
                subject,
                html: buildSimpleEmailHtml({
                  creatorName,
                  publicationName,
                  postTitle: args.postTitle,
                  postUrl,
                  isFree: args.isFree,
                  viralFooter,
                  unsubUrl,
                }),
                headers: {
                  'List-Unsubscribe': `<${unsubUrl}>`,
                  'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
                },
              })
              sent++
              await logAttempt(db, {
                subscriber_id: r.subscriber_id,
                creator_id: args.creatorId,
                post_id: args.postId,
                channel: 'email',
                status: 'sent',
                provider_id:
                  (resp as { data?: { id?: string } }).data?.id ?? null,
              })
            } catch (err) {
              failed++
              const msg = (err as Error).message
              console.error('[notify] email to %s failed: %s', maskEmail(r.email), msg)
              await logAttempt(db, {
                subscriber_id: r.subscriber_id,
                creator_id: args.creatorId,
                post_id: args.postId,
                channel: 'email',
                status: 'failed',
                error: msg.slice(0, 240),
              })
            }
          })
        )
        if (i + BATCH < emailRecipients.length) {
          await new Promise<void>((r) => setTimeout(r, 1100))
        }
      }
    }
  }

  // ── 5. Enviar por WhatsApp (stub-safe) ──────────────────────────────────
  if (whatsappRecipients.length > 0) {
    if (!isWhatsAppConfigured()) {
      console.warn(
        '[notify] WhatsApp not configured — %d recipients skipped',
        whatsappRecipients.length
      )
    } else {
      const postUrl = `${BASE_URL}/${creatorSlug}/${args.postSlug}`
      const templateName =
        process.env.WHATSAPP_TEMPLATE_NEW_POST ?? 'nuevo_post_es'

      for (const r of whatsappRecipients) {
        const unsubUrl = `${BASE_URL}/dashboard/preferencias`
        const params = buildNewPostTemplateParams({
          creatorName,
          postTitle: args.postTitle.slice(0, 60),
          postUrl,
          unsubscribeUrl: unsubUrl,
        })
        try {
          const result = await sendWhatsAppMessage({
            to: r.phone,
            templateName,
            params,
            language: 'es',
          })
          if (result.ok) {
            sent++
            await logAttempt(db, {
              subscriber_id: r.subscriber_id,
              creator_id: args.creatorId,
              post_id: args.postId,
              channel: 'whatsapp',
              status: 'sent',
              provider_id: result.messageId ?? null,
            })
          } else if (result.skipped) {
            // Configurado en build pero algo se fue en runtime — tratar como fallido
            failed++
            await logAttempt(db, {
              subscriber_id: r.subscriber_id,
              creator_id: args.creatorId,
              post_id: args.postId,
              channel: 'whatsapp',
              status: 'failed',
              error: 'skipped_runtime',
            })
          } else {
            failed++
            console.error(
              '[notify] whatsapp to %s failed: %s',
              maskPhone(r.phone),
              result.error
            )
            await logAttempt(db, {
              subscriber_id: r.subscriber_id,
              creator_id: args.creatorId,
              post_id: args.postId,
              channel: 'whatsapp',
              status: 'failed',
              error: (result.error ?? 'unknown').slice(0, 240),
            })
          }
        } catch (err) {
          failed++
          const msg = (err as Error).message
          console.error('[notify] whatsapp exception:', msg)
          await logAttempt(db, {
            subscriber_id: r.subscriber_id,
            creator_id: args.creatorId,
            post_id: args.postId,
            channel: 'whatsapp',
            status: 'failed',
            error: msg.slice(0, 240),
          })
        }
      }
    }
  }

  console.log(
    '[notify] post=%s creator=%s sent=%d failed=%d (email=%d, whats=%d)',
    args.postId,
    args.creatorId,
    sent,
    failed,
    emailRecipients.length,
    whatsappRecipients.length
  )

  return { sent, failed }
}

// ─── Email HTML simple (NYT editorial, con footer viral) ─────────────────────

function buildSimpleEmailHtml(params: {
  creatorName: string
  publicationName: string
  postTitle: string
  postUrl: string
  isFree: boolean
  viralFooter: string
  unsubUrl: string
}): string {
  const accessBadge = params.isFree
    ? '<span style="display:inline-block;font-family:Arial,sans-serif;font-size:10px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;background:#121212;color:#FFFFFF;padding:4px 10px;">ACCESO LIBRE</span>'
    : '<span style="display:inline-block;font-family:Arial,sans-serif;font-size:10px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;background:#C41C1C;color:#FFFFFF;padding:4px 10px;">EXCLUSIVO SUSCRIPTORES</span>'

  return `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>${params.postTitle}</title></head>
<body style="margin:0;padding:0;background:#FAFAF7;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAFAF7;padding:36px 16px;">
    <tr><td>
      <table width="600" cellpadding="0" cellspacing="0" align="center" style="max-width:600px;width:100%;background:#FFFFFF;border:1px solid #E8E8E8;">
        <tr><td style="background:#C41C1C;height:4px;font-size:0;line-height:0;">&nbsp;</td></tr>
        <tr><td style="padding:24px 36px 16px;border-bottom:1px solid #EEE;">
          <p style="margin:0;font-family:Arial,sans-serif;font-size:10px;letter-spacing:3px;color:#888;text-transform:uppercase;">${params.publicationName}</p>
        </td></tr>
        <tr><td style="padding:32px 36px 24px;">
          ${accessBadge}
          <h1 style="margin:14px 0 18px;font-family:Georgia,serif;font-size:24px;color:#121212;line-height:1.25;">${params.postTitle}</h1>
          <p style="margin:0 0 22px;font-family:Arial,sans-serif;font-size:14px;color:#444;line-height:1.65;">${params.creatorName} acaba de publicar un nuevo análisis.</p>
          <a href="${params.postUrl}" style="display:inline-block;background:#121212;color:#FFF;font-family:Arial,sans-serif;font-size:11px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;padding:13px 24px;text-decoration:none;">Leer ahora &rarr;</a>
        </td></tr>
        <tr><td style="padding:20px 36px;border-top:1px solid #EEE;background:#FAFAFA;">
          <p style="margin:0 0 8px;font-family:Arial,sans-serif;font-size:11px;color:#999;line-height:1.6;">${params.viralFooter.replace(/\n/g, '<br>')}</p>
          <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;color:#BBB;">
            <a href="${params.unsubUrl}" style="color:#C41C1C;text-decoration:underline;">Cancelar suscripción</a>
            &middot; <a href="https://nebbuler.com/dashboard/preferencias" style="color:#999;text-decoration:underline;">Preferencias de notificación</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`
}
