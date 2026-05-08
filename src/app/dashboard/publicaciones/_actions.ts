'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { Creator } from '@/types/database'

export async function deletePost(formData: FormData) {
  const postId = formData.get('postId') as string
  if (!postId) return

  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return

  const { data: creatorRaw } = await db
    .from('creators')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle()

  const creator = creatorRaw as Pick<Creator, 'id'> | null
  if (!creator) return

  await db
    .from('posts')
    .delete()
    .eq('id', postId)
    .eq('creator_id', creator.id)

  revalidatePath('/dashboard/publicaciones')
  revalidatePath('/dashboard')
}

export async function unpublishPost(formData: FormData) {
  const postId = formData.get('postId') as string
  if (!postId) return

  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return

  const { data: creatorRaw } = await db
    .from('creators')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle()

  const creator = creatorRaw as Pick<Creator, 'id'> | null
  if (!creator) return

  await db
    .from('posts')
    .update({ published_at: null })
    .eq('id', postId)
    .eq('creator_id', creator.id)

  revalidatePath('/dashboard/publicaciones')
  revalidatePath('/dashboard')
}
