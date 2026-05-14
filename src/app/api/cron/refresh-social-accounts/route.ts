import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getAccountFollowers } from '@/lib/x-client'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: Request) {
  const secret = new URL(req.url).searchParams.get('secret')
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const { data: accounts } = await supabase
    .from('social_monitored_accounts')
    .select('*')
    .eq('is_active', true)
    .eq('platform', 'x')

  let updated = 0
  for (const acc of accounts ?? []) {
    try {
      const followers = await getAccountFollowers(acc.account_handle)
      await supabase
        .from('social_monitored_accounts')
        .update({ followers_count: followers, last_refreshed_at: new Date().toISOString() })
        .eq('id', acc.id)
      updated++
    } catch {
      // continúa
    }
  }

  return NextResponse.json({ ok: true, updated })
}
