// Validación de autenticación para endpoints de cron.
// Único método aceptado: Authorization: Bearer <CRON_SECRET>.
// Antes se aceptaba `?secret=` en query string — eliminado tras auditoría
// 2026-05-21 porque queda en logs de Vercel/referrers/history.

import crypto from 'crypto'

export function isAuthorizedCron(req: Request): boolean {
  const secret = process.env.CRON_SECRET
  if (!secret) {
    console.error('[cron-auth] CRON_SECRET no configurado — rechazando')
    return false
  }

  // Buscar tanto Authorization (mayúscula) como authorization (minúscula).
  const header = req.headers.get('authorization') ?? req.headers.get('Authorization') ?? ''
  if (!header.startsWith('Bearer ')) return false

  const provided = header.slice('Bearer '.length).trim()
  if (provided.length !== secret.length) return false

  try {
    return crypto.timingSafeEqual(Buffer.from(provided), Buffer.from(secret))
  } catch {
    return false
  }
}
