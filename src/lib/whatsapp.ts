/**
 * WhatsApp Cloud API client — Nebbuler
 *
 * Documentación oficial:
 *   https://developers.facebook.com/docs/whatsapp/cloud-api/reference/messages
 *
 * Variables de entorno necesarias:
 *   WHATSAPP_API_TOKEN          — Bearer token de Meta (System User Access Token)
 *   WHATSAPP_PHONE_NUMBER_ID    — ID del número de WhatsApp Business
 *   WHATSAPP_WEBHOOK_VERIFY_TOKEN — Token compartido con Meta para verificar el webhook
 *   WHATSAPP_AUTO_STATUS_ENABLED — (opcional) 'true' para activar Status auto-post
 *
 * Diseño:
 *   - Si las env vars no están configuradas, las funciones NO lanzan en runtime
 *     a menos que se invoquen — son perezosas. `isWhatsAppConfigured()` permite
 *     consultar disponibilidad sin romper el build ni el render server-side.
 *   - Rate limit local: cola en memoria respeta 80 msg/seg (límite duro de
 *     WhatsApp para tier 1). No persistente — si el proceso muere se reinicia.
 *   - No logueamos PII (números, contenido), solo errores e IDs.
 */

const WHATSAPP_GRAPH_VERSION = 'v21.0'
const MAX_MESSAGES_PER_SECOND = 80
const MAX_MESSAGES_PER_USER_PER_DAY = 1000

// ─── Detección de configuración ───────────────────────────────────────────────

export function isWhatsAppConfigured(): boolean {
  return Boolean(
    process.env.WHATSAPP_API_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID
  )
}

function requireConfig(): { token: string; phoneNumberId: string } {
  const token = process.env.WHATSAPP_API_TOKEN
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID
  if (!token || !phoneNumberId) {
    throw new Error(
      '[whatsapp] WHATSAPP_API_TOKEN o WHATSAPP_PHONE_NUMBER_ID no configurados'
    )
  }
  return { token, phoneNumberId }
}

// ─── Rate limit (sliding window 1s) ───────────────────────────────────────────

const sendTimestamps: number[] = []
const dailyCount = new Map<string, { count: number; resetAt: number }>()

async function rateLimitGate(to: string): Promise<void> {
  // Global: 80 msg/seg
  const now = Date.now()
  while (sendTimestamps.length && now - sendTimestamps[0] > 1000) {
    sendTimestamps.shift()
  }
  if (sendTimestamps.length >= MAX_MESSAGES_PER_SECOND) {
    const waitMs = 1000 - (now - sendTimestamps[0]) + 5
    await new Promise<void>((r) => setTimeout(r, waitMs))
  }
  sendTimestamps.push(Date.now())

  // Per-user diario: 1000 msg/día
  const key = hashPhone(to)
  const entry = dailyCount.get(key)
  if (entry && entry.resetAt > Date.now()) {
    if (entry.count >= MAX_MESSAGES_PER_USER_PER_DAY) {
      throw new Error('[whatsapp] daily per-user limit reached')
    }
    entry.count++
  } else {
    dailyCount.set(key, {
      count: 1,
      resetAt: Date.now() + 24 * 60 * 60 * 1000,
    })
  }
}

function hashPhone(phone: string): string {
  // Hash débil para uso interno (no criptográfico) — evita PII en memoria
  let h = 0
  for (let i = 0; i < phone.length; i++) {
    h = (h << 5) - h + phone.charCodeAt(i)
    h |= 0
  }
  return String(h)
}

// ─── E.164 normalize ──────────────────────────────────────────────────────────

export function normalizeE164(input: string): string | null {
  const raw = input.replace(/[^0-9+]/g, '')
  if (!raw) return null
  const candidate = raw.startsWith('+') ? raw : `+${raw}`
  if (!/^\+[1-9][0-9]{6,14}$/.test(candidate)) return null
  return candidate
}

// ─── Envío de mensaje template ────────────────────────────────────────────────

export interface SendWhatsAppOptions {
  to: string                      // E.164
  templateName: string            // p.ej. 'nuevo_post_es'
  params: string[]                // params posicionales del body del template
  language?: string               // default 'es'
}

export interface SendWhatsAppResult {
  ok: boolean
  messageId?: string
  error?: string
  skipped?: boolean
}

export async function sendWhatsAppMessage(
  opts: SendWhatsAppOptions
): Promise<SendWhatsAppResult> {
  if (!isWhatsAppConfigured()) {
    console.warn('[whatsapp] no configurado — mensaje omitido')
    return { ok: false, skipped: true, error: 'not_configured' }
  }

  const to = normalizeE164(opts.to)
  if (!to) {
    return { ok: false, error: 'invalid_phone_format' }
  }

  await rateLimitGate(to)

  const { token, phoneNumberId } = requireConfig()
  const url = `https://graph.facebook.com/${WHATSAPP_GRAPH_VERSION}/${phoneNumberId}/messages`

  const body = {
    messaging_product: 'whatsapp',
    to: to.replace(/^\+/, ''), // WhatsApp espera sin "+"
    type: 'template',
    template: {
      name: opts.templateName,
      language: { code: opts.language ?? 'es' },
      components: [
        {
          type: 'body',
          parameters: opts.params.map((p) => ({ type: 'text', text: p })),
        },
      ],
    },
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    const json = (await res.json()) as {
      messages?: { id: string }[]
      error?: { message?: string; code?: number }
    }
    if (!res.ok) {
      console.error(
        '[whatsapp] send failed status=%s code=%s',
        res.status,
        json.error?.code ?? 'unknown'
      )
      return { ok: false, error: json.error?.message ?? `http_${res.status}` }
    }
    return { ok: true, messageId: json.messages?.[0]?.id }
  } catch (err) {
    console.error('[whatsapp] network error:', (err as Error).message)
    return { ok: false, error: 'network_error' }
  }
}

// ─── Envío de texto libre (solo dentro de ventana 24h después de inbound) ─────
// Útil para responder a STOP/BAJA con confirmación.

export async function sendWhatsAppText(opts: {
  to: string
  body: string
}): Promise<SendWhatsAppResult> {
  if (!isWhatsAppConfigured()) {
    return { ok: false, skipped: true, error: 'not_configured' }
  }
  const to = normalizeE164(opts.to)
  if (!to) return { ok: false, error: 'invalid_phone_format' }

  await rateLimitGate(to)

  const { token, phoneNumberId } = requireConfig()
  const url = `https://graph.facebook.com/${WHATSAPP_GRAPH_VERSION}/${phoneNumberId}/messages`

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: to.replace(/^\+/, ''),
        type: 'text',
        text: { body: opts.body.slice(0, 1024) },
      }),
    })
    const json = (await res.json()) as {
      messages?: { id: string }[]
      error?: { message?: string }
    }
    if (!res.ok) {
      console.error('[whatsapp] text send failed status=%s', res.status)
      return { ok: false, error: json.error?.message ?? `http_${res.status}` }
    }
    return { ok: true, messageId: json.messages?.[0]?.id }
  } catch (err) {
    console.error('[whatsapp] text network error:', (err as Error).message)
    return { ok: false, error: 'network_error' }
  }
}

// ─── Helper: footer viral compartido entre WA y email ─────────────────────────

export function buildViralFooter(creatorSlug?: string): string {
  const ref = creatorSlug ? `?ref=${encodeURIComponent(creatorSlug)}` : ''
  return `\n\n¿Tú también tienes algo que decir? Abre tu sala en Nebbuler → https://nebbuler.com/abrir${ref}`
}

// ─── Helper: armar template params para "nuevo_post_es" ───────────────────────

export interface NewPostNotificationParams {
  creatorName: string
  postTitle: string
  postUrl: string
  unsubscribeUrl: string
}

export function buildNewPostTemplateParams(
  p: NewPostNotificationParams
): string[] {
  // Orden: creator_name, post_title, post_url, unsubscribe_url
  return [p.creatorName, p.postTitle, p.postUrl, p.unsubscribeUrl]
}

// ─── Helper: template params para "verificacion_codigo" ───────────────────────

export function buildVerificationTemplateParams(code: string): string[] {
  // Orden: codigo (6 dígitos)
  return [code]
}
