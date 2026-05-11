import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

const INDEXNOW_KEY = process.env.INDEXNOW_KEY ?? ''
const INDEXNOW_ENGINES = [
  'https://api.indexnow.org/indexnow',
  'https://www.bing.com/indexnow',
]

export async function POST(request: NextRequest) {
  // Verificar que viene del servidor interno (no exponer públicamente)
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { urls } = await request.json()
  if (!Array.isArray(urls) || urls.length === 0) {
    return NextResponse.json({ error: 'urls required' }, { status: 400 })
  }

  // Filtrar solo URLs de nebbuler.com
  const safeUrls = urls.filter((u: string) =>
    typeof u === 'string' && u.startsWith('https://nebbuler.com/')
  )

  if (!INDEXNOW_KEY || INDEXNOW_KEY.includes('REEMPLAZAR')) {
    return NextResponse.json({ ok: false, reason: 'INDEXNOW_KEY not configured' })
  }

  const payload = {
    host: 'nebbuler.com',
    key: INDEXNOW_KEY,
    keyLocation: `https://nebbuler.com/${INDEXNOW_KEY}.txt`,
    urlList: safeUrls,
  }

  const results = await Promise.allSettled(
    INDEXNOW_ENGINES.map(engine =>
      fetch(engine, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).then(r => ({ engine, status: r.status }))
    )
  )

  return NextResponse.json({
    ok: true,
    submitted: safeUrls.length,
    results: results.map(r => r.status === 'fulfilled' ? r.value : 'error'),
  })
}
