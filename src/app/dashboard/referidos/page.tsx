// Panel de referidos del creador — /dashboard/referidos
//
// Server component que muestra:
//  - KPIs (clicks estimados, signups, conversions, meses gratis ganados)
//  - Link de referido + botones de share (client island)
//  - Tabla con los últimos 20 referidos (anonimizada)
//  - Sección "¿Cómo funciona?"

import { redirect } from 'next/navigation'
import { createClient as createServerSupabase } from '@/lib/supabase/server'
import { createClient as createServiceSupabase } from '@supabase/supabase-js'
import {
  CONVERSIONS_FOR_REWARD,
  REWARD_MONTHS_FREE,
  type ReferralStatus,
} from '@/lib/referral-helpers'
import ShareCard from './_share-card'

export const dynamic = 'force-dynamic'

function adminSupabase() {
  const key = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!key) throw new Error('SUPABASE_SECRET_KEY missing')
  return createServiceSupabase(process.env.NEXT_PUBLIC_SUPABASE_URL!, key)
}

type ReferralRow = {
  id: string
  referred_id: string | null
  status: ReferralStatus
  reward_type: string
  reward_amount_usd: number | null
  rewarded_at: string | null
  subscribed_at: string | null
  created_at: string
}

const STATUS_LABELS: Record<ReferralStatus, { label: string; cls: string }> = {
  pending: { label: 'Pendiente', cls: 'bg-[#FAFAF7] text-[#666] border-[#E5E5E5]' },
  signup: { label: 'Registrado', cls: 'bg-[#FFF9E6] text-[#8B6B00] border-[#F2D98C]' },
  subscribed: { label: 'Suscrito', cls: 'bg-[#E8F4FE] text-[#0A66C2] border-[#9CC9F0]' },
  converted: { label: 'Convertido', cls: 'bg-[#F0FAF5] text-[#0A7A3B] border-[#A8DCBC]' },
  rewarded: { label: 'Premiado', cls: 'bg-[#FFF0F0] text-[#C41C1C] border-[#F0B4B4]' },
  expired: { label: 'Expirado', cls: 'bg-[#F7F7F7] text-[#999] border-[#E5E5E5]' },
}

function maskName(referredId: string | null): string {
  if (!referredId) return 'Anónimo'
  // Anonimización: solo primeros 4 chars del UUID, sin email
  return `Suscriptor #${referredId.slice(0, 4).toUpperCase()}`
}

function fmtDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('es-CL', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return iso
  }
}

export default async function ReferidosPage() {
  const supabase = await createServerSupabase()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/entrar')
  }

  // Verificar que sea creator
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: creatorRaw } = await (supabase.from('sala_creators') as any)
    .select('id, name, slug')
    .eq('user_id', user.id)
    .maybeSingle()

  const creator = creatorRaw as { id: string; name: string; slug: string } | null
  if (!creator?.slug) {
    redirect('/abrir')
  }

  // Query referidos
  const admin = adminSupabase()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: rowsRaw } = await (admin.from('sala_referrals') as any)
    .select('id, referred_id, status, reward_type, reward_amount_usd, rewarded_at, subscribed_at, created_at')
    .eq('referrer_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50)

  const rows: ReferralRow[] = (rowsRaw ?? []) as ReferralRow[]

  // KPIs
  const signups = rows.filter((r) => r.status !== 'pending' && r.status !== 'expired').length
  const conversions = rows.filter(
    (r) => r.status === 'converted' || r.status === 'rewarded'
  ).length
  const rewardsTotalUsd = rows.reduce(
    (acc, r) => acc + (r.rewarded_at && r.reward_amount_usd ? Number(r.reward_amount_usd) : 0),
    0
  )
  // Meses gratis ganados — usando el modelo: cada N conversiones = 1 mes
  const monthsEarned = Math.floor(conversions / CONVERSIONS_FOR_REWARD) * REWARD_MONTHS_FREE
  // Clicks estimados (mismo modelo que el endpoint /stats)
  const clicks = signups * 4

  const conversionsTowardNext = conversions % CONVERSIONS_FOR_REWARD
  const nextRewardIn = Math.max(0, CONVERSIONS_FOR_REWARD - conversionsTowardNext)
  const rewardsRedeemed = rows.filter(
    (r) => r.reward_type !== 'none' && r.rewarded_at != null
  ).length
  const pendingReward =
    conversions >= CONVERSIONS_FOR_REWARD &&
    rewardsRedeemed < Math.floor(conversions / CONVERSIONS_FOR_REWARD)

  const kpis = [
    { label: 'Clicks (est.)', value: clicks, hint: 'Estimado en base a signups' },
    { label: 'Registros', value: signups, hint: 'Crearon su cuenta' },
    { label: 'Conversiones', value: conversions, hint: 'Pagaron al menos 1 mes' },
    {
      label: 'Meses gratis',
      value: monthsEarned,
      hint: rewardsTotalUsd > 0 ? `≈ US$ ${rewardsTotalUsd.toFixed(2)}` : 'Aún sin recompensas',
    },
  ]

  const recentRows = rows.slice(0, 20)

  return (
    <main
      className="flex-1 overflow-y-auto bg-[#F7F7F7]"
      style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
    >
      <div className="mx-auto max-w-5xl px-6 py-10 sm:px-10 sm:py-14">
        {/* Cabecera editorial */}
        <header className="mb-10 border-b border-[#DEDEDE] pb-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#C41C1C]">
            Programa de referidos
          </p>
          <h1
            className="mt-3 text-[34px] sm:text-[44px] font-bold leading-[1.05] text-[#121212]"
            style={{ fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif" }}
          >
            Invita y gana meses gratis.
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[#444]">
            Comparte tu link personal con creadores que aún no están en Nebbuler. Por cada{' '}
            <strong className="text-[#121212]">{CONVERSIONS_FOR_REWARD} suscripciones</strong>{' '}
            que se completen, ganas{' '}
            <strong className="text-[#121212]">
              {REWARD_MONTHS_FREE} mes gratis
            </strong>
            . Ellos también.
          </p>
        </header>

        {/* KPIs */}
        <section className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {kpis.map((k) => (
            <div key={k.label} className="border border-[#E5E5E5] bg-white p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#666]">
                {k.label}
              </p>
              <p
                className="mt-2 text-[32px] font-bold leading-none text-[#121212]"
                style={{ fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif" }}
              >
                {k.value}
              </p>
              <p className="mt-2 text-[11px] text-[#999]">{k.hint}</p>
            </div>
          ))}
        </section>

        {/* Share card */}
        <section className="mb-12">
          <ShareCard
            username={creator.slug}
            creatorName={creator.name}
            kpis={{
              clicks,
              signups,
              conversions,
              rewards: monthsEarned,
              nextRewardIn,
              pendingReward,
            }}
          />
        </section>

        {/* Tabla */}
        <section className="mb-12">
          <div className="mb-4 flex items-baseline justify-between">
            <h2
              className="text-[22px] font-bold text-[#121212]"
              style={{ fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif" }}
            >
              Últimos referidos
            </h2>
            <p className="text-[11px] uppercase tracking-[0.16em] text-[#999]">
              {recentRows.length} {recentRows.length === 1 ? 'registro' : 'registros'}
            </p>
          </div>

          {recentRows.length === 0 ? (
            <div className="border border-dashed border-[#DEDEDE] bg-white px-6 py-16 text-center">
              <p className="text-[14px] text-[#666]">
                Todavía no has referido a nadie. Copia tu link arriba y compártelo en tus redes.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden border border-[#E5E5E5] bg-white">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#E5E5E5] bg-[#FAFAF7]">
                    <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.16em] text-[#666]">
                      Suscriptor
                    </th>
                    <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.16em] text-[#666]">
                      Fecha
                    </th>
                    <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.16em] text-[#666]">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentRows.map((r) => {
                    const s = STATUS_LABELS[r.status] ?? STATUS_LABELS.pending
                    return (
                      <tr
                        key={r.id}
                        className="border-b border-[#F0F0F0] last:border-b-0 hover:bg-[#FAFAF7] transition-colors"
                      >
                        <td className="px-5 py-3 text-[13px] text-[#121212]">
                          {maskName(r.referred_id)}
                        </td>
                        <td className="px-5 py-3 text-[12px] text-[#666]">
                          {fmtDate(r.created_at)}
                        </td>
                        <td className="px-5 py-3">
                          <span
                            className={`inline-block border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${s.cls}`}
                          >
                            {s.label}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Cómo funciona */}
        <section className="border-t border-[#DEDEDE] pt-10">
          <h2
            className="mb-6 text-[22px] font-bold text-[#121212]"
            style={{ fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif" }}
          >
            ¿Cómo funciona?
          </h2>

          <ol className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              {
                n: '01',
                t: 'Comparte tu link',
                d: 'Envíalo por WhatsApp, Twitter, LinkedIn o email a creadores afines.',
              },
              {
                n: '02',
                t: 'Se suscriben',
                d: `Cuando ${CONVERSIONS_FOR_REWARD} personas crean su sala y pagan, llegas a la recompensa.`,
              },
              {
                n: '03',
                t: 'Mes gratis',
                d: 'Acreditamos automáticamente un mes en tu próximo ciclo. Ellos también lo reciben.',
              },
            ].map((s) => (
              <li key={s.n} className="border border-[#E5E5E5] bg-white p-6">
                <p
                  className="mb-3 text-[12px] font-bold tracking-[0.18em] text-[#C41C1C]"
                  style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                >
                  {s.n}
                </p>
                <p className="mb-1.5 text-[15px] font-semibold text-[#121212]">{s.t}</p>
                <p className="text-[13px] leading-relaxed text-[#666]">{s.d}</p>
              </li>
            ))}
          </ol>

          <p className="mt-6 text-[12px] leading-relaxed text-[#999]">
            * Los referidos solo cuentan cuando completan al menos un mes de suscripción activa.
            No incluye periodos de prueba, reembolsos ni auto-referidos. Las recompensas son
            acumulables y se aplican como crédito sobre tu próxima factura.
          </p>
        </section>
      </div>
    </main>
  )
}
