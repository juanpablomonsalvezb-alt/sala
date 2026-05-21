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

// Tiers permitidos de precio mensual (CLP). Cambios aquí requieren actualizar
// el selector del form (page.tsx) y la documentación de pricing.
// Rango duro: [1000, 100000] para evitar fraude (precio 1 CLP o 99M CLP).
const ALLOWED_PRICE_TIERS = [4990, 7990, 9990, 14990, 19990, 29990] as const
const PRICE_MIN_CLP = 1000
const PRICE_MAX_CLP = 100000

function sanitizeString(value: unknown, max: number): string {
  if (typeof value !== 'string') return ''
  return value.trim().slice(0, max)
}

function sanitizeOptionalString(value: unknown, max: number): string | null {
  const trimmed = sanitizeString(value, max)
  return trimmed.length > 0 ? trimmed : null
}

function validatePriceClp(price: unknown): number | null {
  if (typeof price !== 'number' || !Number.isFinite(price) || !Number.isInteger(price)) {
    return null
  }
  if (price < PRICE_MIN_CLP || price > PRICE_MAX_CLP) return null
  // Permitir tiers conocidos directamente; cualquier otro valor debe estar dentro
  // del rango duro (por flexibilidad futura) pero ser múltiplo de 10.
  if ((ALLOWED_PRICE_TIERS as readonly number[]).includes(price)) return price
  return price % 10 === 0 ? price : null
}

const ALLOWED_FREQUENCIES = ['diaria', 'semanal', 'quincenal', 'mensual', 'irregular'] as const

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

  // Validación server-side estricta
  const name = sanitizeString(input.name, 100)
  const specialty = sanitizeString(input.specialty, 100)
  const bio = sanitizeString(input.bio, 280)
  const bio_long = sanitizeOptionalString(input.bio_long, 4000)
  const linkedin_url = sanitizeOptionalString(input.linkedin_url, 500)
  const frequency = sanitizeString(input.publish_frequency, 50).toLowerCase()
  const price = validatePriceClp(input.price_clp)

  if (!name || name.length < 2) {
    return { error: 'El nombre es requerido (mínimo 2 caracteres).' }
  }
  if (!specialty || specialty.length < 2) {
    return { error: 'La especialidad es requerida.' }
  }
  if (!bio || bio.length < 10) {
    return { error: 'La bio es requerida (mínimo 10 caracteres).' }
  }
  if (linkedin_url && !/^https?:\/\/(www\.)?linkedin\.com\//i.test(linkedin_url)) {
    return { error: 'URL de LinkedIn inválida.' }
  }
  if (!(ALLOWED_FREQUENCIES as readonly string[]).includes(frequency)) {
    return { error: 'Frecuencia de publicación inválida.' }
  }
  if (price === null) {
    return {
      error: `Precio inválido. Debe estar entre $${PRICE_MIN_CLP.toLocaleString('es-CL')} y $${PRICE_MAX_CLP.toLocaleString('es-CL')} CLP.`,
    }
  }

  const { error } = await db
    .from('sala_creators')
    .update({
      name,
      specialty,
      bio,
      bio_long,
      linkedin_url,
      publish_frequency: frequency,
      price_clp: price,
    })
    .eq('user_id', user.id)

  if (error) {
    console.error('Error updating creator:', error.code, error.message)
    return { error: 'Error al guardar los cambios. Inténtalo de nuevo.' }
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/configuracion')

  return { success: true }
}
