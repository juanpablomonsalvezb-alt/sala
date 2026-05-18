/**
 * Rate limiter por IP / por user — basado en Supabase como storage.
 *
 * Implementación intencionalmente simple (sin Redis): cada bucket es una row
 * en sala_rate_limits con TTL via attempted_at + ventana.
 *
 * Para escala mayor, migrar a Upstash Redis con @upstash/ratelimit.
 */

import { createServiceClient } from '@/lib/supabase/server'

export type RateLimitResult = {
  ok: boolean
  remaining: number
  resetIn: number
  reason?: string
}

export type RateLimitConfig = {
  /** Identificador único (ej: 'checkout', 'auth_signup') */
  bucket: string
  /** Llave del que hace la request (IP, user_id, etc.) */
  key: string
  /** Máx requests permitidas en la ventana */
  limit: number
  /** Ventana en segundos */
  windowSec: number
}

/**
 * Devuelve { ok: true } si la request está permitida, { ok: false } si excedió.
 * Best-effort: si la BD falla, permite la request (no bloquea sistema crítico).
 */
export async function rateLimit(cfg: RateLimitConfig): Promise<RateLimitResult> {
  const supabase = createServiceClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any
  const now = new Date()
  const windowStart = new Date(now.getTime() - cfg.windowSec * 1000).toISOString()

  try {
    // Contar requests en ventana
    const { count } = await db
      .from('sala_rate_limits')
      .select('id', { count: 'exact', head: true })
      .eq('bucket', cfg.bucket)
      .eq('key', cfg.key)
      .gte('created_at', windowStart)

    const used = count ?? 0
    const remaining = Math.max(0, cfg.limit - used - 1)

    if (used >= cfg.limit) {
      // Calcular reset time (la request más antigua de la ventana + windowSec)
      const { data } = await db
        .from('sala_rate_limits')
        .select('created_at')
        .eq('bucket', cfg.bucket)
        .eq('key', cfg.key)
        .gte('created_at', windowStart)
        .order('created_at', { ascending: true })
        .limit(1)
        .maybeSingle()

      const oldest = data?.created_at ? new Date(data.created_at).getTime() : now.getTime()
      const resetIn = Math.max(1, Math.ceil((oldest + cfg.windowSec * 1000 - now.getTime()) / 1000))

      return { ok: false, remaining: 0, resetIn, reason: 'rate_limit_exceeded' }
    }

    // Registrar este hit
    await db.from('sala_rate_limits').insert({
      bucket: cfg.bucket,
      key: cfg.key,
      created_at: now.toISOString(),
    })

    return { ok: true, remaining, resetIn: cfg.windowSec }
  } catch (err) {
    // Fail-open: si el rate limiter está caído, NO bloqueamos al usuario
    // (mejor permitir uso que romper el producto). Loguear para investigar.
    console.error('[rate-limit] storage error — failing open:', err)
    return { ok: true, remaining: cfg.limit, resetIn: cfg.windowSec, reason: 'storage_error' }
  }
}

/** Extrae IP del Request (Vercel / Cloudflare standard). */
export function getClientIp(request: Request): string {
  const xff = request.headers.get('x-forwarded-for')
  if (xff) return xff.split(',')[0].trim()
  const real = request.headers.get('x-real-ip')
  if (real) return real
  return 'unknown'
}
