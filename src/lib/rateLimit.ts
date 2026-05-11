// Rate limit in-memory por instancia de Lambda.
// Limitación conocida: en Vercel serverless cada instancia tiene su propio Map,
// por lo que el límite efectivo es N×limit (siendo N el número de instancias activas).
// Suficiente para frenar bots triviales y consumo abusivo. Para protección robusta,
// upgrade a @upstash/ratelimit con Redis HTTP.

type Bucket = { count: number; resetAt: number }
const buckets = new Map<string, Bucket>()

let lastCleanup = Date.now()
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000

function cleanup() {
  const now = Date.now()
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return
  lastCleanup = now
  for (const [key, bucket] of buckets.entries()) {
    if (now > bucket.resetAt) buckets.delete(key)
  }
}

export type RateLimitResult = {
  allowed:    boolean
  remaining:  number
  retryAfter: number
}

export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  cleanup()
  const now = Date.now()
  const bucket = buckets.get(key)

  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: limit - 1, retryAfter: 0 }
  }

  if (bucket.count >= limit) {
    return {
      allowed:    false,
      remaining:  0,
      retryAfter: Math.ceil((bucket.resetAt - now) / 1000),
    }
  }

  bucket.count++
  return {
    allowed:    true,
    remaining:  limit - bucket.count,
    retryAfter: 0,
  }
}

export function getClientIp(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  const real = headers.get('x-real-ip')
  if (real) return real
  return 'unknown'
}

// Escape seguro para JSON embebido en <script type="application/ld+json">.
// JSON.stringify NO escapa </ por defecto — esto evita break out del tag.
export function safeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(new RegExp('\u2028', 'g'), '\\u2028')
    .replace(new RegExp('\u2029', 'g'), '\\u2029')
}
