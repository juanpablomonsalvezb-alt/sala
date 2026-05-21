// ─────────────────────────────────────────────────────────────────────────────
// RetentionCard — server component
//
// Tarjeta para el dashboard que muestra el número de suscriptores en riesgo
// detectados por el sistema anti-churn predictivo. Se renderiza únicamente si
// hay >0 signals pendientes para el creator. Linkea a /dashboard/retencion.
// ─────────────────────────────────────────────────────────────────────────────

import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

interface Props {
  creatorId: string
}

export default async function RetentionCard({ creatorId }: Props) {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any

  const { count } = await db
    .from('sala_churn_signals')
    .select('id', { count: 'exact', head: true })
    .eq('creator_id', creatorId)
    .eq('outcome', 'pending')

  const atRisk = count ?? 0
  if (atRisk === 0) return null

  return (
    <section className="bg-white border border-[#DEDEDE] px-8 py-7 flex items-center justify-between">
      <div>
        <p
          className="text-[10px] font-sans font-bold tracking-[0.18em] uppercase text-[#C41C1C] mb-2"
          style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
        >
          Anti-Churn predictivo
        </p>
        <h3
          className="text-[20px] font-bold text-[#121212]"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          <span className="text-[#C41C1C]">{atRisk}</span>{' '}
          {atRisk === 1 ? 'suscriptor' : 'suscriptores'} en riesgo
        </h3>
        <p
          className="text-[13px] text-[#666666] mt-1"
          style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
        >
          Detectados heurísticamente. Si no actúas, recibirán un save offer en 24h.
        </p>
      </div>
      <Link
        href="/dashboard/retencion"
        className="inline-flex items-center gap-2 bg-[#121212] text-white text-[13px] font-semibold px-5 py-3 hover:bg-[#000000] transition-colors flex-shrink-0"
        style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
      >
        Retención →
      </Link>
    </section>
  )
}
