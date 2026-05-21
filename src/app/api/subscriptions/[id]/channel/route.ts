import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const VALID = new Set(['email', 'whatsapp', 'both'])

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  if (!id) return NextResponse.json({ error: 'missing_id' }, { status: 400 })

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  let body: { channel_preference?: string }
  try {
    body = (await request.json()) as { channel_preference?: string }
  } catch {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 })
  }

  const channel = body.channel_preference ?? ''
  if (!VALID.has(channel)) {
    return NextResponse.json({ error: 'invalid_channel' }, { status: 400 })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any
  const { error, data } = await db
    .from('sala_subscriptions')
    .update({ channel_preference: channel })
    .eq('id', id)
    .eq('subscriber_id', user.id) // RLS double-check
    .select('id')
    .maybeSingle()

  if (error) {
    console.error('[subs/channel] update error:', error.message)
    return NextResponse.json({ error: 'db_error' }, { status: 500 })
  }
  if (!data) {
    return NextResponse.json({ error: 'not_found_or_forbidden' }, { status: 404 })
  }

  return NextResponse.json({ ok: true })
}
