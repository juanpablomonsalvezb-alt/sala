import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token') ?? ''

  if (!token || token.length < 40) {
    return NextResponse.json({ ok: false, error: 'Token inválido' }, { status: 400 })
  }

  const supabase = createServiceClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any

  const { data: row, error: findErr } = await db
    .from('boletin_unsubscribe_tokens')
    .select('user_id')
    .eq('token', token)
    .maybeSingle()

  if (findErr || !row) {
    return NextResponse.json({ ok: false, error: 'Token no encontrado o ya utilizado' }, { status: 404 })
  }

  // Marcar al usuario como desuscrito del boletín
  const { error: updateErr } = await db
    .from('sala_profiles')
    .update({ boletin_activo: false })
    .eq('id', row.user_id)

  if (updateErr) {
    console.error('[boletin/desuscribir] Error al actualizar perfil:', updateErr)
    return NextResponse.json({ ok: false, error: 'Error interno al procesar la desuscripción' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}

export async function POST(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token') ?? ''

  if (!token || token.length < 40) {
    return NextResponse.json({ ok: false, error: 'Token inválido' }, { status: 400 })
  }

  const supabase = createServiceClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any

  const { data: row } = await db
    .from('boletin_unsubscribe_tokens')
    .select('user_id')
    .eq('token', token)
    .maybeSingle()

  if (!row) {
    return NextResponse.json({ ok: false, error: 'Token no encontrado' }, { status: 404 })
  }

  await db
    .from('sala_profiles')
    .update({ boletin_activo: false })
    .eq('id', row.user_id)

  return NextResponse.json({ ok: true })
}
