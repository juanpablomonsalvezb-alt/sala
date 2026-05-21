'use client'

import { useEffect, useMemo, useState } from 'react'

interface CreatorRowData {
  country: string
  area: string
}

const COUNTRIES = [
  { code: '', label: 'Todos los países' },
  { code: 'CL', label: 'Chile' },
  { code: 'AR', label: 'Argentina' },
  { code: 'MX', label: 'México' },
  { code: 'CO', label: 'Colombia' },
  { code: 'PE', label: 'Perú' },
  { code: 'UY', label: 'Uruguay' },
  { code: 'BR', label: 'Brasil' },
  { code: 'EC', label: 'Ecuador' },
  { code: 'ES', label: 'España' },
]

export function LeaderboardFilters() {
  const [country, setCountry] = useState('')
  const [area, setArea] = useState('')
  const [areas, setAreas] = useState<string[]>([])

  // Detectar áreas únicas leyendo el DOM (los rows tienen data-area)
  useEffect(() => {
    const rows = Array.from(
      document.querySelectorAll<HTMLElement>('[data-area]')
    )
    const set = new Set<string>()
    rows.forEach(r => {
      const v = r.getAttribute('data-area')
      if (v && v.trim() && v !== 'Reservado') set.add(v.trim())
    })
    setAreas(Array.from(set).sort())
  }, [])

  // Aplicar filtros
  useEffect(() => {
    const rows = Array.from(
      document.querySelectorAll<HTMLElement>('[data-area]')
    )
    rows.forEach(r => {
      const rowCountry = r.getAttribute('data-country') ?? ''
      const rowArea = r.getAttribute('data-area') ?? ''
      const matchCountry = !country || rowCountry === country
      const matchArea = !area || rowArea === area
      const parent = r.closest('li')
      if (parent) {
        parent.style.display = matchCountry && matchArea ? '' : 'none'
      }
    })
  }, [country, area])

  const selectClass =
    'bg-white border border-[#121212] text-[#121212] text-[11px] uppercase tracking-[0.15em] px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-[#C41C1C] cursor-pointer'

  const hasFilters = useMemo(() => country || area, [country, area])

  return (
    <div className="flex flex-col md:flex-row md:items-center gap-3">
      <span className="text-[10px] uppercase tracking-[0.25em] text-[#666] font-semibold">
        Filtrar
      </span>
      <select
        value={country}
        onChange={e => setCountry(e.target.value)}
        className={selectClass}
        aria-label="Filtrar por país"
      >
        {COUNTRIES.map(c => (
          <option key={c.code} value={c.code}>
            {c.label}
          </option>
        ))}
      </select>
      <select
        value={area}
        onChange={e => setArea(e.target.value)}
        className={selectClass}
        aria-label="Filtrar por especialidad"
      >
        <option value="">Todas las especialidades</option>
        {areas.map(a => (
          <option key={a} value={a}>
            {a}
          </option>
        ))}
      </select>
      {hasFilters && (
        <button
          type="button"
          onClick={() => {
            setCountry('')
            setArea('')
          }}
          className="text-[10px] uppercase tracking-[0.2em] text-[#C41C1C] hover:underline font-medium"
        >
          Limpiar filtros
        </button>
      )}
    </div>
  )
}
