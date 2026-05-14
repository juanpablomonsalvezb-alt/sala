import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { searchProfessionalOpportunities, searchViralOpportunities } from '@/lib/x-client'
import { getLinkedInFeed } from '@/lib/linkedin-client'
import { getNextImage, getNextTemplate } from '@/lib/social'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: Request) {
  const secret = new URL(req.url).searchParams.get('secret')
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const results = { x_professional: 0, x_viral: 0, linkedin: 0, errors: [] as string[] }

  // X — Profesional
  try {
    const posts = await searchProfessionalOpportunities(15)
    for (const post of posts) {
      if (!post.id) continue
      const image = await getNextImage('professional')
      const template = await getNextTemplate('x', 'professional')
      const { error } = await supabase.from('social_opportunities').upsert({
        platform: 'x',
        post_url: post.url,
        post_id: post.id,
        post_text: post.text.slice(0, 500),
        author_handle: post.authorHandle,
        author_followers: post.authorFollowers,
        engagement_score: post.engagementScore,
        mode: 'professional',
        suggested_image_id: image?.id ?? null,
        suggested_comment_id: template?.id ?? null,
      }, { onConflict: 'platform,post_id', ignoreDuplicates: true })
      if (!error) results.x_professional++
    }
  } catch (e) {
    results.errors.push(`x_professional: ${String(e).slice(0, 100)}`)
  }

  // X — Viral
  try {
    const posts = await searchViralOpportunities(15)
    for (const post of posts) {
      if (!post.id) continue
      const image = await getNextImage('viral')
      const template = await getNextTemplate('x', 'viral')
      const { error } = await supabase.from('social_opportunities').upsert({
        platform: 'x',
        post_url: post.url,
        post_id: post.id,
        post_text: post.text.slice(0, 500),
        author_handle: post.authorHandle,
        author_followers: post.authorFollowers,
        engagement_score: post.engagementScore,
        mode: 'viral',
        suggested_image_id: image?.id ?? null,
        suggested_comment_id: template?.id ?? null,
      }, { onConflict: 'platform,post_id', ignoreDuplicates: true })
      if (!error) results.x_viral++
    }
  } catch (e) {
    results.errors.push(`x_viral: ${String(e).slice(0, 100)}`)
  }

  // LinkedIn
  try {
    const posts = await getLinkedInFeed()
    for (const post of posts) {
      if (!post.id) continue
      const image = await getNextImage('professional')
      const template = await getNextTemplate('linkedin', 'professional')
      const { error } = await supabase.from('social_opportunities').upsert({
        platform: 'linkedin',
        post_url: post.url,
        post_id: post.id,
        post_text: post.text.slice(0, 500),
        author_handle: post.authorHandle,
        author_followers: post.authorFollowers,
        engagement_score: post.commentCount * 5 + post.shareCount * 3 + post.likeCount,
        mode: 'professional',
        suggested_image_id: image?.id ?? null,
        suggested_comment_id: template?.id ?? null,
      }, { onConflict: 'platform,post_id', ignoreDuplicates: true })
      if (!error) results.linkedin++
    }
  } catch (e) {
    results.errors.push(`linkedin: ${String(e).slice(0, 100)}`)
  }

  return NextResponse.json({ ok: true, ...results })
}
