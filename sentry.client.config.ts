// Sentry client-side initialization for Nebbuler.
//
// Este archivo es importado por instrumentation-client.ts. La regla de oro:
// si NEXT_PUBLIC_SENTRY_DSN no está definido, no se inicializa nada y la app
// sigue funcionando idénticamente (sin telemetría). Esto permite previews,
// builds locales y desarrollo sin requerir cuenta de Sentry.
//
// Cuotas tier gratuito: 5k errors/mes, 30 días retención. Por eso:
//  - tracesSampleRate bajo (10% transactions)
//  - session replay OFF, solo replay on-error (1.0)
//  - filtramos ruido conocido en ignoreErrors
//  - sanitizamos PII en beforeSend

import * as Sentry from '@sentry/nextjs'

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.NEXT_PUBLIC_VERCEL_ENV ?? process.env.NODE_ENV ?? 'development',
    release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,

    // Performance: 10% de transactions en cliente
    tracesSampleRate: 0.1,

    // Session Replay: off por defecto, on solo si hubo error
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 1.0,

    // Ruido común que no es accionable
    ignoreErrors: [
      // Browser extensions / scripts inyectados
      'top.GLOBALS',
      'ResizeObserver loop limit exceeded',
      'ResizeObserver loop completed with undelivered notifications',
      'Non-Error promise rejection captured',
      // Network jitter — no es bug nuestro
      'Network request failed',
      'NetworkError when attempting to fetch resource',
      'Failed to fetch',
      'Load failed',
      'cancelled',
      'AbortError',
      // Cliente offline / cerrando tab
      'The operation was aborted',
      // Errores de extensiones de Chrome
      /^chrome-extension:\/\//,
      /^moz-extension:\/\//,
      // Errores de PWA service worker en navegación normal
      'No matching service worker detected',
    ],

    denyUrls: [
      // Chrome / Firefox / Edge extensions
      /extensions\//i,
      /^chrome:\/\//i,
      /^moz-extension:\/\//i,
      // Scripts de terceros que no controlamos
      /\/(gtm|analytics|posthog|umami)\.js/i,
    ],

    // Sanitización de PII antes de enviar al servidor de Sentry
    beforeSend(event) {
      // Quitar email del user context — usamos solo id
      if (event.user) {
        delete event.user.email
        delete event.user.ip_address
      }

      // Sanitizar URLs en request — remover query strings con tokens/emails
      if (event.request?.url) {
        try {
          const url = new URL(event.request.url)
          const sensitiveParams = ['email', 'token', 'access_token', 'phone', 'tel', 'password']
          for (const p of sensitiveParams) {
            if (url.searchParams.has(p)) url.searchParams.set(p, '[redacted]')
          }
          event.request.url = url.toString()
        } catch {
          // URL no parseable — dejar como está
        }
      }

      return event
    },

    // Integrations: replay solo si está disponible (defensa para SSR)
    integrations: [
      Sentry.replayIntegration({
        maskAllText: true,
        blockAllMedia: true,
        maskAllInputs: true,
      }),
    ],
  })
}
