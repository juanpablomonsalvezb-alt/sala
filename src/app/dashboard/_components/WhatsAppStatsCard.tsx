import { createClient } from '@/lib/supabase/server'

/**
 * Card de stats de WhatsApp para el creator dashboard.
 *
 * Sólo se renderiza si:
 *   - El creator tiene >0 suscriptores activos.
 *   - (Independiente de si WhatsApp está configurado — la vista funciona
 *     incluso sin token, mostrando 0%.)
 *
 * Lee de la vista `sala_creator_whatsapp_stats` definida en la migración
 * 20260521000005_whatsapp_prefs.sql.
 */

interface StatsRow {
  total_active: number
  whatsapp_active: number
  email_active: number
  whatsapp_pct: number
}

export default async function WhatsAppStatsCard({
  creatorId,
}: {
  creatorId: string
}) {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any

  let row: StatsRow | null = null
  try {
    const { data } = await db
      .from('sala_creator_whatsapp_stats')
      .select('total_active, whatsapp_active, email_active, whatsapp_pct')
      .eq('creator_id', creatorId)
      .maybeSingle()
    row = (data as StatsRow | null) ?? null
  } catch (err) {
    // Vista podría no existir aún si la migración no corrió — degrada silencioso
    console.warn(
      '[WhatsAppStatsCard] stats unavailable:',
      (err as Error).message
    )
    return null
  }

  if (!row || row.total_active === 0) return null

  const pct = Number(row.whatsapp_pct ?? 0)
  const barWidth = Math.max(0, Math.min(100, pct))

  return (
    <div className="bg-white border border-[#DEDEDE] p-6 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span
          className="text-[11px] uppercase tracking-[0.14em] text-[#666666] font-medium"
          style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
        >
          Canal de notificación
        </span>
        <span
          className="text-[10px] uppercase tracking-[0.15em] bg-[#25D366] text-white px-2 py-0.5"
          aria-label="WhatsApp"
        >
          WhatsApp
        </span>
      </div>

      <div className="flex items-baseline gap-2">
        <span
          className="text-[40px] font-bold text-[#121212] leading-none"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          {pct.toFixed(0)}%
        </span>
        <span className="text-[12px] text-[#666666]">
          de {row.total_active} suscriptores
        </span>
      </div>

      {/* Barra */}
      <div className="h-1.5 bg-[#F0F0F0] overflow-hidden">
        <div
          className="h-full bg-[#25D366] transition-all duration-500"
          style={{ width: `${barWidth}%` }}
          aria-hidden
        />
      </div>

      <p className="text-[12px] text-[#666666] leading-relaxed">
        {row.whatsapp_active} suscriptor{row.whatsapp_active === 1 ? '' : 'es'} con
        WhatsApp habilitado. En LATAM, WhatsApp rinde ~5× más que email.
      </p>
    </div>
  )
}
