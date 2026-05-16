// Dynamic OG image for public creator posts
// OG_ENABLED=true/false — if disabled, redirects to static fallback
// Never modifies existing routes

import { createServiceClient } from '@/lib/supabase/server'
import { buildPostOGResponse, buildFallbackOGResponse } from '@/lib/og/templates'

export const runtime = 'nodejs'
export const revalidate = 3600

const OG_ENABLED = process.env.OG_ENABLED !== 'false'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!OG_ENABLED) return buildFallbackOGResponse()

  const { slug } = await params

  try {
    const supabase = createServiceClient()

    const { data: post } = await supabase
      .from('sala_posts')
      .select('title, published_at, creator_id, interaction_count')
      .eq('slug', slug)
      .maybeSingle()

    if (!post) return buildFallbackOGResponse()

    const { data: creator } = await supabase
      .from('sala_creators')
      .select('name, specialty')
      .eq('id', post.creator_id)
      .maybeSingle()

    const publishedDate = post.published_at
      ? new Date(post.published_at as string).toLocaleDateString('es-CL', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      : undefined

    return buildPostOGResponse({
      title: (post.title as string) ?? 'Sin título',
      creatorName: creator?.name ?? 'Nebbuler',
      creatorSpecialty: creator?.specialty ?? '',
      interactionCount: (post.interaction_count as number) ?? 0,
      publishedAt: publishedDate,
    })
  } catch {
    return buildFallbackOGResponse()
  }
}
