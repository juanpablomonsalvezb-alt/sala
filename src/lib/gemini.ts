// Llamada a Gemini, mismo patrón (rotación de keys) que
// /api/cron/generate-pages — reutilizado por los crons de noticias/contenido.

const GEMINI_KEYS = [
  process.env.GEMINI_API_KEY,
  process.env.GEMINI_API_KEY_2,
  process.env.GEMINI_API_KEY_3,
  process.env.GEMINI_API_KEY_4,
  process.env.GEMINI_API_KEY_5,
  process.env.GEMINI_API_KEY_6,
  process.env.GEMINI_API_KEY_7,
].filter(Boolean) as string[]

const GEMINI_MODEL = process.env.GEMINI_MODEL ?? 'gemini-2.5-flash'

export async function geminiComplete(prompt: string, maxOutputTokens: number, keyIndex = 0): Promise<string> {
  const key = GEMINI_KEYS[keyIndex % GEMINI_KEYS.length]
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${key}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens, temperature: 0.65, thinkingConfig: { thinkingBudget: 0 } },
      }),
    }
  )
  if (!res.ok) {
    const err = await res.text()
    if (res.status === 429 && keyIndex < GEMINI_KEYS.length - 1) {
      return geminiComplete(prompt, maxOutputTokens, keyIndex + 1)
    }
    throw new Error(`Gemini ${res.status}: ${err.slice(0, 200)}`)
  }
  const data = (await res.json()) as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> }
  const raw = data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
  return raw.replace(/^```html\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/, '').trim()
}
