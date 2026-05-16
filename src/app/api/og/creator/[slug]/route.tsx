// Dynamic OG image for creator profile pages
// OG_ENABLED=true/false — if disabled, redirects to static fallback

import { createServiceClient } from '@/lib/supabase/server'
import { buildCreatorOGResponse, buildFallbackOGResponse } from '@/lib/og/templates'

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

    const { data: creator } = await supabase
      .from('sala_creators')
      .select('name, specialty, bio, subscriber_count, price_clp')
      .eq('slug', slug)
      .maybeSingle()

    if (!creator) return buildFallbackOGResponse()

    return buildCreatorOGResponse({
      name: creator.name as string,
      specialty: creator.specialty as string,
      bio: (creator.bio as string) ?? '',
      subscriberCount: (creator.subscriber_count as number) ?? undefined,
      price: (creator.price_clp as number) ?? undefined,
    })
  } catch {
    return buildFallbackOGResponse()
  }
}
