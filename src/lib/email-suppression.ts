// Suppression list de emails — nunca enviar a estos.
// Razones: bounced anteriormente, spam complaint, unsubscribe, baneado por compliance.
//
// Cualquier envío de email cold/marketing debe pasar por isSuppressed() antes.
// Los emails transaccionales (welcome, password reset) NO están sujetos a esto
// porque son consentidos por el usuario.

import { createServiceClient } from '@/lib/supabase/server'

// Lista inicial — bounces del 2026-05-17 (campaign launch-2026-05)
const INITIAL_SUPPRESSED = new Set([
  'daniela.dib@restofworld.org',
  'leo.schwartz@restofworld.org',
  'anna.heim@techcrunch.com',
  'marina.temkin@techcrunch.com',
  'jimena.tolama@bloomberglinea.com',
  'andres.engler@bloomberglinea.com',
  'lucila.lopardo@forbesargentina.com',
  'martina.veneziani@forbesargentina.com',
])

let dynamicCache: Set<string> | null = null
let dynamicCacheLoadedAt = 0
const CACHE_TTL_MS = 5 * 60 * 1000

async function loadDynamicSuppressed(): Promise<Set<string>> {
  if (dynamicCache && Date.now() - dynamicCacheLoadedAt < CACHE_TTL_MS) {
    return dynamicCache
  }

  try {
    const supabase = createServiceClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase as any)
      .from('email_suppressions')
      .select('email')
      .limit(10000)
    const fromDb = (data ?? []).map((r: { email: string }) => r.email.toLowerCase())
    dynamicCache = new Set([...INITIAL_SUPPRESSED, ...fromDb])
    dynamicCacheLoadedAt = Date.now()
    return dynamicCache
  } catch {
    return INITIAL_SUPPRESSED
  }
}

export async function isSuppressed(email: string): Promise<boolean> {
  const normalized = email.toLowerCase().trim()
  if (INITIAL_SUPPRESSED.has(normalized)) return true
  const dyn = await loadDynamicSuppressed()
  return dyn.has(normalized)
}

export async function suppressEmail(
  email: string,
  reason: 'bounce' | 'spam_complaint' | 'unsubscribe' | 'manual',
  detail?: string,
): Promise<void> {
  const supabase = createServiceClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase as any)
    .from('email_suppressions')
    .upsert(
      {
        email: email.toLowerCase().trim(),
        reason,
        detail,
        added_at: new Date().toISOString(),
      },
      { onConflict: 'email', ignoreDuplicates: false },
    )
  // Invalidar cache
  dynamicCache = null
}

/** Helper para usar antes de cualquier envío cold/marketing. */
export async function guardEmail(
  email: string,
): Promise<{ ok: true } | { ok: false; reason: string }> {
  if (!email || !email.includes('@')) {
    return { ok: false, reason: 'invalid_email_format' }
  }
  if (await isSuppressed(email)) {
    return { ok: false, reason: 'suppressed' }
  }
  return { ok: true }
}
