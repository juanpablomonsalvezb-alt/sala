import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { Creator, Post } from '@/types/database'
import { deletePost, unpublishPost } from './_actions'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('es-CL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

// ─── Action buttons ───────────────────────────────────────────────────────────

function PostActions({ post }: { post: Post }) {
  return (
    <div className="flex items-center gap-3">
      <Link
        href={`/dashboard/nueva-publicacion?edit=${post.id}`}
        className="text-[12px] text-[#666666] hover:text-[#121212] transition-colors underline underline-offset-2"
        style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
      >
        Editar
      </Link>
      {post.published_at && (
        <form action={unpublishPost}>
          <input type="hidden" name="postId" value={post.id} />
          <button
            type="submit"
            className="text-[12px] text-[#666666] hover:text-[#C41C1C] transition-colors underline underline-offset-2"
            style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
          >
            Despublicar
          </button>
        </form>
      )}
      <form action={deletePost}>
        <input type="hidden" name="postId" value={post.id} />
        <button
          type="submit"
          className="text-[12px] text-[#C41C1C] hover:text-[#a01515] transition-colors underline underline-offset-2"
          style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
        >
          Eliminar
        </button>
      </form>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function PublicacionesPage() {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/entrar')

  const { data: creatorRaw } = await db
    .from('sala_creators')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle()

  const creator = creatorRaw as Pick<Creator, 'id'> | null
  if (!creator) redirect('/abrir')

  const { data: postsRaw } = await db
    .from('sala_posts')
    .select('*')
    .eq('creator_id', creator!.id)
    .order('created_at', { ascending: false })

  const posts: Post[] = (postsRaw as Post[] | null) ?? []

  const published = posts.filter((p) => p.published_at !== null)
  const drafts = posts.filter((p) => p.published_at === null)

  return (
    <>
      {/* Header */}
      <div className="bg-white border-b border-[#DEDEDE] px-8 py-5 flex items-center justify-between flex-shrink-0">
        <div>
          <h1
            className="text-[22px] font-bold text-[#121212] leading-tight"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Publicaciones
          </h1>
          <p
            className="text-[13px] text-[#666666] mt-0.5"
            style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
          >
            {published.length} publicadas · {drafts.length} borradores
          </p>
        </div>
        <Link
          href="/dashboard/nueva-publicacion"
          className="inline-flex items-center gap-2 bg-[#121212] text-white text-[13px] font-medium px-4 py-2.5 hover:bg-[#2a2a2a] transition-colors"
          style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
        >
          Nueva publicación →
        </Link>
      </div>

      <main className="flex-1 overflow-y-auto">
        <div className="px-8 py-7">
          {posts.length === 0 ? (
            <div className="bg-white border border-[#DEDEDE] px-8 py-16 text-center">
              <p
                className="text-[15px] text-[#666666] mb-4"
                style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
              >
                Aún no tienes publicaciones.
              </p>
              <Link
                href="/dashboard/nueva-publicacion"
                className="inline-flex items-center gap-2 bg-[#C41C1C] text-white text-[13px] font-semibold px-5 py-3 hover:bg-[#a01515] transition-colors"
                style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
              >
                Crear tu primera publicación →
              </Link>
            </div>
          ) : (
            <div className="bg-white border border-[#DEDEDE]">
              {/* Table header */}
              <div
                className="grid px-6 py-3 border-b border-[#DEDEDE] bg-[#F7F7F7]"
                style={{ gridTemplateColumns: '1fr 130px 110px 100px 200px' }}
              >
                {['Título', 'Fecha', 'Tipo', 'Estado', 'Acciones'].map((h) => (
                  <span
                    key={h}
                    className="text-[11px] uppercase tracking-[0.1em] text-[#666666] font-medium"
                    style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
                  >
                    {h}
                  </span>
                ))}
              </div>

              {/* Rows */}
              {posts.map((post, i) => (
                <div
                  key={post.id}
                  className={`grid px-6 py-4 items-center ${
                    i !== posts.length - 1 ? 'border-b border-[#DEDEDE]' : ''
                  } hover:bg-[#F7F7F7] transition-colors`}
                  style={{ gridTemplateColumns: '1fr 130px 110px 100px 200px' }}
                >
                  {/* Title */}
                  <div className="pr-4">
                    <Link
                      href={`/${post.slug}`}
                      className="text-[14px] text-[#121212] font-medium leading-snug line-clamp-2 hover:text-[#C41C1C] transition-colors"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      {post.title}
                    </Link>
                    {post.excerpt && (
                      <p
                        className="text-[12px] text-[#666666] mt-0.5 line-clamp-1"
                        style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
                      >
                        {post.excerpt}
                      </p>
                    )}
                  </div>

                  {/* Date */}
                  <span
                    className="text-[13px] text-[#666666]"
                    style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
                  >
                    {formatDate(post.published_at ?? post.created_at)}
                  </span>

                  {/* Type */}
                  <span
                    className="text-[12px] text-[#666666]"
                    style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
                  >
                    {post.is_free ? 'Libre' : 'Premium'}
                  </span>

                  {/* Status */}
                  <span
                    className={`inline-flex text-[11px] font-medium px-2 py-0.5 w-fit tracking-wide uppercase ${
                      post.published_at
                        ? 'bg-[#121212] text-white'
                        : 'bg-[#DEDEDE] text-[#666666]'
                    }`}
                    style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
                  >
                    {post.published_at ? 'Publicado' : 'Borrador'}
                  </span>

                  {/* Actions */}
                  <PostActions post={post} />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  )
}
