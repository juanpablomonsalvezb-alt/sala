import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { email } = await req.json()
  if (!email || !email.includes('@')) {
    return NextResponse.json({ ok: false, error: 'Email inválido' }, { status: 400 })
  }
  // TODO: integrar con Resend para lista founder newsletter
  console.log('[newsletter] nueva suscripción:', email)
  return NextResponse.json({ ok: true })
}
