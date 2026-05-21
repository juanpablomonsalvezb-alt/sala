// Helpers compartidos del sistema de invitaciones VIP.
// Formato de código: 4 segmentos de 4 chars [A-Z0-9] separados por guión.
// Ej: NEBB-X9F2-K7AM-3PWR

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // sin 0/O/1/I para legibilidad
const SEGMENT_LEN = 4
const SEGMENTS = 4

export function generateInviteCode(): string {
  const out: string[] = []
  for (let s = 0; s < SEGMENTS; s++) {
    let seg = ''
    for (let i = 0; i < SEGMENT_LEN; i++) {
      seg += ALPHABET[Math.floor(Math.random() * ALPHABET.length)]
    }
    out.push(seg)
  }
  return out.join('-')
}

export function normalizeInviteCode(input: string | null | undefined): string | null {
  if (!input) return null
  const cleaned = input.trim().toUpperCase().replace(/\s+/g, '')
  if (cleaned.length < 6 || cleaned.length > 32) return null
  // Permitir cualquier alfa+num+guión (más permisivo que el generador)
  if (!/^[A-Z0-9-]+$/.test(cleaned)) return null
  return cleaned
}

export const INVITE_COOKIE = 'nb_invite'
