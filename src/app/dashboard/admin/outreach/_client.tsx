'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'

export interface OutreachRow {
  id: string
  platform: string
  profile_url: string
  full_name: string | null
  headline: string | null
  country: string | null
  specialty: string | null
  followers_count: number | null
  signal_post_url: string | null
  signal_post_excerpt: string | null
  signal_engagement: number | null
  signal_reason: string | null
  ai_score: number | null
  ai_pitch_draft: string | null
  status: string
  invite_code_id: string | null
  invite_code?: string | null
  notes: string | null
  detected_at: string
  reviewed_at: string | null
  sent_at: string | null
}

export interface OutreachKpis {
  pending: number
  approved: number
  sent_this_week: number
  sent_total: number
  converted: number
  conversion_rate: number
}

type FilterKey = 'pending' | 'approved' | 'sent' | 'converted' | 'rejected' | 'all'

function scoreColor(score: number | null): string {
  if (score == null) return 'bg-[#EEEEEE] text-[#666]'
  if (score >= 0.8) return 'bg-[#DCFCE7] text-[#15803D]'
  if (score >= 0.5) return 'bg-[#FEF3C7] text-[#92400E]'
  return 'bg-[#FEE2E2] text-[#B30000]'
}

function statusColor(status: string): string {
  switch (status) {
    case 'pending':
      return 'bg-[#F7F7F7] text-[#666]'
    case 'approved':
      return 'bg-[#E0E7FF] text-[#1E3A8A]'
    case 'sent':
    case 'contacted':
      return 'bg-[#FEF3C7] text-[#92400E]'
    case 'converted':
      return 'bg-[#DCFCE7] text-[#15803D]'
    case 'rejected':
    case 'blocked':
      return 'bg-[#FEE2E2] text-[#B30000]'
    default:
      return 'bg-[#EEEEEE] text-[#666]'
  }
}

function formatDate(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('es-CL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function specialtyLabel(s: string | null): string {
  if (!s) return '—'
  const map: Record<string, string> = {
    economia: 'Economía',
    derecho: 'Derecho',
    finanzas: 'Finanzas',
    salud: 'Salud',
    tech: 'Tech',
    marketing: 'Marketing',
    consultoria: 'Consultoría',
    contabilidad: 'Contabilidad',
    recursos_humanos: 'RR. HH.',
    real_estate: 'Real Estate',
    otro: 'Otro',
  }
  return map[s] ?? s
}

export function OutreachAdminClient({
  initialTargets,
  initialKpis,
}: {
  initialTargets: OutreachRow[]
  initialKpis: OutreachKpis
}) {
  const [targets, setTargets] = useState<OutreachRow[]>(initialTargets)
  const [kpis] = useState<OutreachKpis>(initialKpis)
  const [filter, setFilter] = useState<FilterKey>('pending')
  const [countryFilter, setCountryFilter] = useState<string>('all')
  const [specialtyFilter, setSpecialtyFilter] = useState<string>('all')
  const [busyId, setBusyId] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [draftEdits, setDraftEdits] = useState<Record<string, string>>({})

  const filtered = useMemo(() => {
    return targets.filter((t) => {
      if (filter !== 'all') {
        if (filter === 'sent') {
          if (t.status !== 'sent' && t.status !== 'contacted') return false
        } else if (t.status !== filter) {
          return false
        }
      }
      if (countryFilter !== 'all' && t.country !== countryFilter) return false
      if (specialtyFilter !== 'all' && t.specialty !== specialtyFilter) return false
      return true
    })
  }, [targets, filter, countryFilter, specialtyFilter])

  const countries = useMemo(() => {
    const s = new Set<string>()
    for (const t of targets) if (t.country) s.add(t.country)
    return Array.from(s).sort()
  }, [targets])

  const specialties = useMemo(() => {
    const s = new Set<string>()
    for (const t of targets) if (t.specialty) s.add(t.specialty)
    return Array.from(s).sort()
  }, [targets])

  function updateLocal(id: string, patch: Partial<OutreachRow>) {
    setTargets((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)))
  }

  async function patchStatus(id: string, status: string) {
    setBusyId(id)
    try {
      const draft = draftEdits[id]
      const body: Record<string, unknown> = { id, status }
      if (typeof draft === 'string') body.ai_pitch_draft = draft

      const res = await fetch('/api/admin/outreach', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (res.ok) {
        const data = (await res.json()) as { target: OutreachRow }
        updateLocal(id, data.target)
      }
    } finally {
      setBusyId(null)
    }
  }

  async function generateInvite(id: string) {
    setBusyId(id)
    try {
      const res = await fetch('/api/admin/outreach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'generate_invite' }),
      })
      if (res.ok) {
        const data = (await res.json()) as { invite: { id: string; code: string } }
        updateLocal(id, {
          invite_code_id: data.invite.id,
          invite_code: data.invite.code,
          status: 'approved',
        })
      }
    } finally {
      setBusyId(null)
    }
  }

  async function copyPitch(t: OutreachRow) {
    const draft = draftEdits[t.id] ?? t.ai_pitch_draft ?? ''
    const inviteUrl = t.invite_code
      ? `${window.location.origin}/vip/${t.invite_code}`
      : ''
    const fullMessage = inviteUrl ? `${draft.trim()}\n\n${inviteUrl}` : draft.trim()

    try {
      await navigator.clipboard.writeText(fullMessage)
      setCopiedId(t.id)
      setTimeout(() => setCopiedId(null), 1800)
    } catch {
      window.prompt('Copia el DM:', fullMessage)
    }
  }

  function setDraft(id: string, value: string) {
    setDraftEdits((prev) => ({ ...prev, [id]: value }))
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
              Outreach LinkedIn
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] bg-[#C41C1C] text-white px-2 py-0.5">
              SUPERADMIN
            </span>
          </div>
          <p className="text-[13px] text-[#666] mt-1">
            Cola de leads detectados por IA. Revisa, ajusta el DM, genera código VIP y envía.
          </p>
        </div>
        <Link
          href="/dashboard/admin"
          className="text-[13px] text-[#666] hover:text-[#121212]"
        >
          ← Panel admin
        </Link>
      </div>

      <div className="px-8 py-7 space-y-7">
        {/* KPIs */}
        <section>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-px bg-[#DEDEDE] border border-[#DEDEDE]">
            <Stat label="Pendientes" value={kpis.pending} accent />
            <Stat label="Aprobados" value={kpis.approved} />
            <Stat label="Enviados (7d)" value={kpis.sent_this_week} />
            <Stat label="Convertidos" value={kpis.converted} />
            <Stat
              label="Conversión"
              value={`${(kpis.conversion_rate * 100).toFixed(1)}%`}
              isText
            />
          </div>
        </section>

        {/* Filtros */}
        <div className="flex flex-wrap gap-3 items-center text-[12px]">
          <div className="flex gap-1.5">
            {(['pending', 'approved', 'sent', 'converted', 'rejected', 'all'] as FilterKey[]).map(
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
                  {f === 'pending'
                    ? 'Pendientes'
                    : f === 'approved'
                    ? 'Aprobados'
                    : f === 'sent'
                    ? 'Enviados'
                    : f === 'converted'
                    ? 'Convertidos'
                    : f === 'rejected'
                    ? 'Rechazados'
                    : 'Todos'}
                </button>
              )
            )}
          </div>

          <select
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
            className="px-3 py-1.5 border border-[#DEDEDE] bg-white text-[12px]"
          >
            <option value="all">Todos los países</option>
            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={specialtyFilter}
            onChange={(e) => setSpecialtyFilter(e.target.value)}
            className="px-3 py-1.5 border border-[#DEDEDE] bg-white text-[12px]"
          >
            <option value="all">Todas las especialidades</option>
            {specialties.map((s) => (
              <option key={s} value={s}>
                {specialtyLabel(s)}
              </option>
            ))}
          </select>

          <span className="text-[12px] text-[#999] ml-auto">{filtered.length} resultados</span>
        </div>

        {/* Cards */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.length === 0 && (
            <div className="col-span-full bg-white border border-[#DEDEDE] px-6 py-12 text-center text-[13px] text-[#999]">
              No hay targets en este filtro. El cron corre a las 07:00 UTC.
            </div>
          )}

          {filtered.map((t) => {
            const draft = draftEdits[t.id] ?? t.ai_pitch_draft ?? ''
            const isBusy = busyId === t.id
            return (
              <article
                key={t.id}
                className="bg-white border border-[#DEDEDE] flex flex-col"
              >
                {/* Header card */}
                <header className="px-5 py-4 border-b border-[#EEEEEE] flex items-start gap-3">
                  <div
                    className="w-11 h-11 rounded-full bg-[#121212] text-white text-[14px] font-semibold flex items-center justify-center flex-shrink-0"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    {(t.full_name ?? '?').charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <a
                        href={t.profile_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[14px] font-semibold text-[#121212] hover:underline"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                      >
                        {t.full_name ?? 'Perfil sin nombre'}
                      </a>
                      <span
                        className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 ${scoreColor(
                          t.ai_score
                        )}`}
                      >
                        {t.ai_score != null ? t.ai_score.toFixed(2) : '—'}
                      </span>
                      <span
                        className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 ${statusColor(
                          t.status
                        )}`}
                      >
                        {t.status}
                      </span>
                    </div>
                    {t.headline && (
                      <p className="text-[12px] text-[#666] mt-0.5 line-clamp-2">{t.headline}</p>
                    )}
                    <div className="flex gap-3 text-[11px] text-[#999] mt-1.5">
                      <span>{t.country ?? '—'}</span>
                      <span>·</span>
                      <span>{specialtyLabel(t.specialty)}</span>
                      <span>·</span>
                      <span>{(t.followers_count ?? 0).toLocaleString('es-CL')} followers</span>
                    </div>
                  </div>
                </header>

                {/* Signal */}
                {(t.signal_post_excerpt || t.signal_post_url) && (
                  <div className="px-5 py-3 border-b border-[#EEEEEE] bg-[#FAFAF7]">
                    <div className="text-[10px] uppercase tracking-[0.12em] text-[#999] mb-1.5">
                      Señal detectada
                      {t.signal_engagement && t.signal_engagement > 0 && (
                        <span> · {t.signal_engagement.toLocaleString('es-CL')} reacciones</span>
                      )}
                    </div>
                    {t.signal_post_excerpt && (
                      <p className="text-[12px] text-[#333] leading-relaxed italic">
                        “{t.signal_post_excerpt}”
                      </p>
                    )}
                    <div className="flex gap-3 items-center mt-2 text-[11px]">
                      {t.signal_post_url && (
                        <a
                          href={t.signal_post_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#121212] underline underline-offset-2 hover:no-underline"
                        >
                          Ver post →
                        </a>
                      )}
                      {t.signal_reason && (
                        <span className="text-[#666]">{t.signal_reason}</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Pitch editor */}
                <div className="px-5 py-4 flex-1">
                  <div className="text-[10px] uppercase tracking-[0.12em] text-[#999] mb-1.5">
                    DM personalizado
                  </div>
                  <textarea
                    value={draft}
                    onChange={(e) => setDraft(t.id, e.target.value)}
                    rows={5}
                    maxLength={1200}
                    className="w-full text-[13px] text-[#121212] bg-[#FAFAF7] border border-[#EEEEEE] px-3 py-2.5 focus:outline-none focus:border-[#121212] resize-none font-sans"
                    placeholder="DM editable…"
                  />
                  <div className="flex justify-between text-[10px] text-[#999] mt-1">
                    <span>{draft.length} / 1200</span>
                    {t.invite_code && (
                      <span className="font-mono text-[#121212]">
                        invite: {t.invite_code}
                      </span>
                    )}
                  </div>
                </div>

                {/* Acciones */}
                <footer className="px-5 py-3 border-t border-[#EEEEEE] flex flex-wrap gap-2 bg-[#FAFAFA]">
                  {!t.invite_code && (
                    <button
                      disabled={isBusy}
                      onClick={() => generateInvite(t.id)}
                      className="text-[12px] px-3 py-1.5 bg-[#121212] text-white hover:bg-[#2a2a2a] disabled:opacity-50"
                    >
                      Generar código VIP
                    </button>
                  )}
                  <button
                    disabled={isBusy}
                    onClick={() => copyPitch(t)}
                    className="text-[12px] px-3 py-1.5 border border-[#121212] text-[#121212] hover:bg-[#121212] hover:text-white disabled:opacity-50"
                  >
                    {copiedId === t.id ? '✓ Copiado' : 'Copiar DM + link'}
                  </button>
                  {t.status !== 'sent' && t.status !== 'contacted' && (
                    <button
                      disabled={isBusy}
                      onClick={() => patchStatus(t.id, 'sent')}
                      className="text-[12px] px-3 py-1.5 border border-[#DEDEDE] text-[#121212] hover:border-[#121212] disabled:opacity-50"
                    >
                      Marcar como enviado
                    </button>
                  )}
                  {t.status === 'sent' && (
                    <button
                      disabled={isBusy}
                      onClick={() => patchStatus(t.id, 'converted')}
                      className="text-[12px] px-3 py-1.5 border border-[#15803D] text-[#15803D] hover:bg-[#15803D] hover:text-white disabled:opacity-50"
                    >
                      Marcar convertido
                    </button>
                  )}
                  {t.status !== 'rejected' && (
                    <button
                      disabled={isBusy}
                      onClick={() => patchStatus(t.id, 'rejected')}
                      className="text-[12px] px-3 py-1.5 border border-[#DEDEDE] text-[#B30000] hover:border-[#B30000] disabled:opacity-50 ml-auto"
                    >
                      Rechazar
                    </button>
                  )}
                </footer>
              </article>
            )
          })}
        </section>

        <Link href="/dashboard/admin" className="text-[13px] text-[#666] hover:text-[#121212]">
          ← Volver al panel admin
        </Link>
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
