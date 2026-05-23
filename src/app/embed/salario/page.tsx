import type { Metadata } from 'next'
import Link from 'next/link'
import { PAISES, PROFESIONES, SALARIOS } from '@/data/salarios'

export const metadata: Metadata = {
  title: 'Salarios Profesionales LATAM — Widget Embebible | Nebbuler',
  description: 'Widget embebible con datos de salarios profesionales en Latinoamérica. Gratis para incrustar en tu sitio.',
  robots: { index: false, follow: true },
}

type Props = { searchParams: Promise<Record<string, string | undefined>> }

export default async function EmbedSalarioPage({ searchParams }: Props) {
  const sp = await searchParams
  const profesionSlug = sp.profesion ?? 'economista'
  const paisSlug = sp.pais ?? 'chile'

  const profesion = PROFESIONES.find(p => p.slug === profesionSlug) ?? PROFESIONES[0]
  const pais = PAISES.find(p => p.slug === paisSlug) ?? PAISES[0]
  const salario = SALARIOS[profesionSlug]?.[paisSlug]

  const fmt = (n: number) => `${pais.simbolo}${n.toLocaleString('es-CL')}`

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-md mx-auto border border-[#E5E5E5] bg-white">
        {/* Header */}
        <div className="bg-[#0A0A0A] text-white px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/50 mb-1">
              Salario {profesion.nombreMayus}
            </p>
            <p className="text-lg font-serif font-bold">
              {pais.emoji} {pais.nombre}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-white/40">Datos 2026</p>
          </div>
        </div>

        {/* Data */}
        {salario ? (
          <div className="p-5 space-y-3">
            <div className="flex justify-between py-2 border-b border-black/5">
              <span className="text-sm text-black/60">Mínimo</span>
              <span className="text-sm font-mono font-semibold">{fmt(salario.min)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-black/5">
              <span className="text-sm text-black/60">Promedio</span>
              <span className="text-sm font-mono font-bold text-[#0A0A0A]">{fmt(salario.promedio)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-black/5">
              <span className="text-sm text-black/60">Máximo</span>
              <span className="text-sm font-mono font-semibold">{fmt(salario.max)}</span>
            </div>
            <p className="text-[10px] text-black/30 pt-1">
              Fuente: {salario.fuente} · Salario mensual en {pais.moneda}
            </p>
          </div>
        ) : (
          <div className="p-5 text-center text-sm text-black/40">
            Datos no disponibles para esta combinación.
          </div>
        )}

        {/* Powered by */}
        <div className="border-t border-[#E5E5E5] px-5 py-3 flex items-center justify-between">
          <a
            href={`https://nebbuler.com/salario/${profesionSlug}/${paisSlug}?ref=embed`}
            target="_blank"
            rel="noopener"
            className="text-[11px] text-[#C41C1C] font-medium hover:underline"
          >
            Ver análisis completo →
          </a>
          <a
            href="https://nebbuler.com?ref=embed-salario"
            target="_blank"
            rel="noopener"
            className="text-[10px] text-black/30 hover:text-black/50"
          >
            Powered by <span className="font-bold">Nebbuler</span>
          </a>
        </div>
      </div>

      {/* Embed code for copy */}
      <div className="max-w-md mx-auto mt-8 p-4 bg-[#F8F7F5] border border-[#E5E5E5]">
        <p className="text-xs font-bold tracking-[0.15em] uppercase text-black/40 mb-3">
          Código para incrustar
        </p>
        <code className="block text-[11px] bg-white p-3 border border-[#E5E5E5] break-all text-black/70 select-all">
          {`<iframe src="https://nebbuler.com/embed/salario?profesion=${profesionSlug}&pais=${paisSlug}" width="400" height="300" frameborder="0" style="border:1px solid #eee;border-radius:4px;"></iframe>`}
        </code>
      </div>
    </div>
  )
}
