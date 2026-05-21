// Next.js 16 client-side instrumentation hook.
//
// Reemplaza al antiguo sentry.client.config.ts en la convención de Next 16.
// La inicialización real vive en sentry.client.config.ts (importado abajo)
// para mantener una estructura familiar a quien venga del SDK clásico.

import './sentry.client.config'

import * as Sentry from '@sentry/nextjs'

// Captura cambios de ruta del App Router como spans de navegación.
// Si no hay DSN, captureRouterTransitionStart es no-op.
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart
