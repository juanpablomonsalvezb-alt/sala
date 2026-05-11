import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

/**
 * POST /api/mp/disconnect
 * Elimina los tokens MP del creador autenticado.
 * Los suscriptores activos no se ven afectados (sus pagos ya están registrados).
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://nebbuler.com'

  if (authError || !user) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 })
  }

  const service = createServiceClient()

  const { error: updateError } = await service
    .from('sala_creators')
    .update({
      mp_access_token:  null,
      mp_refresh_token: null,
      mp_user_id:       null,
      mp_connected_at:  null,
    })
    .eq('user_id', user.id)

  if (updateError) {
    console.error('[mp/disconnect] DB error:', updateError)
    return NextResponse.json({ error: 'Error al desconectar.' }, { status: 500 })
  }

  return NextResponse.redirect(
    new URL('/dashboard/configuracion?mp_disconnected=1', baseUrl)
  )
}
