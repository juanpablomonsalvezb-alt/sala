import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  // Security: validate CRON_SECRET
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = await createClient()

    // Mock trending keywords (in production: use Google Trends API)
    const mockTrendingKeywords = [
      { keyword: 'abogado tributario', search_volume: 2100, monthly_growth: 12.5, difficulty: 65 },
      { keyword: 'consultor marketing digital', search_volume: 1850, monthly_growth: 8.3, difficulty: 72 },
      { keyword: 'diseñador web freelance', search_volume: 1640, monthly_growth: 5.7, difficulty: 58 },
      { keyword: 'contador CPA', search_volume: 980, monthly_growth: 3.2, difficulty: 48 },
      { keyword: 'psicólogo clínico', search_volume: 1520, monthly_growth: 6.8, difficulty: 62 },
    ]

    const results: { keyword: string; status: string }[] = []
    for (const kw of mockTrendingKeywords) {
      const { error } = await supabase.from('trending_keywords').upsert({
        keyword: kw.keyword,
        search_volume: kw.search_volume,
        monthly_growth: kw.monthly_growth,
        difficulty_score: kw.difficulty,
        country_code: 'CL',
        status: 'detected',
      })

      if (!error) {
        results.push({ keyword: kw.keyword, status: 'inserted' })
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      detected: results.length,
      keywords: results,
    })
  } catch (error) {
    console.error('Trend detection error:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
