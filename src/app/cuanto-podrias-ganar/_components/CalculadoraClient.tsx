'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  PROFESSIONS_CONFIG,
  COUNTRIES_CONFIG,
  estimarIngresos,
  formatLocal,
} from '@/lib/ingresos-estimator'
import { ShareButtons } from '@/components/magnet/share-buttons'

export function CalculadoraClient() {
  const [profesion, setProfesion] = useState(PROFESSIONS_CONFIG[2].slug)
  const [pais, setPais] = useState<string>('CL')
  const [followers, setFollowers] = useState(5000)
  const [horas, setHoras] = useState(8)

  const result = useMemo(
    () =>
      estimarIngresos({
        profesionSlug: profesion,
        paisCode: pais,
        followers,
        horasSemana: horas,
      }),
    [profesion, pais, followers, horas]
  )

  const formatLocally = (n: number) =>
    formatLocal(n, result.precioSugerido.locale, result.precioSugerido.symbol)

  const shareUrl = useMemo(() => {
    const params = new URLSearchParams({
      profesion,
      pais,
      followers: String(followers),
      horas: String(horas),
    })
    return `https://nebbuler.com/cuanto-podrias-ganar?${params.toString()}`
  }, [profesion, pais, followers, horas])

  const ogUrl = `https://nebbuler.com/api/og/cuanto-ganarias?profesion=${profesion}&pais=${pais}&followers=${followers}&horas=${horas}`

  const profesionName =
    PROFESSIONS_CONFIG.find(p => p.slug === profesion)?.nombre ?? ''

  const shareText = `Como ${profesionName.toLowerCase()} podría generar ${formatLocally(result.nebbuler.ingresoMensualNeto)} /mes con una membresía Nebbuler. Calcula el tuyo —`

  return (
    <section className="max-w-5xl mx-auto px-6 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-12">
        {/* Form */}
        <div className="flex flex-col gap-8">
          <Field label="Tu profesión">
            <select
              value={profesion}
              onChange={e => setProfesion(e.target.value)}
              className="w-full bg-white border border-[#121212] text-[#121212] text-sm px-4 py-3 font-sans focus:outline-none focus:ring-2 focus:ring-[#C41C1C]"
            >
              {PROFESSIONS_CONFIG.map(p => (
                <option key={p.slug} value={p.slug}>
                  {p.nombre} · {p.area}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Tu país">
            <select
              value={pais}
              onChange={e => setPais(e.target.value)}
              className="w-full bg-white border border-[#121212] text-[#121212] text-sm px-4 py-3 font-sans focus:outline-none focus:ring-2 focus:ring-[#C41C1C]"
            >
              {COUNTRIES_CONFIG.map(c => (
                <option key={c.code} value={c.code}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </Field>

          <Field
            label="Audiencia total (LinkedIn + IG + Twitter)"
            hint={`${followers.toLocaleString('es-CL')} seguidores`}
          >
            <input
              type="range"
              min={100}
              max={100000}
              step={100}
              value={followers}
              onChange={e => setFollowers(parseInt(e.target.value, 10))}
              className="w-full accent-[#C41C1C]"
            />
            <div className="flex justify-between text-[10px] uppercase tracking-[0.18em] text-[#999] mt-2">
              <span>100</span>
              <span>25k</span>
              <span>50k</span>
              <span>100k+</span>
            </div>
          </Field>

          <Field
            label="Horas por semana dedicadas a contenido"
            hint={`${horas}h / semana`}
          >
            <input
              type="range"
              min={1}
              max={25}
              step={1}
              value={horas}
              onChange={e => setHoras(parseInt(e.target.value, 10))}
              className="w-full accent-[#C41C1C]"
            />
            <div className="flex justify-between text-[10px] uppercase tracking-[0.18em] text-[#999] mt-2">
              <span>1h</span>
              <span>10h</span>
              <span>25h+</span>
            </div>
          </Field>
        </div>

        {/* Result */}
        <div className="flex flex-col">
          <div className="border-2 border-[#121212] p-8 md:p-12 bg-white">
            <p className="text-[10px] uppercase tracking-[0.28em] text-[#C41C1C] font-semibold mb-4">
              Tu ingreso estimado
            </p>
            <AnimatePresence mode="wait">
              <motion.div
                key={result.nebbuler.ingresoMensualNeto}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                <p className="font-serif text-5xl md:text-7xl font-bold leading-none tracking-[-0.03em] text-[#C41C1C]">
                  {formatLocally(result.nebbuler.ingresoMensualNeto)}
                </p>
                <p className="text-sm uppercase tracking-[0.22em] text-[#666] mt-3">
                  /mes — netos con Nebbuler
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 pt-6 border-t border-[#DEDEDE] grid grid-cols-2 gap-4 text-sm font-sans">
              <Stat
                label="Suscriptores estimados"
                value={result.suscriptoresEstimados.toLocaleString('es-CL')}
              />
              <Stat
                label="Precio por suscriptor"
                value={formatLocally(result.precioSugerido.amount)}
              />
              <Stat
                label="Bruto mensual"
                value={formatLocally(result.ingresoMensual)}
              />
              <Stat
                label="Bruto anual"
                value={formatLocally(result.ingresoAnual)}
              />
            </div>
          </div>

          {/* Tabla comparativa */}
          <div className="mt-8 border-t-2 border-[#121212]">
            <p className="text-[10px] uppercase tracking-[0.28em] text-[#C41C1C] font-semibold mt-6 mb-4">
              Comparativa con otras plataformas
            </p>
            <table className="w-full text-sm font-sans">
              <thead>
                <tr className="border-b border-[#121212] text-[10px] uppercase tracking-[0.2em] text-[#666]">
                  <th className="text-left py-3 font-medium">Plataforma</th>
                  <th className="text-right py-3 font-medium">Comisión</th>
                  <th className="text-right py-3 font-medium">Neto / mes</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[#DEDEDE] bg-[#FAFAF7]">
                  <td className="py-3 font-bold text-[#C41C1C]">
                    Nebbuler
                  </td>
                  <td className="py-3 text-right text-[#666]">
                    Tarifa fija
                  </td>
                  <td className="py-3 text-right font-bold tabular-nums">
                    {formatLocally(result.nebbuler.ingresoMensualNeto)}
                  </td>
                </tr>
                <tr className="border-b border-[#DEDEDE]">
                  <td className="py-3">{result.substack.nombre}</td>
                  <td className="py-3 text-right text-[#666]">10%</td>
                  <td className="py-3 text-right tabular-nums">
                    {formatLocally(result.substack.ingresoMensualNeto)}
                  </td>
                </tr>
                <tr className="border-b border-[#DEDEDE]">
                  <td className="py-3">{result.patreon.nombre}</td>
                  <td className="py-3 text-right text-[#666]">8%</td>
                  <td className="py-3 text-right tabular-nums">
                    {formatLocally(result.patreon.ingresoMensualNeto)}
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
              <DiferenciaBox
                label="Más al año vs Substack"
                value={formatLocally(result.diferenciaAnualSubstack)}
              />
              <DiferenciaBox
                label="Más al año vs Patreon"
                value={formatLocally(result.diferenciaAnualPatreon)}
              />
            </div>
          </div>

          {/* CTA + Share */}
          <div className="mt-10 flex flex-col gap-4">
            <Link
              href="/registro"
              className="block w-full text-center px-8 py-5 bg-[#C41C1C] text-white text-[12px] uppercase tracking-[0.25em] font-medium hover:bg-[#A01818] transition-colors"
            >
              Empezar mi sala →
            </Link>

            <div className="mt-2">
              <p className="text-[10px] uppercase tracking-[0.25em] text-[#666] mb-3 font-semibold">
                Compartir mi resultado
              </p>
              <ShareButtons
                tool="calculadora"
                url={shareUrl}
                text={shareText}
              />
              <a
                href={ogUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block mt-3 text-[10px] uppercase tracking-[0.22em] text-[#666] hover:text-[#C41C1C] underline"
              >
                Ver imagen para Stories / IG vertical →
              </a>
            </div>

            <Link
              href={`/directorio?area=${encodeURIComponent(
                PROFESSIONS_CONFIG.find(p => p.slug === profesion)?.area ?? ''
              )}`}
              className="text-[11px] uppercase tracking-[0.22em] text-[#666] hover:text-[#121212] underline self-start mt-2"
            >
              Ver creadores top en tu nicho →
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <label className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <span className="text-[11px] uppercase tracking-[0.22em] text-[#121212] font-semibold">
          {label}
        </span>
        {hint && (
          <span className="text-[11px] text-[#C41C1C] font-sans font-bold tabular-nums">
            {hint}
          </span>
        )}
      </div>
      {children}
    </label>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.2em] text-[#666] mb-1">
        {label}
      </p>
      <p className="font-serif text-xl font-bold text-[#121212] tabular-nums">
        {value}
      </p>
    </div>
  )
}

function DiferenciaBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-[#121212] p-4 bg-white">
      <p className="text-[10px] uppercase tracking-[0.2em] text-[#666] mb-1">
        {label}
      </p>
      <p className="font-serif text-2xl font-bold text-[#C41C1C] tabular-nums leading-none">
        +{value}
      </p>
    </div>
  )
}
