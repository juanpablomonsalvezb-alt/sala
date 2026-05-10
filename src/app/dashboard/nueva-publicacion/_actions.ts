'use server'

import { redirect } from 'next/navigation'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { sendNewPostNotification } from '@/lib/email'
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

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 200)
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabaseAny = supabase as any

  // Obtener creator con datos completos para el email
  const { data: creatorRaw, error: creatorError } = await supabaseAny
    .from('sala_creators')
    .select('id, name, slug, publication_name')
    .eq('user_id', user.id)
    .maybeSingle()

  const creator = creatorRaw as (Pick<Creator, 'id' | 'name' | 'slug' | 'publication_name'> | null)

  if (creatorError || !creator) {
    return { error: 'No tienes un perfil de creador. Configura tu sala primero.' }
  }

  const baseSlug = slugify(input.title)
  const uniqueSlug = `${baseSlug}-${Date.now().toString(36)}`
  const excerpt = stripHtml(input.content)

  const { data: postRaw, error: insertError } = await supabaseAny
    .from('sala_posts')
    .insert({
      creator_id: creator.id,
      title: input.title,
      content: input.content,
      excerpt,
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

  // Enviar emails a suscriptores activos cuando se publica
  if (input.publish && post) {
    try {
      const serviceClient = createServiceClient()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const serviceAny = serviceClient as any

      // Obtener emails de suscriptores activos
      const { data: subscriptions } = await serviceAny
        .from('sala_subscriptions')
        .select('subscriber_id')
        .eq('creator_id', creator.id)
        .eq('status', 'active')

      if (subscriptions && subscriptions.length > 0) {
        const subscriberIds = subscriptions.map((s: { subscriber_id: string }) => s.subscriber_id)

        const { data: profiles } = await serviceAny
          .from('sala_profiles')
          .select('email')
          .in('id', subscriberIds)

        const emails: string[] = (profiles ?? [])
          .map((p: { email: string }) => p.email)
          .filter(Boolean)

        if (emails.length > 0) {
          await sendNewPostNotification({
            subscriberEmails: emails,
            creatorName: creator.name,
            creatorSlug: creator.slug,
            publicationName: creator.publication_name ?? creator.name,
            postTitle: input.title,
            postExcerpt: excerpt,
            postSlug: uniqueSlug,
            isFree: input.isFree,
          })
        }
      }
    } catch (emailErr) {
      // El email falla silenciosamente — el post ya fue publicado
      console.error('[createPost] error enviando emails:', emailErr)
    }
  }

  if (input.publish) {
    redirect('/dashboard')
  }

  return { postId: post?.id }
}
