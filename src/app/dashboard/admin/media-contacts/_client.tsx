'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'

export interface MediaContactRow {
  id: string
  outlet_name: string
  country: string | null
  tier: number | null
  sector: string
  email: string
  contact_name: string | null
  language: string | null
  status: string
  last_contacted_at: string | null
  response_rate: number | null
  notes: string | null
  created_at: string
  times_contacted?: number
  times_published?: number
  times_replied?: number
}

function statusColor(s: string): string {
  switch (s) {
    case 'active':
      return 'bg-[#DCFCE7] text-[#15803D]'
    case 'paused':
      return 'bg-[#FEF3C7] text-[#92400E]'
    case 'bounced':
      return 'bg-[#FEE2E2] text-[#B30000]'
    case 'unsubscribed':
      return 'bg-[#E5E7EB] text-[#374151]'
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

export function MediaContactsAdminClient({ initial }: { initial: MediaContactRow[] }) {
  const [items, setItems] = useState<MediaContactRow[]>(initial)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [countryFilter, setCountryFilter] = useState<string>('all')
  const [sectorFilter, setSectorFilter] = useState<string>('all')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    outlet_name: '',
    email: '',
    country: 'CL',
    tier: 2,
    sector: 'general',
    contact_name: '',
    notes: '',
  })

  const filtered = useMemo(() => {
    return items.filter((r) => {
      if (statusFilter !== 'all' && r.status !== statusFilter) return false
      if (countryFilter !== 'all' && r.country !== countryFilter) return false
      if (sectorFilter !== 'all' && r.sector !== sectorFilter) return false
      return true
    })
  }, [items, statusFilter, countryFilter, sectorFilter])

  const totals = useMemo(() => {
    return {
      total: items.length,
      active: items.filter((r) => r.status === 'active').length,
      contacted: items.reduce((acc, r) => acc + (r.times_contacted ?? 0), 0),
      published: items.reduce((acc, r) => acc + (r.times_published ?? 0), 0),
    }
  }, [items])

  const countries = useMemo(() => {
    const s = new Set<string>()
    for (const r of items) if (r.country) s.add(r.country)
    return Array.from(s).sort()
  }, [items])

  const sectors = useMemo(() => {
    const s = new Set<string>()
    for (const r of items) if (r.sector) s.add(r.sector)
    return Array.from(s).sort()
  }, [items])

  async function patchRow(id: string, patch: Partial<MediaContactRow>) {
    setBusyId(id)
    try {
      const res = await fetch('/api/admin/media-contacts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...patch }),
      })
      if (res.ok) {
        const data = (await res.json()) as { media_contact: MediaContactRow }
        setItems((prev) => prev.map((r) => (r.id === id ? { ...r, ...data.media_contact } : r)))
      }
    } finally {
      setBusyId(null)
    }
  }

  async function deleteRow(id: string) {
    if (!confirm('¿Eliminar este medio? Esta acción es permanente.')) return
    setBusyId(id)
    try {
      const res = await fetch(`/api/admin/media-contacts?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        setItems((prev) => prev.filter((r) => r.id !== id))
      }
    } finally {
      setBusyId(null)
    }
  }

  async function createRow() {
    if (!form.outlet_name.trim() || !form.email.trim()) {
      alert('Outlet y email son obligatorios')
      return
    }
    try {
      const res = await fetch('/api/admin/media-contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        const data = (await res.json()) as { media_contact: MediaContactRow }
        setItems((prev) => [{ ...data.media_contact, times_contacted: 0, times_published: 0, times_replied: 0 }, ...prev])
        setShowForm(false)
        setForm({ outlet_name: '', email: '', country: 'CL', tier: 2, sector: 'general', contact_name: '', notes: '' })
      } else {
        const err = (await res.json()) as { error?: string }
        alert('Error: ' + (err.error ?? 'unknown'))
      }
    } catch (err) {
      alert('Error: ' + (err as Error).message)
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
              Medios de prensa
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] bg-[#C41C1C] text-white px-2 py-0.5">
              SUPERADMIN
            </span>
          </div>
          <p className="text-[13px] text-[#666] mt-1">
            Base de contactos para distribución de press releases.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-[#121212] text-white text-[12px] font-medium px-4 py-2 hover:bg-[#2a2a2a]"
          >
            {showForm ? 'Cancelar' : '+ Nuevo medio'}
          </button>
          <Link href="/dashboard/admin/press-releases" className="border border-[#121212] text-[#121212] text-[12px] font-medium px-4 py-2 hover:bg-[#121212] hover:text-white">
            ← Press Releases
          </Link>
        </div>
      </div>

      <div className="px-8 py-7 space-y-7">
        {/* KPIs */}
        <section>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#DEDEDE] border border-[#DEDEDE]">
            <Stat label="Total medios" value={totals.total} accent />
            <Stat label="Activos" value={totals.active} />
            <Stat label="Veces contactados" value={totals.contacted} />
            <Stat label="Publicaciones logradas" value={totals.published} />
          </div>
        </section>

        {/* Form nuevo */}
        {showForm && (
          <section className="bg-white border border-[#DEDEDE] p-5">
            <h2 className="text-[14px] font-semibold text-[#121212] mb-3 uppercase tracking-wider">
              Nuevo medio
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                placeholder="Outlet (ej: La Tercera Pulso)"
                value={form.outlet_name}
                onChange={(e) => setForm((f) => ({ ...f, outlet_name: e.target.value }))}
                className="border border-[#DEDEDE] px-3 py-2 text-[13px] focus:outline-none focus:border-[#121212]"
              />
              <input
                placeholder="Email"
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="border border-[#DEDEDE] px-3 py-2 text-[13px] focus:outline-none focus:border-[#121212]"
              />
              <input
                placeholder="Nombre del contacto (opcional)"
                value={form.contact_name}
                onChange={(e) => setForm((f) => ({ ...f, contact_name: e.target.value }))}
                className="border border-[#DEDEDE] px-3 py-2 text-[13px] focus:outline-none focus:border-[#121212]"
              />
              <select
                value={form.country}
                onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
                className="border border-[#DEDEDE] px-3 py-2 text-[13px] focus:outline-none focus:border-[#121212]"
              >
                {['CL', 'AR', 'MX', 'CO', 'PE', 'UY', 'EC', 'PA', 'RD', 'BR', 'ES', 'US'].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <select
                value={form.tier}
                onChange={(e) => setForm((f) => ({ ...f, tier: Number(e.target.value) }))}
                className="border border-[#DEDEDE] px-3 py-2 text-[13px] focus:outline-none focus:border-[#121212]"
              >
                <option value={1}>Tier 1</option>
                <option value={2}>Tier 2</option>
                <option value={3}>Tier 3</option>
              </select>
              <select
                value={form.sector}
                onChange={(e) => setForm((f) => ({ ...f, sector: e.target.value }))}
                className="border border-[#DEDEDE] px-3 py-2 text-[13px] focus:outline-none focus:border-[#121212]"
              >
                <option value="general">General</option>
                <option value="finanzas">Finanzas</option>
                <option value="tech">Tech</option>
                <option value="startups">Startups</option>
              </select>
              <textarea
                placeholder="Notas (opcional)"
                rows={2}
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                className="border border-[#DEDEDE] px-3 py-2 text-[13px] focus:outline-none focus:border-[#121212] md:col-span-2 resize-none"
              />
            </div>
            <button
              onClick={createRow}
              className="mt-3 bg-[#121212] text-white text-[12px] px-4 py-2 hover:bg-[#2a2a2a]"
            >
              Guardar medio
            </button>
          </section>
        )}

        {/* Filtros */}
        <div className="flex flex-wrap gap-3 items-center text-[12px]">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 border border-[#DEDEDE] bg-white text-[12px]"
          >
            <option value="all">Todos los estados</option>
            <option value="active">Activos</option>
            <option value="paused">Pausados</option>
            <option value="bounced">Bounced</option>
            <option value="unsubscribed">Unsubscribed</option>
          </select>

          <select
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
            className="px-3 py-1.5 border border-[#DEDEDE] bg-white text-[12px]"
          >
            <option value="all">Todos los países</option>
            {countries.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            value={sectorFilter}
            onChange={(e) => setSectorFilter(e.target.value)}
            className="px-3 py-1.5 border border-[#DEDEDE] bg-white text-[12px]"
          >
            <option value="all">Todos los sectores</option>
            {sectors.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <span className="text-[12px] text-[#999] ml-auto">{filtered.length} medios</span>
        </div>

        {/* Tabla */}
        <section className="bg-white border border-[#DEDEDE]">
          <div
            className="grid px-5 py-2.5 border-b border-[#DEDEDE] bg-[#F7F7F7]"
            style={{ gridTemplateColumns: '1.5fr 1.5fr 70px 70px 110px 90px 110px 120px' }}
          >
            {['Outlet', 'Email', 'País', 'Tier', 'Sector', 'Status', 'Contactos', 'Acciones'].map(
              (h) => (
                <span
                  key={h}
                  className="text-[10px] uppercase tracking-[0.1em] text-[#666] font-medium font-sans"
                >
                  {h}
                </span>
              )
            )}
          </div>

          {filtered.map((r) => (
            <div
              key={r.id}
              className="grid px-5 py-3 items-center border-b border-[#EEEEEE] hover:bg-[#FAFAFA] transition-colors text-[12px]"
              style={{ gridTemplateColumns: '1.5fr 1.5fr 70px 70px 110px 90px 110px 120px' }}
            >
              <div>
                <p className="text-[13px] font-medium text-[#121212] font-serif">{r.outlet_name}</p>
                {r.contact_name && (
                  <p className="text-[11px] text-[#999]">{r.contact_name}</p>
                )}
              </div>
              <span className="text-[12px] text-[#666] truncate" title={r.email}>{r.email}</span>
              <span className="text-[12px] text-[#666]">{r.country ?? '—'}</span>
              <span className="text-[12px] text-[#666]">T{r.tier ?? '—'}</span>
              <span className="text-[11px] text-[#666] capitalize">{r.sector}</span>
              <select
                value={r.status}
                disabled={busyId === r.id}
                onChange={(e) => patchRow(r.id, { status: e.target.value })}
                className={`text-[10px] uppercase font-bold px-1.5 py-0.5 w-fit border-0 ${statusColor(r.status)}`}
              >
                <option value="active">active</option>
                <option value="paused">paused</option>
                <option value="bounced">bounced</option>
                <option value="unsubscribed">unsubsc</option>
              </select>
              <div className="text-[11px] text-[#666]">
                <div>{r.times_contacted ?? 0} envíos</div>
                <div className="text-[10px] text-[#15803D]">{r.times_published ?? 0} publicaron</div>
              </div>
              <div className="flex gap-1.5">
                <button
                  disabled={busyId === r.id}
                  onClick={() => deleteRow(r.id)}
                  className="text-[11px] px-2 py-1 border border-[#DEDEDE] text-[#B30000] hover:border-[#B30000] disabled:opacity-50"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="px-5 py-10 text-center text-[13px] text-[#999]">
              No hay medios en este filtro.
            </div>
          )}
        </section>

        <p className="text-[11px] text-[#999] text-center">
          {filtered.length} de {items.length} medios · última actualización: {formatDate(items[0]?.created_at ?? null)}
        </p>
      </div>
    </main>
  )
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string
  value: number
  accent?: boolean
}) {
  return (
    <div className={`bg-white p-5 ${accent ? 'border-l-2 border-[#C41C1C]' : ''}`}>
      <p className="text-[10px] uppercase tracking-[0.14em] text-[#888] font-medium">{label}</p>
      <p
        className="text-[28px] font-bold text-[#121212] mt-1 tabular-nums"
        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
      >
        {Number(value).toLocaleString('es-CL')}
      </p>
    </div>
  )
}
