// Next.js server instrumentation hook (Next 16 stable).
//
// Carga la config de Sentry apropiada según runtime. Si SENTRY_DSN no está
// presente, los archivos sentry.*.config.ts hacen short-circuit y no hacen
// nada — la app sigue funcionando sin telemetría.

import * as Sentry from '@sentry/nextjs'

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config')
  }
  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config')
  }
}

// onRequestError: captura errores no manejados en Server Components, Route
// Handlers, Server Actions y middleware. Sentry.captureRequestError es no-op
// si Sentry.init no se ejecutó (sin DSN), así que es seguro re-exportarlo
// siempre.
export const onRequestError = Sentry.captureRequestError
