'use server'

import { redirect } from 'next/navigation'
import { createClient, createServiceClient } from '@/lib/supabase/server'

function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
  return (
    !url.includes('placeholder') &&
    url.startsWith('https://') &&
    !key.includes('placeholder') &&
    key.length > 20
  )
}

/** Genera un slug único a partir del nombre de la sala */
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // quitar acentos
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export async function createCreatorProfile(
  formData: FormData
): Promise<{ error: string } | { ok: true } | void> {
  const nombre = (formData.get('nombre') as string | null)?.trim() ?? ''
  const especialidad = (formData.get('especialidad') as string | null)?.trim() ?? ''
  const bio = (formData.get('bio') as string | null)?.trim() ?? ''
  const linkedin = (formData.get('linkedin') as string | null)?.trim() ?? ''
  const nombreSala = (formData.get('nombreSala') as string | null)?.trim() ?? ''
  const pitch = (formData.get('pitch') as string | null)?.trim() ?? ''
  const frecuencia = (formData.get('frecuencia') as string | null)?.trim() ?? ''
  const precioRaw = formData.get('precio')
  const precio = precioRaw ? parseInt(String(precioRaw), 10) : 9990

  // Validaciones básicas
  if (!nombre || !especialidad || !bio || !nombreSala || !pitch || !frecuencia) {
    return { error: 'Faltan campos obligatorios.' }
  }

  // Si Supabase no está configurado → simular éxito (demo)
  if (!isSupabaseConfigured()) {
    redirect('/dashboard')
  }

  const supabase = await createClient()

  // Verificar autenticación
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: 'Debes iniciar sesión para crear una sala.' }
  }

  // Garantizar que existe el sala_profile (el trigger puede no haber corrido)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase.from('sala_profiles') as any).upsert(
    {
      id: user.id,
      email: user.email!,
      full_name: user.user_metadata?.full_name ?? null,
      avatar_url: null,
      is_creator: false,
      is_superadmin: false,
    },
    { onConflict: 'id', ignoreDuplicates: true }
  )

  // Verificar si el usuario ya tiene un perfil de creador
  const { data: existing } = await supabase
    .from('sala_creators')
    .select('slug')
    .eq('user_id', user.id)
    .maybeSingle()

  if (existing) {
    redirect('/dashboard')
  }

  // Generar slug único
  let slug = generateSlug(nombreSala)
  if (!slug) slug = generateSlug(nombre)

  // Verificar unicidad del slug y agregar sufijo si es necesario
  const { data: slugConflict } = await supabase
    .from('sala_creators')
    .select('slug')
    .eq('slug', slug)
    .maybeSingle()

  if (slugConflict) {
    slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error: insertError } = await (supabase.from('sala_creators') as any).insert({
    user_id: user.id,
    name: nombre,
    slug,
    specialty: especialidad.toUpperCase(),
    bio,
    bio_long: pitch,
    linkedin_url: linkedin || null,
    price_clp: precio,
    plan: 'free' as const,
    publish_frequency: frecuencia,
    subscriber_count: 0,
    stripe_account_id: null,
    publication_name: nombreSala || null,
    pull_quote: null,
    cover_image_url: null,
  })

  if (insertError) {
    console.error('[createCreatorProfile] insert error:', insertError.message)
    // Sanitizar — nunca exponer error técnico de Postgres al usuario final
    const friendly = insertError.code === '23505'
      ? 'Esa URL ya está tomada. Prueba con otro nombre para tu sala.'
      : 'No se pudo crear el perfil. Inténtalo de nuevo o contáctanos.'
    return { error: friendly }
  }

  // Actualizar el perfil marcándolo como creador
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase.from('sala_profiles') as any).update({ is_creator: true }).eq('id', user.id)

  // No hacer redirect — el cliente necesita continuar al checkout de plataforma
  return { ok: true }
}
