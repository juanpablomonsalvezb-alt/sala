import { NextRequest, NextResponse } from 'next/server'

export async function GET(_req: NextRequest) {
  // Por ahora devuelve 0 — cuando se implemente la tabla sala_referrals en Supabase,
  // se actualizará aquí para consultar el conteo real por ref_code del referrer_id.
  return NextResponse.json({ count: 0 })
}
