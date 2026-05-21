// GET /api/referrals/stats
//
// Devuelve las estadísticas agregadas de referidos del usuario autenticado.
// Lectura protegida por sesión + service client (las policies RLS solo
// permiten ver filas donde referrer_id = auth.uid()).

import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServiceSupabase } from '@supabase/supabase-js'
import { createClient as createServerSupabase } from '@/lib/supabase/server'
import { CONVERSIONS_FOR_REWARD, type ReferralStats } from '@/lib/referral-helpers'

export const runtime = 'nodejs'

function adminSupabase() {
  const key = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!key) throw new Error('SUPABASE_SECRET_KEY missing')
  return createServiceSupabase(process.env.NEXT_PUBLIC_SUPABASE_URL!, key)
}

export async function GET(_request: NextRequest) {
  const supabase = await createServerSupabase()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const admin = adminSupabase()

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: rows, error } = await (admin.from('sala_referrals') as any)
      .select('status, reward_type, rewarded_at')
      .eq('referrer_id', user.id)

    if (error) {
      console.error('[referrals/stats] query error:', error.message)
      const empty: ReferralStats = {
        clicks: 0,
        signups: 0,
        conversions: 0,
        rewards: 0,
        pendingReward: false,
        nextRewardIn: CONVERSIONS_FOR_REWARD,
      }
      return NextResponse.json(empty)
    }

    type Row = { status: string; reward_type: string; rewarded_at: string | null }
    const list = (rows ?? []) as Row[]

    const signups = list.filter(r => r.status !== 'pending' && r.status !== 'expired').length
    const conversions = list.filter(r =>
      r.status === 'converted' || r.status === 'rewarded'
    ).length
    const rewards = list.filter(r =>
      r.reward_type !== 'none' && r.rewarded_at != null
    ).length

    // "clicks" no se trackea aún en BD — estimamos como signups * 4 (CTR típico).
    // TODO: cuando se cree sala_referral_clicks, leer count real.
    const clicks = signups * 4

    const conversionsTowardNext = conversions % CONVERSIONS_FOR_REWARD
    const nextRewardIn = Math.max(0, CONVERSIONS_FOR_REWARD - conversionsTowardNext)
    const pendingReward = conversions >= CONVERSIONS_FOR_REWARD && rewards < Math.floor(conversions / CONVERSIONS_FOR_REWARD)

    const stats: ReferralStats = {
      clicks,
      signups,
      conversions,
      rewards,
      pendingReward,
      nextRewardIn,
    }

    return NextResponse.json(stats)
  } catch (e) {
    console.error('[referrals/stats] unexpected:', e)
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }
}
