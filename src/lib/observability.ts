// Observability helpers para Nebbuler.
//
// Uso desde cualquier handler / cron / webhook:
//
//   import { captureError, captureMessage, withTags } from '@/lib/observability'
//
//   try { ... } catch (err) {
//     captureError(err, { webhook: 'mp', stage: 'preapproval-lookup' })
//   }
//
// Diseño:
//  - En desarrollo: solo console.* (no spam de eventos a Sentry).
//  - En producción: envía a Sentry SI hay DSN; si no hay DSN, console.error
//    como fallback para que el evento siga visible en Vercel logs.
//  - Nunca lanza — si Sentry falla internamente, lo capturamos en silencio
//    para no romper el handler que llamó.

import * as Sentry from '@sentry/nextjs'

type LogLevel = 'info' | 'warning' | 'error' | 'fatal' | 'debug'

const isDev = process.env.NODE_ENV === 'development'
const hasSentryDsn = Boolean(
  process.env.NEXT_PUBLIC_SENTRY_DSN ?? process.env.SENTRY_DSN
)

export function captureError(
  error: unknown,
  context?: Record<string, unknown>
): void {
  if (isDev) {
    console.error('[error]', error, context ?? '')
    return
  }

  // Siempre logueamos a Vercel también — Sentry puede caer / estar throttled
  console.error('[error]', error, context ?? '')

  if (!hasSentryDsn) return

  try {
    Sentry.captureException(error, {
      extra: context,
    })
  } catch {
    // Sentry interno falló — ya está en console.error de arriba
  }
}

export function captureMessage(
  message: string,
  level: LogLevel = 'info',
  context?: Record<string, unknown>
): void {
  if (isDev) {
    const fn = level === 'error' || level === 'fatal' ? console.error : console.log
    fn(`[${level}] ${message}`, context ?? '')
    return
  }

  if (level === 'error' || level === 'fatal' || level === 'warning') {
    console.error(`[${level}] ${message}`, context ?? '')
  }

  if (!hasSentryDsn) return

  try {
    Sentry.captureMessage(message, {
      level,
      extra: context,
    })
  } catch {
    // ignore
  }
}

// Helper: ejecutar callback con tags fijos en el scope local. Útil para
// webhooks y crons que quieren etiquetar todos los errores de ese request.
//
// Ejemplo:
//   return withTags({ webhook: 'mp' }, async () => {
//     ...lógica...
//   })
export async function withTags<T>(
  tags: Record<string, string>,
  fn: () => Promise<T>
): Promise<T> {
  if (!hasSentryDsn) return fn()

  return Sentry.withScope(async (scope) => {
    for (const [k, v] of Object.entries(tags)) {
      scope.setTag(k, v)
    }
    return fn()
  })
}

// Setea contexto de usuario sin exponer PII. Solo id.
export function setUserContext(userId: string | null): void {
  if (!hasSentryDsn) return
  try {
    if (userId) {
      Sentry.setUser({ id: userId })
    } else {
      Sentry.setUser(null)
    }
  } catch {
    // ignore
  }
}

// Tag manual desde código (ej: tipo de webhook, nombre de cron).
export function setTag(key: string, value: string): void {
  if (!hasSentryDsn) return
  try {
    Sentry.setTag(key, value)
  } catch {
    // ignore
  }
}
