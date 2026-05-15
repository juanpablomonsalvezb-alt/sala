'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface Opportunity {
  id: string
  platform: 'x' | 'linkedin'
  post_url: string
  post_text: string
  author_handle: string
  author_followers: number
  engagement_score: number
  mode: 'professional' | 'viral'
  detected_at: string
  status: 'pending' | 'published' | 'skipped'
  suggested_image: { storage_url: string; filename: string } | null
  suggested_template: { text: string } | null
  custom_comment: string | null
}

interface RateLimit {
  platform: string
  count_today: number
  last_published_at: string | null
}

interface PostedContent {
  id: string
  platform: string
  text: string
  image_url: string | null
  posted_at: string
  success: boolean
  error_message: string | null
}

const LIMITS = { x: 10, linkedin: 20 }

export default function SocialMonitorPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [rateLimits, setRateLimits] = useState<Record<string, RateLimit>>({})
  const [postedContent, setPostedContent] = useState<PostedContent[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [loading, setLoading] = useState<string | null>(null)
  const [publishingNow, setPublishingNow] = useState(false)
  const [publishNowMsg, setPublishNowMsg] = useState<{ text: string; ok: boolean } | null>(null)
  const [msg, setMsg] = useState<{ id: string; text: string; ok: boolean } | null>(null)

  const load = useCallback(async () => {
    const today = new Date().toISOString().split('T')[0]
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

    const [{ data: opps }, { data: limits }, { data: posted }] = await Promise.all([
      supabase
        .from('social_opportunities')
        .select('*, suggested_image:social_images(storage_url,filename), suggested_template:social_comment_templates(text)')
        .eq('status', 'pending')
        .order('engagement_score', { ascending: false })
        .limit(20),
      supabase
        .from('social_rate_limits')
        .select('*')
        .eq('date', today),
      supabase
        .from('social_posted_content')
        .select('*')
        .eq('platform', 'x')
        .gte('posted_at', sevenDaysAgo)
        .order('posted_at', { ascending: false })
        .limit(7),
    ])
    setOpportunities((opps as Opportunity[]) ?? [])
    const map: Record<string, RateLimit> = {}
    for (const l of limits ?? []) map[l.platform] = l
    setRateLimits(map)
    setPostedContent((posted as PostedContent[]) ?? [])
  }, [])

  useEffect(() => { load() }, [load])

  async function publish(opp: Opportunity) {
    setLoading(opp.id)
    const comment = editingId === opp.id ? editText : (opp.suggested_template?.text ?? '')
    const res = await fetch('/api/social/publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ opportunityId: opp.id, comment }),
    })
    const data = await res.json()
    if (res.ok) {
      setMsg({ id: opp.id, text: '✅ Publicado', ok: true })
      setOpportunities(prev => prev.filter(o => o.id !== opp.id))
    } else {
      setMsg({ id: opp.id, text: `❌ ${data.error}`, ok: false })
    }
    setLoading(null)
    setEditingId(null)
    setTimeout(() => setMsg(null), 4000)
  }

  async function skip(opp: Opportunity) {
    setLoading(opp.id)
    await fetch('/api/social/skip', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ opportunityId: opp.id }),
    })
    setOpportunities(prev => prev.filter(o => o.id !== opp.id))
    setLoading(null)
  }

  async function handlePublishNow() {
    setPublishingNow(true)
    setPublishNowMsg(null)
    const secret = process.env.NEXT_PUBLIC_CRON_SECRET
    const url = secret
      ? `/api/cron/post-content?secret=${secret}`
      : '/api/cron/post-content'
    try {
      const res = await fetch(url)
      const data = await res.json()
      if (res.ok && data.ok) {
        setPublishNowMsg({ text: '✅ Publicado correctamente', ok: true })
        load()
      } else if (data.skipped) {
        setPublishNowMsg({ text: `⏭ ${data.reason}`, ok: false })
      } else {
        setPublishNowMsg({ text: `❌ ${data.error ?? 'Error desconocido'}`, ok: false })
      }
    } catch {
      setPublishNowMsg({ text: '❌ Error de red', ok: false })
    }
    setPublishingNow(false)
    setTimeout(() => setPublishNowMsg(null), 6000)
  }

  const xLimit = rateLimits['x']
  const liLimit = rateLimits['linkedin']

  const xCount = xLimit?.count_today ?? 0
  const liCount = liLimit?.count_today ?? 0

  function minuntilLI(): number | null {
    if (!liLimit?.last_published_at) return null
    const elapsed = Date.now() - new Date(liLimit.last_published_at).getTime()
    const remaining = 30 * 60 * 1000 - elapsed
    return remaining > 0 ? Math.ceil(remaining / 60000) : null
  }

  const byPlatform = (p: 'x' | 'linkedin') => opportunities.filter(o => o.platform === p)

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-neutral-900">Monitor Social</h1>
        <button
          onClick={load}
          className="text-sm text-neutral-500 hover:text-neutral-900 underline"
        >
          Actualizar
        </button>
      </div>

      {/* Rate limit badges */}
      <div className="flex gap-4 flex-wrap">
        <RateBadge
          platform="X"
          used={xCount}
          max={LIMITS.x}
          cooldown={null}
        />
        <RateBadge
          platform="LinkedIn"
          used={liCount}
          max={LIMITS.linkedin}
          cooldown={minuntilLI()}
        />
      </div>

      {/* ─── Contenido propio ─── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-neutral-500 uppercase tracking-wider">
            Contenido propio — @Nebbuler
          </h2>
          <div className="flex items-center gap-3">
            {publishNowMsg && (
              <p className={`text-xs font-medium ${publishNowMsg.ok ? 'text-emerald-600' : 'text-amber-600'}`}>
                {publishNowMsg.text}
              </p>
            )}
            <button
              onClick={handlePublishNow}
              disabled={publishingNow}
              className="text-xs px-3 py-1.5 rounded-lg bg-neutral-900 text-white hover:bg-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {publishingNow ? 'Publicando…' : 'Publicar ahora'}
            </button>
          </div>
        </div>

        {postedContent.length === 0 ? (
          <div className="border border-neutral-200 rounded-xl p-6 text-center text-sm text-neutral-400">
            Sin publicaciones propias en los últimos 7 días. El cron publica cada día a las 14:00 UTC.
          </div>
        ) : (
          <div className="space-y-3">
            {postedContent.map(post => (
              <PostedCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>

      {opportunities.length === 0 && (
        <div className="py-20 text-center text-neutral-400">
          No hay oportunidades pendientes. El cron detecta cada 2 horas.
        </div>
      )}

      {/* X */}
      {byPlatform('x').length > 0 && (
        <Section title="𝕏 (Twitter)">
          {byPlatform('x').map(opp => (
            <OppCard
              key={opp.id}
              opp={opp}
              blocked={xCount >= LIMITS.x}
              loading={loading === opp.id}
              editing={editingId === opp.id}
              editText={editText}
              feedback={msg?.id === opp.id ? msg : null}
              onEdit={() => { setEditingId(opp.id); setEditText(opp.suggested_template?.text ?? '') }}
              onEditChange={setEditText}
              onCancelEdit={() => setEditingId(null)}
              onPublish={() => publish(opp)}
              onSkip={() => skip(opp)}
            />
          ))}
        </Section>
      )}

      {/* LinkedIn */}
      {byPlatform('linkedin').length > 0 && (
        <Section title="LinkedIn">
          {byPlatform('linkedin').map(opp => (
            <OppCard
              key={opp.id}
              opp={opp}
              blocked={liCount >= LIMITS.linkedin || (minuntilLI() !== null)}
              loading={loading === opp.id}
              editing={editingId === opp.id}
              editText={editText}
              feedback={msg?.id === opp.id ? msg : null}
              blockReason={minuntilLI() !== null ? `Esperá ${minuntilLI()} min` : undefined}
              onEdit={() => { setEditingId(opp.id); setEditText(opp.suggested_template?.text ?? '') }}
              onEditChange={setEditText}
              onCancelEdit={() => setEditingId(null)}
              onPublish={() => publish(opp)}
              onSkip={() => skip(opp)}
            />
          ))}
        </Section>
      )}
    </div>
  )
}

function PostedCard({ post }: { post: PostedContent }) {
  const date = new Date(post.posted_at)
  const label = date.toLocaleString('es-CL', {
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
  })
  return (
    <div className={`border rounded-xl p-4 space-y-2 bg-white ${post.success ? 'border-neutral-200' : 'border-red-200 bg-red-50'}`}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-neutral-400">{label}</p>
        <span className={`text-xs rounded-full px-2 py-0.5 border ${post.success ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 'text-red-700 bg-red-50 border-red-200'}`}>
          {post.success ? 'Publicado' : 'Error'}
        </span>
      </div>
      <p className="text-sm text-neutral-800">{post.text}</p>
      {post.image_url && (
        <img src={post.image_url} alt="imagen post" className="w-24 h-14 object-cover rounded-lg border border-neutral-200" />
      )}
      {post.error_message && (
        <p className="text-xs text-red-500">{post.error_message}</p>
      )}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <h2 className="text-sm font-medium text-neutral-500 uppercase tracking-wider">{title}</h2>
      {children}
    </div>
  )
}

function RateBadge({ platform, used, max, cooldown }: {
  platform: string; used: number; max: number; cooldown: number | null
}) {
  const pct = Math.min((used / max) * 100, 100)
  const color = pct >= 100 ? 'bg-red-500' : pct >= 70 ? 'bg-amber-500' : 'bg-emerald-500'
  return (
    <div className="border border-neutral-200 rounded-lg px-4 py-3 min-w-[140px]">
      <div className="flex justify-between text-xs text-neutral-500 mb-1">
        <span>{platform}</span>
        <span>{used}/{max}/día</span>
      </div>
      <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
      {cooldown && (
        <p className="text-xs text-amber-600 mt-1">Próxima en {cooldown} min</p>
      )}
    </div>
  )
}

function OppCard({
  opp, blocked, loading, editing, editText, feedback, blockReason,
  onEdit, onEditChange, onCancelEdit, onPublish, onSkip,
}: {
  opp: Opportunity
  blocked: boolean
  loading: boolean
  editing: boolean
  editText: string
  feedback: { text: string; ok: boolean } | null
  blockReason?: string
  onEdit: () => void
  onEditChange: (v: string) => void
  onCancelEdit: () => void
  onPublish: () => void
  onSkip: () => void
}) {
  const modeColor = opp.mode === 'professional'
    ? 'bg-blue-50 text-blue-700 border-blue-200'
    : 'bg-purple-50 text-purple-700 border-purple-200'

  return (
    <div className="border border-neutral-200 rounded-xl p-4 space-y-3 bg-white hover:shadow-sm transition-shadow">
      {/* Meta */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-0.5 min-w-0">
          <p className="text-sm font-medium text-neutral-900 truncate">@{opp.author_handle}</p>
          <p className="text-xs text-neutral-400">
            Score {opp.engagement_score.toLocaleString()} ·{' '}
            {new Date(opp.detected_at).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <span className={`text-xs border rounded-full px-2 py-0.5 shrink-0 ${modeColor}`}>
          {opp.mode}
        </span>
      </div>

      {/* Post text */}
      <p className="text-sm text-neutral-700 line-clamp-3 bg-neutral-50 rounded-lg p-2.5">
        {opp.post_text || <span className="italic text-neutral-400">Sin texto</span>}
      </p>

      {/* Comment preview / edit */}
      {editing ? (
        <div className="space-y-2">
          <textarea
            value={editText}
            onChange={e => onEditChange(e.target.value)}
            className="w-full text-sm border border-neutral-300 rounded-lg p-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-neutral-900"
            rows={3}
          />
          <button onClick={onCancelEdit} className="text-xs text-neutral-400 hover:text-neutral-700">
            Cancelar edición
          </button>
        </div>
      ) : (
        <div className="flex items-start gap-2">
          <p className="text-sm text-neutral-600 flex-1 italic border-l-2 border-neutral-200 pl-2">
            {opp.suggested_template?.text ?? '—'}
          </p>
          <button onClick={onEdit} className="text-xs text-neutral-400 hover:text-neutral-700 shrink-0 mt-0.5">
            Editar
          </button>
        </div>
      )}

      {/* Image preview */}
      {opp.suggested_image?.storage_url && (
        <img
          src={opp.suggested_image.storage_url}
          alt="imagen Nebbuler"
          className="w-24 h-14 object-cover rounded-lg border border-neutral-200"
        />
      )}

      {/* Feedback */}
      {feedback && (
        <p className={`text-xs font-medium ${feedback.ok ? 'text-emerald-600' : 'text-red-600'}`}>
          {feedback.text}
        </p>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        <a
          href={opp.post_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-neutral-400 hover:text-neutral-700 underline"
        >
          Ver post
        </a>
        <div className="flex-1" />
        <button
          onClick={onSkip}
          disabled={loading}
          className="text-xs px-3 py-1.5 rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-50 disabled:opacity-50"
        >
          Saltar
        </button>
        <button
          onClick={onPublish}
          disabled={loading || blocked}
          title={blocked ? (blockReason ?? 'Límite diario alcanzado') : undefined}
          className="text-xs px-3 py-1.5 rounded-lg bg-neutral-900 text-white hover:bg-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? '…' : blocked ? (blockReason ?? 'Límite') : 'Publicar'}
        </button>
      </div>
    </div>
  )
}
