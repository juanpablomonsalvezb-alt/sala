// Fuente única de verdad del precio de plataforma Nebbuler.
//
// Decisión 2026-05-21: tarifa de plataforma baja de $29.990 CLP a USD 19/mes
// para alinear con el precio "psicológico" estándar de SaaS LATAM. Se muestra
// en la moneda local del visitante para mejorar la conversión.

export const PLATFORM_PRICE_USD = 19

// CLP es la moneda de cobro real (MercadoPago Chile). El resto son
// conversiones de visualización — al momento del checkout siempre se cobra
// en CLP a través de MP. Tasas mayo 2026 redondeadas a precio "amigable".
export const PLATFORM_PRICE_CLP = 17990

// Códigos de país ISO-3166 alpha-2 que mapeamos a moneda local.
// El header x-vercel-ip-country expone esto en runtime (edge).
export type CountryCode =
  | 'CL' | 'AR' | 'MX' | 'CO' | 'PE' | 'UY' | 'BR'
  | 'ES' | 'US' | 'EC' | 'VE' | 'BO' | 'PY' | 'CR' | 'PA' | 'DO' | 'GT'

export interface LocalPrice {
  amount: number
  currency: string   // ISO-4217
  symbol: string     // símbolo a mostrar antes del número
  locale: string     // para Intl.NumberFormat
  flag: string       // emoji bandera
  country: string    // nombre del país en español
}

// Precios redondeados al múltiplo psicológico más cercano (no conversión exacta).
// Tasas referencia mayo 2026 (USD 1 ≈ valor moneda local):
// CLP 945, EUR 0.92, MXN 17.3, COP 4100, ARS 1250, PEN 3.75, UYU 40, BRL 5.7
export const PRICE_BY_COUNTRY: Record<CountryCode, LocalPrice> = {
  CL: { amount: 17990,  currency: 'CLP', symbol: '$',    locale: 'es-CL', flag: '🇨🇱', country: 'Chile' },
  AR: { amount: 23990,  currency: 'ARS', symbol: '$',    locale: 'es-AR', flag: '🇦🇷', country: 'Argentina' },
  MX: { amount: 349,    currency: 'MXN', symbol: '$',    locale: 'es-MX', flag: '🇲🇽', country: 'México' },
  CO: { amount: 79000,  currency: 'COP', symbol: '$',    locale: 'es-CO', flag: '🇨🇴', country: 'Colombia' },
  PE: { amount: 69,     currency: 'PEN', symbol: 'S/',   locale: 'es-PE', flag: '🇵🇪', country: 'Perú' },
  UY: { amount: 790,    currency: 'UYU', symbol: '$U',   locale: 'es-UY', flag: '🇺🇾', country: 'Uruguay' },
  BR: { amount: 109,    currency: 'BRL', symbol: 'R$',   locale: 'pt-BR', flag: '🇧🇷', country: 'Brasil' },
  EC: { amount: 19,     currency: 'USD', symbol: 'US$',  locale: 'es-EC', flag: '🇪🇨', country: 'Ecuador' },
  VE: { amount: 19,     currency: 'USD', symbol: 'US$',  locale: 'es-VE', flag: '🇻🇪', country: 'Venezuela' },
  BO: { amount: 129,    currency: 'BOB', symbol: 'Bs',   locale: 'es-BO', flag: '🇧🇴', country: 'Bolivia' },
  PY: { amount: 149000, currency: 'PYG', symbol: '₲',    locale: 'es-PY', flag: '🇵🇾', country: 'Paraguay' },
  CR: { amount: 9990,   currency: 'CRC', symbol: '₡',    locale: 'es-CR', flag: '🇨🇷', country: 'Costa Rica' },
  PA: { amount: 19,     currency: 'USD', symbol: 'US$',  locale: 'es-PA', flag: '🇵🇦', country: 'Panamá' },
  DO: { amount: 1190,   currency: 'DOP', symbol: 'RD$',  locale: 'es-DO', flag: '🇩🇴', country: 'Rep. Dominicana' },
  GT: { amount: 149,    currency: 'GTQ', symbol: 'Q',    locale: 'es-GT', flag: '🇬🇹', country: 'Guatemala' },
  ES: { amount: 17,     currency: 'EUR', symbol: '€',    locale: 'es-ES', flag: '🇪🇸', country: 'España' },
  US: { amount: 19,     currency: 'USD', symbol: 'US$',  locale: 'en-US', flag: '🇺🇸', country: 'Estados Unidos' },
}

// Fallback cuando no detectamos país: mostrar USD 19.
export const DEFAULT_DISPLAY_PRICE: LocalPrice = {
  amount: PLATFORM_PRICE_USD,
  currency: 'USD',
  symbol: 'US$',
  locale: 'en-US',
  flag: '🌎',
  country: 'Internacional',
}

export function getPriceForCountry(code: string | null | undefined): LocalPrice {
  if (!code) return DEFAULT_DISPLAY_PRICE
  const upper = code.toUpperCase() as CountryCode
  return PRICE_BY_COUNTRY[upper] ?? DEFAULT_DISPLAY_PRICE
}

// Formatea con Intl.NumberFormat respetando convenciones locales (separadores
// de miles, decimales, etc.). Sin currencyDisplay porque ya pasamos `symbol`
// aparte para tener control visual.
export function formatLocalPrice(price: LocalPrice): string {
  try {
    const fmt = new Intl.NumberFormat(price.locale, {
      maximumFractionDigits: price.currency === 'USD' || price.currency === 'EUR' ? 0 : 0,
    })
    return `${price.symbol}${fmt.format(price.amount)}`
  } catch {
    return `${price.symbol}${price.amount}`
  }
}

// Helper para "USD 19" o "$17.990 CLP" según contexto.
export function formatWithCurrency(price: LocalPrice): string {
  return `${formatLocalPrice(price)} ${price.currency}`
}
