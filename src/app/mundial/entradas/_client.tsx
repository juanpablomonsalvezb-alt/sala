'use client'

import { useState, useMemo } from 'react'
import partidosData from '@/data/mundial-partidos.json'

/* ── Pricing data (USD, base price without FIFA 15% fee) ── */
const PRICING: Record<string, { cat1: [number, number]; cat2: [number, number]; cat3: [number, number]; cat4: [number, number] }> = {
  grupos: {
    cat1: [345, 620],
    cat2: [260, 465],
    cat3: [120, 215],
    cat4: [60, 105],
  },
  dieciseisavos: {
    cat1: [440, 480],
    cat2: [335, 360],
    cat3: [160, 175],
    cat4: [125, 135],
  },
  octavos: {
    cat1: [590, 890],
    cat2: [450, 675],
    cat3: [220, 330],
    cat4: [170, 260],
  },
  cuartos: {
    cat1: [1125, 1690],
    cat2: [765, 1150],
    cat3: [485, 725],
    cat4: [275, 410],
  },
  semifinales: {
    cat1: [2565, 2780],
    cat2: [1775, 1920],
    cat3: [660, 720],
    cat4: [420, 455],
  },
  'tercer-lugar': {
    cat1: [1000, 1000],
    cat2: [715, 715],
    cat3: [360, 360],
    cat4: [165, 165],
  },
  final: {
    cat1: [6370, 6370],
    cat2: [4210, 4210],
    cat3: [2790, 2790],
    cat4: [2030, 2030],
  },
}

const FASE_LABELS: Record<string, string> = {
  grupos: 'Fase de Grupos',
  dieciseisavos: 'Dieciseisavos de Final',
  octavos: 'Octavos de Final',
  cuartos: 'Cuartos de Final',
  semifinales: 'Semifinales',
  'tercer-lugar': 'Tercer Lugar',
  final: 'Final',
}

const CAT_LABELS = ['Categoría 1 (Premium)', 'Categoría 2 (Alta)', 'Categoría 3 (Media)', 'Categoría 4 (Básica)']
const CAT_KEYS: ('cat1' | 'cat2' | 'cat3' | 'cat4')[] = ['cat1', 'cat2', 'cat3', 'cat4']

const HOST_TEAMS = ['Mexico', 'Estados Unidos', 'Canada']

/* Currency conversions (approximate May 2026) */
const CURRENCIES: { code: string; label: string; rate: number; symbol: string }[] = [
  { code: 'USD', label: 'Dólar (USD)', rate: 1, symbol: 'US$' },
  { code: 'MXN', label: 'Peso Mexicano', rate: 17.2, symbol: 'MX$' },
  { code: 'CLP', label: 'Peso Chileno', rate: 920, symbol: 'CLP$' },
  { code: 'COP', label: 'Peso Colombiano', rate: 4150, symbol: 'COP$' },
  { code: 'ARS', label: 'Peso Argentino', rate: 1180, symbol: 'AR$' },
  { code: 'BRL', label: 'Real Brasileño', rate: 5.1, symbol: 'R$' },
  { code: 'PEN', label: 'Sol Peruano', rate: 3.75, symbol: 'S/' },
  { code: 'EUR', label: 'Euro', rate: 0.92, symbol: '€' },
]

type Partido = {
  id: number
  slug: string
  equipo1: string
  equipo2: string
  grupo: string
  jornada: number
  fase: string
  fecha: string
  hora_ref: string
}

const partidos = partidosData as Partido[]

function fmt(n: number, symbol: string): string {
  if (n >= 1_000_000) return `${symbol}${(n / 1_000_000).toFixed(1)}M`
  if (n >= 10_000) return `${symbol}${Math.round(n).toLocaleString('es-CL')}`
  return `${symbol}${Math.round(n).toLocaleString('es-CL')}`
}

export function EntradasClient() {
  const [fase, setFase] = useState('grupos')
  const [matchId, setMatchId] = useState<number | null>(null)
  const [category, setCategory] = useState<'cat1' | 'cat2' | 'cat3' | 'cat4'>('cat3')
  const [quantity, setQuantity] = useState(2)
  const [currency, setCurrency] = useState('USD')
  const [showFee, setShowFee] = useState(true)

  const fases = useMemo(() => [...new Set(partidos.map((p) => p.fase))], [])
  const matchesInFase = useMemo(() => partidos.filter((p) => p.fase === fase), [fase])

  const selectedMatch = matchId ? partidos.find((p) => p.id === matchId) : null
  const isHostMatch = selectedMatch
    ? HOST_TEAMS.includes(selectedMatch.equipo1) || HOST_TEAMS.includes(selectedMatch.equipo2)
    : false

  const pricing = PRICING[fase]
  const curr = CURRENCIES.find((c) => c.code === currency) ?? CURRENCIES[0]

  const [minBase, maxBase] = pricing[category]
  // Host nation matches tend toward the high end
  const estimatedBase = isHostMatch ? maxBase : Math.round((minBase + maxBase) / 2)
  const feeMultiplier = showFee ? 1.15 : 1
  const unitPrice = Math.round(estimatedBase * feeMultiplier)
  const totalUSD = unitPrice * quantity
  const totalLocal = Math.round(totalUSD * curr.rate)

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="border-b border-white/10 px-4 py-16 text-center">
        <p className="mb-3 text-sm font-medium uppercase tracking-widest text-amber-400">
          Mundial 2026 — USA · México · Canadá
        </p>
        <h1 className="mx-auto max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
          Cotizador de Entradas
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-neutral-400">
          Calcula cuánto cuestan los boletos al Mundial 2026. Precios oficiales FIFA por fase, categoría y partido.
        </p>
      </section>

      {/* Calculator */}
      <section className="mx-auto max-w-4xl px-4 py-12">
        <div className="rounded-2xl border border-white/10 bg-neutral-950 p-6 sm:p-8">
          {/* Step 1: Fase */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-semibold text-neutral-400">1. Fase del torneo</label>
            <div className="flex flex-wrap gap-2">
              {fases.map((f) => (
                <button
                  key={f}
                  onClick={() => { setFase(f); setMatchId(null) }}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                    fase === f
                      ? 'bg-amber-500 text-black'
                      : 'bg-white/5 text-neutral-300 hover:bg-white/10'
                  }`}
                >
                  {FASE_LABELS[f] ?? f}
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Match (optional) */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-semibold text-neutral-400">
              2. Partido <span className="text-neutral-600">(opcional — afina el precio)</span>
            </label>
            <select
              value={matchId ?? ''}
              onChange={(e) => setMatchId(e.target.value ? Number(e.target.value) : null)}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-amber-500 focus:outline-none"
            >
              <option value="">Cualquier partido de {FASE_LABELS[fase]}</option>
              {matchesInFase.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.equipo1} vs {m.equipo2} — {new Date(m.fecha + 'T12:00:00').toLocaleDateString('es-CL', { day: 'numeric', month: 'short' })}
                </option>
              ))}
            </select>
            {isHostMatch && (
              <p className="mt-2 text-xs text-amber-400">
                ⚡ Partido con selección anfitriona — precios en rango alto
              </p>
            )}
          </div>

          {/* Step 3: Category */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-semibold text-neutral-400">3. Categoría de asiento</label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {CAT_KEYS.map((ck, i) => (
                <button
                  key={ck}
                  onClick={() => setCategory(ck)}
                  className={`rounded-lg px-3 py-3 text-center text-sm font-medium transition ${
                    category === ck
                      ? 'bg-amber-500 text-black'
                      : 'bg-white/5 text-neutral-300 hover:bg-white/10'
                  }`}
                >
                  <span className="block text-xs opacity-70">Cat {i + 1}</span>
                  {CAT_LABELS[i].split('(')[1]?.replace(')', '') ?? ''}
                </button>
              ))}
            </div>
          </div>

          {/* Step 4: Quantity + Currency */}
          <div className="mb-8 grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-neutral-400">4. Cantidad</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-xl hover:bg-white/10"
                >
                  −
                </button>
                <span className="min-w-[2ch] text-center text-2xl font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(10, quantity + 1))}
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-xl hover:bg-white/10"
                >
                  +
                </button>
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-neutral-400">Moneda</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-amber-500 focus:outline-none"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Fee toggle */}
          <div className="mb-8 flex items-center gap-3">
            <button
              onClick={() => setShowFee(!showFee)}
              className={`relative h-6 w-11 rounded-full transition ${showFee ? 'bg-amber-500' : 'bg-white/20'}`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${showFee ? 'left-[22px]' : 'left-0.5'}`}
              />
            </button>
            <span className="text-sm text-neutral-400">
              Incluir tasa FIFA (+15%)
            </span>
          </div>

          {/* Result */}
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-6 text-center">
            <p className="mb-1 text-sm text-neutral-400">
              {quantity} entrada{quantity > 1 ? 's' : ''} · {CAT_LABELS[CAT_KEYS.indexOf(category)]} · {FASE_LABELS[fase]}
              {selectedMatch ? ` · ${selectedMatch.equipo1} vs ${selectedMatch.equipo2}` : ''}
            </p>
            <p className="text-5xl font-black text-amber-400 sm:text-6xl">
              US${totalUSD.toLocaleString('es-CL')}
            </p>
            {currency !== 'USD' && (
              <p className="mt-2 text-2xl font-bold text-neutral-300">
                ≈ {fmt(totalLocal, curr.symbol)}
              </p>
            )}
            <p className="mt-3 text-xs text-neutral-500">
              {showFee ? 'Incluye tasa de servicio FIFA del 15%' : 'Precio base sin tasa de servicio FIFA (15%)'}
              {' · '}Precio por entrada: US${unitPrice.toLocaleString('es-CL')}
            </p>
          </div>

          {/* Price range context */}
          <div className="mt-6 rounded-xl border border-white/5 bg-white/[0.02] p-5">
            <h3 className="mb-3 text-sm font-semibold text-neutral-400">
              Rango de precios para {FASE_LABELS[fase]} — {CAT_LABELS[CAT_KEYS.indexOf(category)]}
            </h3>
            <div className="relative h-4 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-amber-600 to-amber-400"
                style={{
                  left: `${((minBase - minBase) / (maxBase - minBase || 1)) * 100}%`,
                  width: `${maxBase === minBase ? 100 : 100}%`,
                }}
              />
              <div
                className="absolute top-0 h-full w-1 bg-white"
                style={{
                  left: `${maxBase === minBase ? 50 : ((estimatedBase - minBase) / (maxBase - minBase)) * 100}%`,
                }}
                title="Estimado"
              />
            </div>
            <div className="mt-2 flex justify-between text-xs text-neutral-500">
              <span>US${minBase.toLocaleString('es-CL')}</span>
              <span className="text-amber-400">~US${estimatedBase.toLocaleString('es-CL')}</span>
              <span>US${maxBase.toLocaleString('es-CL')}</span>
            </div>
          </div>
        </div>

        {/* Full price table */}
        <div className="mt-12">
          <h2 className="mb-6 text-2xl font-bold">Tabla completa de precios — Mundial 2026</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left text-neutral-400">
                  <th className="px-4 py-3 font-semibold">Fase</th>
                  <th className="px-4 py-3 text-right font-semibold">Cat 1</th>
                  <th className="px-4 py-3 text-right font-semibold">Cat 2</th>
                  <th className="px-4 py-3 text-right font-semibold">Cat 3</th>
                  <th className="px-4 py-3 text-right font-semibold">Cat 4</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(PRICING).map(([f, p]) => (
                  <tr
                    key={f}
                    className={`border-b border-white/5 transition hover:bg-white/5 ${f === fase ? 'bg-amber-500/10' : ''}`}
                  >
                    <td className="px-4 py-3 font-medium">{FASE_LABELS[f]}</td>
                    {CAT_KEYS.map((ck) => {
                      const [lo, hi] = p[ck]
                      return (
                        <td key={ck} className="whitespace-nowrap px-4 py-3 text-right text-neutral-300">
                          {lo === hi
                            ? `US$${lo.toLocaleString('es-CL')}`
                            : `US$${lo.toLocaleString('es-CL')} – ${hi.toLocaleString('es-CL')}`}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-neutral-500">
            Precios base en USD. FIFA aplica una tasa de servicio del 15% adicional.
            Precios varían según demanda, sede y equipos participantes.
            Fuente: FIFA.com, mayo 2026.
          </p>
        </div>

        {/* Tips section */}
        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
            <div className="mb-3 text-2xl">💡</div>
            <h3 className="mb-1 font-bold">Tip: Categoría 4</h3>
            <p className="text-sm text-neutral-400">
              Las entradas Cat 4 (Supporter Entry) son las más baratas pero solo se consiguen a través de federaciones nacionales. Para público general, Cat 3 es la opción más económica.
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
            <div className="mb-3 text-2xl">📈</div>
            <h3 className="mb-1 font-bold">Precios dinámicos</h3>
            <p className="text-sm text-neutral-400">
              FIFA usa precios dinámicos. Partidos de selecciones anfitrionas (USA, México, Canadá) y favoritas cuestan hasta 2x más que partidos neutrales.
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
            <div className="mb-3 text-2xl">🎫</div>
            <h3 className="mb-1 font-bold">Reventa oficial</h3>
            <p className="text-sm text-neutral-400">
              FIFA tiene una plataforma oficial de reventa. Los precios en mercado secundario pueden ser 2-5x el precio original según el partido.
            </p>
          </div>
        </div>

        {/* sr-only for featured snippets */}
        <p className="sr-only">
          Las entradas al Mundial 2026 cuestan entre US$60 (Categoría 4, Fase de Grupos) y US$6,370 (Categoría 1, Final).
          Una entrada de Fase de Grupos Categoría 3 cuesta entre US$120 y US$215.
          La final del Mundial 2026 cuesta US$2,030 (Cat 4), US$2,790 (Cat 3), US$4,210 (Cat 2) o US$6,370 (Cat 1).
          FIFA cobra una tasa de servicio del 15% adicional sobre todos los precios.
        </p>

        {/* CTA */}
        <div className="mt-16 rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-transparent p-8 text-center">
          <h3 className="text-xl font-bold">¿Vas al Mundial 2026?</h3>
          <p className="mx-auto mt-2 max-w-md text-neutral-400">
            Si eres creador de contenido, monetiza tu experiencia mundialista con Nebbuler. US$19/mes, 0% comisión.
          </p>
          <a
            href="/cuanto-te-quitan"
            className="mt-4 inline-block rounded-lg bg-amber-500 px-6 py-3 font-semibold text-black transition hover:bg-amber-400"
          >
            Calcula cuánto te quita tu plataforma
          </a>
        </div>
      </section>
    </main>
  )
}
