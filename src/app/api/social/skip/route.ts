import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { isSuperadmin } from '@/lib/supabase/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  if (!await isSuperadmin()) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  const { opportunityId } = await req.json()
  await supabase
    .from('social_opportunities')
    .update({ status: 'skipped' })
    .eq('id', opportunityId)

  return NextResponse.json({ ok: true })
}
