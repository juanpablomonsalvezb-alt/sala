'use client'

import { useMemo, useState } from 'react'
import { SELECCIONES_LATAM, TASAS_USD } from '@/data/mundial-bootstrap'

type Nicho = 'analista_tactico' | 'ex_jugador' | 'club_dedicado' | 'podcaster' | 'youtuber'

const NICHOS: Record<Nicho, { label: string; conv: number; desc: string }> = {
  analista_tactico: {
    label: 'Analista táctico',
    conv: 0.03,
    desc: 'Tu audiencia es premium. 3% convierte a paga.',
  },
  ex_jugador: {
    label: 'Ex-jugador con podcast',
    conv: 0.025,
    desc: 'Acceso = aura. 2.5% convierte.',
  },
  club_dedicado: {
    label: 'Cuenta dedicada a un club',
    conv: 0.02,
    desc: 'Hinchas leales. 2% paga por contenido exclusivo.',
  },
  podcaster: {
    label: 'Podcaster general de fútbol',
    conv: 0.015,
    desc: 'Audiencia amplia. 1.5% se convierte.',
  },
  youtuber: {
    label: 'YouTuber deportivo',
    conv: 0.012,
    desc: 'Tráfico de descubrimiento. 1.2% paga.',
  },
}

const STRIPE_FIJO = 0.30
const STRIPE_VAR = 0.029
const SUBSTACK_COM = 0.10
const CONVERSION_DOBLE = 0.065 // audiencia + retiro

function fmtUsd(n: number) {
  return `US$${Math.round(n).toLocaleString('en-US')}`
}

function fmtLocal(n: number, simbolo: string, moneda: string) {
  const rounded = Math.round(n)
  return `${simbolo}${rounded.toLocaleString('es-CL')} ${moneda}`
}

export function MundialClient() {
  const [seleccionSlug, setSeleccionSlug] = useState('argentina')
  const [nicho, setNicho] = useState<Nicho>('analista_tactico')
  const [seguidores, setSeguidores] = useState(10000)
  const [precioUsd, setPrecioUsd] = useState(5)

  const seleccion = SELECCIONES_LATAM.find((s) => s.slug === seleccionSlug)!
  const nichoInfo = NICHOS[nicho]
  const tasa = TASAS_USD[seleccion.moneda] ?? 1

  const calc = useMemo(() => {
    const suscriptores = Math.round(seguidores * nichoInfo.conv)
    const brutoUsdMes = suscriptores * precioUsd
    const brutoLocalMes = brutoUsdMes * tasa

    // Substack
    const substackComUsd = brutoUsdMes * SUBSTACK_COM
    const stripeUsd = STRIPE_FIJO * suscriptores + brutoUsdMes * STRIPE_VAR
    const fxUsd = brutoUsdMes * CONVERSION_DOBLE
    const perdidaSubstackUsd = substackComUsd + stripeUsd + fxUsd
    const netoSubstackUsd = Math.max(0, brutoUsdMes - perdidaSubstackUsd)

    // Nebbuler La Sombra (0% comisión variable + ~3.99% procesador local)
    const perdidaNebbulerUsd = brutoUsdMes * 0.0399
    const netoNebbulerUsd = brutoUsdMes - perdidaNebbulerUsd

    // 60 días Mundial = 2 meses
    const ganasMas60dUsd = (netoNebbulerUsd - netoSubstackUsd) * 2
    const ganasMas60dLocal = ganasMas60dUsd * tasa

    return {
      suscriptores,
      brutoUsdMes,
      brutoLocalMes,
      netoSubstackUsd,
      netoNebbulerUsd,
      perdidaSubstackUsd,
      ganasMas60dUsd,
      ganasMas60dLocal,
    }
  }, [seguidores, nichoInfo.conv, precioUsd, tasa])

  const shareText = `Durante el Mundial 2026, ${seleccion.bandera} con ${calc.suscriptores} hinchas pagando US$${precioUsd}/mes:\n\nSubstack: ${fmtUsd(calc.netoSubstackUsd)}/mes neto\nNebbuler (programa La Sombra): ${fmtUsd(calc.netoNebbulerUsd)}/mes neto\n\nDiferencia 60 días: +${fmtUsd(calc.ganasMas60dUsd)} (${fmtLocal(calc.ganasMas60dLocal, seleccion.moneda_simbolo, seleccion.moneda)})\n\nCalcula lo tuyo: nebbuler.com/mundial`

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`

  return (
    <div className="bg-white text-black p-6 md:p-10 shadow-2xl">
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        {/* INPUTS */}
        <div>
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#C41C1C] mb-6">
            Tu perfil de creador
          </p>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-black/70 mb-2">
                Tu selección / audiencia principal
              </label>
              <div className="grid grid-cols-4 gap-2">
                {SELECCIONES_LATAM.map((s) => (
                  <button
                    key={s.slug}
                    type="button"
                    onClick={() => setSeleccionSlug(s.slug)}
                    className={`text-sm py-3 px-2 border transition-colors ${
                      seleccionSlug === s.slug
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-black border-black/20 hover:border-black/40'
                    }`}
                  >
                    <span className="block text-xl mb-1">{s.bandera}</span>
                    <span className="text-[10px] block">{s.pais}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-black/70 mb-2">
                Tipo de creador
              </label>
              <select
                value={nicho}
                onChange={(e) => setNicho(e.target.value as Nicho)}
                className="w-full border border-black/20 px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-black"
              >
                {(Object.entries(NICHOS) as [Nicho, (typeof NICHOS)[Nicho]][]).map(([k, n]) => (
                  <option key={k} value={k}>
                    {n.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-black/50 mt-1 italic">{nichoInfo.desc}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-black/70 mb-2">
                Seguidores activos:{' '}
                <span className="text-black font-semibold">{seguidores.toLocaleString('es-CL')}</span>
              </label>
              <input
                type="range"
                min={1000}
                max={500000}
                step={1000}
                value={seguidores}
                onChange={(e) => setSeguidores(Number(e.target.value))}
                className="w-full accent-[#C41C1C]"
              />
              <div className="flex justify-between text-xs text-black/40 mt-1">
                <span>1K</span>
                <span>500K</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-black/70 mb-2">
                Precio mensual sugerido: <span className="text-black font-semibold">US${precioUsd}</span>
              </label>
              <input
                type="range"
                min={2}
                max={30}
                step={1}
                value={precioUsd}
                onChange={(e) => setPrecioUsd(Number(e.target.value))}
                className="w-full accent-[#C41C1C]"
              />
              <p className="text-xs text-black/50 mt-1">
                ~{fmtLocal(precioUsd * tasa, seleccion.moneda_simbolo, seleccion.moneda)}/mes para tu audiencia
              </p>
            </div>
          </div>
        </div>

        {/* RESULTADO */}
        <div>
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#C41C1C] mb-6">
            Tus números durante el Mundial
          </p>

          <div className="bg-[#0A0A0A] text-white p-6 mb-6">
            <p className="text-white/60 text-sm mb-2">
              {calc.suscriptores} suscriptores pagos · US${precioUsd}/mes
            </p>
            <p className="font-serif text-3xl md:text-4xl leading-tight mb-1">
              {fmtUsd(calc.brutoUsdMes)}<span className="text-white/40 text-base font-sans">/mes bruto</span>
            </p>
            <p className="text-white/50 text-sm">
              ≈ {fmtLocal(calc.brutoLocalMes, seleccion.moneda_simbolo, seleccion.moneda)}/mes
            </p>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center p-4 border border-black/10">
              <div>
                <p className="text-[10px] tracking-[0.2em] uppercase text-black/40">Substack</p>
                <p className="text-sm text-black/60">10% + Stripe + FX doble</p>
              </div>
              <p className="font-mono text-lg">{fmtUsd(calc.netoSubstackUsd)}</p>
            </div>
            <div className="flex justify-between items-center p-4 bg-[#0A0A0A] text-white border border-[#0A0A0A]">
              <div>
                <p className="text-[10px] tracking-[0.2em] uppercase text-white/60">
                  Nebbuler · La Sombra
                </p>
                <p className="text-sm text-white/80">0% comisión hasta el 31 de julio</p>
              </div>
              <p className="font-mono text-lg text-white">{fmtUsd(calc.netoNebbulerUsd)}</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#C41C1C] to-[#8B1414] text-white p-6">
            <p className="text-white/80 text-xs tracking-[0.2em] uppercase mb-2">
              Ganás extra en 60 días de Mundial
            </p>
            <p className="font-serif text-4xl md:text-5xl font-bold leading-[1] mb-2">
              +{fmtUsd(calc.ganasMas60dUsd)}
            </p>
            <p className="text-white/80 text-sm">
              ≈ {fmtLocal(calc.ganasMas60dLocal, seleccion.moneda_simbolo, seleccion.moneda)} extra
              en tu bolsillo
            </p>
          </div>
        </div>
      </div>

      {/* SHARE + CTA */}
      <div className="mt-10 pt-8 border-t border-black/10">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          <p className="text-sm text-black/60">
            Compartilo con un colega periodista deportivo que esté perdiendo plata con Substack
          </p>
          <div className="flex flex-wrap gap-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white px-4 py-2.5 text-sm font-medium hover:bg-[#1ebd5b] transition-colors"
            >
              WhatsApp
            </a>
            <a
              href={twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-black text-white px-4 py-2.5 text-sm font-medium hover:bg-black/80 transition-colors"
            >
              X / Twitter
            </a>
            <a
              href="#aplicar"
              className="inline-flex items-center gap-2 bg-[#C41C1C] text-white px-4 py-2.5 text-sm font-medium hover:bg-[#a01515] transition-colors"
            >
              Aplicar al programa →
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
