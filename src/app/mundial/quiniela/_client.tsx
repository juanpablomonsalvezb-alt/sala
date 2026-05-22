'use client'

import { useMemo, useState } from 'react'

const SELECCIONES_TOP = [
  { nombre: 'Argentina', bandera: '🇦🇷' },
  { nombre: 'Brasil', bandera: '🇧🇷' },
  { nombre: 'Francia', bandera: '🇫🇷' },
  { nombre: 'España', bandera: '🇪🇸' },
  { nombre: 'Inglaterra', bandera: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { nombre: 'Alemania', bandera: '🇩🇪' },
  { nombre: 'Portugal', bandera: '🇵🇹' },
  { nombre: 'México', bandera: '🇲🇽' },
  { nombre: 'Colombia', bandera: '🇨🇴' },
  { nombre: 'Uruguay', bandera: '🇺🇾' },
  { nombre: 'Países Bajos', bandera: '🇳🇱' },
  { nombre: 'Croacia', bandera: '🇭🇷' },
]

const GOLEADORES = [
  'Lionel Messi',
  'Cristiano Ronaldo',
  'Kylian Mbappé',
  'Erling Haaland',
  'Vinícius Júnior',
  'Lautaro Martínez',
  'Harry Kane',
  'Lamine Yamal',
  'Julián Álvarez',
  'Bukayo Saka',
]

const SORPRESAS = [
  'Marruecos (otra vez)',
  'Estados Unidos (anfitrión)',
  'Australia',
  'Senegal',
  'Japón',
  'Ecuador',
  'Canadá',
  'Otra',
]

export function QuinielaClient() {
  const [campeon, setCampeon] = useState('Argentina')
  const [finalista, setFinalista] = useState('Brasil')
  const [tercero, setTercero] = useState('Francia')
  const [goleador, setGoleador] = useState('Lionel Messi')
  const [sorpresa, setSorpresa] = useState('Marruecos (otra vez)')
  const [nombre, setNombre] = useState('')

  const shareText = useMemo(() => {
    const campeonSel = SELECCIONES_TOP.find((s) => s.nombre === campeon)
    const finalistaSel = SELECCIONES_TOP.find((s) => s.nombre === finalista)
    const terceroSel = SELECCIONES_TOP.find((s) => s.nombre === tercero)
    const yo = nombre.trim() ? `Soy ${nombre.trim()} y ` : ''
    return `${yo}esta es mi predicción del Mundial 2026:

🏆 Campeón: ${campeonSel?.bandera ?? ''} ${campeon}
🥈 Finalista: ${finalistaSel?.bandera ?? ''} ${finalista}
🥉 Tercero: ${terceroSel?.bandera ?? ''} ${tercero}
⚽ Goleador: ${goleador}
🎯 Sorpresa: ${sorpresa}

Hacé la tuya en 60 segundos: nebbuler.com/mundial/quiniela`
  }, [campeon, finalista, tercero, goleador, sorpresa, nombre])

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`

  return (
    <div className="bg-white text-black p-6 md:p-10 shadow-2xl">
      <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#C41C1C] mb-6">
        Tus predicciones
      </p>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-black/70 mb-2">
            Tu nombre / @ (opcional)
          </label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: @juanpablo"
            className="w-full border border-black/20 px-3 py-2.5 text-sm focus:outline-none focus:border-black"
          />
        </div>

        <Select label="🏆 Campeón" value={campeon} onChange={setCampeon} options={SELECCIONES_TOP.map((s) => s.nombre)} />
        <Select label="🥈 Finalista" value={finalista} onChange={setFinalista} options={SELECCIONES_TOP.map((s) => s.nombre)} />
        <Select label="🥉 Tercer puesto" value={tercero} onChange={setTercero} options={SELECCIONES_TOP.map((s) => s.nombre)} />
        <Select label="⚽ Goleador del torneo" value={goleador} onChange={setGoleador} options={GOLEADORES} />
        <Select label="🎯 La sorpresa que llega a cuartos" value={sorpresa} onChange={setSorpresa} options={SORPRESAS} />
      </div>

      <div className="mt-8 p-5 bg-[#0A0A0A] text-white">
        <p className="text-xs tracking-[0.2em] uppercase text-white/60 mb-3">Tu predicción</p>
        <pre className="whitespace-pre-wrap text-sm font-sans leading-relaxed">{shareText}</pre>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-2 bg-[#25D366] text-white px-6 py-3 font-medium hover:bg-[#1ebd5b] transition-colors"
        >
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
      </div>
    </div>
  )
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: string[]
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-black/70 mb-2">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-black/20 px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-black"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  )
}
