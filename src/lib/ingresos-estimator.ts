/**
 * Estimador de ingresos para /cuanto-podrias-ganar.
 *
 * Combina conversion rate típico por profesión y país con el pricing local
 * de Nebbuler para calcular ingresos mensuales estimados.
 *
 * No es una promesa: es un estimate basado en benchmarks públicos de
 * Substack/Patreon LATAM 2025-2026 y conversion rates de creators en
 * audiencias de LinkedIn/IG/Twitter.
 */

import { PRICE_BY_COUNTRY, type CountryCode, type LocalPrice } from './pricing'

export interface ProfessionConfig {
  slug: string
  nombre: string
  area: string
  /** Conversion rate base (0.5% – 3%). Profesiones B2B convierten mejor. */
  conversionBase: number
  /** Multiplicador 0.7 – 1.5 según pricing power (un abogado paga más que un coach). */
  pricingPower: number
}

/**
 * 30 profesiones con conversion baseline + pricing power.
 * conversionBase: % típico que paga por una membresía de un creador con audiencia
 *                 razonable que comparte contenido de calidad.
 * pricingPower:   ajuste sobre el precio sugerido país-base (ej: abogados pueden
 *                 cobrar más que un coach, así que un % del audience paga más).
 */
export const PROFESSIONS_CONFIG: ProfessionConfig[] = [
  { slug: 'economista',           nombre: 'Economista',                 area: 'Economía',          conversionBase: 0.018, pricingPower: 1.30 },
  { slug: 'abogado',              nombre: 'Abogado',                    area: 'Derecho',           conversionBase: 0.020, pricingPower: 1.50 },
  { slug: 'contador',             nombre: 'Contador',                   area: 'Finanzas',          conversionBase: 0.022, pricingPower: 1.25 },
  { slug: 'asesor-financiero',    nombre: 'Asesor financiero',          area: 'Finanzas',          conversionBase: 0.025, pricingPower: 1.50 },
  { slug: 'medico',               nombre: 'Médico',                     area: 'Salud',             conversionBase: 0.012, pricingPower: 1.20 },
  { slug: 'psicologo',            nombre: 'Psicólogo',                  area: 'Salud Mental',      conversionBase: 0.020, pricingPower: 1.10 },
  { slug: 'nutricionista',        nombre: 'Nutricionista',              area: 'Salud',             conversionBase: 0.018, pricingPower: 0.95 },
  { slug: 'kinesiologo',          nombre: 'Kinesiólogo',                area: 'Salud',             conversionBase: 0.014, pricingPower: 0.90 },
  { slug: 'dentista',             nombre: 'Dentista',                   area: 'Salud Dental',      conversionBase: 0.010, pricingPower: 1.15 },
  { slug: 'arquitecto',           nombre: 'Arquitecto',                 area: 'Arquitectura',      conversionBase: 0.012, pricingPower: 1.15 },
  { slug: 'ingeniero-civil',      nombre: 'Ingeniero civil',            area: 'Ingeniería',        conversionBase: 0.010, pricingPower: 1.20 },
  { slug: 'ingeniero-informatico',nombre: 'Ingeniero informático',      area: 'Tecnología',        conversionBase: 0.022, pricingPower: 1.30 },
  { slug: 'desarrollador',        nombre: 'Desarrollador de software',  area: 'Tecnología',        conversionBase: 0.025, pricingPower: 1.25 },
  { slug: 'disenador-ux',         nombre: 'Diseñador UX',               area: 'Diseño',            conversionBase: 0.020, pricingPower: 1.10 },
  { slug: 'consultor',            nombre: 'Consultor',                  area: 'Consultoría',       conversionBase: 0.018, pricingPower: 1.35 },
  { slug: 'coach-ejecutivo',      nombre: 'Coach ejecutivo',            area: 'Liderazgo',         conversionBase: 0.022, pricingPower: 1.40 },
  { slug: 'coach',                nombre: 'Coach de vida',              area: 'Desarrollo Personal',conversionBase: 0.015, pricingPower: 0.85 },
  { slug: 'consultor-seo',        nombre: 'Consultor SEO',              area: 'Marketing Digital', conversionBase: 0.025, pricingPower: 1.20 },
  { slug: 'marketer-digital',     nombre: 'Marketer digital',           area: 'Marketing Digital', conversionBase: 0.022, pricingPower: 1.15 },
  { slug: 'copywriter',           nombre: 'Copywriter',                 area: 'Marketing',         conversionBase: 0.018, pricingPower: 1.00 },
  { slug: 'periodista',           nombre: 'Periodista',                 area: 'Medios',            conversionBase: 0.020, pricingPower: 0.85 },
  { slug: 'fotografo',            nombre: 'Fotógrafo',                  area: 'Creativo',          conversionBase: 0.014, pricingPower: 0.95 },
  { slug: 'chef',                 nombre: 'Chef',                       area: 'Gastronomía',       conversionBase: 0.018, pricingPower: 1.05 },
  { slug: 'profesor',             nombre: 'Profesor universitario',     area: 'Educación',         conversionBase: 0.016, pricingPower: 1.00 },
  { slug: 'traductor',            nombre: 'Traductor',                  area: 'Idiomas',           conversionBase: 0.012, pricingPower: 0.90 },
  { slug: 'agente-inmobiliario',  nombre: 'Agente inmobiliario',        area: 'Bienes Raíces',     conversionBase: 0.014, pricingPower: 1.20 },
  { slug: 'fonoaudiologo',        nombre: 'Fonoaudiólogo',              area: 'Salud',             conversionBase: 0.012, pricingPower: 0.90 },
  { slug: 'veterinario',          nombre: 'Veterinario',                area: 'Salud Animal',      conversionBase: 0.014, pricingPower: 1.00 },
  { slug: 'farmaceutico',         nombre: 'Farmacéutico',               area: 'Salud',             conversionBase: 0.010, pricingPower: 1.00 },
  { slug: 'community-manager',    nombre: 'Community manager',          area: 'Marketing Digital', conversionBase: 0.020, pricingPower: 0.90 },
]

export interface CountryConfig {
  code: CountryCode
  nombre: string
  flag: string
  /** Multiplicador 0.7 – 1.2 sobre conversion rate (mercados maduros pagan más). */
  conversionMultiplier: number
}

export const COUNTRIES_CONFIG: CountryConfig[] = [
  { code: 'CL', nombre: 'Chile',              flag: 'CL', conversionMultiplier: 1.15 },
  { code: 'AR', nombre: 'Argentina',          flag: 'AR', conversionMultiplier: 0.90 },
  { code: 'MX', nombre: 'México',             flag: 'MX', conversionMultiplier: 1.10 },
  { code: 'CO', nombre: 'Colombia',           flag: 'CO', conversionMultiplier: 1.00 },
  { code: 'PE', nombre: 'Perú',               flag: 'PE', conversionMultiplier: 0.95 },
  { code: 'UY', nombre: 'Uruguay',            flag: 'UY', conversionMultiplier: 1.20 },
  { code: 'BR', nombre: 'Brasil',             flag: 'BR', conversionMultiplier: 0.95 },
  { code: 'EC', nombre: 'Ecuador',            flag: 'EC', conversionMultiplier: 0.95 },
  { code: 'BO', nombre: 'Bolivia',            flag: 'BO', conversionMultiplier: 0.85 },
  { code: 'PY', nombre: 'Paraguay',           flag: 'PY', conversionMultiplier: 0.85 },
  { code: 'CR', nombre: 'Costa Rica',         flag: 'CR', conversionMultiplier: 1.10 },
  { code: 'PA', nombre: 'Panamá',             flag: 'PA', conversionMultiplier: 1.10 },
  { code: 'DO', nombre: 'Rep. Dominicana',    flag: 'DO', conversionMultiplier: 0.95 },
  { code: 'GT', nombre: 'Guatemala',          flag: 'GT', conversionMultiplier: 0.90 },
  { code: 'VE', nombre: 'Venezuela',          flag: 'VE', conversionMultiplier: 0.75 },
  { code: 'ES', nombre: 'España',             flag: 'ES', conversionMultiplier: 1.20 },
  { code: 'US', nombre: 'Estados Unidos',     flag: 'US', conversionMultiplier: 1.20 },
]

export interface IngresosInput {
  profesionSlug: string
  paisCode: string
  followers: number
  horasSemana: number
}

export interface IngresosResult {
  /** Suscriptores estimados / mes asumiendo conversion sostenido. */
  suscriptoresEstimados: number
  /** Precio sugerido por suscriptor en moneda local. */
  precioSugerido: LocalPrice
  /** Ingreso bruto mensual en moneda local. */
  ingresoMensual: number
  /** Ingreso bruto anual en moneda local. */
  ingresoAnual: number
  /** Nebbuler: cobra USD 19/mes flat. */
  nebbuler: PlataformaResult
  /** Substack: cobra 10% comisión. */
  substack: PlataformaResult
  /** Patreon: cobra ~8% comisión + processing. */
  patreon: PlataformaResult
  /** Diferencia anual neta Nebbuler vs Substack. */
  diferenciaAnualSubstack: number
  /** Diferencia anual neta Nebbuler vs Patreon. */
  diferenciaAnualPatreon: number
}

export interface PlataformaResult {
  nombre: string
  comision: string
  ingresoMensualNeto: number
  ingresoAnualNeto: number
}

const PRECIO_NEBBULER_USD = 19
const PRECIO_NEBBULER_LOCAL: Record<CountryCode, number> = Object.fromEntries(
  Object.entries(PRICE_BY_COUNTRY).map(([k, v]) => [k, v.amount])
) as Record<CountryCode, number>

/**
 * El fee de Nebbuler se cobra en USD pero el creator recibe en moneda local.
 * Aproximamos el fee de USD 19 a la moneda local usando el ratio
 * "precio_local / 19" que es lo que ya está en pricing.ts.
 */
function nebbulerFeeLocal(code: CountryCode): number {
  return PRECIO_NEBBULER_LOCAL[code] ?? PRECIO_NEBBULER_USD
}

export function estimarIngresos(input: IngresosInput): IngresosResult {
  const profesion =
    PROFESSIONS_CONFIG.find(p => p.slug === input.profesionSlug) ??
    PROFESSIONS_CONFIG[0]
  const paisCfg =
    COUNTRIES_CONFIG.find(c => c.code === input.paisCode) ??
    COUNTRIES_CONFIG[0]
  const precioBase = PRICE_BY_COUNTRY[paisCfg.code]

  // Conversion realista capada: incluso con audience muy grande
  // rara vez >3% paga por una membresía recurrente.
  const conversionRaw =
    profesion.conversionBase * paisCfg.conversionMultiplier
  const conversion = Math.min(conversionRaw, 0.030)

  // Bonus suave por horas/semana de dedicación: 5h baseline,
  // 10h+ aumenta 15% el conversion (más contenido = más retención).
  const horasFactor = Math.min(1 + (input.horasSemana - 5) * 0.03, 1.30)
  const conversionFinal = conversion * Math.max(horasFactor, 0.7)

  // Precio sugerido al suscriptor: precio base país × pricingPower de la profesión,
  // redondeado al múltiplo más cercano "amigable".
  const precioSugeridoAmount = roundFriendly(
    precioBase.amount * profesion.pricingPower,
    precioBase.currency
  )
  const precioSugerido: LocalPrice = {
    ...precioBase,
    amount: precioSugeridoAmount,
  }

  const suscriptoresEstimados = Math.round(input.followers * conversionFinal)
  const ingresoMensual = suscriptoresEstimados * precioSugerido.amount
  const ingresoAnual = ingresoMensual * 12

  // Nebbuler: precio fijo en moneda local (equivalente a USD 19)
  const feeNebbuler = nebbulerFeeLocal(paisCfg.code)
  const nebbulerNetoMensual = Math.max(ingresoMensual - feeNebbuler, 0)
  const nebbuler: PlataformaResult = {
    nombre: 'Nebbuler',
    comision: 'Tarifa fija mensual',
    ingresoMensualNeto: nebbulerNetoMensual,
    ingresoAnualNeto: nebbulerNetoMensual * 12,
  }

  // Substack: 10% del bruto
  const substackNetoMensual = ingresoMensual * 0.90
  const substack: PlataformaResult = {
    nombre: 'Substack',
    comision: '10% de comisión',
    ingresoMensualNeto: substackNetoMensual,
    ingresoAnualNeto: substackNetoMensual * 12,
  }

  // Patreon: 8% del bruto (tier Pro)
  const patreonNetoMensual = ingresoMensual * 0.92
  const patreon: PlataformaResult = {
    nombre: 'Patreon',
    comision: '8% de comisión',
    ingresoMensualNeto: patreonNetoMensual,
    ingresoAnualNeto: patreonNetoMensual * 12,
  }

  return {
    suscriptoresEstimados,
    precioSugerido,
    ingresoMensual,
    ingresoAnual,
    nebbuler,
    substack,
    patreon,
    diferenciaAnualSubstack: nebbuler.ingresoAnualNeto - substack.ingresoAnualNeto,
    diferenciaAnualPatreon: nebbuler.ingresoAnualNeto - patreon.ingresoAnualNeto,
  }
}

/**
 * Redondea a un múltiplo "psicológico" según la moneda.
 * CLP/COP/PYG: redondea a 990 más cercano.
 * MXN/PEN/BRL: redondea a 9.
 * USD/EUR: redondea a 1.
 */
function roundFriendly(amount: number, currency: string): number {
  if (currency === 'CLP') return Math.max(Math.round(amount / 1000) * 1000 - 10, 1990)
  if (currency === 'COP') return Math.max(Math.round(amount / 1000) * 1000, 19000)
  if (currency === 'PYG') return Math.max(Math.round(amount / 10000) * 10000, 49000)
  if (currency === 'ARS') return Math.max(Math.round(amount / 1000) * 1000, 4990)
  if (currency === 'MXN') return Math.max(Math.round(amount / 10) * 10 - 1, 99)
  if (currency === 'PEN') return Math.max(Math.round(amount), 19)
  if (currency === 'BRL') return Math.max(Math.round(amount), 19)
  if (currency === 'UYU') return Math.max(Math.round(amount / 10) * 10, 199)
  if (currency === 'BOB') return Math.max(Math.round(amount), 49)
  if (currency === 'CRC') return Math.max(Math.round(amount / 100) * 100, 2990)
  if (currency === 'DOP') return Math.max(Math.round(amount / 10) * 10, 290)
  if (currency === 'GTQ') return Math.max(Math.round(amount), 49)
  return Math.max(Math.round(amount), 5)
}

export function formatLocal(amount: number, locale: string, symbol: string): string {
  try {
    const fmt = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 })
    return `${symbol}${fmt.format(Math.round(amount))}`
  } catch {
    return `${symbol}${Math.round(amount)}`
  }
}
