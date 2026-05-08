import React from 'react'

// ─── Parser de markdown simple ────────────────────────────────────────────────
// Sin dependencias externas. Soporta:
//   **bold**, *italic*, > citas, ## subtítulos, [texto](url), párrafos

interface MarkdownProps {
  content: string
  className?: string
}

// Tokeniza inline: **bold**, *italic*, [texto](url)
function parseInline(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = []
  // Regex que captura los 3 patrones inline en orden de precedencia
  const pattern = /(\*\*(.+?)\*\*|\*(.+?)\*|\[([^\]]+)\]\(([^)]+)\))/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = pattern.exec(text)) !== null) {
    // Texto plano antes del match
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index))
    }

    if (match[0].startsWith('**')) {
      // Bold
      nodes.push(
        <strong key={match.index} className="font-semibold text-[#121212]">
          {match[2]}
        </strong>
      )
    } else if (match[0].startsWith('*')) {
      // Italic
      nodes.push(
        <em key={match.index} className="italic">
          {match[3]}
        </em>
      )
    } else if (match[0].startsWith('[')) {
      // Link
      nodes.push(
        <a
          key={match.index}
          href={match[5]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#CC0000] underline underline-offset-2 hover:opacity-75 transition-opacity"
        >
          {match[4]}
        </a>
      )
    }

    lastIndex = match.index + match[0].length
  }

  // Resto de texto plano
  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex))
  }

  return nodes
}

// Parsea líneas en bloques
function parseBlocks(content: string): React.ReactNode[] {
  const lines = content.split('\n')
  const blocks: React.ReactNode[] = []
  let paragraphBuffer: string[] = []
  let key = 0

  const flushParagraph = () => {
    if (paragraphBuffer.length === 0) return
    const text = paragraphBuffer.join(' ').trim()
    if (text) {
      blocks.push(
        <p
          key={key++}
          className="mb-5 leading-[1.8] text-[#3a3a3a] text-[17px] font-['Inter',_sans-serif]"
          style={{ fontFamily: 'var(--font-inter, Inter, sans-serif)' }}
        >
          {parseInline(text)}
        </p>
      )
    }
    paragraphBuffer = []
  }

  for (const rawLine of lines) {
    const line = rawLine

    // Subtítulo ## o ###
    if (line.startsWith('### ')) {
      flushParagraph()
      blocks.push(
        <h3
          key={key++}
          className="mt-8 mb-3 text-[19px] font-bold leading-snug text-[#121212]"
          style={{ fontFamily: 'var(--font-playfair, Playfair Display, serif)' }}
        >
          {parseInline(line.slice(4))}
        </h3>
      )
      continue
    }

    if (line.startsWith('## ')) {
      flushParagraph()
      blocks.push(
        <h2
          key={key++}
          className="mt-10 mb-4 text-[24px] font-bold leading-tight text-[#121212]"
          style={{ fontFamily: 'var(--font-playfair, Playfair Display, serif)' }}
        >
          {parseInline(line.slice(3))}
        </h2>
      )
      continue
    }

    if (line.startsWith('# ')) {
      flushParagraph()
      blocks.push(
        <h1
          key={key++}
          className="mt-10 mb-4 text-[30px] font-bold leading-tight text-[#121212]"
          style={{ fontFamily: 'var(--font-playfair, Playfair Display, serif)' }}
        >
          {parseInline(line.slice(2))}
        </h1>
      )
      continue
    }

    // Cita > — estilo NYT con borde rojo izquierdo
    if (line.startsWith('> ')) {
      flushParagraph()
      blocks.push(
        <blockquote
          key={key++}
          className="my-8 pl-5 border-l-[3px] border-[#CC0000] italic text-[#555] text-[18px] leading-relaxed"
          style={{ fontFamily: 'var(--font-playfair, Playfair Display, serif)' }}
        >
          {parseInline(line.slice(2))}
        </blockquote>
      )
      continue
    }

    // Línea vacía → cierra párrafo
    if (line.trim() === '') {
      flushParagraph()
      continue
    }

    // Acumular en párrafo
    paragraphBuffer.push(line)
  }

  flushParagraph()

  return blocks
}

export function Markdown({ content, className = '' }: MarkdownProps) {
  const blocks = parseBlocks(content)

  return (
    <div className={`prose-sala max-w-none ${className}`}>
      {blocks}
    </div>
  )
}
