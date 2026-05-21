// Sentry server-side initialization for Nebbuler (Node.js runtime).
//
// Importado por instrumentation.ts cuando NEXT_RUNTIME === 'nodejs'.
// Stub-safe: si no hay DSN, no se inicializa nada.

import * as Sentry from '@sentry/nextjs'

const dsn = process.env.SENTRY_DSN ?? process.env.NEXT_PUBLIC_SENTRY_DSN

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? 'development',
    release: process.env.VERCEL_GIT_COMMIT_SHA,

    // Server: 5% transactions — más bajo por costo (mucho más volumen)
    tracesSampleRate: 0.05,

    // Tags por defecto: runtime para distinguir node vs edge
    initialScope: {
      tags: {
        runtime: 'nodejs',
      },
    },

    // Errores conocidos no críticos que NO debemos reportar
    ignoreErrors: [
      // Supabase: row not found en queries con .single() — es esperable
      'PGRST116',
      // Supabase: no rows en maybeSingle — comportamiento normal
      'JWT expired',
      // Aborted requests del cliente (cerró tab, navegó)
      'aborted',
      'AbortError',
      'The operation was aborted',
      // Connection reset esporádico contra Supabase/MP — reintento normal
      'ECONNRESET',
      'ETIMEDOUT',
      // Next.js: redirect() / notFound() son control flow, no errores
      'NEXT_REDIRECT',
      'NEXT_NOT_FOUND',
      'NEXT_HTTP_ERROR_FALLBACK',
    ],

    beforeSend(event, hint) {
      // Filtrar errores que vienen de redirect/notFound — Next.js los re-lanza
      const err = hint.originalException as Error | undefined
      if (err?.message?.startsWith('NEXT_')) return null

      // Sanitizar emails/teléfonos/tokens del user context
      if (event.user) {
        delete event.user.email
        delete event.user.ip_address
      }

      // Sanitizar headers sensibles
      if (event.request?.headers) {
        const headers = event.request.headers as Record<string, string>
        const sensitive = ['authorization', 'cookie', 'x-supabase-auth', 'x-api-key']
        for (const k of sensitive) {
          if (headers[k]) headers[k] = '[redacted]'
        }
      }

      // Sanitizar URLs (mismo criterio que cliente)
      if (event.request?.url) {
        try {
          const url = new URL(event.request.url)
          const sensitiveParams = ['email', 'token', 'access_token', 'phone', 'tel', 'password']
          for (const p of sensitiveParams) {
            if (url.searchParams.has(p)) url.searchParams.set(p, '[redacted]')
          }
          event.request.url = url.toString()
        } catch {
          // ignore
        }
      }

      return event
    },
  })
}
