import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

/**
 * POST /api/mp/disconnect
 *
 * Desconecta MercadoPago del creador autenticado:
 *   1. Revoca el access_token en MP (fix I6) — el token deja de servir
 *      aunque alguien lo robe de un backup.
 *   2. Borra los tokens de la BD.
 *   3. Informa cuántas suscripciones activas quedan sin procesador (fix I7).
 *
 * Nota: las suscripciones activas NO se cancelan automáticamente porque
 * MP las cobra desde su lado mientras el preapproval esté authorized. Pero
 * sí avisamos al creador para que tome acción.
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://nebbuler.com'

  if (authError || !user) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 })
  }

  const service = createServiceClient()

  // Leer tokens actuales y contar suscripciones activas (en paralelo)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = service as any
  const [creatorRes, subsRes] = await Promise.all([
    db
      .from('sala_creators')
      .select('id, mp_access_token, mp_user_id')
      .eq('user_id', user.id)
      .maybeSingle(),
    db
      .from('sala_subscriptions')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'active'),
  ])

  const creator = creatorRes.data as
    | { id: string; mp_access_token: string | null; mp_user_id: string | null }
    | null
  const activeSubs = subsRes.count ?? 0

  // Filtrar suscripciones activas del CREADOR específico
  let activeSubsThisCreator = 0
  if (creator?.id) {
    const { count } = await db
      .from('sala_subscriptions')
      .select('id', { count: 'exact', head: true })
      .eq('creator_id', creator.id)
      .eq('status', 'active')
    activeSubsThisCreator = count ?? 0
  }

  // FIX I6: revocar token en MP antes de borrarlo (best-effort)
  if (creator?.mp_access_token) {
    try {
      await fetch('https://api.mercadopago.com/oauth/revoke', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id:     process.env.MP_APP_ID,
          client_secret: process.env.MP_CLIENT_SECRET,
          token:         creator.mp_access_token,
        }),
      })
    } catch (revokeErr) {
      // No bloqueamos la desconexión si MP no responde — el creador igual
      // quiere que borremos los tokens de nuestra BD.
      console.error('[mp/disconnect] revoke en MP falló:', revokeErr)
    }
  }

  // Borrar tokens
  const { error: updateError } = await db
    .from('sala_creators')
    .update({
      mp_access_token:     null,
      mp_refresh_token:    null,
      mp_user_id:          null,
      mp_connected_at:     null,
      mp_token_expires_at: null,
    })
    .eq('user_id', user.id)

  if (updateError) {
    console.error('[mp/disconnect] DB error:', updateError)
    return NextResponse.json({ error: 'Error al desconectar.' }, { status: 500 })
  }

  // FIX I7: redirigir con info de impacto si quedan suscriptores activos
  const params = new URLSearchParams({ mp_disconnected: '1' })
  if (activeSubsThisCreator > 0) {
    params.set('active_subs', String(activeSubsThisCreator))
  }

  return NextResponse.redirect(
    new URL(`/dashboard/configuracion?${params.toString()}`, baseUrl)
  )
}
