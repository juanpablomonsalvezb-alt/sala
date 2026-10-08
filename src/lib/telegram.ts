// Envío de mensajes a Telegram para los crons de noticias y contenido.
// Requiere TELEGRAM_BOT_TOKEN y TELEGRAM_CHAT_ID en las env vars de Vercel.

const TELEGRAM_MAX_LENGTH = 4096

export async function sendTelegramMessage(text: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!token || !chatId) {
    throw new Error('TELEGRAM_BOT_TOKEN o TELEGRAM_CHAT_ID no configurados')
  }

  for (const chunk of splitForTelegram(text)) {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: chunk,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    })
    if (!res.ok) {
      const body = await res.text()
      throw new Error(`Telegram API error: ${res.status} ${body}`)
    }
  }
}

// Telegram corta mensajes en 4096 caracteres; partimos en párrafos para no
// cortar una noticia o post a la mitad.
function splitForTelegram(text: string): string[] {
  if (text.length <= TELEGRAM_MAX_LENGTH) return [text]

  const chunks: string[] = []
  let remaining = text
  while (remaining.length > TELEGRAM_MAX_LENGTH) {
    let cut = remaining.lastIndexOf('\n\n', TELEGRAM_MAX_LENGTH)
    if (cut <= 0) cut = TELEGRAM_MAX_LENGTH
    chunks.push(remaining.slice(0, cut).trim())
    remaining = remaining.slice(cut).trim()
  }
  if (remaining) chunks.push(remaining)
  return chunks
}
