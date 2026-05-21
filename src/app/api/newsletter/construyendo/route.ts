import { NextRequest, NextResponse } from 'next/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const email = formData.get('email') as string
    const name = formData.get('name') as string | null

    if (!email?.trim()) {
      return NextResponse.json(
        { error: 'El email es requerido' },
        { status: 400 }
      )
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'El email no es válido' },
        { status: 400 }
      )
    }

    // Legacy SERVICE_ROLE_KEY (JWT) deshabilitada por Supabase 2026-04-19.
    // Sin fallback a anon: anon no bypasea RLS para insertar suscripciones.
    const serviceRoleKey =
      process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!serviceRoleKey) {
      console.error('[newsletter/construyendo] SUPABASE_SECRET_KEY missing')
      return NextResponse.json(
        { error: 'Servicio temporalmente no disponible.' },
        { status: 500 }
      )
    }
    const supabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      serviceRoleKey
    )

    const { data, error } = await supabase
      .from('sala_newsletter_subscriptions')
      .insert({
        email: email.trim(),
        name: name?.trim() || null,
        newsletter_type: 'construyendo',
        subscribed: true,
        created_at: new Date().toISOString(),
      })
      .select()

    if (error) {
      console.error('Newsletter subscription error:', error)
      return NextResponse.json(
        { error: 'Error al procesar la suscripción' },
        { status: 500 }
      )
    }

    // Redirect to success page or return success
    const requestUrl = request.nextUrl.clone()
    requestUrl.pathname = '/construyendo/exito'
    return NextResponse.redirect(requestUrl, { status: 303 })
  } catch (error) {
    console.error('Newsletter API error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
