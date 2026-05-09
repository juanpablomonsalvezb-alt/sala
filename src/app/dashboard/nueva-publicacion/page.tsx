'use client'

import { useState, useCallback, useTransition } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { createPost } from './_actions'

// ─── Carga dinámica — evita SSR del editor Tiptap ────────────────────────────

const NebbulerEditor = dynamic(() => import('@/components/nebbuler-editor'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        maxWidth: '680px',
        margin: '0 auto',
        padding: '48px 24px',
        minHeight: '500px',
        fontFamily: "'Libre Baskerville', Georgia, serif",
        fontSize: '21px',
        color: '#BBBBBB',
      }}
    >
      Cargando editor…
    </div>
  ),
})

// ─── Types ────────────────────────────────────────────────────────────────────

type Visibility = 'gratuita' | 'suscriptores'

// ─── Componente principal ─────────────────────────────────────────────────────

export default function NuevaPublicacionPage() {
  const [title, setTitle]           = useState('')
  const [visibility, setVisibility] = useState<Visibility>('suscriptores')
  const [content, setContent]       = useState('')
  const [savedMsg, setSavedMsg]     = useState('')
  const [error, setError]           = useState('')
  const [isPending, startTransition] = useTransition()

  // ── Manejadores de acción ──
  const handleSaveDraft = useCallback(() => {
    if (!title.trim()) {
      setError('El título es obligatorio para guardar.')
      return
    }
    setError('')
    startTransition(async () => {
      const result = await createPost({
        title: title.trim(),
        content,
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
  }, [title, content, visibility, startTransition])

  const handlePublish = useCallback(() => {
    const plainText = content.replace(/<[^>]*>/g, '').trim()
    if (!title.trim() || !plainText) {
      setError('El título y el contenido son obligatorios para publicar.')
      return
    }
    setError('')
    startTransition(async () => {
      const result = await createPost({
        title: title.trim(),
        content,
        isFree: visibility === 'gratuita',
        publish: true,
      })
      if (result.error) {
        setError(result.error)
      }
      // redirect ocurre server-side dentro de la action
    })
  }, [title, content, visibility, startTransition])

  return (
    <main
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden',
        background: '#fff',
      }}
    >
      {/* ── Header minimalista ── */}
      <header
        style={{
          flexShrink: 0,
          background: '#fff',
          borderBottom: '1px solid #DEDEDE',
          padding: '12px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Izquierda: ← Dashboard */}
        <Link
          href="/dashboard"
          style={{
            fontSize: '13px',
            color: '#666',
            textDecoration: 'none',
            fontFamily: 'var(--font-sans, sans-serif)',
            transition: 'color 0.15s',
          }}
          onMouseEnter={(e) => ((e.target as HTMLElement).style.color = '#121212')}
          onMouseLeave={(e) => ((e.target as HTMLElement).style.color = '#666')}
        >
          ← Dashboard
        </Link>

        {/* Derecha: estado + acciones */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {error && (
            <span
              style={{
                fontSize: '12px',
                color: '#C41C1C',
                fontFamily: 'var(--font-sans, sans-serif)',
              }}
            >
              {error}
            </span>
          )}
          {savedMsg && !error && (
            <span
              style={{
                fontSize: '12px',
                color: '#666',
                fontFamily: 'var(--font-sans, sans-serif)',
              }}
            >
              {savedMsg}
            </span>
          )}

          <button
            onClick={handleSaveDraft}
            disabled={isPending}
            style={{
              fontSize: '13px',
              fontWeight: 500,
              color: '#121212',
              background: '#fff',
              border: '1px solid #DEDEDE',
              padding: '7px 16px',
              cursor: isPending ? 'not-allowed' : 'pointer',
              opacity: isPending ? 0.5 : 1,
              fontFamily: 'var(--font-sans, sans-serif)',
              transition: 'border-color 0.15s, background 0.15s',
            }}
            onMouseEnter={(e) => {
              if (!isPending) {
                ;(e.currentTarget as HTMLButtonElement).style.borderColor = '#666'
                ;(e.currentTarget as HTMLButtonElement).style.background = '#F7F7F7'
              }
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.borderColor = '#DEDEDE'
              ;(e.currentTarget as HTMLButtonElement).style.background = '#fff'
            }}
          >
            {isPending ? 'Guardando…' : 'Guardar borrador'}
          </button>

          <button
            onClick={handlePublish}
            disabled={isPending}
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: '#fff',
              background: '#121212',
              border: '1px solid #121212',
              padding: '7px 20px',
              cursor: isPending ? 'not-allowed' : 'pointer',
              opacity: isPending ? 0.5 : 1,
              fontFamily: 'var(--font-sans, sans-serif)',
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => {
              if (!isPending) {
                ;(e.currentTarget as HTMLButtonElement).style.background = '#2a2a2a'
              }
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.background = '#121212'
            }}
          >
            {isPending ? 'Publicando…' : 'Publicar →'}
          </button>
        </div>
      </header>

      {/* ── Área de escritura ── */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ maxWidth: '780px', margin: '0 auto', padding: '0 52px' }}>

          {/* Título */}
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value)
              if (error) setError('')
            }}
            placeholder="El título de tu análisis…"
            style={{
              width: '100%',
              fontFamily: "'Libre Baskerville', Georgia, serif",
              fontSize: '40px',
              fontWeight: 700,
              color: '#121212',
              lineHeight: 1.2,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              padding: '48px 0 16px',
              letterSpacing: '-0.02em',
            }}
            className="placeholder:text-[#CCC]"
          />

          {/* Toggle de acceso */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
              paddingBottom: '24px',
              borderBottom: '1px solid #DEDEDE',
              marginBottom: '0',
            }}
          >
            <span
              style={{
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: '#666',
                fontWeight: 600,
                fontFamily: 'var(--font-sans, sans-serif)',
              }}
            >
              Acceso
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              {(
                [
                  { value: 'gratuita', label: 'Gratuita' },
                  { value: 'suscriptores', label: 'Solo suscriptores' },
                ] as { value: Visibility; label: string }[]
              ).map((opt) => (
                <label
                  key={opt.value}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-sans, sans-serif)',
                    fontSize: '13px',
                    color: visibility === opt.value ? '#121212' : '#666',
                    fontWeight: visibility === opt.value ? 600 : 400,
                  }}
                  onClick={() => setVisibility(opt.value)}
                >
                  <div
                    style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      border: `1px solid ${visibility === opt.value ? '#121212' : '#DEDEDE'}`,
                      background: visibility === opt.value ? '#121212' : '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      transition: 'border-color 0.15s, background 0.15s',
                    }}
                  >
                    {visibility === opt.value && (
                      <div
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: '#fff',
                        }}
                      />
                    )}
                  </div>
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          {/* Editor Tiptap — toda la interacción via BubbleMenu */}
          <NebbulerEditor
            content={content}
            onChange={setContent}
            placeholder="Escribe tu análisis. Tus lectores lo esperan."
          />
        </div>
      </div>
    </main>
  )
}
