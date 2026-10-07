export const CURRENCIES = ['CLP', 'USD', 'MXN', 'COP', 'ARS', 'PEN'] as const
export type Currency = (typeof CURRENCIES)[number]

export interface RunwayInput {
  cash: number
  revenue: number
  expenses: number
  growth: number // % mensual de crecimiento de ingresos
  currency: Currency
}

export interface RunwayResult {
  netBurn: number
  months: number | null // null = la caja no se agota en el horizonte
  horizon: number
  zeroDate: Date | null
}

export const RUNWAY_HORIZON = 60

export const RUNWAY_DEFAULTS: RunwayInput = {
  cash: 0,
  revenue: 0,
  expenses: 0,
  growth: 0,
  currency: 'CLP',
}

export function computeRunway(input: RunwayInput, from: Date = new Date()): RunwayResult {
  const { cash, revenue, expenses, growth } = input
  const g = 1 + growth / 100
  let balance = cash
  let income = revenue
  let months: number | null = null

  for (let m = 1; m <= RUNWAY_HORIZON; m++) {
    balance += income - expenses
    income *= g
    if (balance < 0) {
      months = m - 1
      break
    }
  }

  const zeroDate =
    months === null
      ? null
      : new Date(from.getFullYear(), from.getMonth() + months, from.getDate())

  return { netBurn: expenses - revenue, months, horizon: RUNWAY_HORIZON, zeroDate }
}

export function parseRunwayParams(sp: Record<string, string | string[] | undefined>): RunwayInput {
  const num = (k: string, max: number) => {
    const raw = Array.isArray(sp[k]) ? sp[k]![0] : sp[k]
    const n = Number(raw)
    return Number.isFinite(n) && n >= 0 ? Math.min(n, max) : 0
  }
  const cur = Array.isArray(sp.m) ? sp.m[0] : sp.m
  return {
    cash: num('c', 1e12),
    revenue: num('i', 1e12),
    expenses: num('g', 1e12),
    growth: num('cr', 100),
    currency: (CURRENCIES as readonly string[]).includes(cur ?? '') ? (cur as Currency) : 'CLP',
  }
}

export function formatMoney(n: number, currency: Currency): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(n)
}

export function runwayHeadline(r: RunwayResult): string {
  if (r.months === null) return `+${r.horizon} meses`
  return r.months === 1 ? '1 mes' : `${r.months} meses`
}
