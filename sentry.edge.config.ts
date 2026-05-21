// Sentry edge-runtime initialization (middleware + edge routes).
// Stub-safe: si no hay DSN, no se inicializa nada.

import * as Sentry from '@sentry/nextjs'

const dsn = process.env.SENTRY_DSN ?? process.env.NEXT_PUBLIC_SENTRY_DSN

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? 'development',
    release: process.env.VERCEL_GIT_COMMIT_SHA,

    // Edge: bajo sample rate (mismo criterio que server)
    tracesSampleRate: 0.05,

    initialScope: {
      tags: {
        runtime: 'edge',
      },
    },

    ignoreErrors: [
      'NEXT_REDIRECT',
      'NEXT_NOT_FOUND',
      'aborted',
      'AbortError',
    ],
  })
}
