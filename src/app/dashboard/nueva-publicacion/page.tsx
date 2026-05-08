'use client'

import { useState, useCallback, useTransition } from 'react'
import Link from 'next/link'
import { createPost } from './_actions'

// ─── Types ────────────────────────────────────────────────────────────────────

type Visibility = 'gratuita' | 'suscriptores'

interface ToolbarAction {
  id: string
  label: string
  syntax: (selected: string) => string
}

// ─── Toolbar actions ──────────────────────────────────────────────────────────

const toolbarActions: ToolbarAction[] = [
  {
    id: 'bold',
    label: 'Negrita',
    syntax: (s) => `**${s || 'texto'}**`,
  },
  {
    id: 'italic',
    label: 'Cursiva',
    syntax: (s) => `*${s || 'texto'}*`,
  },
  {
    id: 'quote',
    label: 'Cita',
    syntax: (s) => `\n> ${s || 'cita'}\n`,
  },
  {
    id: 'heading',
    label: 'Subtítulo',
    syntax: (s) => `\n## ${s || 'Subtítulo'}\n`,
  },
  {
    id: 'link',
    label: 'Enlace',
    syntax: (s) => `[${s || 'texto'}](https://)`,
  },
]

// ─── Preview renderer (simple markdown → HTML) ────────────────────────────────

function renderPreview(text: string): string {
  return text
    .split('\n')
    .map((line) => {
      if (/^## (.+)/.test(line)) {
        return `<h2 style="font-family:'Playfair Display',Georgia,serif;font-size:1.25rem;font-weight:700;color:#121212;margin:1.5rem 0 0.5rem">${line.replace(/^## /, '')}</h2>`
      }
      if (/^> (.+)/.test(line)) {
        return `<blockquote style="border-left:3px solid #C41C1C;padding-left:1rem;margin:1rem 0;color:#666666;font-style:italic">${line.replace(/^> /, '')}</blockquote>`
      }
      const processed = line
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(
          /\[(.+?)\]\((.+?)\)/g,
          '<a href="$2" style="color:#C41C1C;text-decoration:underline">$1</a>'
        )
      if (!processed.trim()) return '<div style="height:0.75rem"></div>'
      return `<p style="margin:0 0 0.75rem;line-height:1.75;color:#121212">${processed}</p>`
    })
    .join('\n')
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function NuevaPublicacionPage() {
  const [title, setTitle] = useState('')
  const [visibility, setVisibility] = useState<Visibility>('suscriptores')
  const [body, setBody] = useState('')
  const [preview, setPreview] = useState(false)
  const [savedMsg, setSavedMsg] = useState('')
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  // ── Keyboard shortcuts ──
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault()
        applyAction(toolbarActions[0])
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
        e.preventDefault()
        applyAction(toolbarActions[1])
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [body]
  )

  // ── Toolbar: apply syntax to selected text ──
  const applyAction = useCallback(
    (action: ToolbarAction) => {
      const textarea = document.getElementById('editor-body') as HTMLTextAreaElement | null
      if (!textarea) return

      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const selected = body.slice(start, end)
      const replacement = action.syntax(selected)

      const next = body.slice(0, start) + replacement + body.slice(end)
      setBody(next)

      setTimeout(() => {
        textarea.focus()
        const newPos = start + replacement.length
        textarea.setSelectionRange(newPos, newPos)
      }, 0)
    },
    [body]
  )

  // ── Save draft ──
  const handleSaveDraft = () => {
    if (!title.trim()) {
      setError('El título es obligatorio para guardar.')
      return
    }
    setError('')
    startTransition(async () => {
      const result = await createPost({
        title: title.trim(),
        content: body,
        isFree: visibility === 'gratuita',
        publish: false,
      })
      if (result.error) {
        setError(result.error)
      } else {
        setSavedMsg('✓ Borrador guardado')
        setTimeout(() => setSavedMsg(''), 3000)
      }
    })
  }

  // ── Publish ──
  const handlePublish = () => {
    if (!title.trim() || !body.trim()) {
      setError('El título y el contenido son obligatorios para publicar.')
      return
    }
    setError('')
    startTransition(async () => {
      const result = await createPost({
        title: title.trim(),
        content: body,
        isFree: visibility === 'gratuita',
        publish: true,
      })
      if (result.error) {
        setError(result.error)
      }
      // redirect happens server-side inside the action
    })
  }

  return (
    <main className="flex-1 flex flex-col overflow-hidden">
      {/* Top bar */}
      <div className="bg-white border-b border-[#DEDEDE] px-8 py-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="text-[13px] text-[#666666] hover:text-[#121212] transition-colors"
            style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
          >
            ← Dashboard
          </Link>
          <span className="text-[#DEDEDE]">/</span>
          <span
            className="text-[13px] font-semibold text-[#121212]"
            style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
          >
            Nueva publicación
          </span>
        </div>

        {/* Preview toggle */}
        <div className="flex items-center gap-1 bg-[#F7F7F7] border border-[#DEDEDE] p-0.5">
          <button
            onClick={() => setPreview(false)}
            className={`text-[12px] font-medium px-3 py-1.5 transition-colors ${
              !preview
                ? 'bg-white text-[#121212] border border-[#DEDEDE]'
                : 'text-[#666666] hover:text-[#121212]'
            }`}
            style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
          >
            Editar
          </button>
          <button
            onClick={() => setPreview(true)}
            className={`text-[12px] font-medium px-3 py-1.5 transition-colors ${
              preview
                ? 'bg-white text-[#121212] border border-[#DEDEDE]'
                : 'text-[#666666] hover:text-[#121212]'
            }`}
            style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
          >
            Vista previa
          </button>
        </div>
      </div>

      {/* Editor / Preview scroll area */}
      <div className="flex-1 overflow-y-auto">
        {preview ? (
          /* ── PREVIEW MODE ── */
          <div className="max-w-[680px] mx-auto py-14 px-6">
            <div className="mb-2">
              <span
                className="text-[11px] uppercase tracking-[0.14em] text-[#666666] font-medium"
                style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
              >
                {visibility === 'suscriptores' ? 'Solo suscriptores' : 'Artículo gratuito'}
              </span>
            </div>

            <h1
              className="text-[2.25rem] font-bold text-[#121212] leading-tight mb-6"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {title || <span className="text-[#DEDEDE]">El título de tu análisis...</span>}
            </h1>

            <div className="flex items-center gap-3 pb-6 border-b border-[#DEDEDE] mb-8">
              <div className="w-8 h-8 rounded-full bg-[#121212] flex items-center justify-center">
                <span className="text-white text-[11px] font-medium">SA</span>
              </div>
              <div>
                <p
                  className="text-[13px] font-semibold text-[#121212]"
                  style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
                >
                  Mi sala
                </p>
                <p
                  className="text-[11px] text-[#666666]"
                  style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
                >
                  {new Date().toLocaleDateString('es-CL', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>

            <div
              className="text-[16px] leading-relaxed text-[#121212]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              dangerouslySetInnerHTML={{
                __html: body.trim()
                  ? renderPreview(body)
                  : '<p style="color:#DEDEDE">Escribe aquí tu análisis. Tus suscriptores lo esperan.</p>',
              }}
            />
          </div>
        ) : (
          /* ── EDIT MODE ── */
          <div className="max-w-[720px] mx-auto py-10 px-6">
            {/* Title input */}
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="El título de tu análisis..."
              className="w-full text-[2.25rem] font-bold text-[#121212] leading-tight bg-transparent border-none outline-none placeholder-[#DEDEDE] mb-6"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            />

            {/* Divider */}
            <div className="h-px bg-[#DEDEDE] mb-5" />

            {/* Visibility toggle */}
            <div className="flex items-center gap-6 mb-7">
              <span
                className="text-[12px] uppercase tracking-[0.12em] text-[#666666] font-medium"
                style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
              >
                Acceso
              </span>
              <div className="flex items-center gap-4">
                {(
                  [
                    { value: 'gratuita', label: 'Gratuita' },
                    { value: 'suscriptores', label: 'Solo suscriptores' },
                  ] as { value: Visibility; label: string }[]
                ).map((opt) => (
                  <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                    <div
                      onClick={() => setVisibility(opt.value)}
                      className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors cursor-pointer ${
                        visibility === opt.value
                          ? 'border-[#121212] bg-[#121212]'
                          : 'border-[#DEDEDE] bg-white hover:border-[#666666]'
                      }`}
                    >
                      {visibility === opt.value && (
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      )}
                    </div>
                    <span
                      className={`text-[13px] ${
                        visibility === opt.value ? 'text-[#121212] font-medium' : 'text-[#666666]'
                      }`}
                      style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
                      onClick={() => setVisibility(opt.value)}
                    >
                      {opt.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Toolbar */}
            <div className="flex items-center gap-px bg-[#F7F7F7] border border-[#DEDEDE] mb-0 w-fit">
              {toolbarActions.map((action, i) => (
                <button
                  key={action.id}
                  onClick={() => applyAction(action)}
                  title={action.label}
                  className={`text-[12px] font-medium text-[#666666] hover:text-[#121212] hover:bg-white px-3 py-2 transition-colors ${
                    i < toolbarActions.length - 1 ? 'border-r border-[#DEDEDE]' : ''
                  }`}
                  style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
                >
                  {action.label}
                </button>
              ))}
            </div>

            {/* Body textarea */}
            <textarea
              id="editor-body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribe aquí tu análisis. Tus suscriptores lo esperan."
              rows={24}
              className="w-full text-[17px] leading-[1.8] text-[#121212] bg-white border border-[#DEDEDE] border-t-0 outline-none placeholder-[#DEDEDE] p-5 resize-none focus:border-[#666666] transition-colors"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            />
          </div>
        )}
      </div>

      {/* ── Bottom action bar ── */}
      <div className="flex-shrink-0 bg-white border-t border-[#DEDEDE] px-8 py-4 flex items-center justify-between">
        {/* Left: word count / error */}
        <div>
          {error ? (
            <span
              className="text-[12px] text-[#C41C1C]"
              style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
            >
              {error}
            </span>
          ) : (
            <span
              className="text-[12px] text-[#666666]"
              style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
            >
              {body.trim() ? `${body.trim().split(/\s+/).length} palabras` : 'Sin contenido aún'}
            </span>
          )}
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-3">
          {savedMsg && (
            <span
              className="text-[12px] text-[#666666]"
              style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
            >
              {savedMsg}
            </span>
          )}
          <button
            onClick={handleSaveDraft}
            disabled={isPending}
            className="text-[13px] font-medium text-[#121212] border border-[#DEDEDE] px-4 py-2 hover:border-[#666666] hover:bg-[#F7F7F7] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
          >
            {isPending ? 'Guardando...' : 'Guardar borrador'}
          </button>
          <button
            onClick={handlePublish}
            disabled={isPending}
            className="text-[13px] font-semibold text-white bg-[#121212] px-5 py-2 hover:bg-[#2a2a2a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
          >
            {isPending ? 'Publicando...' : 'Publicar →'}
          </button>
        </div>
      </div>
    </main>
  )
}
