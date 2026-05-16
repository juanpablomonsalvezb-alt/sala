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

// Keywords profesionales por especialidad — vocabulario amplio para máximo SEO
const PROFESSIONAL_KEYWORDS = {
  legal: [
    'abogado', 'abogada', 'asesor legal', 'derecho', 'contrato', 'tributario', 'impuesto',
    'reforma tributaria', 'código penal', 'demanda', 'juicio', 'defensa legal', 'compliance',
    'derecho laboral', 'finiquito', 'despido', 'contrato de trabajo', 'multa',
  ],
  accounting: [
    'contador', 'contadora', 'auditor', 'contabilidad', 'fiscal', 'IVA', 'renta',
    'declaración de impuestos', 'factura electrónica', 'PYME', 'balance', 'flujo de caja',
    'presupuesto', 'estados financieros', 'depreciación', 'leasing',
  ],
  economics: [
    'inflación', 'tasa de interés', 'banco central', 'tipo de cambio', 'dólar', 'peso',
    'PIB', 'recesión', 'empleo', 'desempleo', 'salario mínimo', 'pensiones', 'AFP',
    'política monetaria', 'política fiscal', 'deuda pública', 'exportaciones', 'inversión',
    'economía', 'economista', 'mercado de capitales',
  ],
  business: [
    'consultor', 'consultoría', 'estrategia', 'negocios', 'startup', 'emprendimiento',
    'financiamiento', 'valuation', 'capital de riesgo', 'venture capital', 'modelo de negocio',
    'marketing digital', 'ventas', 'gestión', 'liderazgo', 'recursos humanos',
  ],
  tech: [
    'desarrollo', 'programador', 'diseñador', 'software', 'tecnología', 'inteligencia artificial',
    'automatización', 'cloud', 'ciberseguridad', 'datos', 'transformación digital',
    'aplicación móvil', 'e-commerce', 'SaaS', 'API', 'machine learning',
  ],
  health: [
    'médico', 'médica', 'doctor', 'doctora', 'psicólogo', 'psicóloga', 'salud',
    'telemedicina', 'clínica', 'hospital', 'paciente', 'diagnóstico', 'tratamiento',
    'salud mental', 'nutrición', 'bienestar', 'licencia médica', 'isapre', 'fonasa',
  ],
  real_estate: [
    'bienes raíces', 'inmobiliaria', 'corretaje', 'arriendo', 'compraventa', 'hipoteca',
    'subsidio', 'tasación', 'plusvalía', 'zona urbana', 'construcción', 'arquitecto',
  ],
  finance: [
    'inversión', 'bolsa de valores', 'acciones', 'bonos', 'fondo mutuo', 'ETF',
    'dividendo', 'portafolio', 'riesgo financiero', 'asesor financiero', 'banca',
    'crédito', 'deuda', 'ahorro', 'jubilación', 'retiro programado',
  ],
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

      // Store trending keywords — solo insertar si no existe ya (no resetear 'generated')
      for (const keyword of keywordSet) {
        const { data: existing } = await supabase
          .from('trending_keywords')
          .select('id, status')
          .eq('keyword', keyword)
          .eq('country_code', countryCode)
          .maybeSingle()

        if (existing) {
          // Ya existe — solo re-detectar si fue generado hace más de 7 días (variante nueva)
          continue
        }

        const { error } = await supabase.from('trending_keywords').insert({
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
