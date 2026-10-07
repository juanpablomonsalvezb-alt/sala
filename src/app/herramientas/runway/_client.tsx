'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  CURRENCIES,
  computeRunway,
  formatMoney,
  runwayHeadline,
  type Currency,
  type RunwayInput,
} from '@/lib/tools/runway'
import { ToolShare } from '@/components/tool-share'

const field =
  'w-full border border-[#DEDEDE] px-3 py-2.5 font-sans text-[14px] text-[#121212] focus:outline-none focus:border-[#121212] bg-white'
const label = 'block font-sans text-[12px] font-semibold text-[#555] uppercase tracking-[0.08em] mb-1.5'

export default function RunwayCalculator({ initial }: { initial: RunwayInput }) {
  const [cash, setCash] = useState(initial.cash ? String(initial.cash) : '')
  const [revenue, setRevenue] = useState(initial.revenue ? String(initial.revenue) : '')
  const [expenses, setExpenses] = useState(initial.expenses ? String(initial.expenses) : '')
  const [growth, setGrowth] = useState(initial.growth ? String(initial.growth) : '')
  const [currency, setCurrency] = useState<Currency>(initial.currency)

  const input: RunwayInput = {
    cash: Math.max(0, Number(cash) || 0),
    revenue: Math.max(0, Number(revenue) || 0),
    expenses: Math.max(0, Number(expenses) || 0),
    growth: Math.min(100, Math.max(0, Number(growth) || 0)),
    currency,
  }
  const hasData = input.cash > 0 && input.expenses > 0
  const result = useMemo(() => computeRunway(input), [input.cash, input.revenue, input.expenses, input.growth]) // eslint-disable-line react-hooks/exhaustive-deps

  // Mantiene la URL compartible con los valores actuales
  useEffect(() => {
    const p = new URLSearchParams()
    if (input.cash) p.set('c', String(input.cash))
    if (input.revenue) p.set('i', String(input.revenue))
    if (input.expenses) p.set('g', String(input.expenses))
    if (input.growth) p.set('cr', String(input.growth))
    p.set('m', currency)
    const qs = p.toString()
    window.history.replaceState(null, '', qs ? `?${qs}` : window.location.pathname)
  }, [input.cash, input.revenue, input.expenses, input.growth, currency])

  const profitable = hasData && result.netBurn <= 0

  return (
    <div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={label} htmlFor="moneda">Moneda</label>
          <select id="moneda" value={currency} onChange={(e) => setCurrency(e.target.value as Currency)} className={field}>
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={label} htmlFor="caja">Caja disponible</label>
          <input id="caja" type="number" inputMode="decimal" min={0} value={cash} onChange={(e) => setCash(e.target.value)} className={field} placeholder="50000000" />
        </div>
        <div>
          <label className={label} htmlFor="gastos">Gastos mensuales</label>
          <input id="gastos" type="number" inputMode="decimal" min={0} value={expenses} onChange={(e) => setExpenses(e.target.value)} className={field} placeholder="8000000" />
        </div>
        <div>
          <label className={label} htmlFor="ingresos">Ingresos mensuales</label>
          <input id="ingresos" type="number" inputMode="decimal" min={0} value={revenue} onChange={(e) => setRevenue(e.target.value)} className={field} placeholder="2000000" />
        </div>
        <div>
          <label className={label} htmlFor="crecimiento">Crecimiento mensual de ingresos (%)</label>
          <input id="crecimiento" type="number" inputMode="decimal" min={0} max={100} value={growth} onChange={(e) => setGrowth(e.target.value)} className={field} placeholder="0" />
        </div>
      </div>

      <div className="mt-8 border border-[#121212] p-6" aria-live="polite">
        {!hasData ? (
          <p className="font-sans text-[14px] text-[#666]">Ingresa tu caja y tus gastos mensuales para ver tu runway.</p>
        ) : (
          <>
            <p className="font-sans text-[11px] uppercase tracking-[0.15em] text-[#C41C1C] mb-2">Tu runway</p>
            <p className="font-serif text-[3rem] font-bold text-[#121212] leading-none mb-3">
              {profitable ? 'Sostenible' : runwayHeadline(result)}
            </p>
            <div className="space-y-1 font-sans text-[14px] text-[#555]">
              <p>
                Burn neto mensual: <strong className="text-[#121212]">{profitable ? 'sin burn (ingresos ≥ gastos)' : formatMoney(result.netBurn, currency)}</strong>
              </p>
              {!profitable && result.zeroDate && (
                <p>
                  Tu caja llega a cero hacia{' '}
                  <strong className="text-[#121212]">
                    {result.zeroDate.toLocaleDateString('es-CL', { month: 'long', year: 'numeric' })}
                  </strong>
                  .
                </p>
              )}
              {!profitable && result.months === null && (
                <p>Con ese crecimiento tu caja no se agota en los próximos {result.horizon} meses.</p>
              )}
              {!profitable && result.months !== null && result.months < 12 && (
                <p>Como regla práctica, muchos equipos buscan tener más de 12 meses de runway antes de levantar capital o recortar.</p>
              )}
            </div>
          </>
        )}
      </div>

      {hasData && (
        <div className="mt-6">
          <ToolShare
            text={
              profitable
                ? 'Mi runway es sostenible: los ingresos cubren los gastos. Calcula el tuyo:'
                : `Mi runway es de ${runwayHeadline(result)}. Calcula el tuyo:`
            }
          />
        </div>
      )}
    </div>
  )
}
