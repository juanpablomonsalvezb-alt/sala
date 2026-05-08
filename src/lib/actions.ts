'use server'

import { createClient } from '@/lib/supabase/server'
import type { Creator, Post, Profile } from '@/types/database'

// ─── getCreatorBySlug ─────────────────────────────────────────────────────────
// Retorna el creator por su slug público, o null si no existe.

export async function getCreatorBySlug(slug: string): Promise<Creator | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('creators')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !data) return null

  return data as Creator
}

// ─── getPostsByCreator ────────────────────────────────────────────────────────
// Retorna los posts publicados de un creator.
// Si isSubscribed=false, solo retorna posts gratuitos.
// Si isSubscribed=true, retorna todos los posts publicados.

export async function getPostsByCreator(
  creatorId: string,
  isSubscribed: boolean
): Promise<Post[]> {
  const supabase = await createClient()

  let query = supabase
    .from('posts')
    .select('*')
    .eq('creator_id', creatorId)
    .not('published_at', 'is', null)
    .lte('published_at', new Date().toISOString())
    .order('published_at', { ascending: false })

  if (!isSubscribed) {
    query = query.eq('is_free', true)
  }

  const { data, error } = await query

  if (error || !data) return []

  return data as Post[]
}

// ─── getSubscriptionStatus ────────────────────────────────────────────────────
// Retorna true si el usuario autenticado tiene una suscripción activa
// con el creator dado. Retorna false si no hay sesión o no está suscrito.

export async function getSubscriptionStatus(creatorId: string): Promise<boolean> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return false

  const { data, error } = await supabase
    .from('subscriptions')
    .select('id')
    .eq('creator_id', creatorId)
    .eq('subscriber_id', user.id)
    .eq('status', 'active')
    .maybeSingle()

  if (error || !data) return false

  return true
}

// ─── getCurrentUser ───────────────────────────────────────────────────────────
// Retorna el Profile del usuario autenticado, o null si no hay sesión.

export async function getCurrentUser(): Promise<Profile | null> {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) return null

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error || !data) return null

  return data as Profile
}
