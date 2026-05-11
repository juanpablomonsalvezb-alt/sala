'use client'

import { useEditor, EditorContent, posToDOMRect } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Youtube from '@tiptap/extension-youtube'
import Placeholder from '@tiptap/extension-placeholder'
import CharacterCount from '@tiptap/extension-character-count'
import { useState, useCallback, useEffect, useRef } from 'react'
import { useUploadThing } from '@/lib/uploadthing'
import { PdfEmbed, FileAttachment } from '@/lib/tiptap-extensions'

// ─── Límites de archivo ───────────────────────────────────────────────────────

const UPLOAD_LIMITS = {
  image:    8  * 1024 * 1024,   // 8 MB
  pdf:       4 * 1024 * 1024,   // 4 MB (~10 páginas)
  document: 16 * 1024 * 1024,   // 16 MB
} as const

const UPLOAD_HINTS = {
  image:    'hasta 8 MB — aprox. 3 fotos de celular',
  pdf:      'hasta 4 MB — máx. 10 páginas',
  document: 'hasta 16 MB — modelos Excel, Word, PPT',
} as const

function formatMB(bytes: number) {
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

// ─── Types ────────────────────────────────────────────────────────────────────

type NebbulerEditorProps = {
  content: string
  onChange: (html: string) => void
  placeholder?: string
}

// ─── Icons SVG inline ─────────────────────────────────────────────────────────

function IconBold() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
      <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
    </svg>
  )
}
function IconItalic() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="19" y1="4" x2="10" y2="4" />
      <line x1="14" y1="20" x2="5" y2="20" />
      <line x1="15" y1="4" x2="9" y2="20" />
    </svg>
  )
}
function IconH2() {
  return <span style={{ fontFamily: 'sans-serif', fontSize: '11px', fontWeight: 700 }}>H2</span>
}
function IconH3() {
  return <span style={{ fontFamily: 'sans-serif', fontSize: '11px', fontWeight: 700 }}>H3</span>
}
function IconQuote() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
      <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
    </svg>
  )
}
function IconLink() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  )
}
function IconPlus() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}
function IconImage() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  )
}
function IconYoutube() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" />
    </svg>
  )
}
function IconSeparator() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="3" y1="12" x2="21" y2="12" />
    </svg>
  )
}
function IconAudio() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  )
}
function IconPdf() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="9" y1="15" x2="15" y2="15" />
    </svg>
  )
}
function IconFile() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  )
}

// ─── BubbleMenu posicionado manualmente ──────────────────────────────────────

interface BubbleState {
  show: boolean
  top: number
  left: number
}

function useBubbleMenuPosition(
  editor: ReturnType<typeof useEditor> | null,
  wrapRef: React.RefObject<HTMLDivElement | null>
) {
  const [state, setState] = useState<BubbleState>({ show: false, top: 0, left: 0 })

  useEffect(() => {
    if (!editor) return

    const update = () => {
      const { state: edState, view } = editor
      const { selection } = edState
      const { from, to } = selection

      if (from === to || !wrapRef.current) {
        setState((s) => ({ ...s, show: false }))
        return
      }

      try {
        const domRect = posToDOMRect(view, from, to)
        const wrapRect = wrapRef.current.getBoundingClientRect()
        const menuWidth = 260
        const rawLeft = domRect.left - wrapRect.left + domRect.width / 2 - menuWidth / 2
        setState({
          show: true,
          top: domRect.top - wrapRect.top - 44,
          left: Math.max(0, rawLeft),
        })
      } catch {
        setState((s) => ({ ...s, show: false }))
      }
    }

    editor.on('selectionUpdate', update)
    editor.on('transaction', update)
    editor.on('blur', () => setState((s) => ({ ...s, show: false })))
    return () => {
      editor.off('selectionUpdate', update)
      editor.off('transaction', update)
    }
  }, [editor, wrapRef])

  return state
}

// ─── Botón "+" — posición ────────────────────────────────────────────────────

interface PlusState {
  show: boolean
  top: number
}

function usePlusButtonPosition(
  editor: ReturnType<typeof useEditor> | null,
  wrapRef: React.RefObject<HTMLDivElement | null>
) {
  const [state, setState] = useState<PlusState>({ show: false, top: 0 })

  useEffect(() => {
    if (!editor) return

    const update = () => {
      const { state: edState, view } = editor
      const { selection } = edState
      const { $from, from, to } = selection

      if (from !== to || !wrapRef.current) {
        setState((s) => ({ ...s, show: false }))
        return
      }

      const node = $from.node()
      if (!node || node.type.name !== 'paragraph' || node.textContent !== '') {
        setState((s) => ({ ...s, show: false }))
        return
      }

      try {
        const coords = view.coordsAtPos(from)
        const wrapRect = wrapRef.current.getBoundingClientRect()
        setState({ show: true, top: coords.top - wrapRect.top })
      } catch {
        setState((s) => ({ ...s, show: false }))
      }
    }

    editor.on('selectionUpdate', update)
    editor.on('transaction', update)
    return () => {
      editor.off('selectionUpdate', update)
      editor.off('transaction', update)
    }
  }, [editor, wrapRef])

  return state
}

// ─── Estilos reutilizables ────────────────────────────────────────────────────

const btnBase: React.CSSProperties = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: '4px 8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'color 0.1s',
}

const blockItemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '8px 12px',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  width: '100%',
  textAlign: 'left',
  fontSize: '13px',
  color: '#121212',
  fontFamily: 'var(--font-sans, sans-serif)',
  transition: 'background 0.1s',
}

// ─── BlockMenuItem con hint contextual ───────────────────────────────────────

function BlockMenuItem({
  icon,
  label,
  hint,
  onMouseDown,
}: {
  icon: React.ReactNode
  label: string
  hint: string
  onMouseDown: (e: React.MouseEvent<HTMLButtonElement>) => void
}) {
  return (
    <button
      onMouseDown={onMouseDown}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '8px',
        padding: '7px 12px',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        width: '100%',
        textAlign: 'left',
        fontFamily: 'var(--font-sans, sans-serif)',
        transition: 'background 0.1s',
      }}
      onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = '#F7F7F7')}
      onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = 'none')}
    >
      <span style={{ marginTop: '2px', flexShrink: 0, color: '#444' }}>{icon}</span>
      <span style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
        <span style={{ fontSize: '13px', color: '#121212', fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: '10px', color: '#999', lineHeight: 1.3 }}>{hint}</span>
      </span>
    </button>
  )
}

// ─── Hook upload handlers ─────────────────────────────────────────────────────

function useFileUpload(
  endpoint: 'imageUploader' | 'pdfUploader' | 'audioUploader' | 'documentUploader',
  limitKey: keyof typeof UPLOAD_LIMITS,
  onComplete: (url: string, name: string) => void,
  onError: (msg: string) => void,
) {
  const [uploading, setUploading] = useState(false)

  const { startUpload } = useUploadThing(endpoint, {
    onClientUploadComplete: (res) => {
      setUploading(false)
      if (res?.[0]) {
        onComplete(res[0].url, res[0].name)
      }
    },
    onUploadError: (err) => {
      setUploading(false)
      onError(`Error al subir: ${err.message}`)
    },
  })

  const triggerUpload = useCallback(
    (accept: string) => {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = accept
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0]
        if (!file) return

        const limit = UPLOAD_LIMITS[limitKey]
        if (file.size > limit) {
          onError(
            `"${file.name}" pesa ${formatMB(file.size)} — el límite es ${formatMB(limit)}. Reduce el tamaño e intenta de nuevo.`
          )
          return
        }

        setUploading(true)
        await startUpload([file])
      }
      input.click()
    },
    [startUpload, limitKey, onError]
  )

  return { uploading, triggerUpload }
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function NebbulerEditor({
  content,
  onChange,
  placeholder = 'Escribe tu análisis. Tus lectores lo esperan.',
}: NebbulerEditorProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const blockMenuRef = useRef<HTMLDivElement>(null)
  const [blockMenuOpen, setBlockMenuOpen] = useState(false)
  const [uploadError, setUploadError] = useState('')

  const handleUploadError = useCallback((msg: string) => {
    setUploadError(msg)
    setBlockMenuOpen(false)
    setTimeout(() => setUploadError(''), 6000)
  }, [])

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Image.configure({ HTMLAttributes: { class: 'editor-image' } }),
      Youtube.configure({
        controls: true,
        nocookie: true,
        HTMLAttributes: { class: 'editor-youtube' },
      }),
      PdfEmbed,
      FileAttachment,
      Placeholder.configure({ placeholder }),
      CharacterCount,
    ],
    content,
    onUpdate({ editor: ed }) {
      onChange(ed.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'nebbuler-prose',
        spellCheck: 'true',
      },
    },
    immediatelyRender: false,
  })

  const bubbleState = useBubbleMenuPosition(editor, wrapRef)
  const plusState = usePlusButtonPosition(editor, wrapRef)

  // Upload handlers
  const { uploading: uploadingImage, triggerUpload: triggerImageUpload } = useFileUpload(
    'imageUploader', 'image',
    (url) => { editor?.chain().focus().setImage({ src: url }).run(); setBlockMenuOpen(false) },
    handleUploadError,
  )

  const { uploading: uploadingPdf, triggerUpload: triggerPdfUpload } = useFileUpload(
    'pdfUploader', 'pdf',
    (url, name) => {
      editor?.chain().focus().insertContent({ type: 'pdfEmbed', attrs: { src: url, name } }).run()
      setBlockMenuOpen(false)
    },
    handleUploadError,
  )

  const { uploading: uploadingDoc, triggerUpload: triggerDocUpload } = useFileUpload(
    'documentUploader', 'document',
    (url, name) => {
      const ext = name.split('.').pop()?.toLowerCase() ?? 'file'
      editor?.chain().focus().insertContent({ type: 'fileAttachment', attrs: { src: url, name, type: ext } }).run()
      setBlockMenuOpen(false)
    },
    handleUploadError,
  )

  const isUploading = uploadingImage || uploadingPdf || uploadingDoc

  // Cerrar bloque-menu al click fuera
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (blockMenuRef.current && !blockMenuRef.current.contains(e.target as Node)) {
        setBlockMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const insertYoutube = useCallback(() => {
    if (!editor) return
    const url = window.prompt('URL del video de YouTube:')
    if (url) editor.chain().focus().setYoutubeVideo({ src: url }).run()
    setBlockMenuOpen(false)
  }, [editor])

  const insertHorizontalRule = useCallback(() => {
    if (!editor) return
    editor.chain().focus().setHorizontalRule().run()
    setBlockMenuOpen(false)
  }, [editor])

  const setLink = useCallback(() => {
    if (!editor) return
    const prev = editor.getAttributes('link').href as string | undefined
    const url = window.prompt('URL del enlace:', prev ?? 'https://')
    if (url === null) return
    if (url === '') {
      editor.chain().focus().unsetMark('link').run()
    } else {
      editor.chain().focus().setMark('link', { href: url }).run()
    }
  }, [editor])

  const wordCount = editor
    ? (editor.storage.characterCount as { words?: () => number } | undefined)?.words?.() ?? 0
    : 0

  if (!editor) return null

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>

      {/* ── Indicador de carga / error ── */}
      {(isUploading || uploadError) && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background: uploadError ? '#C41C1C' : '#121212',
            color: '#fff',
            padding: '10px 16px',
            fontSize: '13px',
            fontFamily: 'var(--font-sans, sans-serif)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            maxWidth: '360px',
            lineHeight: 1.4,
          }}
        >
          {isUploading && (
            <span style={{ display: 'inline-block', width: '12px', height: '12px', flexShrink: 0, borderRadius: '50%', border: '2px solid #fff', borderTopColor: 'transparent', animation: 'spin 0.7s linear infinite' }} />
          )}
          {uploadError ? uploadError : 'Subiendo archivo…'}
          {uploadError && (
            <button
              onClick={() => setUploadError('')}
              style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '16px', lineHeight: 1, marginLeft: '4px', flexShrink: 0 }}
            >
              ×
            </button>
          )}
        </div>
      )}

      {/* ── BubbleMenu flotante (sobre selección) ── */}
      {bubbleState.show && (
        <div
          onMouseDown={(e) => e.preventDefault()}
          style={{
            position: 'absolute',
            top: bubbleState.top,
            left: bubbleState.left,
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            background: '#121212',
            color: '#fff',
            padding: '6px 4px',
            pointerEvents: 'auto',
            userSelect: 'none',
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
          }}
        >
          <button
            onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleBold().run() }}
            title="Negrita"
            style={{ ...btnBase, color: editor.isActive('bold') ? '#C41C1C' : '#fff' }}
          >
            <IconBold />
          </button>
          <button
            onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleItalic().run() }}
            title="Cursiva"
            style={{ ...btnBase, color: editor.isActive('italic') ? '#C41C1C' : '#fff' }}
          >
            <IconItalic />
          </button>
          <div style={{ width: '1px', height: '14px', background: '#333', margin: '0 2px' }} />
          <button
            onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 2 }).run() }}
            title="Subtítulo H2"
            style={{ ...btnBase, color: editor.isActive('heading', { level: 2 }) ? '#C41C1C' : '#fff' }}
          >
            <IconH2 />
          </button>
          <button
            onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 3 }).run() }}
            title="Subtítulo H3"
            style={{ ...btnBase, color: editor.isActive('heading', { level: 3 }) ? '#C41C1C' : '#fff' }}
          >
            <IconH3 />
          </button>
          <div style={{ width: '1px', height: '14px', background: '#333', margin: '0 2px' }} />
          <button
            onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleBlockquote().run() }}
            title="Cita"
            style={{ ...btnBase, color: editor.isActive('blockquote') ? '#C41C1C' : '#fff' }}
          >
            <IconQuote />
          </button>
          <button
            onMouseDown={(e) => { e.preventDefault(); setLink() }}
            title="Enlace"
            style={{ ...btnBase, color: editor.isActive('link') ? '#C41C1C' : '#fff' }}
          >
            <IconLink />
          </button>
        </div>
      )}

      {/* ── Botón "+" en margen izquierdo ── */}
      {plusState.show && (
        <div
          ref={blockMenuRef}
          style={{
            position: 'absolute',
            top: plusState.top - 3,
            left: 0,
            zIndex: 40,
          }}
        >
          <button
            onMouseDown={(e) => { e.preventDefault(); setBlockMenuOpen((v) => !v) }}
            title="Insertar bloque"
            style={{
              width: '22px',
              height: '22px',
              background: 'none',
              border: '1px solid #DEDEDE',
              cursor: 'pointer',
              color: '#666',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.color = '#121212'
              ;(e.currentTarget as HTMLButtonElement).style.borderColor = '#121212'
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.color = '#666'
              ;(e.currentTarget as HTMLButtonElement).style.borderColor = '#DEDEDE'
            }}
          >
            <IconPlus />
          </button>

          {blockMenuOpen && (
            <div
              style={{
                position: 'absolute',
                top: '26px',
                left: '0',
                background: '#fff',
                border: '1px solid #DEDEDE',
                boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                zIndex: 50,
                minWidth: '240px',
              }}
            >
              {/* Multimedia */}
              <div style={{ padding: '6px 12px 2px', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'var(--font-sans)' }}>
                Multimedia
              </div>
              <BlockMenuItem icon={<IconImage />} label="Imagen" hint={UPLOAD_HINTS.image} onMouseDown={(e) => { e.preventDefault(); triggerImageUpload('image/*') }} />
              <BlockMenuItem icon={<IconYoutube />} label="YouTube / Vimeo" hint="pega la URL del video" onMouseDown={(e) => { e.preventDefault(); insertYoutube() }} />

              {/* Documentos */}
              <div style={{ height: '1px', background: '#DEDEDE', margin: '4px 0' }} />
              <div style={{ padding: '6px 12px 2px', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'var(--font-sans)' }}>
                Documentos
              </div>
              <BlockMenuItem icon={<IconPdf />} label="PDF" hint={UPLOAD_HINTS.pdf} onMouseDown={(e) => { e.preventDefault(); triggerPdfUpload('application/pdf') }} />
              <BlockMenuItem icon={<IconFile />} label="Excel / Word / PPT" hint={UPLOAD_HINTS.document} onMouseDown={(e) => { e.preventDefault(); triggerDocUpload('.xlsx,.xls,.docx,.doc,.pptx,.ppt,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel') }} />

              {/* Formato */}
              <div style={{ height: '1px', background: '#DEDEDE', margin: '4px 0' }} />
              <BlockMenuItem icon={<IconSeparator />} label="Separador" hint="línea divisoria" onMouseDown={(e) => { e.preventDefault(); insertHorizontalRule() }} />
            </div>
          )}
        </div>
      )}

      {/* ── Área de escritura ── */}
      <EditorContent editor={editor} />

      {/* ── Contador de palabras ── */}
      {wordCount > 0 && (
        <div
          style={{
            textAlign: 'right',
            maxWidth: '680px',
            margin: '0 auto',
            paddingRight: '24px',
            paddingBottom: '8px',
            fontSize: '12px',
            color: '#BBBBBB',
            fontFamily: 'var(--font-sans, sans-serif)',
          }}
        >
          {wordCount} {wordCount === 1 ? 'palabra' : 'palabras'}
        </div>
      )}
    </div>
  )
}
