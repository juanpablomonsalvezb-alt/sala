'use client'

import { useMemo, useState } from 'react'

type Plataforma = 'substack' | 'patreon' | 'beehiiv' | 'gumroad'

const PLATAFORMAS: Record<Plataforma, { nombre: string; comision: number; fija: number }> = {
  substack: { nombre: 'Substack', comision: 0.10, fija: 0 },
  patreon: { nombre: 'Patreon', comision: 0.10, fija: 0 },
  beehiiv: { nombre: 'Beehiiv', comision: 0.0, fija: 49 },
  gumroad: { nombre: 'Gumroad', comision: 0.10, fija: 0 },
}

const MONEDAS = {
  USD: { simbolo: 'USD', tasa: 1, etiqueta: 'Dólares (USD)' },
  CLP: { simbolo: 'CLP', tasa: 970, etiqueta: 'Pesos chilenos (CLP)' },
  COP: { simbolo: 'COP', tasa: 4200, etiqueta: 'Pesos colombianos (COP)' },
  ARS: { simbolo: 'ARS', tasa: 1180, etiqueta: 'Pesos argentinos (ARS)' },
  MXN: { simbolo: 'MXN', tasa: 19.5, etiqueta: 'Pesos mexicanos (MXN)' },
  PEN: { simbolo: 'PEN', tasa: 3.78, etiqueta: 'Soles peruanos (PEN)' },
}

type Moneda = keyof typeof MONEDAS

const STRIPE_FIJO = 0.30 // USD
const STRIPE_VAR = 0.029
const CONVERSION_AUDIENCIA = 0.04 // 4% en promedio
const CONVERSION_RETIRO = 0.025 // 2.5% en promedio

function fmt(n: number, simbolo: string) {
  const rounded = Math.round(n)
  const formatted = rounded.toLocaleString('es-CL')
  return `${simbolo === 'USD' ? 'US$' : '$'}${formatted} ${simbolo}`
}

function fmtUsd(n: number) {
  return `US$${Math.round(n).toLocaleString('en-US')}`
}

export function CuantoTeQuitanClient() {
  const [plataforma, setPlataforma] = useState<Plataforma>('substack')
  const [moneda, setMoneda] = useState<Moneda>('CLP')
  const [suscriptores, setSuscriptores] = useState(100)
  const [precioLocal, setPrecioLocal] = useState(10000)

  const calc = useMemo(() => {
    const tasaMoneda = MONEDAS[moneda].tasa
    const precioUsd = precioLocal / tasaMoneda

    const brutoMensualUsd = precioUsd * suscriptores
    const brutoMensualLocal = precioLocal * suscriptores

    const p = PLATAFORMAS[plataforma]

    // Comisión plataforma (sobre USD)
    const comisionPlataformaUsd = brutoMensualUsd * p.comision + p.fija
    // Stripe
    const stripeFijoUsd = STRIPE_FIJO * suscriptores
    const stripeVarUsd = brutoMensualUsd * STRIPE_VAR
    // Conversión audiencia
    const conversionAudienciaUsd = brutoMensualUsd * CONVERSION_AUDIENCIA
    // Conversión retiro
    const conversionRetiroUsd = brutoMensualUsd * CONVERSION_RETIRO

    const totalPerdidaMensualUsd =
      comisionPlataformaUsd +
      stripeFijoUsd +
      stripeVarUsd +
      conversionAudienciaUsd +
      conversionRetiroUsd

    const netoMensualUsd = Math.max(0, brutoMensualUsd - totalPerdidaMensualUsd)
    const perdidaAnualUsd = totalPerdidaMensualUsd * 12
    const perdidaAnualLocal = perdidaAnualUsd * tasaMoneda

    // En Nebbuler: solo cargos de procesador local (MercadoPago LATAM ~3.99% promedio)
    const procesadorLocal = 0.0399
    const perdidaNebbulerMensualUsd = brutoMensualUsd * procesadorLocal
    const netoNebbulerMensualUsd = brutoMensualUsd - perdidaNebbulerMensualUsd

    const ganasMasMensualUsd = netoNebbulerMensualUsd - netoMensualUsd
    const ganasMasAnualUsd = ganasMasMensualUsd * 12
    const ganasMasAnualLocal = ganasMasAnualUsd * tasaMoneda

    const porcentajePerdida = brutoMensualUsd > 0 ? (totalPerdidaMensualUsd / brutoMensualUsd) * 100 : 0

    return {
      brutoMensualUsd,
      brutoMensualLocal,
      comisionPlataformaUsd,
      stripeFijoUsd,
      stripeVarUsd,
      conversionAudienciaUsd,
      conversionRetiroUsd,
      totalPerdidaMensualUsd,
      netoMensualUsd,
      perdidaAnualUsd,
      perdidaAnualLocal,
      netoNebbulerMensualUsd,
      ganasMasMensualUsd,
      ganasMasAnualUsd,
      ganasMasAnualLocal,
      porcentajePerdida,
      tasaMoneda,
    }
  }, [plataforma, moneda, suscriptores, precioLocal])

  const monedaSym = MONEDAS[moneda].simbolo
  const perdidaRounded = Math.round(calc.perdidaAnualUsd).toLocaleString('en-US')
  const shareUrl = `https://nebbuler.com/cuanto-te-quitan?p=${plataforma}&perdida=${perdidaRounded}&moneda=${moneda}`
  const shareText = `Cada año pierdo US$${perdidaRounded} (${fmt(
    calc.perdidaAnualLocal,
    monedaSym,
  )}) en comisiones de ${PLATAFORMAS[plataforma].nombre} 😱\n\nCalcula lo tuyo → ${shareUrl}`

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`

  const copyResult = () => {
    navigator.clipboard.writeText(shareText)
  }

  return (
    <div className="bg-white text-black p-6 md:p-10 shadow-2xl">
      <div className="grid md:grid-cols-2 gap-8 md:gap-12">
        {/* INPUTS */}
        <div>
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#C41C1C] mb-6">
            Tus datos
          </p>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-black/70 mb-2">
                Plataforma que usás
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(Object.entries(PLATAFORMAS) as [Plataforma, (typeof PLATAFORMAS)[Plataforma]][]).map(
                  ([key, p]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setPlataforma(key)}
                      className={`text-sm py-2.5 px-3 border transition-colors ${
                        plataforma === key
                          ? 'bg-black text-white border-black'
                          : 'bg-white text-black border-black/20 hover:border-black/40'
                      }`}
                    >
                      {p.nombre}
                    </button>
                  ),
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-black/70 mb-2">
                Moneda de tu audiencia
              </label>
              <select
                value={moneda}
                onChange={(e) => setMoneda(e.target.value as Moneda)}
                className="w-full border border-black/20 px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-black"
              >
                {Object.entries(MONEDAS).map(([key, m]) => (
                  <option key={key} value={key}>
                    {m.etiqueta}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-black/70 mb-2">
                Suscriptores: <span className="text-black font-semibold">{suscriptores}</span>
              </label>
              <input
                type="range"
                min={10}
                max={1000}
                step={10}
                value={suscriptores}
                onChange={(e) => setSuscriptores(Number(e.target.value))}
                className="w-full accent-[#C41C1C]"
              />
              <div className="flex justify-between text-xs text-black/40 mt-1">
                <span>10</span>
                <span>1000</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-black/70 mb-2">
                Precio mensual por suscriptor en {monedaSym}
              </label>
              <input
                type="number"
                value={precioLocal}
                onChange={(e) => setPrecioLocal(Math.max(0, Number(e.target.value)))}
                className="w-full border border-black/20 px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-black"
              />
              <p className="text-xs text-black/50 mt-1">
                Equivale a ~{fmtUsd(precioLocal / calc.tasaMoneda)} USD
              </p>
            </div>
          </div>
        </div>

        {/* RESULTADO */}
        <div>
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#C41C1C] mb-6">
            Tu pérdida real
          </p>

          <div className="bg-[#FFF8F8] border-l-4 border-[#C41C1C] p-6 mb-6">
            <p className="text-sm text-black/60 mb-2">
              Cada año {PLATAFORMAS[plataforma].nombre} te quita
            </p>
            <p className="font-serif text-4xl md:text-5xl leading-[1] font-bold text-[#C41C1C] mb-3">
              {fmtUsd(calc.perdidaAnualUsd)}
            </p>
            <p className="text-sm text-black/60">
              equivalente a <strong>{fmt(calc.perdidaAnualLocal, monedaSym)}</strong> · es el{' '}
              <strong>{calc.porcentajePerdida.toFixed(1)}%</strong> de tu ingreso bruto
            </p>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between py-2 border-b border-black/10">
              <span className="text-black/60">Bruto mensual</span>
              <span className="font-mono">{fmtUsd(calc.brutoMensualUsd)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-black/10">
              <span className="text-black/60">
                Comisión {PLATAFORMAS[plataforma].nombre}
              </span>
              <span className="font-mono text-[#C41C1C]">
                −{fmtUsd(calc.comisionPlataformaUsd)}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-black/10">
              <span className="text-black/60">Stripe (2.9% + $0.30/tx)</span>
              <span className="font-mono text-[#C41C1C]">
                −{fmtUsd(calc.stripeFijoUsd + calc.stripeVarUsd)}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-black/10">
              <span className="text-black/60">Conversión que paga tu audiencia</span>
              <span className="font-mono text-[#C41C1C]">
                −{fmtUsd(calc.conversionAudienciaUsd)}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-black/10">
              <span className="text-black/60">Tu conversión al retirar a {monedaSym}</span>
              <span className="font-mono text-[#C41C1C]">
                −{fmtUsd(calc.conversionRetiroUsd)}
              </span>
            </div>
            <div className="flex justify-between py-3 font-semibold">
              <span>Te queda mensual</span>
              <span className="font-mono">{fmtUsd(calc.netoMensualUsd)}</span>
            </div>
          </div>

          <div className="mt-6 bg-black text-white p-5">
            <p className="text-xs tracking-[0.15em] uppercase text-white/60 mb-2">
              En Nebbuler ganarías
            </p>
            <p className="font-serif text-3xl font-bold mb-1">
              +{fmtUsd(calc.ganasMasAnualUsd)}/año
            </p>
            <p className="text-sm text-white/70">
              ({fmt(calc.ganasMasAnualLocal, monedaSym)}) extra en tu bolsillo
            </p>
          </div>
        </div>
      </div>

      {/* SHARE */}
      <div className="mt-10 pt-8 border-t border-black/10">
        <p className="text-center text-sm text-black/60 mb-4">
          Comparte este resultado con otro creador que también esté perdiendo plata
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white px-6 py-3 font-medium hover:bg-[#1ebd5b] transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
            Compartir por WhatsApp
          </a>
          <a
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-black text-white px-6 py-3 font-medium hover:bg-black/80 transition-colors"
          >
            Compartir en X
          </a>
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-[#0A66C2] text-white px-6 py-3 font-medium hover:bg-[#094f97] transition-colors"
          >
            Compartir en LinkedIn
          </a>
        </div>
      </div>
    </div>
  )
}
