'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export interface UpdateCreatorInput {
  name: string
  specialty: string
  bio: string
  bio_long: string
  linkedin_url: string
  publish_frequency: string
  price_clp: number
}

export interface UpdateCreatorResult {
  error?: string
  success?: boolean
}

export async function updateCreatorProfile(
  input: UpdateCreatorInput
): Promise<UpdateCreatorResult> {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: 'No estás autenticado.' }
  }

  const { error } = await db
    .from('creators')
    .update({
      name: input.name,
      specialty: input.specialty,
      bio: input.bio,
      bio_long: input.bio_long || null,
      linkedin_url: input.linkedin_url || null,
      publish_frequency: input.publish_frequency,
      price_clp: input.price_clp,
    })
    .eq('user_id', user.id)

  if (error) {
    console.error('Error updating creator:', error)
    return { error: 'Error al guardar los cambios. Inténtalo de nuevo.' }
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/configuracion')

  return { success: true }
}
