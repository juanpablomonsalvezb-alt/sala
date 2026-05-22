'use client'

import { useMemo, useState } from 'react'

type Moneda = { code: string; label: string; symbol: string; toUSD: number }

const MONEDAS: Moneda[] = [
  { code: 'USD', label: 'Dólares (USD)', symbol: 'US$', toUSD: 1 },
  { code: 'COP', label: 'Pesos colombianos (COP)', symbol: '$', toUSD: 1 / 4100 },
  { code: 'MXN', label: 'Pesos mexicanos (MXN)', symbol: '$', toUSD: 1 / 18 },
  { code: 'ARS', label: 'Pesos argentinos (ARS)', symbol: '$', toUSD: 1 / 1100 },
  { code: 'PEN', label: 'Soles peruanos (PEN)', symbol: 'S/', toUSD: 1 / 3.7 },
  { code: 'UYU', label: 'Pesos uruguayos (UYU)', symbol: '$U', toUSD: 1 / 40 },
  { code: 'CLP', label: 'Pesos chilenos (CLP)', symbol: '$', toUSD: 1 / 1000 },
]

// Tarifa fija Nebbuler equivalente a ~$30 USD/mes
const NEBBULER_FIJO_USD = 30

export function CalculadoraClient() {
  const [subs, setSubs] = useState(100)
  const [precio, setPrecio] = useState(10)
  const [monedaCode, setMonedaCode] = useState('USD')

  const moneda = MONEDAS.find((m) => m.code === monedaCode) ?? MONEDAS[0]

  const calc = useMemo(() => {
    const ingresoBruto = subs * precio
    const ingresoBrutoUSD = ingresoBruto * moneda.toUSD

    // Nebbuler: tarifa fija, sin comisión variable
    const nebbulerFijoLocal = NEBBULER_FIJO_USD / moneda.toUSD
    const nebbulerNeto = ingresoBruto - nebbulerFijoLocal

    // Substack: 10% comisión + 2.9% Stripe + $0.30 USD por transacción
    const substackComision = ingresoBruto * 0.1
    const substackStripe = ingresoBruto * 0.029 + (0.3 / moneda.toUSD) * subs
    const substackNeto = ingresoBruto - substackComision - substackStripe

    // Patreon Pro: 8% comisión + ~5% procesamiento total
    const patreonComision = ingresoBruto * 0.08
    const patreonProc = ingresoBruto * 0.05
    const patreonNeto = ingresoBruto - patreonComision - patreonProc

    return {
      ingresoBruto,
      ingresoBrutoUSD,
      nebbulerNeto,
      nebbulerComision: nebbulerFijoLocal,
      substackNeto,
      substackComision: substackComision + substackStripe,
      patreonNeto,
      patreonComision: patreonComision + patreonProc,
    }
  }, [subs, precio, moneda])

  const fmt = (n: number) => `${moneda.symbol}${Math.round(n).toLocaleString('es-CL')}`
  const fmtUSD = (n: number) => `~US$${Math.round(n).toLocaleString('en-US')}`

  return (
    <div className="border border-[#DEDEDE] p-8 bg-white">
      {/* Inputs */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div>
          <label className="block font-sans text-[12px] font-bold text-[#666] uppercase tracking-wider mb-2">
            Suscriptores
          </label>
          <input
            type="number"
            min={1}
            max={100000}
            value={subs}
            onChange={(e) => setSubs(Math.max(1, parseInt(e.target.value) || 0))}
            className="w-full font-serif text-[2rem] font-bold border-b-2 border-[#121212] py-2 focus:outline-none focus:border-[#C41C1C]"
          />
          <input
            type="range"
            min={1}
            max={2000}
            value={subs}
            onChange={(e) => setSubs(parseInt(e.target.value))}
            className="w-full mt-2 accent-[#C41C1C]"
          />
        </div>
        <div>
          <label className="block font-sans text-[12px] font-bold text-[#666] uppercase tracking-wider mb-2">
            Precio mensual ({moneda.code})
          </label>
          <input
            type="number"
            min={100}
            value={precio}
            onChange={(e) => setPrecio(Math.max(100, parseInt(e.target.value) || 0))}
            className="w-full font-serif text-[2rem] font-bold border-b-2 border-[#121212] py-2 focus:outline-none focus:border-[#C41C1C]"
          />
          <input
            type="range"
            min={500}
            max={moneda.code === 'USD' ? 100 : 50000}
            step={moneda.code === 'USD' ? 1 : 500}
            value={precio}
            onChange={(e) => setPrecio(parseInt(e.target.value))}
            className="w-full mt-2 accent-[#C41C1C]"
          />
        </div>
        <div>
          <label className="block font-sans text-[12px] font-bold text-[#666] uppercase tracking-wider mb-2">
            Moneda
          </label>
          <select
            value={monedaCode}
            onChange={(e) => setMonedaCode(e.target.value)}
            className="w-full font-sans text-[15px] border-b-2 border-[#121212] py-3 bg-transparent focus:outline-none focus:border-[#C41C1C]"
          >
            {MONEDAS.map((m) => (
              <option key={m.code} value={m.code}>{m.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Ingreso bruto */}
      <div className="mb-8 p-6 bg-[#F7F7F7]">
        <p className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-[#666] mb-2">
          Ingreso bruto mensual
        </p>
        <p className="font-serif text-[3rem] font-bold text-[#121212] leading-none">
          {fmt(calc.ingresoBruto)}
        </p>
        <p className="font-sans text-[14px] text-[#666] mt-1">
          {fmtUSD(calc.ingresoBrutoUSD)} / mes · {fmtUSD(calc.ingresoBrutoUSD * 12)} / año
        </p>
      </div>

      {/* Comparativa neto */}
      <h3 className="font-serif text-[1.3rem] font-bold mb-4">¿Cuánto te queda en cada plataforma?</h3>
      <div className="space-y-3">
        <PlatformRow
          name="Nebbuler"
          highlight
          neto={calc.nebbulerNeto}
          comision={calc.nebbulerComision}
          monedaSymbol={moneda.symbol}
          detail="Tarifa fija ~US$30/mes · 0% comisión variable"
        />
        <PlatformRow
          name="Substack"
          neto={calc.substackNeto}
          comision={calc.substackComision}
          monedaSymbol={moneda.symbol}
          detail="10% Substack + 2.9% + US$0.30/tx Stripe · solo USD"
        />
        <PlatformRow
          name="Patreon Pro"
          neto={calc.patreonNeto}
          comision={calc.patreonComision}
          monedaSymbol={moneda.symbol}
          detail="8% Patreon + ~5% procesamiento · solo USD"
        />
      </div>

      {/* Diferencia */}
      {calc.nebbulerNeto > calc.substackNeto && (
        <div className="mt-6 p-5 bg-[#FFFBE6] border-l-4 border-[#15803d]">
          <p className="font-sans text-[14px] text-[#222]">
            <strong>Con Nebbuler te quedan {fmt(calc.nebbulerNeto - calc.substackNeto)} más</strong>{' '}
            por mes que con Substack — son <strong>{fmt((calc.nebbulerNeto - calc.substackNeto) * 12)}</strong> al año.
          </p>
        </div>
      )}
    </div>
  )
}

function PlatformRow({
  name,
  neto,
  comision,
  monedaSymbol,
  detail,
  highlight,
}: {
  name: string
  neto: number
  comision: number
  monedaSymbol: string
  detail: string
  highlight?: boolean
}) {
  const fmt = (n: number) => `${monedaSymbol}${Math.round(n).toLocaleString('es-CL')}`
  return (
    <div
      className={`flex items-center justify-between p-4 border ${
        highlight ? 'bg-[#FFFBE6] border-[#C41C1C]' : 'border-[#DEDEDE]'
      }`}
    >
      <div className="flex-1">
        <p className="font-serif text-[1.1rem] font-bold">{name}</p>
        <p className="text-[12px] text-[#666] mt-0.5">{detail}</p>
      </div>
      <div className="text-right">
        <p className={`font-serif text-[1.6rem] font-bold ${highlight ? 'text-[#15803d]' : 'text-[#121212]'}`}>
          {fmt(neto)}
        </p>
        <p className="text-[11px] text-[#999]">Comisión: {fmt(comision)}</p>
      </div>
    </div>
  )
}
