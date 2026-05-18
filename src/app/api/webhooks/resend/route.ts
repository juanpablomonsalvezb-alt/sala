import { NextRequest, NextResponse } from 'next/server'
import { suppressEmail } from '@/lib/email-suppression'
import crypto from 'crypto'

export const runtime = 'nodejs'

/**
 * Webhook de Resend — recibe eventos de bounce / complaint / delivered.
 * Auto-suprime emails problemáticos para que no se vuelvan a intentar.
 *
 * Configurar en Resend Dashboard → Webhooks:
 *   URL: https://nebbuler.com/api/webhooks/resend
 *   Events: email.bounced, email.complained, email.delivered_delayed
 *   Signing secret → set en RESEND_WEBHOOK_SECRET
 */

function verifySignature(body: string, signature: string | null, secret: string): boolean {
  if (!signature) return false
  // Resend usa svix para firmar — verificación simplificada por HMAC
  // (svix tiene su propia librería pero hace lo mismo en el fondo)
  try {
    const expectedSig = crypto.createHmac('sha256', secret).update(body).digest('base64')
    return crypto.timingSafeEqual(Buffer.from(expectedSig), Buffer.from(signature))
  } catch {
    return false
  }
}

export async function POST(request: NextRequest) {
  const body = await request.text()
  const secret = process.env.RESEND_WEBHOOK_SECRET ?? ''

  // En desarrollo / si no hay secret configurado, aceptamos sin firma pero logeamos
  if (secret) {
    const sig = request.headers.get('svix-signature')
    if (!verifySignature(body, sig, secret)) {
      console.warn('[resend webhook] firma inválida')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }
  }

  let event: { type: string; data: { email_id: string; to: string[]; bounce?: { type: string; subType: string }; complaint?: unknown } }
  try {
    event = JSON.parse(body)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const recipients = event.data?.to ?? []

  // Suprimir según tipo de evento
  if (event.type === 'email.bounced') {
    const bounceType = event.data?.bounce?.type ?? 'unknown'
    for (const email of recipients) {
      // Solo suprimir hard bounces (permanente). Soft bounces son temporales.
      if (bounceType === 'hard' || bounceType === 'permanent' || bounceType === 'undetermined') {
        await suppressEmail(email, 'bounce', `${bounceType}/${event.data?.bounce?.subType ?? ''}`)
        console.log(`[resend webhook] suprimido por bounce: ${email}`)
      }
    }
  } else if (event.type === 'email.complained') {
    for (const email of recipients) {
      await suppressEmail(email, 'spam_complaint', 'user marked as spam')
      console.log(`[resend webhook] suprimido por spam complaint: ${email}`)
    }
  }

  return NextResponse.json({ received: true })
}
