'use server'

import { createClient } from '@/lib/supabase/server'

// Mapeo estático: interés declarado por el lector → palabras clave a buscar
// en `sala_creators.specialty` (texto libre, en mayúsculas). No existe hoy
// una taxonomía de temas conectada a creadores (`sala_disciplines` está en
// el schema pero nunca se escribe desde la app), así que este es un match
// best-effort con fallback a los creadores más recientes.
const INTEREST_KEYWORDS: Record<string, string[]> = {
  'Macroeconomía': ['ECONOM'],
  'Derecho tributario': ['ABOGAD', 'DERECHO', 'CONTADOR', 'TRIBUTAR'],
  'Finanzas personales': ['FINANC', 'CONTADOR', 'ECONOM'],
  'Salud pública': ['MÉDIC', 'MEDIC', 'SALUD', 'NUTRICION'],
  'Urbanismo': ['ARQUITECT', 'INGENIER'],
  'Tecnología': ['INGENIER', 'TECNOLOG', 'DISEÑADOR'],
  'Mercados': ['ECONOM', 'FINANC'],
  'Política económica': ['ECONOM', 'POLÍTIC', 'POLITIC'],
  'Negocios': ['EMPRESARI', 'FINANC', 'ECONOM'],
  'Educación': ['DOCENT', 'PROFESOR', 'EDUCAD'],
  'Derecho laboral': ['ABOGAD', 'DERECHO'],
  'Medio ambiente': ['AMBIENT', 'INGENIER'],
}

export type RecommendedCreator = {
  id: string
  slug: string
  name: string
  specialty: string
  postCount: number
}

async function withPostCounts(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  creators: { id: string; slug: string; name: string; specialty: string }[]
): Promise<RecommendedCreator[]> {
  return Promise.all(
    creators.map(async (c) => {
      const { count } = await supabase
        .from('sala_posts')
        .select('*', { count: 'exact', head: true })
        .eq('creator_id', c.id)
      return { ...c, postCount: count ?? 0 }
    })
  )
}

export async function getRecommendedCreators(interests: string[]): Promise<RecommendedCreator[]> {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any

  const keywords = Array.from(
    new Set(interests.flatMap((i) => INTEREST_KEYWORDS[i] ?? []))
  )

  if (keywords.length > 0) {
    const orFilter = keywords.map((k) => `specialty.ilike.%${k}%`).join(',')
    const { data: matched } = await db
      .from('sala_creators')
      .select('id, slug, name, specialty')
      .neq('plan', 'free')
      .or(orFilter)
      .order('created_at', { ascending: false })
      .limit(3)

    if (matched && matched.length > 0) {
      return withPostCounts(db, matched)
    }
  }

  // Sin coincidencias (o sin intereses) — los 3 más recientes con sala pública.
  const { data: recent } = await db
    .from('sala_creators')
    .select('id, slug, name, specialty')
    .neq('plan', 'free')
    .order('created_at', { ascending: false })
    .limit(3)

  return withPostCounts(db, recent ?? [])
}

export type OnboardingAnswers = {
  profession: string
  interests: string[]
  content_frequency: string
}

export async function completeOnboarding(data: OnboardingAnswers | null): Promise<{ error: string } | { ok: true }> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: 'No hay sesión activa.' }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from('sala_profiles') as any)
    .update(
      data
        ? {
            onboarding_completed: true,
            profession: data.profession,
            interests: data.interests,
            content_frequency: data.content_frequency,
          }
        : { onboarding_completed: true }
    )
    .eq('id', user.id)

  if (error) {
    console.error('[completeOnboarding] update error:', error.message)
    return { error: 'No se pudo guardar. Inténtalo de nuevo.' }
  }

  return { ok: true }
}
