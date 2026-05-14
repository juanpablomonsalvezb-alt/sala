import { createClient as createSupabaseAdmin } from '@supabase/supabase-js'

function adminClient() {
  return createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// Límites diarios
export const LIMITS = {
  x: 10,
  linkedin: 20,
  linkedinMinutesBetween: 30,
} as const

export type Platform = 'x' | 'linkedin'

export async function getRateLimit(platform: Platform) {
  const supabase = adminClient()
  const today = new Date().toISOString().split('T')[0]
  const { data } = await supabase
    .from('social_rate_limits')
    .select('*')
    .eq('platform', platform)
    .eq('date', today)
    .single()
  return data ?? { platform, date: today, count_today: 0, last_published_at: null }
}

export async function incrementRateLimit(platform: Platform) {
  const supabase = adminClient()
  const today = new Date().toISOString().split('T')[0]
  await supabase.from('social_rate_limits').upsert({
    platform,
    date: today,
    count_today: (await getRateLimit(platform)).count_today + 1,
    last_published_at: new Date().toISOString(),
  }, { onConflict: 'platform,date' })
}

export async function canPublish(platform: Platform): Promise<{ ok: boolean; reason?: string }> {
  const limit = await getRateLimit(platform)
  const max = LIMITS[platform]
  if (limit.count_today >= max) return { ok: false, reason: `Límite diario alcanzado (${max}/${max})` }
  if (platform === 'linkedin' && limit.last_published_at) {
    const elapsed = Date.now() - new Date(limit.last_published_at).getTime()
    const minMs = LIMITS.linkedinMinutesBetween * 60 * 1000
    if (elapsed < minMs) {
      const mins = Math.ceil((minMs - elapsed) / 60000)
      return { ok: false, reason: `Esperá ${mins} minutos más entre publicaciones LinkedIn` }
    }
  }
  return { ok: true }
}

export async function getNextImage(tone: 'professional' | 'viral') {
  const supabase = adminClient()
  const { data } = await supabase
    .from('social_images')
    .select('*')
    .eq('tone', tone)
    .order('last_used_at', { ascending: true, nullsFirst: true })
    .limit(1)
    .single()
  return data
}

export async function getNextTemplate(platform: Platform, tone: 'professional' | 'viral') {
  const supabase = adminClient()
  const { data } = await supabase
    .from('social_comment_templates')
    .select('*')
    .in('platform', [platform, 'both'])
    .eq('tone', tone)
    .eq('active', true)
    .order('last_used_at', { ascending: true, nullsFirst: true })
    .limit(1)
    .single()
  return data
}

export async function markImageUsed(id: string) {
  const supabase = adminClient()
  await supabase
    .from('social_images')
    .update({ last_used_at: new Date().toISOString(), times_used: supabase.rpc('increment', { x: 1 }) })
    .eq('id', id)
}

export async function markTemplateUsed(id: string) {
  const supabase = adminClient()
  await supabase
    .from('social_comment_templates')
    .update({ last_used_at: new Date().toISOString(), times_used: supabase.rpc('increment', { x: 1 }) })
    .eq('id', id)
}

export async function getPendingOpportunities() {
  const supabase = adminClient()
  const { data } = await supabase
    .from('social_opportunities')
    .select(`
      *,
      suggested_image:social_images(id, filename, storage_url, tone),
      suggested_template:social_comment_templates(id, text, tone, platform)
    `)
    .eq('status', 'pending')
    .order('engagement_score', { ascending: false })
    .limit(20)
  return data ?? []
}
