import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { searchProfessionalOpportunities, searchViralOpportunities } from '@/lib/x-client'
import { getLinkedInFeed } from '@/lib/linkedin-client'
import { getNextImage, getNextTemplate } from '@/lib/social'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: Request) {
  const secret = new URL(req.url).searchParams.get('secret')
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  let inserted = 0

  // X — Profesional
  try {
    const posts = await searchProfessionalOpportunities()
    for (const post of posts) {
      const image = await getNextImage('professional')
      const template = await getNextTemplate('x', 'professional')
      const { error } = await supabase.from('social_opportunities').upsert({
        platform: 'x',
        post_url: post.url,
        post_id: post.id,
        post_text: post.text.slice(0, 500),
        author_handle: post.authorHandle,
        author_followers: post.authorFollowers,
        engagement_score: post.replyCount * 3 + post.retweetCount * 2 + post.likeCount,
        mode: 'professional',
        suggested_image_id: image?.id ?? null,
        suggested_comment_id: template?.id ?? null,
      }, { onConflict: 'platform,post_id', ignoreDuplicates: true })
      if (!error) inserted++
    }
  } catch (e) {
    console.error('[social-cron] X professional error:', e)
  }

  // X — Viral
  try {
    const posts = await searchViralOpportunities()
    for (const post of posts) {
      const image = await getNextImage('viral')
      const template = await getNextTemplate('x', 'viral')
      await supabase.from('social_opportunities').upsert({
        platform: 'x',
        post_url: post.url,
        post_id: post.id,
        post_text: post.text.slice(0, 500),
        author_handle: post.authorHandle,
        author_followers: post.authorFollowers,
        engagement_score: post.replyCount * 3 + post.retweetCount * 2 + post.likeCount,
        mode: 'viral',
        suggested_image_id: image?.id ?? null,
        suggested_comment_id: template?.id ?? null,
      }, { onConflict: 'platform,post_id', ignoreDuplicates: true })
      inserted++
    }
  } catch (e) {
    console.error('[social-cron] X viral error:', e)
  }

  // LinkedIn feed
  try {
    const posts = await getLinkedInFeed()
    for (const post of posts) {
      const image = await getNextImage('professional')
      const template = await getNextTemplate('linkedin', 'professional')
      await supabase.from('social_opportunities').upsert({
        platform: 'linkedin',
        post_url: post.url,
        post_id: post.id,
        post_text: post.text.slice(0, 500),
        author_handle: post.authorHandle,
        author_followers: post.authorFollowers,
        engagement_score: post.commentCount * 3 + post.shareCount * 2 + post.likeCount,
        mode: 'professional',
        suggested_image_id: image?.id ?? null,
        suggested_comment_id: template?.id ?? null,
      }, { onConflict: 'platform,post_id', ignoreDuplicates: true })
      inserted++
    }
  } catch (e) {
    console.error('[social-cron] LinkedIn error:', e)
  }

  return NextResponse.json({ ok: true, inserted })
}
