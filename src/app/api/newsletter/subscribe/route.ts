import { NextRequest, NextResponse } from 'next/server'
import { rateLimit, getClientIp } from '@/lib/rateLimit'

export async function POST(req: NextRequest) {
  // Rate limit: 5 suscripciones / hora por IP
  const ip = getClientIp(req.headers)
  const rl = rateLimit(`newsletter:${ip}`, 10, 60 * 60 * 1000)
  if (!rl.allowed) {
    return NextResponse.json(
      { ok: false, error: 'Demasiadas solicitudes' },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } }
    )
  }

  const { email } = await req.json()
  // eslint-disable-next-line no-control-regex
  if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || /[\r\n\x00]/.test(email)) {
    return NextResponse.json({ ok: false, error: 'Email inválido' }, { status: 400 })
  }
  // TODO: integrar con Resend para lista founder newsletter
  console.log('[newsletter] nueva suscripción:', email)
  return NextResponse.json({ ok: true })
}
