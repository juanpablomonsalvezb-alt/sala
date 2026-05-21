// Helpers de anonimización para social proof real-time.
// Garantía: nunca exponemos email, apellido completo, UUID, ni precio.

const FLAG_MAP: Record<string, string> = {
  CL: '\u{1F1E8}\u{1F1F1}',
  AR: '\u{1F1E6}\u{1F1F7}',
  MX: '\u{1F1F2}\u{1F1FD}',
  CO: '\u{1F1E8}\u{1F1F4}',
  PE: '\u{1F1F5}\u{1F1EA}',
  UY: '\u{1F1FA}\u{1F1FE}',
  EC: '\u{1F1EA}\u{1F1E8}',
  BO: '\u{1F1E7}\u{1F1F4}',
  PY: '\u{1F1F5}\u{1F1FE}',
  VE: '\u{1F1FB}\u{1F1EA}',
  CR: '\u{1F1E8}\u{1F1F7}',
  PA: '\u{1F1F5}\u{1F1E6}',
  GT: '\u{1F1EC}\u{1F1F9}',
  HN: '\u{1F1ED}\u{1F1F3}',
  SV: '\u{1F1F8}\u{1F1FB}',
  NI: '\u{1F1F3}\u{1F1EE}',
  DO: '\u{1F1E9}\u{1F1F4}',
  PR: '\u{1F1F5}\u{1F1F7}',
  CU: '\u{1F1E8}\u{1F1FA}',
  ES: '\u{1F1EA}\u{1F1F8}',
  US: '\u{1F1FA}\u{1F1F8}',
  BR: '\u{1F1E7}\u{1F1F7}',
}

const COUNTRY_NAME: Record<string, string> = {
  CL: 'Chile',
  AR: 'Argentina',
  MX: 'México',
  CO: 'Colombia',
  PE: 'Perú',
  UY: 'Uruguay',
  EC: 'Ecuador',
  BO: 'Bolivia',
  PY: 'Paraguay',
  VE: 'Venezuela',
  CR: 'Costa Rica',
  PA: 'Panamá',
  GT: 'Guatemala',
  HN: 'Honduras',
  SV: 'El Salvador',
  NI: 'Nicaragua',
  DO: 'Rep. Dominicana',
  PR: 'Puerto Rico',
  CU: 'Cuba',
  ES: 'España',
  US: 'EE.UU.',
  BR: 'Brasil',
}

/**
 * Convierte un nombre completo en formato "Juan P." (primer nombre + inicial apellido).
 * - "Juan Pablo Monsalvez" -> "Juan P."
 * - "María" -> "María"
 * - "" / null -> "Alguien"
 */
export function anonymizeName(fullName?: string | null): string {
  if (!fullName) return 'Alguien'
  const cleaned = fullName.trim().replace(/\s+/g, ' ')
  if (!cleaned) return 'Alguien'

  const parts = cleaned.split(' ').filter(Boolean)
  if (parts.length === 0) return 'Alguien'

  const first = capitalize(parts[0])
  if (parts.length === 1) return first

  const lastInitial = parts[parts.length - 1]?.charAt(0)?.toUpperCase()
  if (!lastInitial) return first

  return `${first} ${lastInitial}.`
}

function capitalize(s: string): string {
  if (!s) return s
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
}

/**
 * Convierte un código ISO-2 a bandera emoji. Devuelve '' si no se reconoce.
 */
export function countryToFlag(code?: string | null): string {
  if (!code) return ''
  const upper = code.trim().toUpperCase()
  return FLAG_MAP[upper] ?? ''
}

/**
 * Devuelve el nombre del país en español, o el código original si no se reconoce.
 */
export function countryToName(code?: string | null): string {
  if (!code) return ''
  const upper = code.trim().toUpperCase()
  return COUNTRY_NAME[upper] ?? upper
}

/**
 * Convierte un timestamp ISO a edad relativa en español.
 *   - "hace unos segundos"
 *   - "hace 3 min"
 *   - "hace 2 h"
 *   - "hace 1 d"
 */
export function timestampToAge(iso: string | Date): string {
  const then = typeof iso === 'string' ? new Date(iso).getTime() : iso.getTime()
  if (!Number.isFinite(then)) return ''

  const diffSec = Math.max(0, Math.floor((Date.now() - then) / 1000))
  if (diffSec < 30) return 'hace unos segundos'
  if (diffSec < 60) return `hace ${diffSec} seg`
  const diffMin = Math.floor(diffSec / 60)
  if (diffMin < 60) return `hace ${diffMin} min`
  const diffHr = Math.floor(diffMin / 60)
  if (diffHr < 24) return `hace ${diffHr} h`
  const diffDay = Math.floor(diffHr / 24)
  return `hace ${diffDay} d`
}
