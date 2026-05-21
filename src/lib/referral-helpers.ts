// Helpers compartidos del programa de referidos.
// El "username" del referido es siempre el `slug` de sala_creators (o el slug
// generado para readers — out-of-scope ahora).

export const REFERRER_COOKIE = 'nb_referrer'
export const REFERRER_COOKIE_MAX_AGE = 60 * 60 * 24 * 30 // 30 días

const VALID_SLUG = /^[a-z0-9][a-z0-9-]{1,48}[a-z0-9]$/

export function normalizeUsername(input: string | null | undefined): string | null {
  if (!input) return null
  const cleaned = input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
  if (!VALID_SLUG.test(cleaned)) return null
  return cleaned
}

const ALLOWED_NEXT = new Set(['/registro', '/abrir', '/entrar', '/'])

export function safeNext(next: string | null | undefined, fallback = '/registro'): string {
  if (!next) return fallback
  if (ALLOWED_NEXT.has(next)) return next
  return fallback
}

// Reglas de negocio centralizadas (single source of truth)
export const CONVERSIONS_FOR_REWARD = 3
export const REWARD_MONTHS_FREE = 1

export type ReferralStatus =
  | 'pending'
  | 'signup'
  | 'subscribed'
  | 'converted'
  | 'rewarded'
  | 'expired'

export type ReferralSource = 'link' | 'share' | 'email'

export type RewardType = 'none' | 'discount_3mo' | 'cash_usd' | 'free_month'

export interface ReferralStats {
  clicks: number
  signups: number
  conversions: number
  rewards: number
  pendingReward: boolean
  nextRewardIn: number
}
