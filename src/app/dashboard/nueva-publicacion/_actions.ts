'use server'

import { redirect } from 'next/navigation'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { sendNewPostNotification } from '@/lib/email'
import { sanitizeHtml, stripHtml } from '@/lib/sanitize'
import type { Creator, Post } from '@/types/database'

interface CreatePostInput {
  title: string
  content: string
  isFree: boolean
  publish: boolean
}

interface UpdatePostInput extends CreatePostInput {
  postId: string
}

interface PostResult {
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
  const words = stripHtml(content).split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}

async function getCreatorForUser(userId: string) {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('sala_creators')
    .select('id, name, slug, publication_name')
    .eq('user_id', userId)
    .maybeSingle()
  if (error) return null
  return data as Pick<Creator, 'id' | 'name' | 'slug' | 'publication_name'> | null
}

export async function createPost(input: CreatePostInput): Promise<PostResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No estás autenticado. Por favor, inicia sesión.' }

  // Validación de slug — un título solo de símbolos/emojis no genera slug válido
  const baseSlug = slugify(input.title)
  if (!baseSlug) {
    return { error: 'El título debe contener al menos una letra o número.' }
  }

  const creator = await getCreatorForUser(user.id)
  if (!creator) return { error: 'No tienes un perfil de creador. Configura tu sala primero.' }

  const safeHtml = sanitizeHtml(input.content)
  const excerpt = stripHtml(safeHtml).slice(0, 200)
  const uniqueSlug = `${baseSlug}-${Date.now().toString(36)}`

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabaseAny = supabase as any
  const { data: postRaw, error: insertError } = await supabaseAny
    .from('sala_posts')
    .insert({
      creator_id: creator.id,
      title: input.title.slice(0, 200),
      content: safeHtml,
      excerpt,
      is_free: input.isFree,
      slug: uniqueSlug,
      read_time_minutes: estimateReadTime(safeHtml),
      published_at: input.publish ? new Date().toISOString() : null,
    })
    .select('id')
    .single()

  const post = postRaw as Pick<Post, 'id'> | null

  if (insertError) {
    console.error('Error inserting post:', insertError)
    return { error: 'Error al guardar la publicación. Inténtalo de nuevo.' }
  }

  if (input.publish && post) {
    await notifySubscribers({
      creatorId: creator.id,
      creatorName: creator.name,
      creatorSlug: creator.slug,
      publicationName: creator.publication_name ?? creator.name,
      postTitle: input.title,
      postExcerpt: excerpt,
      postSlug: uniqueSlug,
      isFree: input.isFree,
    })
  }

  if (input.publish) redirect('/dashboard')
  return { postId: post?.id }
}

export async function updatePost(input: UpdatePostInput): Promise<PostResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No estás autenticado.' }

  if (!slugify(input.title)) {
    return { error: 'El título debe contener al menos una letra o número.' }
  }

  const creator = await getCreatorForUser(user.id)
  if (!creator) return { error: 'No tienes un perfil de creador.' }

  const safeHtml = sanitizeHtml(input.content)
  const excerpt = stripHtml(safeHtml).slice(0, 200)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabaseAny = supabase as any

  // Leer el post para saber si ya estaba publicado
  const { data: existingRaw } = await supabaseAny
    .from('sala_posts')
    .select('id, slug, published_at')
    .eq('id', input.postId)
    .eq('creator_id', creator.id)
    .single()

  const existing = existingRaw as { id: string; slug: string; published_at: string | null } | null
  if (!existing) return { error: 'Publicación no encontrada.' }

  const wasPublished = !!existing.published_at
  const willPublish = input.publish

  const updatePayload: Record<string, unknown> = {
    title: input.title.slice(0, 200),
    content: safeHtml,
    excerpt,
    is_free: input.isFree,
    read_time_minutes: estimateReadTime(safeHtml),
  }
  // Solo establecer published_at la primera vez que se publica
  if (!wasPublished && willPublish) {
    updatePayload.published_at = new Date().toISOString()
  }

  const { error: updateError } = await supabaseAny
    .from('sala_posts')
    .update(updatePayload)
    .eq('id', input.postId)
    .eq('creator_id', creator.id)

  if (updateError) {
    console.error('Error updating post:', updateError)
    return { error: 'Error al actualizar la publicación.' }
  }

  // Notificar solo si recién pasó a publicada
  if (!wasPublished && willPublish) {
    await notifySubscribers({
      creatorId: creator.id,
      creatorName: creator.name,
      creatorSlug: creator.slug,
      publicationName: creator.publication_name ?? creator.name,
      postTitle: input.title,
      postExcerpt: excerpt,
      postSlug: existing.slug,
      isFree: input.isFree,
    })
  }

  if (willPublish) redirect('/dashboard')
  return { postId: existing.id }
}

export async function extractViralQuotes(
  postId: string,
  content: string,
  creatorName: string
): Promise<{ quotes: string[] }> {
  // Verificar que hay sesión activa
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { quotes: [] }

  // Extraer texto plano del HTML — seguro para la IA
  const plainText = content
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 3000)

  if (plainText.length < 100) return { quotes: [] }

  // Intentar con Anthropic SDK si está disponible
  try {
    const Anthropic = (await import('@anthropic-ai/sdk')).default
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 300,
      messages: [{
        role: 'user',
        content: `Eres un experto en marketing de contenido. Del siguiente análisis profesional, extrae las 3 frases más citables: las más contundentes, sorprendentes o que generen más curiosidad. Cada frase debe tener entre 60 y 200 caracteres y ser una idea completa por sí sola.

Devuelve SOLO las 3 frases, una por línea, sin numeración, sin comillas, sin explicaciones.

Texto:
${plainText}`,
      }],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''
    const quotes = text
      .split('\n')
      .map(q => q.trim())
      .filter(q => q.length > 20)
      .slice(0, 3)
    return { quotes }
  } catch {
    // Fallback: extraer oraciones largas manualmente
    const sentences = plainText
      .split(/[.!?]/)
      .map(s => s.trim())
      .filter(s => s.length >= 60 && s.length <= 200)
      .slice(0, 3)
    return { quotes: sentences }
  }
}

async function notifySubscribers(args: {
  creatorId: string
  creatorName: string
  creatorSlug: string
  publicationName: string
  postTitle: string
  postExcerpt: string
  postSlug: string
  isFree: boolean
}) {
  try {
    const serviceClient = createServiceClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const serviceAny = serviceClient as any

    const { data: subscriptions } = await serviceAny
      .from('sala_subscriptions')
      .select('subscriber_id')
      .eq('creator_id', args.creatorId)
      .eq('status', 'active')

    if (!subscriptions || subscriptions.length === 0) return

    const subscriberIds = subscriptions.map((s: { subscriber_id: string }) => s.subscriber_id)
    const { data: profiles } = await serviceAny
      .from('sala_profiles')
      .select('email')
      .in('id', subscriberIds)

    const emails: string[] = (profiles ?? [])
      .map((p: { email: string }) => p.email)
      .filter(Boolean)

    if (emails.length === 0) return

    await sendNewPostNotification({
      subscriberEmails: emails,
      creatorName: args.creatorName,
      creatorSlug: args.creatorSlug,
      publicationName: args.publicationName,
      postTitle: args.postTitle,
      postExcerpt: args.postExcerpt,
      postSlug: args.postSlug,
      isFree: args.isFree,
    })
  } catch (err) {
    console.error('[notifySubscribers] error:', err)
  }
}
