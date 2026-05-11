'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'

type Audience =
  | 'colegas'
  | 'clientes'
  | 'academia'
  | 'linkedin'
  | 'instagram'

const AUDIENCE_LABELS: Record<Audience, string> = {
  colegas: 'Colegas del sector',
  clientes: 'Clientes y ex-clientes',
  academia: 'Grupo académico / universidad',
  linkedin: 'LinkedIn connections',
  instagram: 'Seguidores de Instagram',
}

function buildMessages(
  name: string,
  url: string,
  audience: Audience
): string[] {
  const displayUrl = url.startsWith('http') ? url : `nebbuler.com/${url.replace(/^nebbuler\.com\//, '')}`

  const specialty: Record<Audience, string> = {
    colegas: 'mi área',
    clientes: 'temas que nos interesan',
    academia: 'mi campo de investigación',
    linkedin: 'mi disciplina',
    instagram: 'los temas que sigo',
  }

  const s = specialty[audience]

  return [
    // Mensaje 1 — Lanzamiento
    `Hola! Acabo de lanzar mi newsletter en Nebbuler: ${name}.\nCada semana publico análisis sobre ${s} para profesionales como ustedes.\nPueden leer mi primera publicación gratis acá 👉 ${displayUrl}`,

    // Mensaje 2 — Exclusividad
    `Si te interesa ${s} a nivel profesional, te comparto algo que acabo de armar:\n${name} en Nebbuler — análisis sin filtros, directo al punto.\n${displayUrl}`,

    // Mensaje 3 — Social proof
    `Varios colegas ya se suscribieron. Te lo comparto por si también te sirve:\n${name} — ${displayUrl}`,

    // Mensaje 4 — Valor directo
    `Publiqué un análisis que creo que te puede interesar: ${name}\nPuedes leer una parte gratis en ${displayUrl}\nSi te sirve, la suscripción mensual vale menos que un café ☕`,

    // Mensaje 5 — LinkedIn friendly
    `Comparto un trabajo que vengo desarrollando hace tiempo: análisis de ${s}.\nSi está en tu radar, puedes ver mis publicaciones en ${displayUrl}`,
  ]
}

const TIPS = [
  'Mejor horario para enviar: martes a jueves entre 9 y 11am.',
  'Personaliza cada mensaje con el nombre del grupo o persona.',
  'No envíes el mismo mensaje dos veces al mismo grupo.',
  'Mide tus visitas desde el dashboard de Nebbuler.',
  'Agradece a quienes se suscriban mencionando que los referiste.',
]

interface CopyState {
  copied: boolean
}

export default function ViralizarPage() {
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [audience, setAudience] = useState<Audience>('colegas')
  const [copyStates, setCopyStates] = useState<CopyState[]>(
    Array(5).fill({ copied: false })
  )

  const hasInputs = name.trim().length > 0 && url.trim().length > 0
  const messages = hasInputs ? buildMessages(name.trim(), url.trim(), audience) : []

  function getWhatsAppUrl(text: string): string {
    return `https://wa.me/?text=${encodeURIComponent(text)}`
  }

  async function handleCopy(index: number) {
    const msg = messages[index]
    if (!msg) return
    await navigator.clipboard.writeText(msg)
    setCopyStates(prev => prev.map((s, i) => i === index ? { copied: true } : s))
    setTimeout(() => {
      setCopyStates(prev => prev.map((s, i) => i === index ? { copied: false } : s))
    }, 2000)
  }

  const MESSAGE_TITLES = [
    'Lanzamiento',
    'Exclusividad',
    'Social proof',
    'Valor directo',
    'LinkedIn friendly',
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header>
        <div className="h-[3px] bg-[#C41C1C]" />
        <div className="border-b border-[#DEDEDE] py-4 px-6">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <Link
              href="/"
              className="font-serif text-[20px] font-bold text-[#121212] tracking-[-0.01em]"
            >
              NEBBULER
            </Link>
            <Link
              href="/dashboard"
              className="font-sans text-[12px] text-[#666] hover:text-[#121212] transition-colors"
            >
              ← Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12">
        {/* Títulos */}
        <div className="mb-10">
          <p className="font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-[#C41C1C] mb-2">
            Herramienta de crecimiento
          </p>
          <h1 className="font-serif text-[32px] font-bold text-[#121212] leading-tight tracking-[-0.02em] mb-3">
            Comparte tu sala en WhatsApp
          </h1>
          <p className="font-sans text-[15px] text-[#666] leading-relaxed">
            Mensajes pre-escritos para tus grupos profesionales. Cópialos y pégalos directamente.
          </p>
        </div>

        {/* Formulario */}
        <div className="border border-[#DEDEDE] p-6 mb-10 space-y-5">
          <div>
            <label
              htmlFor="creator-name"
              className="block font-sans text-[11px] font-bold tracking-[0.12em] uppercase text-[#666] mb-1.5"
            >
              Tu nombre / nombre de tu publicación
            </label>
            <input
              id="creator-name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Rodrigo Fuentes — Política Monetaria"
              className="w-full font-sans text-[14px] text-[#121212] border border-[#DEDEDE] px-3 py-2.5 focus:outline-none focus:border-[#121212] placeholder:text-[#BDBDBD]"
            />
          </div>

          <div>
            <label
              htmlFor="creator-url"
              className="block font-sans text-[11px] font-bold tracking-[0.12em] uppercase text-[#666] mb-1.5"
            >
              Tu URL en Nebbuler
            </label>
            <input
              id="creator-url"
              type="text"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="nebbuler.com/rodrigo-fuentes-marin"
              className="w-full font-sans text-[14px] text-[#121212] border border-[#DEDEDE] px-3 py-2.5 focus:outline-none focus:border-[#121212] placeholder:text-[#BDBDBD]"
            />
          </div>

          <div>
            <label
              htmlFor="audience"
              className="block font-sans text-[11px] font-bold tracking-[0.12em] uppercase text-[#666] mb-1.5"
            >
              A quién vas a enviar
            </label>
            <select
              id="audience"
              value={audience}
              onChange={e => setAudience(e.target.value as Audience)}
              className="w-full font-sans text-[14px] text-[#121212] border border-[#DEDEDE] px-3 py-2.5 focus:outline-none focus:border-[#121212] bg-white"
            >
              {(Object.entries(AUDIENCE_LABELS) as [Audience, string][]).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Mensajes generados */}
        {!hasInputs ? (
          <div className="border border-dashed border-[#DEDEDE] p-8 text-center mb-10">
            <p className="font-sans text-[13px] text-[#999]">
              Completa los campos de arriba para ver tus 5 mensajes listos para copiar.
            </p>
          </div>
        ) : (
          <div className="space-y-4 mb-10">
            <p className="font-sans text-[11px] font-bold tracking-[0.15em] uppercase text-[#999] mb-2">
              Tus 5 mensajes
            </p>
            {messages.map((msg, index) => (
              <div key={index} className="border border-[#DEDEDE] overflow-hidden">
                {/* Badge del tipo */}
                <div className="flex items-center justify-between px-4 py-2 bg-[#F7F7F7] border-b border-[#DEDEDE]">
                  <span className="font-sans text-[10px] font-bold tracking-[0.15em] uppercase text-[#666]">
                    {MESSAGE_TITLES[index]}
                  </span>
                  <span className="font-sans text-[10px] text-[#999]">
                    {msg.length} caracteres
                  </span>
                </div>

                {/* Texto */}
                <div className="p-4">
                  <p className="font-sans text-[13px] text-[#121212] leading-relaxed whitespace-pre-line mb-4">
                    {msg}
                  </p>

                  {/* Acciones */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => handleCopy(index)}
                      className="font-sans text-[11px] font-bold tracking-[0.08em] uppercase px-3 py-1.5 border border-[#DEDEDE] text-[#121212] hover:bg-[#121212] hover:text-white transition-colors"
                    >
                      {copyStates[index]?.copied ? '¡Copiado!' : 'Copiar'}
                    </button>
                    <a
                      href={getWhatsAppUrl(msg)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-sans text-[11px] font-bold tracking-[0.08em] uppercase px-3 py-1.5 bg-[#25D366] text-white hover:opacity-90 transition-opacity"
                    >
                      Enviar por WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tips */}
        <div className="border-t border-[#DEDEDE] pt-8 mb-10">
          <p className="font-sans text-[11px] font-bold tracking-[0.15em] uppercase text-[#999] mb-4">
            Tips para compartir
          </p>
          <ul className="space-y-3">
            {TIPS.map((tip, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="font-serif text-[#C41C1C] mt-0.5 leading-none flex-shrink-0">—</span>
                <span className="font-sans text-[14px] text-[#444] leading-relaxed">{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Imagen de perfil optimizada */}
        <div className="border border-[#DEDEDE] p-5 bg-[#F7F7F7]">
          <p className="font-sans text-[11px] font-bold tracking-[0.15em] uppercase text-[#999] mb-2">
            Imagen de perfil para WhatsApp
          </p>
          <p className="font-serif text-[16px] font-bold text-[#121212] mb-2">
            Tu tarjeta de presentación digital
          </p>
          <p className="font-sans text-[13px] text-[#666] leading-relaxed mb-4">
            Obtén un widget embebible con tu foto, nombre y disciplina. Úsalo como imagen de perfil en grupos de WhatsApp para aumentar el reconocimiento.
          </p>
          {url.trim() ? (
            <a
              href={`/widget/${url.trim().replace(/.*nebbuler\.com\//, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-[12px] font-bold tracking-[0.08em] uppercase px-5 py-2.5 bg-[#121212] text-white hover:bg-[#C41C1C] transition-colors inline-block"
            >
              Ver mi widget →
            </a>
          ) : (
            <p className="font-sans text-[12px] text-[#999] italic">
              Ingresa tu URL para obtener el link a tu widget.
            </p>
          )}
        </div>
      </main>

      <footer className="border-t border-[#DEDEDE] py-6 px-6 mt-8">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <span className="font-sans text-[11px] font-semibold uppercase tracking-widest text-[#666666]">
            NEBBULER · CHILE · 2026
          </span>
          <a
            href="mailto:hello@nebbuler.com"
            className="font-sans text-[12px] text-[#666666] hover:text-[#121212] transition-colors duration-150"
          >
            hello@nebbuler.com
          </a>
        </div>
      </footer>
    </div>
  )
}
