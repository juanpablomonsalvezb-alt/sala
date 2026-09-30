import { NextRequest, NextResponse } from 'next/server';
import { buildPrompt, parseAIResponse } from '@/lib/content-pipeline/prompt';
import { ContentRequest, ContentPipelineResponse, GeneratedContent } from '@/lib/content-pipeline/types';

async function callAI(prompt: string): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are an expert content strategist and copywriter.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 3000,
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    throw new Error(`AI API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || '';
}

function generateId(): string {
  return `content_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export async function POST(request: NextRequest): Promise<NextResponse<ContentPipelineResponse>> {
  try {
    const body: ContentRequest = await request.json();

    const requiredFields: (keyof ContentRequest)[] = ['topic', 'targetAudience', 'tone', 'format', 'length'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    const prompt = buildPrompt(body);
    const aiResponse = await callAI(prompt);
    const parsed = parseAIResponse(aiResponse);

    if (!parsed.title || !parsed.body) {
      return NextResponse.json(
        { success: false, error: 'Failed to parse AI response' },
        { status: 500 }
      );
    }

    const content: GeneratedContent = {
      id: generateId(),
      title: parsed.title,
      body: parsed.body,
      metaDescription: parsed.metaDescription,
      hashtags: parsed.hashtags,
      wordCount: parsed.wordCount || parsed.body.split(/\s+/).length,
      readingTime: parsed.readingTime || Math.ceil(parsed.body.split(/\s+/).length / 200),
      seoScore: parsed.seoScore || 75,
      createdAt: new Date(),
    };

    return NextResponse.json({ success: true, data: content });
  } catch (error) {
    console.error('Content generation error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Generation failed' },
      { status: 500 }
    );
  }
}