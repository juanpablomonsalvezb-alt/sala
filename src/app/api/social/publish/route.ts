import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { replyToTweet } from '@/lib/x-client'
import { publishLinkedInPost } from '@/lib/linkedin-client'
import { canPublish, incrementRateLimit, markImageUsed, markTemplateUsed } from '@/lib/social'
import { isSuperadmin } from '@/lib/supabase/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  if (!await isSuperadmin()) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  const { opportunityId, comment } = await req.json()

  const { data: opp } = await supabase
    .from('social_opportunities')
    .select('*, suggested_image:social_images(storage_url), suggested_template:social_comment_templates(text)')
    .eq('id', opportunityId)
    .single()

  if (!opp) return NextResponse.json({ error: 'not found' }, { status: 404 })
  if (opp.status !== 'pending') return NextResponse.json({ error: 'already processed' }, { status: 400 })

  const check = await canPublish(opp.platform)
  if (!check.ok) return NextResponse.json({ error: check.reason }, { status: 429 })

  const text = comment || opp.custom_comment || opp.suggested_template?.text || ''
  const imageUrl = opp.suggested_image?.storage_url

  try {
    if (opp.platform === 'x') {
      await replyToTweet(opp.post_id, text)
    } else {
      await publishLinkedInPost(text, imageUrl)
    }
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }

  await supabase
    .from('social_opportunities')
    .update({ status: 'published', published_at: new Date().toISOString(), custom_comment: text })
    .eq('id', opportunityId)

  await incrementRateLimit(opp.platform)
  if (opp.suggested_image_id) await markImageUsed(opp.suggested_image_id)
  if (opp.suggested_comment_id) await markTemplateUsed(opp.suggested_comment_id)

  return NextResponse.json({ ok: true })
}
