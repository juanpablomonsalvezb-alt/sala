import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

// ─── GET /api/unsubscribe?token=<hex48> ──────────────────────────────────────
// Procesa el click en "Cancelar suscripción" del email.
// Valida el token, cancela la suscripción y muestra una página de confirmación.

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token') ?? ''

  if (!token || token.length < 40) {
    return htmlResponse('Token de cancelación inválido.', false)
  }

  const supabase = createServiceClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any

  // Buscar el token
  const { data: row, error: findErr } = await db
    .from('sala_unsubscribe_tokens')
    .select('subscriber_id, creator_id, expires_at')
    .eq('token', token)
    .maybeSingle()

  if (findErr || !row) {
    return htmlResponse('Este link ya fue usado o no es válido.', false)
  }

  if (new Date(row.expires_at) < new Date()) {
    return htmlResponse(
      'Este link de cancelación expiró (30 días). Puedes cancelar tu suscripción directamente desde nebbuler.com/dashboard.',
      false
    )
  }

  // Cancelar la suscripción
  await db
    .from('sala_subscriptions')
    .update({ status: 'cancelled', cancelled_at: new Date().toISOString() })
    .eq('subscriber_id', row.subscriber_id)
    .eq('creator_id', row.creator_id)
    .eq('status', 'active')

  // Invalidar el token para que no se reutilice
  await db
    .from('sala_unsubscribe_tokens')
    .delete()
    .eq('token', token)

  return htmlResponse(
    'Suscripción cancelada correctamente. Ya no recibirás más emails de este creador.',
    true
  )
}

// ─── POST /api/unsubscribe  (List-Unsubscribe-Post one-click) ─────────────────
// Los clientes de email como Gmail envían POST para el unsubscribe de un clic.

export async function POST(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token') ?? ''

  if (!token || token.length < 40) {
    return NextResponse.json({ error: 'token_invalid' }, { status: 400 })
  }

  const supabase = createServiceClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any

  const { data: row } = await db
    .from('sala_unsubscribe_tokens')
    .select('subscriber_id, creator_id, expires_at')
    .eq('token', token)
    .maybeSingle()

  if (!row || new Date(row.expires_at) < new Date()) {
    return NextResponse.json({ error: 'token_expired' }, { status: 410 })
  }

  await db
    .from('sala_subscriptions')
    .update({ status: 'cancelled', cancelled_at: new Date().toISOString() })
    .eq('subscriber_id', row.subscriber_id)
    .eq('creator_id', row.creator_id)
    .eq('status', 'active')

  await db
    .from('sala_unsubscribe_tokens')
    .delete()
    .eq('token', token)

  return NextResponse.json({ ok: true })
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function htmlResponse(message: string, success: boolean): NextResponse {
  const accentColor = success ? '#121212' : '#C41C1C'
  const iconHtml = success
    ? `<div style="width:48px;height:48px;background:#121212;border-radius:50%;margin:0 auto 24px;display:flex;align-items:center;justify-content:center;">
         <span style="color:#fff;font-size:22px;line-height:1;">&#10003;</span>
       </div>`
    : `<div style="width:48px;height:48px;background:#C41C1C;border-radius:50%;margin:0 auto 24px;display:flex;align-items:center;justify-content:center;">
         <span style="color:#fff;font-size:22px;line-height:1;">&#33;</span>
       </div>`

  const body = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nebbuler — Cancelar suscripción</title>
</head>
<body style="margin:0;padding:40px 20px;background:#F7F7F7;font-family:Georgia,serif;text-align:center;">
  <div style="background:#FFFFFF;max-width:480px;margin:0 auto;padding:0;">
    <div style="height:4px;background:#C41C1C;"></div>
    <div style="padding:48px 40px;">
      ${iconHtml}
      <p style="margin:0 0 8px;font-family:Arial,sans-serif;font-size:10px;font-weight:bold;letter-spacing:3px;color:#999999;text-transform:uppercase;">NEBBULER</p>
      <p style="font-size:15px;color:${accentColor};line-height:1.7;margin:16px 0 28px;font-family:Arial,sans-serif;">${message}</p>
      <a href="https://nebbuler.com"
         style="display:inline-block;background:#121212;color:#FFFFFF;font-family:Arial,sans-serif;font-size:10px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;padding:12px 24px;text-decoration:none;">
        Ir a Nebbuler &rarr;
      </a>
    </div>
  </div>
</body>
</html>`

  return new NextResponse(body, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}
