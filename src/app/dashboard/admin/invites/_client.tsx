'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'

interface InviteRow {
  id: string
  code: string
  assigned_email: string | null
  assigned_name: string | null
  notes: string | null
  max_uses: number
  times_used: number
  expires_at: string | null
  revoked_at: string | null
  grants_plan: string
  created_at: string
}

function formatDate(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('es-CL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function statusOf(row: InviteRow): { label: string; color: string } {
  if (row.revoked_at) return { label: 'Revocado', color: 'bg-[#EEEEEE] text-[#666]' }
  if (row.expires_at && new Date(row.expires_at).getTime() < Date.now()) {
    return { label: 'Expirado', color: 'bg-[#FEF2E2] text-[#7A4A00]' }
  }
  if (row.times_used >= row.max_uses) {
    return { label: 'Usado', color: 'bg-[#E0E7FF] text-[#1E3A8A]' }
  }
  return { label: 'Activo', color: 'bg-[#DCFCE7] text-[#15803D]' }
}

export function InvitesAdminClient({ initialInvites }: { initialInvites: InviteRow[] }) {
  const [invites, setInvites] = useState<InviteRow[]>(initialInvites)
  const [showCreate, setShowCreate] = useState(false)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'active' | 'used' | 'revoked' | 'expired'>('all')

  const stats = useMemo(() => {
    const total = invites.length
    const active = invites.filter((i) => !i.revoked_at && i.times_used < i.max_uses && (!i.expires_at || new Date(i.expires_at).getTime() > Date.now())).length
    const redeemed = invites.reduce((acc, i) => acc + i.times_used, 0)
    const revoked = invites.filter((i) => i.revoked_at).length
    return { total, active, redeemed, revoked }
  }, [invites])

  const filtered = useMemo(() => {
    if (filter === 'all') return invites
    return invites.filter((i) => {
      const s = statusOf(i).label.toLowerCase()
      if (filter === 'active') return s === 'activo'
      if (filter === 'used') return s === 'usado'
      if (filter === 'revoked') return s === 'revocado'
      if (filter === 'expired') return s === 'expirado'
      return true
    })
  }, [invites, filter])

  async function copyInviteUrl(code: string) {
    const url = `${window.location.origin}/invite/${code}`
    try {
      await navigator.clipboard.writeText(url)
      setCopiedCode(code)
      setTimeout(() => setCopiedCode(null), 1500)
    } catch {
      // fallback
      window.prompt('Copia el link:', url)
    }
  }

  async function handleRevoke(id: string) {
    if (!confirm('¿Revocar este código? El invitado no podrá usarlo más.')) return
    const res = await fetch('/api/admin/invites', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action: 'revoke' }),
    })
    if (res.ok) {
      setInvites((prev) =>
        prev.map((i) => (i.id === id ? { ...i, revoked_at: new Date().toISOString() } : i))
      )
    }
  }

  async function handleUnrevoke(id: string) {
    const res = await fetch('/api/admin/invites', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action: 'unrevoke' }),
    })
    if (res.ok) {
      setInvites((prev) =>
        prev.map((i) => (i.id === id ? { ...i, revoked_at: null } : i))
      )
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
              Invitaciones VIP
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] bg-[#C41C1C] text-white px-2 py-0.5">
              SUPERADMIN
            </span>
          </div>
          <p className="text-[13px] text-[#666] mt-1">
            Genera códigos para que influencers abran su sala sin pagar la tarifa de plataforma.
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="bg-[#121212] text-white text-[13px] font-medium px-4 py-2.5 hover:bg-[#2a2a2a]"
        >
          + Nuevo código
        </button>
      </div>

      <div className="px-8 py-7 space-y-7">
        {/* KPIs */}
        <section>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#DEDEDE] border border-[#DEDEDE]">
            <Stat label="Total emitidos" value={stats.total} />
            <Stat label="Activos" value={stats.active} accent />
            <Stat label="Redenciones" value={stats.redeemed} />
            <Stat label="Revocados" value={stats.revoked} />
          </div>
        </section>

        {/* Filtros */}
        <div className="flex gap-2 text-[12px]">
          {(['all', 'active', 'used', 'revoked', 'expired'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 border ${
                filter === f
                  ? 'bg-[#121212] text-white border-[#121212]'
                  : 'bg-white text-[#666] border-[#DEDEDE] hover:border-[#121212]'
              }`}
            >
              {f === 'all'
                ? 'Todos'
                : f === 'active'
                ? 'Activos'
                : f === 'used'
                ? 'Usados'
                : f === 'revoked'
                ? 'Revocados'
                : 'Expirados'}
            </button>
          ))}
        </div>

        {/* Tabla */}
        <section className="bg-white border border-[#DEDEDE]">
          <table className="w-full text-[13px]">
            <thead className="bg-[#F7F7F7] text-[10px] uppercase tracking-[0.1em] text-[#888]">
              <tr>
                <th className="text-left px-4 py-3">Código</th>
                <th className="text-left px-4 py-3">Para</th>
                <th className="text-left px-4 py-3">Estado</th>
                <th className="text-left px-4 py-3">Usos</th>
                <th className="text-left px-4 py-3">Expira</th>
                <th className="text-left px-4 py-3">Creado</th>
                <th className="text-right px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-[#999]">
                    No hay códigos {filter !== 'all' ? `(${filter})` : ''}.
                  </td>
                </tr>
              )}
              {filtered.map((inv) => {
                const status = statusOf(inv)
                return (
                  <tr key={inv.id} className="border-t border-[#EEEEEE] hover:bg-[#FAFAFA]">
                    <td className="px-4 py-3 font-mono text-[12px] font-semibold text-[#121212]">
                      {inv.code}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-[#121212]">{inv.assigned_name || '—'}</div>
                      {inv.assigned_email && (
                        <div className="text-[11px] text-[#888]">{inv.assigned_email}</div>
                      )}
                      {inv.notes && (
                        <div className="text-[11px] text-[#666] mt-1 italic">{inv.notes}</div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 ${status.color}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 tabular-nums">
                      {inv.times_used} / {inv.max_uses}
                    </td>
                    <td className="px-4 py-3 text-[#666]">{formatDate(inv.expires_at)}</td>
                    <td className="px-4 py-3 text-[#666]">{formatDate(inv.created_at)}</td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button
                        onClick={() => copyInviteUrl(inv.code)}
                        className="text-[12px] text-[#121212] underline underline-offset-2 hover:no-underline"
                      >
                        {copiedCode === inv.code ? '✓ Copiado' : 'Copiar link'}
                      </button>
                      {inv.revoked_at ? (
                        <button
                          onClick={() => handleUnrevoke(inv.id)}
                          className="text-[12px] text-[#15803D]"
                        >
                          Reactivar
                        </button>
                      ) : (
                        <button
                          onClick={() => handleRevoke(inv.id)}
                          className="text-[12px] text-[#B30000]"
                        >
                          Revocar
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </section>

        <Link href="/dashboard/admin" className="text-[13px] text-[#666] hover:text-[#121212]">
          ← Volver al panel admin
        </Link>
      </div>

      {showCreate && (
        <CreateInviteModal
          onClose={() => setShowCreate(false)}
          onCreated={(inv) => setInvites((prev) => [inv, ...prev])}
        />
      )}
    </main>
  )
}

function Stat({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className={`bg-white p-5 ${accent ? 'border-l-2 border-[#C41C1C]' : ''}`}>
      <p className="text-[10px] uppercase tracking-[0.14em] text-[#888] font-medium">{label}</p>
      <p
        className="text-[28px] font-bold text-[#121212] mt-1 tabular-nums"
        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
      >
        {value.toLocaleString('es-CL')}
      </p>
    </div>
  )
}

function CreateInviteModal({
  onClose,
  onCreated,
}: {
  onClose: () => void
  onCreated: (inv: InviteRow) => void
}) {
  const [display_name, setName] = useState('')
  const [assigned_email, setEmail] = useState('')
  const [notes, setNotes] = useState('')
  const [max_uses, setMaxUses] = useState(1)
  const [days, setDays] = useState(30)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [created, setCreated] = useState<InviteRow | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const expires_at = days > 0
      ? new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString()
      : null
    try {
      const res = await fetch('/api/admin/invites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ display_name, assigned_email, notes, max_uses, expires_at }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Error al crear código')
        setLoading(false)
        return
      }
      onCreated(data.invite)
      setCreated(data.invite)
      setLoading(false)
    } catch {
      setError('Error de red')
      setLoading(false)
    }
  }

  async function copyUrl() {
    if (!created) return
    const url = `${window.location.origin}/invite/${created.code}`
    await navigator.clipboard.writeText(url)
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="bg-white border border-[#121212] max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
        {!created ? (
          <form onSubmit={handleSubmit} className="p-6">
            <h2
              className="text-[24px] font-bold text-[#121212] mb-4"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Nuevo código de invitación
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-[12px] uppercase tracking-wider text-[#666] mb-1">
                  Nombre del invitado <span className="text-[#999]">(opcional)</span>
                </label>
                <input
                  type="text"
                  value={display_name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Lucas Lacoste"
                  maxLength={200}
                  className="w-full border border-[#DEDEDE] px-3 py-2 text-[14px] focus:border-[#121212] outline-none"
                />
              </div>

              <div>
                <label className="block text-[12px] uppercase tracking-wider text-[#666] mb-1">
                  Email asignado <span className="text-[#999]">(opcional · restringe el código a un email)</span>
                </label>
                <input
                  type="email"
                  value={assigned_email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="lucas@ejemplo.com"
                  className="w-full border border-[#DEDEDE] px-3 py-2 text-[14px] focus:border-[#121212] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] uppercase tracking-wider text-[#666] mb-1">
                    Máx. usos
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={1000}
                    value={max_uses}
                    onChange={(e) => setMaxUses(parseInt(e.target.value || '1', 10))}
                    className="w-full border border-[#DEDEDE] px-3 py-2 text-[14px] focus:border-[#121212] outline-none tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-[12px] uppercase tracking-wider text-[#666] mb-1">
                    Expira en (días, 0 = sin expirar)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={3650}
                    value={days}
                    onChange={(e) => setDays(parseInt(e.target.value || '0', 10))}
                    className="w-full border border-[#DEDEDE] px-3 py-2 text-[14px] focus:border-[#121212] outline-none tabular-nums"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[12px] uppercase tracking-wider text-[#666] mb-1">
                  Notas internas
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ej: Conocido en evento X · respondió por LinkedIn"
                  rows={2}
                  maxLength={2000}
                  className="w-full border border-[#DEDEDE] px-3 py-2 text-[14px] focus:border-[#121212] outline-none"
                />
              </div>
            </div>

            {error && (
              <p className="text-[13px] text-[#B30000] mt-3 bg-[#FFE6E6] p-3">{error}</p>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="text-[13px] text-[#666] px-4 py-2"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="text-[13px] text-white bg-[#121212] px-4 py-2 hover:bg-[#2a2a2a] disabled:opacity-60"
              >
                {loading ? 'Creando…' : 'Crear código'}
              </button>
            </div>
          </form>
        ) : (
          <div className="p-6">
            <h2
              className="text-[24px] font-bold text-[#121212] mb-2"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Código creado
            </h2>
            <p className="text-[13px] text-[#666] mb-4">
              Comparte este link con el invitado:
            </p>
            <div className="bg-[#F7F7F7] border border-[#DEDEDE] p-4 mb-4">
              <p className="text-[10px] uppercase tracking-wider text-[#666] mb-1">Código</p>
              <p className="font-mono text-[16px] font-bold text-[#121212]">{created.code}</p>
            </div>
            <div className="bg-[#FFFBEA] border border-[#EAB308] p-4 mb-4">
              <p className="text-[10px] uppercase tracking-wider text-[#7A5900] mb-1">Link</p>
              <p className="text-[12px] text-[#121212] break-all">
                {typeof window !== 'undefined' ? window.location.origin : 'https://nebbuler.com'}/invite/{created.code}
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={copyUrl}
                className="text-[13px] text-white bg-[#C41C1C] px-4 py-2 hover:bg-[#A01515]"
              >
                Copiar link
              </button>
              <button
                onClick={onClose}
                className="text-[13px] text-[#666] px-4 py-2 border border-[#DEDEDE]"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
