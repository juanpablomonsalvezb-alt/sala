import { createClient } from '@/lib/supabase/server'
import NuevaPublicacionClient from './_components/NuevaPublicacionClient'

type PostInitial = {
  id: string
  title: string
  content: string
  isFree: boolean
  isPublished: boolean
}

export default async function NuevaPublicacionPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>
}) {
  const { edit } = await searchParams

  let initial: PostInitial | null = null

  if (edit) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const db = supabase as any
      const { data: creator } = await db
        .from('sala_creators')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle()

      if (creator) {
        const { data: post } = await db
          .from('sala_posts')
          .select('id, title, content, is_free, published_at')
          .eq('id', edit)
          .eq('creator_id', creator.id)
          .maybeSingle()

        if (post) {
          initial = {
            id: post.id,
            title: post.title ?? '',
            content: post.content ?? '',
            isFree: !!post.is_free,
            isPublished: !!post.published_at,
          }
        }
      }
    }
  }

  return <NuevaPublicacionClient initial={initial} />
}
