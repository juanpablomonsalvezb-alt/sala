'use client'

import { useState, useRef, useEffect, FormEvent } from 'react'
import Link from 'next/link'

interface Creator {
  name: string
  specialty: string
  slug: string
}

interface Message {
  role: 'user' | 'assistant'
  content: string
  creators?: Creator[]
}

const SUGGESTED_QUESTIONS = [
  '¿Qué es la TPM y cómo afecta mi hipoteca?',
  '¿Cómo tributa una SpA en Chile?',
  '¿Cuál es la diferencia entre EBITDA y flujo de caja?',
  '¿Qué está pasando con la inflación en LATAM?',
]

// Parsear la respuesta para extraer creadores si el modelo los incluyó
function parseAssistantMessage(raw: string): { text: string; creators: Creator[] } {
  const creatorRegex = /\[CREADORES_RELEVANTES\]([\s\S]*?)\[\/CREADORES_RELEVANTES\]/
  const match = raw.match(creatorRegex)

  if (!match) {
    return { text: raw.trim(), creators: [] }
  }

  const creatorsBlock = match[1]
  const text = raw.replace(creatorRegex, '').trim()

  const creators: Creator[] = []
  const lines = creatorsBlock.split('\n').filter((l) => l.trim().startsWith('-'))

  for (const line of lines) {
    // Formato: - Nombre · Specialty → nebbuler.com/slug
    const arrowSplit = line.split('→')
    if (arrowSplit.length < 2) continue
    const urlPart = arrowSplit[1].trim()
    const slug = urlPart.replace('nebbuler.com/', '').trim()
    const leftPart = arrowSplit[0].replace('-', '').trim()
    const dotSplit = leftPart.split('·')
    const name = dotSplit[0].trim()
    const specialty = dotSplit[1]?.trim() ?? ''
    if (name && slug) {
      creators.push({ name, specialty, slug })
    }
  }

  return { text, creators }
}

export default function PreguntaPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendQuestion(question: string) {
    if (!question.trim() || isStreaming) return

    const userMessage: Message = { role: 'user', content: question }
    const historyForApi = messages
      .slice(-6)
      .map((m) => ({ role: m.role, content: m.content }))

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsStreaming(true)

    // Añadir placeholder del asistente
    setMessages((prev) => [...prev, { role: 'assistant', content: '', creators: [] }])

    abortRef.current = new AbortController()

    try {
      const response = await fetch('/api/pregunta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, history: historyForApi }),
        signal: abortRef.current.signal,
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let accumulated = ''

      if (!reader) throw new Error('No readable stream')

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        accumulated += decoder.decode(value, { stream: true })

        // Actualizar el último mensaje en tiempo real
        setMessages((prev) => {
          const updated = [...prev]
          const last = updated[updated.length - 1]
          if (last.role === 'assistant') {
            updated[updated.length - 1] = { ...last, content: accumulated }
          }
          return updated
        })
      }

      // Parsear el mensaje final completo para extraer creadores
      const { text, creators } = parseAssistantMessage(accumulated)
      setMessages((prev) => {
        const updated = [...prev]
        const last = updated[updated.length - 1]
        if (last.role === 'assistant') {
          updated[updated.length - 1] = { ...last, content: text, creators }
        }
        return updated
      })
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return
      setMessages((prev) => {
        const updated = [...prev]
        const last = updated[updated.length - 1]
        if (last.role === 'assistant') {
          updated[updated.length - 1] = {
            ...last,
            content: 'Hubo un error al procesar tu pregunta. Por favor, inténtalo de nuevo.',
          }
        }
        return updated
      })
    } finally {
      setIsStreaming(false)
      inputRef.current?.focus()
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    sendQuestion(input)
  }

  function handleSuggestedQuestion(q: string) {
    sendQuestion(q)
  }

  const showSuggestions = messages.length === 0

  return (
    <div className="min-h-screen bg-white text-[#121212] flex flex-col">
      {/* Header editorial */}
      <header className="border-b border-[#121212]/10 shrink-0">
        <div className="h-[3px] bg-[#C41C1C] w-full" />
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/" className="font-serif text-xl font-bold tracking-widest text-[#121212]">
            NEBBULER
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-sans text-[#121212]/60">
            <Link href="/directorio" className="hover:text-[#121212] transition-colors">Directorio</Link>
            <Link href="/glosario" className="hover:text-[#121212] transition-colors">Glosario</Link>
            <Link href="/observatorio" className="hover:text-[#121212] transition-colors">Observatorio</Link>
            <Link href="/para-creadores" className="hover:text-[#C41C1C] font-medium transition-colors">Para creadores</Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <div className="max-w-3xl mx-auto w-full px-6 pt-10 pb-6 shrink-0">
        <p className="font-sans text-xs tracking-[0.2em] uppercase text-[#C41C1C] mb-3">
          Observatorio de Nebbuler
        </p>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#121212] mb-3">
          Pregunta al Observatorio
        </h1>
        <p className="font-sans text-base text-[#121212]/60 leading-relaxed">
          Respuestas de profesionales verificados — economistas, abogados, médicos y más.
        </p>
      </div>

      {/* Área de conversación */}
      <div className="flex-1 max-w-3xl mx-auto w-full px-6 overflow-y-auto">
        {showSuggestions ? (
          /* Preguntas sugeridas */
          <div className="pb-6">
            <p className="font-sans text-xs text-[#121212]/40 uppercase tracking-wider mb-4">
              Preguntas frecuentes
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSuggestedQuestion(q)}
                  disabled={isStreaming}
                  className="text-left p-4 rounded-lg border border-[#121212]/10 hover:border-[#C41C1C]/30 hover:bg-[#FAFAFA] transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <p className="font-sans text-sm text-[#121212]/70 group-hover:text-[#121212] transition-colors leading-relaxed">
                    {q}
                  </p>
                  <span className="text-[#C41C1C] text-xs opacity-0 group-hover:opacity-100 transition-opacity mt-1 block">
                    Preguntar →
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Mensajes */
          <div className="pb-6 space-y-6">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'user' ? (
                  <div className="max-w-[85%] bg-[#121212] text-white rounded-2xl rounded-tr-sm px-5 py-3.5">
                    <p className="font-sans text-sm leading-relaxed">{msg.content}</p>
                  </div>
                ) : (
                  <div className="max-w-[90%]">
                    <div className="bg-[#F7F7F7] rounded-2xl rounded-tl-sm px-5 py-4">
                      {msg.content === '' && isStreaming ? (
                        /* Loading dots */
                        <div className="flex items-center gap-1.5 py-1">
                          <span className="w-2 h-2 rounded-full bg-[#121212]/30 animate-bounce [animation-delay:-0.3s]" />
                          <span className="w-2 h-2 rounded-full bg-[#121212]/30 animate-bounce [animation-delay:-0.15s]" />
                          <span className="w-2 h-2 rounded-full bg-[#121212]/30 animate-bounce" />
                        </div>
                      ) : (
                        <>
                          <div className="font-sans text-sm text-[#121212]/80 leading-relaxed whitespace-pre-wrap">
                            {/* Mostrar contenido sin el bloque de creadores crudo */}
                            {msg.content.replace(/\[CREADORES_RELEVANTES\][\s\S]*?\[\/CREADORES_RELEVANTES\]/, '').trim()}
                            {/* Cursor parpadeante mientras streaming */}
                            {isStreaming && i === messages.length - 1 && (
                              <span className="inline-block w-0.5 h-4 bg-[#121212]/40 ml-0.5 animate-pulse" />
                            )}
                          </div>

                          {/* Sección "Leer más en Nebbuler" */}
                          {!isStreaming && msg.creators && msg.creators.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-[#121212]/10">
                              <p className="font-sans text-xs text-[#121212]/40 uppercase tracking-wider mb-3">
                                Leer más en Nebbuler
                              </p>
                              <div className="flex flex-col gap-2">
                                {msg.creators.map((c) => (
                                  <Link
                                    key={c.slug}
                                    href={`/c/${c.slug}`}
                                    className="group flex items-center gap-3 p-2.5 rounded-lg border border-[#121212]/10 bg-white hover:border-[#C41C1C]/30 transition-all"
                                  >
                                    <div className="shrink-0 w-7 h-7 rounded-full bg-[#121212] flex items-center justify-center text-white font-serif text-xs font-bold">
                                      {c.name.charAt(0)}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <p className="font-sans font-medium text-xs text-[#121212] group-hover:text-[#C41C1C] transition-colors">
                                        {c.name}
                                      </p>
                                      {c.specialty && (
                                        <p className="font-sans text-[10px] text-[#121212]/40 uppercase tracking-wide mt-0.5">
                                          {c.specialty}
                                        </p>
                                      )}
                                    </div>
                                    <span className="text-[#C41C1C] text-xs opacity-60 group-hover:opacity-100 transition-opacity">
                                      →
                                    </span>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input fijo en la parte inferior */}
      <div className="shrink-0 border-t border-[#121212]/10 bg-white">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <form onSubmit={handleSubmit} className="flex items-center gap-3">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu pregunta..."
              disabled={isStreaming}
              className="flex-1 font-sans text-sm border border-[#121212]/20 rounded-lg px-4 py-3 focus:outline-none focus:border-[#C41C1C] focus:ring-1 focus:ring-[#C41C1C]/20 disabled:opacity-50 disabled:cursor-not-allowed bg-[#FAFAFA] placeholder:text-[#121212]/30 transition-colors"
            />
            <button
              type="submit"
              disabled={!input.trim() || isStreaming}
              className="shrink-0 bg-[#C41C1C] text-white font-sans font-medium text-sm px-5 py-3 rounded-lg hover:bg-[#a01515] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {isStreaming ? (
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Pensando
                </span>
              ) : (
                'Preguntar'
              )}
            </button>
          </form>

          {/* Disclaimer */}
          <p className="font-sans text-[10px] text-[#121212]/30 mt-2 text-center">
            El Observatorio es una guía de orientación profesional, no asesoría legal, financiera ni médica.
          </p>
        </div>
      </div>
    </div>
  )
}
