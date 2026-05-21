import { headers } from 'next/headers'
import {
  DEFAULT_DISPLAY_PRICE,
  PLATFORM_PRICE_USD,
  PLATFORM_PRICE_CLP,
  formatLocalPrice,
  getPriceForCountry,
  type LocalPrice,
} from '@/lib/pricing'

// Lee el país desde el header de geolocalización que Vercel inyecta
// automáticamente (x-vercel-ip-country). En dev o cuando Vercel no detecta
// país, cae a USD 19.
async function detectCountry(): Promise<string | null> {
  try {
    const h = await headers()
    return h.get('x-vercel-ip-country') ?? h.get('cf-ipcountry')
  } catch {
    return null
  }
}

export async function getServerPrice(): Promise<LocalPrice> {
  const country = await detectCountry()
  return getPriceForCountry(country)
}

interface PriceDisplayProps {
  // Si true, muestra también la conversión a USD entre paréntesis.
  showUsdEquivalent?: boolean
  // Si true, muestra "/mes" después del precio.
  showPerMonth?: boolean
  // Si true, muestra la bandera del país.
  showFlag?: boolean
  // Tamaño del texto: 'sm' (display inline), 'lg' (hero pricing).
  size?: 'sm' | 'md' | 'lg' | 'xl'
  // Forzar país (útil para testing o páginas dedicadas a un mercado).
  forceCountry?: string
  // Color y className para integrar con el diseño de la página.
  className?: string
}

const SIZE_CLASSES: Record<NonNullable<PriceDisplayProps['size']>, string> = {
  sm: 'text-base',
  md: 'text-2xl font-semibold',
  lg: 'text-4xl font-bold',
  xl: 'text-6xl font-bold tracking-tight',
}

export async function PriceDisplay({
  showUsdEquivalent = false,
  showPerMonth = true,
  showFlag = false,
  size = 'md',
  forceCountry,
  className = '',
}: PriceDisplayProps) {
  const country = forceCountry ?? (await detectCountry())
  const price = getPriceForCountry(country)
  const isUSD = price.currency === 'USD'

  return (
    <span className={`inline-flex items-baseline gap-1 ${SIZE_CLASSES[size]} ${className}`}>
      {showFlag && <span className="text-base mr-1" aria-hidden>{price.flag}</span>}
      <span style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
        {formatLocalPrice(price)}
      </span>
      <span className="text-[0.5em] text-[#666666] font-medium ml-1">
        {price.currency}
        {showPerMonth && '/mes'}
      </span>
      {showUsdEquivalent && !isUSD && (
        <span className="text-[0.4em] text-[#999999] ml-2">
          (US${PLATFORM_PRICE_USD})
        </span>
      )}
    </span>
  )
}

// Versión "stat" para hero/pricing pages. Muestra precio grande + nota explicativa.
export async function PriceHero({
  className = '',
}: {
  className?: string
}) {
  const price = await getServerPrice()
  const isLocal = price.currency !== 'USD'

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <div className="flex items-baseline gap-2">
        <span
          className="text-[64px] font-bold text-[#121212] tracking-tight leading-none"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          {formatLocalPrice(price)}
        </span>
        <span className="text-[18px] text-[#666666] font-medium">
          {price.currency}/mes
        </span>
      </div>
      <p className="text-[13px] text-[#666666]">
        {isLocal ? (
          <>
            <span className="mr-1">{price.flag}</span>
            Precio para {price.country} · equivale a US${PLATFORM_PRICE_USD}/mes
          </>
        ) : (
          <>
            <span className="mr-1">{price.flag}</span>
            US${PLATFORM_PRICE_USD}/mes · pago seguro vía MercadoPago
          </>
        )}
      </p>
    </div>
  )
}

// Tabla de conversiones para mostrar transparencia (footer/precios).
export function PriceConversionsTable() {
  const rows: Array<[string, string, string]> = [
    ['🇨🇱', 'Chile', `$${(PLATFORM_PRICE_CLP).toLocaleString('es-CL')} CLP`],
    ['🇲🇽', 'México', '$349 MXN'],
    ['🇦🇷', 'Argentina', '$23.990 ARS'],
    ['🇨🇴', 'Colombia', '$79.000 COP'],
    ['🇵🇪', 'Perú', 'S/69 PEN'],
    ['🇺🇾', 'Uruguay', '$U 790 UYU'],
    ['🇧🇷', 'Brasil', 'R$ 109 BRL'],
    ['🇪🇸', 'España', '€17 EUR'],
    ['🇪🇨🇵🇦🇻🇪🇺🇸', 'USD', 'US$19 USD'],
  ]

  return (
    <div className="border border-[#DEDEDE] bg-white">
      <div className="px-5 py-3 border-b border-[#DEDEDE]">
        <p className="text-[11px] uppercase tracking-[0.14em] text-[#666666] font-medium">
          Precio equivalente por país
        </p>
      </div>
      <ul className="divide-y divide-[#EEEEEE]">
        {rows.map(([flag, country, price]) => (
          <li
            key={country}
            className="flex items-center justify-between px-5 py-3 text-[14px]"
          >
            <span className="flex items-center gap-2">
              <span aria-hidden className="text-base">{flag}</span>
              <span className="text-[#121212]">{country}</span>
            </span>
            <span className="text-[#121212] font-medium tabular-nums">{price}</span>
          </li>
        ))}
      </ul>
      <div className="px-5 py-3 border-t border-[#DEDEDE] text-[11px] text-[#999999]">
        Todos los precios son equivalentes a US${PLATFORM_PRICE_USD}/mes. Cobro real
        procesado por MercadoPago en pesos chilenos.
      </div>
    </div>
  )
}
