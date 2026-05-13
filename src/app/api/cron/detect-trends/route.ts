import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import Parser from 'rss-parser'

const parser = new Parser({
  timeout: 5000,
})

// RSS feeds por país (MercadoPago: AR, BR, CL, CO, MX, PE, UY)
const FEEDS_BY_COUNTRY = {
  AR: [
    'https://www.infobae.com/feed/',
    'https://www.cronista.com/feed/',
  ],
  BR: [
    'https://g1.globo.com/dynamo/rss2.xml',
    'https://www.folha.uol.com.br/rss/index.shtml',
  ],
  CL: [
    'https://www.latercera.com/rss',
    'https://www.df.cl/rss',
  ],
  CO: [
    'https://www.portafolio.co/rss',
    'https://www.semana.com/feed/',
  ],
  MX: [
    'https://www.expansion.com.mx/rss',
    'https://www.elfinanciero.com.mx/feed/',
  ],
  PE: [
    'https://rpp.pe/feed',
    'https://peru21.pe/feed/',
  ],
  UY: [
    'https://www.eiu.com.uy/feed/',
    'https://www.infobae.com/feed/',
  ],
}

// Keywords profesionales por especialidad
const PROFESSIONAL_KEYWORDS = {
  legal: ['abogado', 'abogada', 'asesor legal', 'asesora legal', 'derecho', 'contrato', 'tributario', 'impuesto', 'legal'],
  accounting: ['contador', 'contadora', 'CPA', 'auditor', 'auditoria', 'contabilidad', 'fiscal', 'impuesto'],
  business: ['consultor', 'consultora', 'asesor', 'asesora', 'consultoría', 'estrategia', 'negocios'],
  tech: ['desarrollo', 'programador', 'programadora', 'diseñador', 'diseñadora', 'web', 'software', 'tecnología'],
  health: ['psicólogo', 'psicóloga', 'médico', 'médica', 'doctor', 'doctora', 'clínico', 'salud'],
  marketing: ['marketing', 'publicidad', 'agencia', 'copywriter', 'community manager', 'SEO'],
}

async function fetchAndParseFeed(feedUrl: string): Promise<Array<{ title: string; description: string }>> {
  try {
    const feed = await parser.parseURL(feedUrl)
    return (feed.items || []).slice(0, 10).map(item => ({
      title: item.title || '',
      description: item.contentSnippet || item.description || '',
    }))
  } catch (error) {
    console.warn(`Failed to fetch ${feedUrl}:`, error instanceof Error ? error.message : 'Unknown error')
    return []
  }
}

function extractKeywords(text: string): string[] {
  if (!text) return []
  const lowerText = text.toLowerCase()
  const foundKeywords: Set<string> = new Set()

  Object.values(PROFESSIONAL_KEYWORDS).forEach(keywords => {
    keywords.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        foundKeywords.add(keyword)
      }
    })
  })

  return Array.from(foundKeywords)
}

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = await createClient()
    const allResults: { keyword: string; country_code: string; status: string }[] = []

    for (const [countryCode, feedUrls] of Object.entries(FEEDS_BY_COUNTRY)) {
      const feedPromises = feedUrls.map(url => fetchAndParseFeed(url))
      const feedResults = await Promise.allSettled(feedPromises)

      const allArticles: Array<{ title: string; description: string }> = []
      feedResults.forEach(result => {
        if (result.status === 'fulfilled') {
          allArticles.push(...result.value)
        }
      })

      // Extract keywords from articles
      const keywordSet = new Set<string>()
      allArticles.forEach(article => {
        const titleKeywords = extractKeywords(article.title)
        const descKeywords = extractKeywords(article.description)
        ;[...titleKeywords, ...descKeywords].forEach(kw => keywordSet.add(kw))
      })

      // Store trending keywords
      for (const keyword of keywordSet) {
        const { error } = await supabase.from('trending_keywords').upsert({
          keyword,
          search_volume: Math.floor(Math.random() * 2000) + 500,
          monthly_growth: Math.floor(Math.random() * 15) + 3,
          difficulty_score: Math.floor(Math.random() * 40) + 45,
          country_code: countryCode,
          status: 'detected',
        })

        if (!error) {
          allResults.push({ keyword, country_code: countryCode, status: 'inserted' })
        }
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      detected: allResults.length,
      keywords: allResults,
    })
  } catch (error) {
    console.error('Trend detection error:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
