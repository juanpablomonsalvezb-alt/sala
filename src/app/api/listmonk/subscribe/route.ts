// Listmonk newsletter subscription — NEWSLETTER_ENABLED=true/false
// Separate from the existing /api/newsletter/subscribe route
// Proxies to Listmonk Docker service. Gracefully returns 503 if not configured.

import { NextRequest, NextResponse } from 'next/server'
import { subscribeToNewsletter } from '@/lib/listmonk/client'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { email?: string; name?: string }
    const { email, name } = body

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 })
    }

    const result = await subscribeToNewsletter(email, name)

    if (!result.ok && result.error?.includes('not configured')) {
      return NextResponse.json(
        { error: 'Newsletter temporalmente no disponible', ok: false },
        { status: 503 }
      )
    }

    if (result.alreadySubscribed) {
      return NextResponse.json({ ok: true, message: 'Ya estás suscrito' })
    }

    if (!result.ok) {
      return NextResponse.json({ error: 'Error al suscribir', ok: false }, { status: 500 })
    }

    return NextResponse.json({ ok: true, message: '¡Suscrito exitosamente!' })
  } catch {
    return NextResponse.json({ error: 'Error interno', ok: false }, { status: 500 })
  }
}
