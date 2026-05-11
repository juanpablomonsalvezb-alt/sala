'use client'

import { useState, useCallback, useTransition } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { createPost, updatePost } from '../_actions'

type PostInitial = {
  id: string
  title: string
  content: string
  isFree: boolean
  isPublished: boolean
}

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

type Visibility = 'gratuita' | 'suscriptores'

export default function NuevaPublicacionClient({ initial }: { initial: PostInitial | null }) {
  const isEditing = !!initial
  const [title, setTitle] = useState(initial?.title ?? '')
  const [visibility, setVisibility] = useState<Visibility>(
    initial?.isFree ? 'gratuita' : 'suscriptores'
  )
  const [content, setContent] = useState(initial?.content ?? '')
  const [savedMsg, setSavedMsg] = useState('')
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  const handleSaveDraft = useCallback(() => {
    if (!title.trim()) {
      setError('El título es obligatorio para guardar.')
      return
    }
    setError('')
    startTransition(async () => {
      const result = isEditing && initial
        ? await updatePost({
            postId: initial.id,
            title: title.trim(),
            content,
            isFree: visibility === 'gratuita',
            publish: false,
          })
        : await createPost({
            title: title.trim(),
            content,
            isFree: visibility === 'gratuita',
            publish: false,
          })

      if (result.error) setError(result.error)
      else {
        setSavedMsg('✓ Borrador guardado')
        setTimeout(() => setSavedMsg(''), 3000)
      }
    })
  }, [title, content, visibility, isEditing, initial])

  const handlePublish = useCallback(() => {
    const plainText = content.replace(/<[^>]*>/g, '').trim()
    if (!title.trim() || !plainText) {
      setError('El título y el contenido son obligatorios para publicar.')
      return
    }
    setError('')
    startTransition(async () => {
      const result = isEditing && initial
        ? await updatePost({
            postId: initial.id,
            title: title.trim(),
            content,
            isFree: visibility === 'gratuita',
            publish: true,
          })
        : await createPost({
            title: title.trim(),
            content,
            isFree: visibility === 'gratuita',
            publish: true,
          })

      if (result.error) setError(result.error)
    })
  }, [title, content, visibility, isEditing, initial])

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
        <Link
          href="/dashboard"
          style={{
            fontSize: '13px',
            color: '#666',
            textDecoration: 'none',
            fontFamily: 'var(--font-sans, sans-serif)',
            transition: 'color 0.15s',
          }}
        >
          ← Dashboard
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {isEditing && (
            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: '#C41C1C',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontFamily: 'var(--font-sans, sans-serif)',
              }}
            >
              Editando · {initial?.isPublished ? 'Publicado' : 'Borrador'}
            </span>
          )}
          {error && (
            <span style={{ fontSize: '12px', color: '#C41C1C', fontFamily: 'var(--font-sans, sans-serif)' }}>
              {error}
            </span>
          )}
          {savedMsg && !error && (
            <span style={{ fontSize: '12px', color: '#666', fontFamily: 'var(--font-sans, sans-serif)' }}>
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
            }}
          >
            {isPending ? 'Guardando…' : isEditing ? 'Guardar cambios' : 'Guardar borrador'}
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
            }}
          >
            {isPending
              ? 'Publicando…'
              : isEditing && initial?.isPublished
                ? 'Actualizar →'
                : 'Publicar →'}
          </button>
        </div>
      </header>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ maxWidth: '780px', margin: '0 auto', padding: '0 52px' }}>
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

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
              paddingBottom: '24px',
              borderBottom: '1px solid #DEDEDE',
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
                    }}
                  >
                    {visibility === opt.value && (
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#fff' }} />
                    )}
                  </div>
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

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
