import type { SupabaseClient } from '@supabase/supabase-js'

// Día 30/31 sin renovación → bloqueo automático
// Si han pasado más de 35 días desde el último cobro y MP no ha enviado webhook
// de renovación, bloqueamos el acceso por seguridad.
// 35 = 30/31 días del ciclo + margen para webhooks tardíos.
const MAX_AGE_DAYS = 35

export function isSubscriptionFresh(lastPaidAt: string | null | undefined): boolean {
  if (!lastPaidAt) return false
  const last = new Date(lastPaidAt).getTime()
  if (isNaN(last)) return false
  const ageDays = (Date.now() - last) / (1000 * 60 * 60 * 24)
  return ageDays <= MAX_AGE_DAYS
}

// Verifica si el lector tiene acceso al contenido pagado del creador.
// Regla: status='active' AND último cobro hace menos de 35 días.
export async function isReaderSubscribed(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: SupabaseClient<any>,
  subscriberId: string,
  creatorId: string
): Promise<boolean> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any)
    .from('sala_subscriptions')
    .select('id, last_paid_at, created_at')
    .eq('subscriber_id', subscriberId)
    .eq('creator_id', creatorId)
    .eq('status', 'active')
    .maybeSingle()

  if (!data) return false
  // last_paid_at es la fuente de verdad; created_at queda como fallback para
  // suscripciones legacy donde last_paid_at no se haya escrito todavía.
  return isSubscriptionFresh(data.last_paid_at ?? data.created_at)
}
