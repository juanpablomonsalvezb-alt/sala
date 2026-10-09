// Llamada simple a OpenAI chat completions, reutilizada por los crons de
// noticias/contenido. Mismo patrón que /api/content-pipeline/generate.

export async function openaiComplete(prompt: string, maxTokens: number): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: maxTokens,
    }),
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`OpenAI API error: ${response.status} ${body}`)
  }

  const data = await response.json()
  return (data.choices?.[0]?.message?.content ?? '').trim()
}
