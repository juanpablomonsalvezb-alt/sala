import { NextRequest, NextResponse } from 'next/server'
import { verifyWebhookSignature } from '@/lib/lemonsqueezy'
import { createServiceClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const rawBody = await request.text()
  const signature = request.headers.get('x-signature') ?? ''

  if (!verifyWebhookSignature(rawBody, signature)) {
    console.warn('[ls/webhook] firma inválida')
    return NextResponse.json({ error: 'Firma inválida' }, { status: 400 })
  }

  let payload: Record<string, unknown>
  try {
    payload = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 })
  }

  const meta = payload?.meta as Record<string, unknown> | undefined
  const eventName = meta?.event_name as string | undefined
  const customData = meta?.custom_data as Record<string, string> | undefined

  // Solo procesar eventos de suscripción activa
  if (eventName !== 'subscription_created' && eventName !== 'order_created') {
    return NextResponse.json({ received: true })
  }

  const creatorId = customData?.creator_id
  const userId = customData?.user_id

  if (!creatorId || !userId) {
    console.warn('[ls/webhook] sin creator_id o user_id en custom_data')
    return NextResponse.json({ received: true })
  }

  const supabase = await createServiceClient()

  // Activar el plan del creador
  const { error } = await supabase
    .from('sala_creators')
    .update({ plan: 'creator' })
    .eq('id', creatorId)
    .eq('user_id', userId)

  if (error) {
    console.error('[ls/webhook] error activando plan:', error.message)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }

  console.log(`[ls/webhook] Plan activado para creador ${creatorId}`)
  return NextResponse.json({ received: true })
}
