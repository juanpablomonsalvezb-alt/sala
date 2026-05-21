'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'

export interface PressReleaseRow {
  id: string
  creator_id: string
  creator_name: string | null
  creator_slug: string | null
  creator_specialty: string | null
  milestone_type: string | null
  milestone_value: number | null
  milestone_reached_at: string | null
  pr_title: string | null
  pr_body_es: string | null
  pr_quote: string | null
  ai_generated: boolean
  status: string
  reviewed_at: string | null
  sent_at: string | null
  sent_to_count: number | null
  response_count: number | null
  published_count: number | null
  notes: string | null
  created_at: string
}

export interface PressKpis {
  draft: number
  approved: number
  sent: number
  published: number
  rejected: number
  publication_rate: number
}

type FilterKey = 'draft' | 'approved' | 'sent' | 'published' | 'rejected' | 'all'

function statusColor(s: string): string {
  switch (s) {
    case 'draft':
      return 'bg-[#F7F7F7] text-[#666]'
    case 'approved':
      return 'bg-[#E0E7FF] text-[#1E3A8A]'
    case 'sent':
      return 'bg-[#FEF3C7] text-[#92400E]'
    case 'published':
      return 'bg-[#DCFCE7] text-[#15803D]'
    case 'rejected':
      return 'bg-[#FEE2E2] text-[#B30000]'
    default:
      return 'bg-[#EEEEEE] text-[#666]'
  }
}

function milestoneLabel(m: string | null): string {
  const map: Record<string, string> = {
    first_100: '100 suscriptores',
    first_500: '500 suscriptores',
    first_1000: '1.000 suscriptores',
    mrr_1k_usd: 'MRR US$1k',
    mrr_5k_usd: 'MRR US$5k',
    mrr_10k_usd: 'MRR US$10k',
    one_year: 'Un año en plataforma',
  }
  return m ? map[m] ?? m : '—'
}

function formatDate(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('es-CL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function PressReleasesAdminClient({
  initial,
  initialKpis,
}: {
  initial: PressReleaseRow[]
  initialKpis: PressKpis
}) {
  const [items, setItems] = useState<PressReleaseRow[]>(initial)
  const [kpis] = useState<PressKpis>(initialKpis)
  const [filter, setFilter] = useState<FilterKey>('draft')
  const [sectorFilter, setSectorFilter] = useState<string>('all')
  const [busyId, setBusyId] = useState<string | null>(null)
  const [editorOpenId, setEditorOpenId] = useState<string | null>(null)
  const [previewOpenId, setPreviewOpenId] = useState<string | null>(null)
  const [previewInfo, setPreviewInfo] = useState<{
    would_send_to: number
    sectors: string[]
    sample: Array<{ outlet: string; email: string; sector: string }>
  } | null>(null)
  const [edits, setEdits] = useState<
    Record<string, { pr_title?: string; pr_body_es?: string; pr_quote?: string }>
  >({})

  const filtered = useMemo(() => {
    return items.filter((r) => {
      if (filter !== 'all' && r.status !== filter) return false
      if (sectorFilter !== 'all') {
        const sectorMap: Record<string, string[]> = {
          finanzas: ['finanzas', 'economia', 'contabilidad', 'real_estate'],
          tech: ['tech'],
          startups: ['tech', 'marketing'],
          general: [],
        }
        const allowed = sectorMap[sectorFilter] ?? []
        if (allowed.length > 0 && !allowed.includes(r.creator_specialty ?? '')) return false
      }
      return true
    })
  }, [items, filter, sectorFilter])

  function patchLocal(id: string, patch: Partial<PressReleaseRow>) {
    setItems((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)))
  }

  function getEditField(id: string, field: 'pr_title' | 'pr_body_es' | 'pr_quote'): string {
    const original = items.find((r) => r.id === id)
    return edits[id]?.[field] ?? original?.[field] ?? ''
  }

  function setEditField(
    id: string,
    field: 'pr_title' | 'pr_body_es' | 'pr_quote',
    value: string
  ) {
    setEdits((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value } }))
  }

  async function saveEdits(id: string) {
    const e = edits[id]
    if (!e) {
      setEditorOpenId(null)
      return
    }
    setBusyId(id)
    try {
      const res = await fetch('/api/admin/press-releases', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...e }),
      })
      if (res.ok) {
        const data = (await res.json()) as { press_release: PressReleaseRow }
        patchLocal(id, data.press_release)
        setEdits((prev) => {
          const next = { ...prev }
          delete next[id]
          return next
        })
        setEditorOpenId(null)
      }
    } finally {
      setBusyId(null)
    }
  }

  async function patchStatus(id: string, status: string) {
    setBusyId(id)
    try {
      const res = await fetch('/api/admin/press-releases', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      })
      if (res.ok) {
        const data = (await res.json()) as { press_release: PressReleaseRow }
        patchLocal(id, data.press_release)
      }
    } finally {
      setBusyId(null)
    }
  }

  async function loadPreview(id: string) {
    setBusyId(id)
    try {
      const res = await fetch(`/api/admin/press-releases/${id}/send?preview=1`, {
        method: 'POST',
      })
      if (res.ok) {
        const data = (await res.json()) as {
          would_send_to: number
          sectors: string[]
          sample: Array<{ outlet: string; email: string; sector: string }>
        }
        setPreviewInfo(data)
        setPreviewOpenId(id)
      } else {
        const err = (await res.json()) as { error?: string }
        setPreviewInfo({ would_send_to: 0, sectors: [], sample: [] })
        setPreviewOpenId(id)
        alert('Preview falló: ' + (err.error ?? 'unknown'))
      }
    } finally {
      setBusyId(null)
    }
  }

  async function sendNow(id: string) {
    if (!confirm('¿Enviar este press release a los medios elegibles? Esta acción no se puede deshacer.')) return
    setBusyId(id)
    try {
      const res = await fetch(`/api/admin/press-releases/${id}/send`, { method: 'POST' })
      if (res.ok) {
        const data = (await res.json()) as { sent: number; failed: number }
        patchLocal(id, { status: 'sent', sent_at: new Date().toISOString() })
        alert(`Enviados: ${data.sent} · Fallidos: ${data.failed}`)
        setPreviewOpenId(null)
      } else {
        const err = (await res.json()) as { error?: string; current?: string }
        alert(`No se pudo enviar: ${err.error}${err.current ? ` (status actual: ${err.current})` : ''}`)
      }
    } finally {
      setBusyId(null)
    }
  }

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="bg-white border-b border-[#DEDEDE] px-8 py-5 flex items-center justify-between flex-shrink-0">
        <div>
          <div className="flex items-center gap-3">
            <h1
              className="text-[22px] font-bold text-[#121212]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Press Releases
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] bg-[#C41C1C] text-white px-2 py-0.5">
              SUPERADMIN
            </span>
          </div>
          <p className="text-[13px] text-[#666] mt-1">
            Drafts generados por IA cuando un creador cruza un hito. Revisa, edita y envía a la base de medios.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/dashboard/admin/media-contacts"
            className="border border-[#121212] text-[#121212] text-[12px] font-medium px-4 py-2 hover:bg-[#121212] hover:text-white"
          >
            Medios →
          </Link>
          <Link href="/dashboard/admin" className="text-[13px] text-[#666] hover:text-[#121212] self-center">
            ← Panel
          </Link>
        </div>
      </div>

      <div className="px-8 py-7 space-y-7">
        {/* KPIs */}
        <section>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-px bg-[#DEDEDE] border border-[#DEDEDE]">
            <Stat label="Drafts" value={kpis.draft} accent />
            <Stat label="Aprobados" value={kpis.approved} />
            <Stat label="Enviados" value={kpis.sent} />
            <Stat label="Publicados" value={kpis.published} />
            <Stat label="Rechazados" value={kpis.rejected} />
            <Stat
              label="Tasa publicación"
              value={`${(kpis.publication_rate * 100).toFixed(1)}%`}
              isText
            />
          </div>
        </section>

        {/* Filtros */}
        <div className="flex flex-wrap gap-3 items-center text-[12px]">
          <div className="flex gap-1.5">
            {(['draft', 'approved', 'sent', 'published', 'rejected', 'all'] as FilterKey[]).map(
              (f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 border ${
                    filter === f
                      ? 'bg-[#121212] text-white border-[#121212]'
                      : 'bg-white text-[#666] border-[#DEDEDE] hover:border-[#121212]'
                  }`}
                >
                  {f === 'all' ? 'Todos' : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              )
            )}
          </div>

          <select
            value={sectorFilter}
            onChange={(e) => setSectorFilter(e.target.value)}
            className="px-3 py-1.5 border border-[#DEDEDE] bg-white text-[12px]"
          >
            <option value="all">Todos los sectores</option>
            <option value="finanzas">Finanzas</option>
            <option value="tech">Tech</option>
            <option value="startups">Startups</option>
            <option value="general">General</option>
          </select>

          <span className="text-[12px] text-[#999] ml-auto">{filtered.length} resultados</span>
        </div>

        {/* Cards */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.length === 0 && (
            <div className="col-span-full bg-white border border-[#DEDEDE] px-6 py-12 text-center text-[13px] text-[#999]">
              No hay press releases en este filtro. El cron corre a las 08:00 UTC.
            </div>
          )}

          {filtered.map((r) => {
            const isBusy = busyId === r.id
            const isEditing = editorOpenId === r.id
            return (
              <article key={r.id} className="bg-white border border-[#DEDEDE] flex flex-col">
                <header className="px-5 py-4 border-b border-[#EEEEEE]">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span
                          className="text-[14px] font-semibold text-[#121212]"
                          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                        >
                          {r.creator_name ?? 'Creador sin nombre'}
                        </span>
                        <span
                          className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 ${statusColor(r.status)}`}
                        >
                          {r.status}
                        </span>
                        {r.ai_generated && (
                          <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 bg-[#F3E8FF] text-[#6B21A8]">
                            IA
                          </span>
                        )}
                      </div>
                      <div className="flex gap-3 text-[11px] text-[#666]">
                        <span>{milestoneLabel(r.milestone_type)}</span>
                        <span>·</span>
                        <span>{r.creator_specialty ?? '—'}</span>
                        <span>·</span>
                        <span>{formatDate(r.created_at)}</span>
                      </div>
                    </div>
                  </div>
                </header>

                <div className="px-5 py-4 flex-1 space-y-3">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.12em] text-[#999] mb-1">
                      Título
                    </div>
                    {isEditing ? (
                      <input
                        value={getEditField(r.id, 'pr_title')}
                        onChange={(e) => setEditField(r.id, 'pr_title', e.target.value)}
                        maxLength={280}
                        className="w-full text-[14px] font-semibold text-[#121212] bg-[#FAFAF7] border border-[#EEEEEE] px-3 py-2 focus:outline-none focus:border-[#121212]"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                      />
                    ) : (
                      <p
                        className="text-[15px] font-semibold text-[#121212] leading-snug"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                      >
                        {r.pr_title ?? '(sin título)'}
                      </p>
                    )}
                  </div>

                  <div>
                    <div className="text-[10px] uppercase tracking-[0.12em] text-[#999] mb-1">
                      Cuerpo
                    </div>
                    {isEditing ? (
                      <textarea
                        value={getEditField(r.id, 'pr_body_es')}
                        onChange={(e) => setEditField(r.id, 'pr_body_es', e.target.value)}
                        rows={9}
                        maxLength={12000}
                        className="w-full text-[13px] text-[#222] bg-[#FAFAF7] border border-[#EEEEEE] px-3 py-2.5 focus:outline-none focus:border-[#121212] resize-y font-serif"
                      />
                    ) : (
                      <p className="text-[13px] text-[#444] leading-relaxed whitespace-pre-wrap font-serif line-clamp-6">
                        {r.pr_body_es ?? '(sin cuerpo)'}
                      </p>
                    )}
                  </div>

                  <div>
                    <div className="text-[10px] uppercase tracking-[0.12em] text-[#999] mb-1">
                      Quote
                    </div>
                    {isEditing ? (
                      <textarea
                        value={getEditField(r.id, 'pr_quote')}
                        onChange={(e) => setEditField(r.id, 'pr_quote', e.target.value)}
                        rows={2}
                        maxLength={800}
                        className="w-full text-[13px] italic text-[#222] bg-[#FAFAF7] border border-[#EEEEEE] px-3 py-2 focus:outline-none focus:border-[#121212] resize-none font-serif"
                      />
                    ) : (
                      <p className="text-[13px] italic text-[#444] leading-relaxed font-serif border-l-2 border-[#C41C1C] pl-3">
                        {r.pr_quote ?? '(sin quote)'}
                      </p>
                    )}
                  </div>

                  {r.sent_to_count != null && r.sent_to_count > 0 && (
                    <div className="text-[11px] text-[#999] pt-1">
                      Enviado a {r.sent_to_count} medios · Publicado en {r.published_count ?? 0}
                    </div>
                  )}
                </div>

                <footer className="px-5 py-3 border-t border-[#EEEEEE] flex flex-wrap gap-2 bg-[#FAFAFA]">
                  {isEditing ? (
                    <>
                      <button
                        disabled={isBusy}
                        onClick={() => saveEdits(r.id)}
                        className="text-[12px] px-3 py-1.5 bg-[#121212] text-white hover:bg-[#2a2a2a] disabled:opacity-50"
                      >
                        Guardar cambios
                      </button>
                      <button
                        disabled={isBusy}
                        onClick={() => {
                          setEditorOpenId(null)
                          setEdits((prev) => {
                            const n = { ...prev }
                            delete n[r.id]
                            return n
                          })
                        }}
                        className="text-[12px] px-3 py-1.5 border border-[#DEDEDE] text-[#666]"
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <>
                      {r.status !== 'sent' && r.status !== 'published' && (
                        <button
                          disabled={isBusy}
                          onClick={() => setEditorOpenId(r.id)}
                          className="text-[12px] px-3 py-1.5 border border-[#121212] text-[#121212] hover:bg-[#121212] hover:text-white"
                        >
                          Editar
                        </button>
                      )}
                      {r.status === 'draft' && (
                        <button
                          disabled={isBusy}
                          onClick={() => patchStatus(r.id, 'approved')}
                          className="text-[12px] px-3 py-1.5 bg-[#15803D] text-white hover:opacity-90 disabled:opacity-50"
                        >
                          Aprobar
                        </button>
                      )}
                      {r.status === 'approved' && (
                        <button
                          disabled={isBusy}
                          onClick={() => loadPreview(r.id)}
                          className="text-[12px] px-3 py-1.5 bg-[#121212] text-white hover:bg-[#2a2a2a] disabled:opacity-50"
                        >
                          Preview envío
                        </button>
                      )}
                      {r.status === 'sent' && (
                        <button
                          disabled={isBusy}
                          onClick={() => patchStatus(r.id, 'published')}
                          className="text-[12px] px-3 py-1.5 border border-[#15803D] text-[#15803D] hover:bg-[#15803D] hover:text-white"
                        >
                          Marcar publicado
                        </button>
                      )}
                      {r.status !== 'rejected' && r.status !== 'sent' && r.status !== 'published' && (
                        <button
                          disabled={isBusy}
                          onClick={() => patchStatus(r.id, 'rejected')}
                          className="text-[12px] px-3 py-1.5 border border-[#DEDEDE] text-[#B30000] hover:border-[#B30000] ml-auto"
                        >
                          Rechazar
                        </button>
                      )}
                    </>
                  )}
                </footer>
              </article>
            )
          })}
        </section>

        {/* Preview modal */}
        {previewOpenId && previewInfo && (
          <div
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4"
            onClick={() => setPreviewOpenId(null)}
          >
            <div
              className="bg-white border border-[#121212] w-full max-w-[600px] p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h2
                className="text-[20px] font-bold text-[#121212] mb-1"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Confirmar envío
              </h2>
              <p className="text-[13px] text-[#666] mb-4">
                Se enviará a <strong>{previewInfo.would_send_to}</strong> medios elegibles en los
                sectores: <strong>{previewInfo.sectors.join(', ')}</strong>
              </p>

              <div className="max-h-[280px] overflow-y-auto border border-[#EEEEEE] mb-4">
                <table className="w-full text-[12px]">
                  <thead className="bg-[#FAFAFA] sticky top-0">
                    <tr>
                      <th className="text-left px-3 py-2 uppercase tracking-wider text-[10px] text-[#666]">
                        Medio
                      </th>
                      <th className="text-left px-3 py-2 uppercase tracking-wider text-[10px] text-[#666]">
                        Email
                      </th>
                      <th className="text-left px-3 py-2 uppercase tracking-wider text-[10px] text-[#666]">
                        Sector
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewInfo.sample.map((s, i) => (
                      <tr key={i} className="border-t border-[#EEEEEE]">
                        <td className="px-3 py-2">{s.outlet}</td>
                        <td className="px-3 py-2 text-[#666]">{s.email}</td>
                        <td className="px-3 py-2 text-[#999]">{s.sector}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {previewInfo.would_send_to > previewInfo.sample.length && (
                  <p className="text-[11px] text-[#999] px-3 py-2 border-t border-[#EEEEEE]">
                    … y {previewInfo.would_send_to - previewInfo.sample.length} medios más
                  </p>
                )}
              </div>

              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setPreviewOpenId(null)}
                  className="text-[12px] px-4 py-2 border border-[#DEDEDE] text-[#666]"
                >
                  Cancelar
                </button>
                <button
                  disabled={busyId === previewOpenId}
                  onClick={() => sendNow(previewOpenId!)}
                  className="text-[12px] px-4 py-2 bg-[#C41C1C] text-white hover:bg-[#A01818] disabled:opacity-50"
                >
                  Enviar a {previewInfo.would_send_to} medios
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

function Stat({
  label,
  value,
  accent,
  isText,
}: {
  label: string
  value: number | string
  accent?: boolean
  isText?: boolean
}) {
  return (
    <div className={`bg-white p-5 ${accent ? 'border-l-2 border-[#C41C1C]' : ''}`}>
      <p className="text-[10px] uppercase tracking-[0.14em] text-[#888] font-medium">{label}</p>
      <p
        className="text-[28px] font-bold text-[#121212] mt-1 tabular-nums"
        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
      >
        {isText ? value : Number(value).toLocaleString('es-CL')}
      </p>
    </div>
  )
}
