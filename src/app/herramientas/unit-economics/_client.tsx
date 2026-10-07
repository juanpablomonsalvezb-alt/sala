'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  VERDICT_TEXT,
  computeUnitEconomics,
  type UnitEconInput,
} from '@/lib/tools/unit-economics'
import { ToolShare } from '@/components/tool-share'

const field =
  'w-full border border-[#DEDEDE] px-3 py-2.5 font-sans text-[14px] text-[#121212] focus:outline-none focus:border-[#121212] bg-white'
const label = 'block font-sans text-[12px] font-semibold text-[#555] uppercase tracking-[0.08em] mb-1.5'
const hint = 'font-sans text-[11px] text-[#999] mt-1'

const num = (n: number) => n.toLocaleString('es-CL', { maximumFractionDigits: 1 })

export default function UnitEconomicsCalculator({ initial }: { initial: UnitEconInput }) {
  const [arpu, setArpu] = useState(initial.arpu ? String(initial.arpu) : '')
  const [margin, setMargin] = useState(String(initial.margin))
  const [churn, setChurn] = useState(String(initial.churn))
  const [cac, setCac] = useState(initial.cac ? String(initial.cac) : '')

  const input: UnitEconInput = {
    arpu: Math.max(0, Number(arpu) || 0),
    margin: Math.min(100, Math.max(0, Number(margin) || 0)),
    churn: Math.min(100, Math.max(0, Number(churn) || 0)),
    cac: Math.max(0, Number(cac) || 0),
  }
  const r = useMemo(() => computeUnitEconomics(input), [input.arpu, input.margin, input.churn, input.cac]) // eslint-disable-line react-hooks/exhaustive-deps
  const v = VERDICT_TEXT[r.verdict]

  useEffect(() => {
    const p = new URLSearchParams()
    if (input.arpu) p.set('a', String(input.arpu))
    p.set('mg', String(input.margin))
    p.set('ch', String(input.churn))
    if (input.cac) p.set('cac', String(input.cac))
    window.history.replaceState(null, '', `?${p.toString()}`)
  }, [input.arpu, input.margin, input.churn, input.cac])

  return (
    <div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="arpu">Ingreso mensual por cliente</label>
          <input id="arpu" type="number" inputMode="decimal" min={0} value={arpu} onChange={(e) => setArpu(e.target.value)} className={field} placeholder="30000" />
          <p className={hint}>Lo que paga un cliente al mes (ARPU)</p>
        </div>
        <div>
          <label className={label} htmlFor="margen">Margen bruto (%)</label>
          <input id="margen" type="number" inputMode="decimal" min={0} max={100} value={margin} onChange={(e) => setMargin(e.target.value)} className={field} />
          <p className={hint}>Después de costos directos de servir al cliente</p>
        </div>
        <div>
          <label className={label} htmlFor="churn">Churn mensual (%)</label>
          <input id="churn" type="number" inputMode="decimal" min={0} max={100} value={churn} onChange={(e) => setChurn(e.target.value)} className={field} />
          <p className={hint}>% de clientes que se va cada mes</p>
        </div>
        <div>
          <label className={label} htmlFor="cac">CAC</label>
          <input id="cac" type="number" inputMode="decimal" min={0} value={cac} onChange={(e) => setCac(e.target.value)} className={field} placeholder="90000" />
          <p className={hint}>Lo que gastas en conseguir un cliente nuevo</p>
        </div>
      </div>

      <div className="mt-8 border border-[#121212] p-6" aria-live="polite">
        {r.verdict === 'sin-datos' ? (
          <p className="font-sans text-[14px] text-[#666]">{v.body}</p>
        ) : (
          <>
            <p className="font-sans text-[11px] uppercase tracking-[0.15em] text-[#C41C1C] mb-2">Relación LTV : CAC</p>
            <p className="font-serif text-[3rem] font-bold text-[#121212] leading-none mb-2">
              {r.ratio !== null ? `${num(r.ratio)} : 1` : '—'}
            </p>
            <p className="font-serif text-[16px] font-bold text-[#121212] mb-1">{v.title}</p>
            <p className="font-sans text-[14px] text-[#555] leading-relaxed mb-4">{v.body}</p>
            <dl className="grid grid-cols-2 gap-3 font-sans text-[13px] text-[#555] border-t border-[#DEDEDE] pt-4">
              <div>
                <dt className="text-[#999] text-[11px] uppercase tracking-[0.08em]">LTV</dt>
                <dd className="text-[#121212] font-semibold">{r.ltv !== null ? num(Math.round(r.ltv)) : '—'}</dd>
              </div>
              <div>
                <dt className="text-[#999] text-[11px] uppercase tracking-[0.08em]">Payback del CAC</dt>
                <dd className="text-[#121212] font-semibold">{r.paybackMonths !== null ? `${num(r.paybackMonths)} meses` : '—'}</dd>
              </div>
              <div>
                <dt className="text-[#999] text-[11px] uppercase tracking-[0.08em]">Vida media del cliente</dt>
                <dd className="text-[#121212] font-semibold">{r.lifetimeMonths !== null ? `${num(r.lifetimeMonths)} meses` : '—'}</dd>
              </div>
              <div>
                <dt className="text-[#999] text-[11px] uppercase tracking-[0.08em]">Margen mensual por cliente</dt>
                <dd className="text-[#121212] font-semibold">{num(Math.round(r.monthlyProfit))}</dd>
              </div>
            </dl>
          </>
        )}
      </div>

      {r.ratio !== null && (
        <div className="mt-6">
          <ToolShare text={`Mi relación LTV:CAC es ${num(r.ratio)}:1. Calcula la tuya:`} />
        </div>
      )}
    </div>
  )
}
