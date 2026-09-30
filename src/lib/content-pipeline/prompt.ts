import { ContentRequest } from './types';

const SYSTEM_PROMPT = `You are an expert content strategist and copywriter. Create high-quality, engaging content that ranks well and converts readers. Follow SEO best practices, maintain the specified tone, and include clear CTAs when requested.`;

const FORMAT_INSTRUCTIONS: Record<string, string> = {
  article: `Write a comprehensive article with H2/H3 headings, bullet points, and actionable takeaways. Include meta description (150-160 chars). Target 1500-2500 words for long, 800-1200 for medium, 400-600 for short.`,
  'social-post': `Create an engaging social media post with hook, value, and CTA. Include 3-5 relevant hashtags. Optimize for the platform's character limits and best practices.`,
  email: `Write a compelling email with subject line, preheader, body, and clear CTA. Follow email marketing best practices. Keep it scannable with short paragraphs.`,
  linkedin: `Write a professional LinkedIn post with storytelling hook, insights, and engagement question. Use line breaks for readability. Include 3-5 hashtags.`,
  twitter: `Create a Twitter/X thread (3-7 tweets) or single tweet with hook, value, and CTA. Include 2-3 hashtags. Optimize for engagement.`,
};

const TONE_GUIDES: Record<string, string> = {
  professional: 'Authoritative, polished, industry-standard language. Avoid slang.',
  casual: 'Conversational, relatable, like talking to a friend. Use contractions.',
  expert: 'Deep technical knowledge, precise terminology, assumes audience literacy.',
  friendly: 'Warm, encouraging, accessible. Use "we" and "you" language.',
};

const LENGTH_GUIDES: Record<string, string> = {
  short: 'Concise, punchy, every word counts. Get to the point fast.',
  medium: 'Balanced depth and brevity. Cover key points without fluff.',
  long: 'Comprehensive, thorough, definitive resource. Include examples, data, frameworks.',
};

export function buildPrompt(request: ContentRequest): string {
  const formatInstruction = FORMAT_INSTRUCTIONS[request.format] || FORMAT_INSTRUCTIONS.article;
  const toneGuide = TONE_GUIDES[request.tone] || TONE_GUIDES.professional;
  const lengthGuide = LENGTH_GUIDES[request.length] || LENGTH_GUIDES.medium;

  const keywordSection = request.keywords?.length
    ? `\n**Keywords to naturally integrate:** ${request.keywords.join(', ')}`
    : '';

  const ctaSection = request.cta
    ? `\n**Call to Action:** ${request.cta}`
    : '';

  return `${SYSTEM_PROMPT}

**Task:** Create a ${request.format} about "${request.topic}" for ${request.targetAudience}.

**Format Requirements:** ${formatInstruction}

**Tone:** ${toneGuide}

**Length:** ${lengthGuide}${keywordSection}${ctaSection}

**Output Structure (JSON):**
{
  "title": "Compelling, SEO-optimized title",
  "body": "Full content with proper formatting",
  "metaDescription": "150-160 char meta description (for articles)",
  "hashtags": ["tag1", "tag2", "tag3"],
  "wordCount": 1234,
  "readingTime": 5,
  "seoScore": 85
}

Return ONLY valid JSON. No markdown, no explanations.`;
}

export function parseAIResponse(response: string): Partial<{
  title: string;
  body: string;
  metaDescription: string;
  hashtags: string[];
  wordCount: number;
  readingTime: number;
  seoScore: number;
}> {
  try {
    const cleaned = response.trim().replace(/^```json\n?|\n?```$/g, '');
    return JSON.parse(cleaned);
  } catch {
    return {};
  }
}