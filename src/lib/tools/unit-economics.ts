export interface UnitEconInput {
  arpu: number // ingreso mensual por cliente
  margin: number // margen bruto %
  churn: number // churn mensual %
  cac: number // costo de adquirir un cliente
}

export interface UnitEconResult {
  monthlyProfit: number // margen mensual por cliente
  lifetimeMonths: number | null // 1 / churn
  ltv: number | null
  ratio: number | null // LTV / CAC
  paybackMonths: number | null // CAC / margen mensual
  verdict: 'sin-datos' | 'riesgoso' | 'ajustado' | 'sano' | 'sobre-optimizado'
}

export const UNIT_ECON_DEFAULTS: UnitEconInput = { arpu: 0, margin: 80, churn: 5, cac: 0 }

export function computeUnitEconomics(i: UnitEconInput): UnitEconResult {
  const monthlyProfit = i.arpu * (i.margin / 100)
  const lifetimeMonths = i.churn > 0 ? 1 / (i.churn / 100) : null
  const ltv = lifetimeMonths !== null ? monthlyProfit * lifetimeMonths : null
  const ratio = ltv !== null && i.cac > 0 ? ltv / i.cac : null
  const paybackMonths = monthlyProfit > 0 && i.cac > 0 ? i.cac / monthlyProfit : null

  let verdict: UnitEconResult['verdict'] = 'sin-datos'
  if (ratio !== null) {
    // Reglas prácticas de uso común, no son leyes: 3:1 como referencia.
    if (ratio < 1) verdict = 'riesgoso'
    else if (ratio < 3) verdict = 'ajustado'
    else if (ratio <= 5) verdict = 'sano'
    else verdict = 'sobre-optimizado'
  }
  return { monthlyProfit, lifetimeMonths, ltv, ratio, paybackMonths, verdict }
}

export function parseUnitEconParams(sp: Record<string, string | string[] | undefined>): UnitEconInput {
  const num = (k: string, max: number, fallback: number) => {
    const raw = Array.isArray(sp[k]) ? sp[k]![0] : sp[k]
    if (raw === undefined) return fallback
    const n = Number(raw)
    return Number.isFinite(n) && n >= 0 ? Math.min(n, max) : fallback
  }
  return {
    arpu: num('a', 1e9, 0),
    margin: num('mg', 100, UNIT_ECON_DEFAULTS.margin),
    churn: num('ch', 100, UNIT_ECON_DEFAULTS.churn),
    cac: num('cac', 1e9, 0),
  }
}

export const VERDICT_TEXT: Record<UnitEconResult['verdict'], { title: string; body: string }> = {
  'sin-datos': {
    title: 'Completa los datos',
    body: 'Ingresa ingreso por cliente, margen, churn y CAC para ver el resultado.',
  },
  riesgoso: {
    title: 'Pierdes plata por cliente',
    body: 'Cada cliente te genera menos de lo que cuesta conseguirlo. Antes de gastar más en adquisición, baja el CAC, sube el precio o reduce el churn.',
  },
  ajustado: {
    title: 'Funciona, pero con poco margen',
    body: 'Recuperas la inversión, pero con poco colchón. Como referencia común, muchos equipos apuntan a una relación LTV:CAC de 3 o más.',
  },
  sano: {
    title: 'Relación saludable',
    body: 'Cada cliente deja bastante más de lo que cuesta adquirirlo. Es una buena base para invertir en crecer, siempre que el payback sea razonable para tu caja.',
  },
  'sobre-optimizado': {
    title: 'Quizás estás invirtiendo poco en crecer',
    body: 'Una relación muy alta puede indicar que podrías gastar más en adquisición y crecer más rápido sin romper la economía por cliente.',
  },
}
