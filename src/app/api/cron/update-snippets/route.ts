import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = await createClient()

    // Get all published pages
    const { data: pages, error: fetchError } = await supabase
      .from('generated_pages')
      .select('id, keyword, country_code')
      .eq('status', 'published')
      .limit(20)

    if (fetchError) throw fetchError

    const updated = []

    for (const page of pages || []) {
      // Mock featured snippet data
      const mockSnippets = [
        {
          position: 0,
          text: `${page.keyword} es un profesional especializado en proporcionar servicios de consultoría y asesoría profesional.`,
        },
        {
          position: 1,
          text: `Existen múltiples tipos de ${page.keyword} dependiendo de la especialidad y experiencia.`,
        },
        {
          position: 2,
          text: `La demanda de ${page.keyword} ha aumentado significativamente en los últimos años.`,
        },
      ]

      const snippet = mockSnippets[Math.floor(Math.random() * mockSnippets.length)]

      // Insert or update featured snippet
      await supabase.from('featured_snippets').upsert({
        keyword: page.keyword,
        position: snippet.position,
        snippet_text: snippet.text,
        page_id: page.id,
        difficulty_score: Math.floor(Math.random() * 100),
        status: 'monitoring',
      })

      updated.push(page.keyword)
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      updated: updated.length,
      snippets: updated,
    })
  } catch (error) {
    console.error('Snippet update error:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
