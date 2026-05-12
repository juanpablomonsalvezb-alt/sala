import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createServiceClient } from '@/lib/supabase/server'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { postId } = await request.json()

    if (!postId) {
      return NextResponse.json(
        { error: 'postId is required' },
        { status: 400 }
      )
    }

    const supabase = createServiceClient()

    const { data: post } = await supabase
      .from('sala_posts')
      .select('*')
      .eq('id', postId)
      .single()

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    const prompt = `Extrae las 5 citas más destacables de este texto.
Deben ser frases completas, impactantes y autónomas (que se entiendan sin contexto).
Máximo 150 caracteres cada una.

TEXTO:
${post.content}

Responde SOLO con un JSON array, sin explicación adicional:
[
  "cita 1",
  "cita 2",
  ...
]`

    const message = await client.messages.create({
      model: 'claude-opus-4-7',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    const responseText = message.content[0].type === 'text' ? message.content[0].text : ''
    let quotes: string[] = []

    try {
      quotes = JSON.parse(responseText)
    } catch {
      return NextResponse.json(
        { error: 'Failed to parse quotes' },
        { status: 500 }
      )
    }

    const insertQuotes = quotes.map((text, index) => ({
      post_id: postId,
      text,
      position: index,
    }))

    const { data, error } = await supabase
      .from('sala_post_quotes')
      .insert(insertQuotes)
      .select()

    if (error) {
      console.error('DB insert error:', error)
      return NextResponse.json(
        { error: 'Failed to save quotes' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      count: data?.length || 0,
      quotes: data,
    })
  } catch (error) {
    console.error('Quote extraction error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
