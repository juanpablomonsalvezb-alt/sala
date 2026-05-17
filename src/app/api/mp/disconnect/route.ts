import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

/**
 * POST /api/mp/disconnect
 *
 * 1. Revoca el access_token en MP (fix I6).
 * 2. Borra el row de sala_creator_secrets (fix C10).
 * 3. Reporta suscripciones activas afectadas (fix I7).
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://nebbuler.com'

  if (authError || !user) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 })
  }

  const service = createServiceClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = service as any

  // Buscar creator del usuario
  const { data: creatorRow } = await db
    .from('sala_creators')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle()

  const creator = creatorRow as { id: string } | null
  if (!creator?.id) {
    return NextResponse.json({ error: 'Creador no encontrado.' }, { status: 404 })
  }

  // Leer secret actual + contar suscripciones activas (en paralelo)
  const [secretRes, subsRes] = await Promise.all([
    db
      .from('sala_creator_secrets')
      .select('mp_access_token')
      .eq('creator_id', creator.id)
      .maybeSingle(),
    db
      .from('sala_subscriptions')
      .select('id', { count: 'exact', head: true })
      .eq('creator_id', creator.id)
      .eq('status', 'active'),
  ])

  const secret = secretRes.data as { mp_access_token: string | null } | null
  const activeSubsThisCreator = subsRes.count ?? 0

  // FIX I6: revocar token en MP antes de borrarlo (best-effort)
  if (secret?.mp_access_token) {
    try {
      await fetch('https://api.mercadopago.com/oauth/revoke', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id:     process.env.MP_APP_ID,
          client_secret: process.env.MP_CLIENT_SECRET,
          token:         secret.mp_access_token,
        }),
      })
    } catch (revokeErr) {
      console.error('[mp/disconnect] revoke en MP falló:', revokeErr)
    }
  }

  // Borrar row de secrets (FK ON DELETE CASCADE haría lo mismo si borrara
  // sala_creators, pero acá solo borramos el secret).
  const { error: deleteError } = await db
    .from('sala_creator_secrets')
    .delete()
    .eq('creator_id', creator.id)

  if (deleteError) {
    console.error('[mp/disconnect] delete secret error:', deleteError)
    return NextResponse.json({ error: 'Error al desconectar.' }, { status: 500 })
  }

  // FIX I7: warning si quedan suscriptores afectados
  const params = new URLSearchParams({ mp_disconnected: '1' })
  if (activeSubsThisCreator > 0) {
    params.set('active_subs', String(activeSubsThisCreator))
  }

  return NextResponse.redirect(
    new URL(`/dashboard/configuracion?${params.toString()}`, baseUrl)
  )
}
