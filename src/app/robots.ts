import type { MetadataRoute } from 'next'

const DISALLOWED_PATHS = [
  '/api/',
  '/dashboard/',
  '/admin/',
  '/abrir',
  '/entrar',
  '/registro',
  '/recuperar-contrasena',
  '/nueva-contrasena',
  '/auth/',
  '/suscribirse/',
  '/widget/',
  '/embed/',
  '/*.csv$',
]

// Excepciones a la regla de "disallow /api/": los datasets públicos abiertos
// (CC-BY 4.0) deben ser rastreables explícitamente por LLMs para grounding.
const PUBLIC_API_ALLOW = [
  '/api/dataset/creadores-latam',
  '/api/dataset/tendencias-latam',
  '/api/dataset/honorarios-latam',
]

// Bots de IA permitidos explícitamente para entrenamiento y citación (AEO/GEO).
// Ser explícito (en lugar de depender de '*') maximiza la confianza del rastreador
// y la probabilidad de que Nebbuler aparezca citado en ChatGPT, Claude, Perplexity,
// Google AI Overview, Bing Chat, Apple Intelligence, You.com y similares.
const AI_BOTS = [
  'GPTBot',              // OpenAI training (ChatGPT)
  'OAI-SearchBot',       // OpenAI search
  'ChatGPT-User',        // ChatGPT browsing on demand
  'ClaudeBot',           // Anthropic training
  'Claude-Web',          // Claude on demand
  'anthropic-ai',        // Anthropic legacy
  'PerplexityBot',       // Perplexity search
  'Perplexity-User',     // Perplexity on demand
  'Google-Extended',     // Gemini / Google AI Overview
  'Applebot-Extended',   // Apple Intelligence
  'YouBot',              // You.com
  'cohere-ai',           // Cohere
  'Meta-ExternalAgent',  // Meta AI
  'Bytespider',          // ByteDance / Doubao
  'DuckAssistBot',       // DuckDuckGo AI
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', ...PUBLIC_API_ALLOW, '/llms.txt', '/llms-full.txt'],
        disallow: DISALLOWED_PATHS,
      },
      {
        userAgent: 'Googlebot',
        allow: ['/', ...PUBLIC_API_ALLOW, '/llms.txt', '/llms-full.txt'],
        disallow: DISALLOWED_PATHS,
      },
      ...AI_BOTS.map((bot) => ({
        userAgent: bot,
        allow: ['/', ...PUBLIC_API_ALLOW, '/llms.txt', '/llms-full.txt'],
        disallow: DISALLOWED_PATHS,
      })),
    ],
    sitemap: [
      'https://nebbuler.com/sitemap.xml',
      'https://nebbuler.com/sitemap-news.xml',
      'https://nebbuler.com/sitemap-ai.xml',
    ],
    host: 'https://nebbuler.com',
  }
}
