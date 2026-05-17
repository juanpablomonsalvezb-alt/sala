// Funciones puras del webhook MP — extraídas para poder testearlas sin BD ni red.
// Cualquier cambio aquí debe ir acompañado de tests en `tests/mp-helpers.test.ts`.

export const PLATFORM_FEE_CLP = 29990

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export function buildEventId(
  type: string | undefined,
  dataId: string | number | undefined,
  bodyEventId: string | number | undefined,
  requestId: string,
): string {
  const base = `${type ?? 'unknown'}:${dataId ?? bodyEventId ?? 'unknown'}`
  return requestId ? `${base}:${requestId}` : base
}

export function validatePlatformAmount(amountPaid: number): boolean {
  return Math.abs(amountPaid - PLATFORM_FEE_CLP) <= PLATFORM_FEE_CLP * 0.01
}

export function parseRef(
  ref: string,
): { subscriberId: string; creatorId: string; priceCLP: number } | null {
  const parts = ref.split(':')
  if (parts.length < 3) return null
  const [subscriberId, creatorId, priceStr] = parts
  if (!UUID_RE.test(subscriberId) || !UUID_RE.test(creatorId)) return null
  if (subscriberId === creatorId) return null
  const priceCLP = parseInt(priceStr, 10)
  if (isNaN(priceCLP) || priceCLP <= 0) return null
  return { subscriberId, creatorId, priceCLP }
}

export function parsePlatformRef(
  ref: string,
): { creatorId: string; userId: string } | null {
  if (!ref.startsWith('platform:')) return null
  const parts = ref.split(':')
  if (parts.length < 3) return null
  const [, creatorId, userId] = parts
  if (!UUID_RE.test(creatorId) || !UUID_RE.test(userId)) return null
  return { creatorId, userId }
}

// Constant-time string comparison para anti-CSRF state
export function safeStringEq(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return diff === 0
}
