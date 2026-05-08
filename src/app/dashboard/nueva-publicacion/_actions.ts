'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Creator, Post } from '@/types/database'

interface CreatePostInput {
  title: string
  content: string
  isFree: boolean
  publish: boolean
}

interface CreatePostResult {
  error?: string
  postId?: string
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80)
}

function estimateReadTime(content: string): number {
  const words = content.trim().split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
}

export async function createPost(input: CreatePostInput): Promise<CreatePostResult> {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: 'No estás autenticado. Por favor, inicia sesión.' }
  }

  // Obtener creator del usuario
  const { data: creatorRaw, error: creatorError } = await supabase
    .from('creators')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const creator = creatorRaw as (Pick<Creator, 'id'> | null)

  if (creatorError || !creator) {
    return { error: 'No tienes un perfil de creador. Configura tu sala primero.' }
  }

  const baseSlug = slugify(input.title)
  const uniqueSlug = `${baseSlug}-${Date.now().toString(36)}`

  // Usamos any para evitar el conflicto con never[] del tipo generado
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabaseAny = supabase as any

  const { data: postRaw, error: insertError } = await supabaseAny
    .from('posts')
    .insert({
      creator_id: creator.id,
      title: input.title,
      content: input.content,
      excerpt: input.content.slice(0, 160) || null,
      is_free: input.isFree,
      slug: uniqueSlug,
      read_time_minutes: estimateReadTime(input.content),
      published_at: input.publish ? new Date().toISOString() : null,
    })
    .select('id')
    .single()

  const post = postRaw as Pick<Post, 'id'> | null

  if (insertError) {
    console.error('Error inserting post:', insertError)
    return { error: 'Error al guardar la publicación. Inténtalo de nuevo.' }
  }

  if (input.publish) {
    redirect('/dashboard')
  }

  return { postId: post?.id }
}
