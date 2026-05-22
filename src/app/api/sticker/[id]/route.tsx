import { ImageResponse } from 'next/og'

export const runtime = 'edge'

type Sticker = {
  emoji: string
  text: string
  bg: string
  textColor: string
  emojiSize?: number
  textSize?: number
}

const STICKERS: Record<string, Sticker> = {
  gol: { emoji: '⚽', text: 'GOOOOL', bg: '#C41C1C', textColor: '#FFFFFF', emojiSize: 220 },
  campeon: { emoji: '🏆', text: 'CAMPEÓN', bg: '#0A0A0A', textColor: '#FFD700', emojiSize: 240 },
  vamos: { emoji: '🔥', text: 'VAMOS!', bg: '#FF6B00', textColor: '#FFFFFF', emojiSize: 220 },
  llora: { emoji: '😭', text: 'LLORO', bg: '#1C3FC4', textColor: '#FFFFFF', emojiSize: 240 },
  penal: { emoji: '🥅', text: 'PENAL', bg: '#000000', textColor: '#C41C1C', emojiSize: 240 },
  tarjeta: { emoji: '🟥', text: 'AFUERA', bg: '#C41C1C', textColor: '#FFFFFF', emojiSize: 220 },
  silbato: { emoji: '🦓', text: 'VAR', bg: '#FFD700', textColor: '#000000', emojiSize: 220 },
  fiesta: { emoji: '🎉', text: 'COPA', bg: '#0A0A0A', textColor: '#FFFFFF', emojiSize: 240 },
  asado: { emoji: '🥩', text: 'ASADO', bg: '#8B4513', textColor: '#FFFFFF', emojiSize: 220 },
  mate: { emoji: '🧉', text: 'CON MATE', bg: '#1B5E20', textColor: '#FFFFFF', emojiSize: 220, textSize: 60 },
  cancha: { emoji: '🏟️', text: 'A LA CANCHA', bg: '#0A0A0A', textColor: '#C41C1C', emojiSize: 220, textSize: 56 },
  hincha: { emoji: '📣', text: 'HINCHADA', bg: '#C41C1C', textColor: '#FFFFFF', emojiSize: 220, textSize: 60 },
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const s = STICKERS[id] ?? STICKERS.gol

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: s.bg,
          padding: 30,
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        <span
          style={{
            fontSize: s.emojiSize ?? 220,
            lineHeight: 1,
            marginBottom: 16,
          }}
        >
          {s.emoji}
        </span>
        <span
          style={{
            fontSize: s.textSize ?? 78,
            fontWeight: 900,
            color: s.textColor,
            letterSpacing: '-0.04em',
            textAlign: 'center',
            lineHeight: 1,
          }}
        >
          {s.text}
        </span>
        <span
          style={{
            position: 'absolute',
            bottom: 14,
            fontSize: 18,
            color: s.textColor,
            opacity: 0.6,
            letterSpacing: '0.15em',
            fontWeight: 700,
          }}
        >
          NEBBULER · MUNDIAL 2026
        </span>
      </div>
    ),
    { width: 512, height: 512 },
  )
}
