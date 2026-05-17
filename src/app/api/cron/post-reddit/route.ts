import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const maxDuration = 60

// ---------------------------------------------------------------------------
// Templates por subreddit
// ---------------------------------------------------------------------------
const TEMPLATES: Record<string, { title: string; text: string; subreddit: string }> = {
  chile: {
    subreddit: 'chile',
    title: '¿Alguien ha intentado monetizar sus análisis profesionales? Encontré algo interesante',
    text: `Llevo tiempo preguntándome por qué los profesionales en Chile regalamos nuestro criterio. Un economista conocido mío lleva 8 meses con una newsletter de pago sobre análisis macro. Tiene más de 200 suscriptores pagando ~$19.990 al mes. Son casi $4M recurrentes, sin dejar su trabajo. La plataforma que usa es nebbuler.com, que cobra 0% de comisión (a diferencia de Substack que cobra 10%). ¿Alguien en este sub lo ha intentado? ¿Hay demanda real para esto en Chile?`,
  },
  colombia: {
    subreddit: 'colombia',
    title: 'Los profesionales colombianos cobramos por hora pero regalamos lo más valioso que tenemos',
    text: `Llevo años en consultoría y hay algo que me molesta: nuestro criterio se regala constantemente. En grupos de WhatsApp, en LinkedIn, en reuniones de networking. Gratis. Vi que un abogado en Bogotá tiene una newsletter de análisis tributario con 300+ suscriptores a $150.000 COP/mes. Son $45M mensuales recurrentes sin ampliar el estudio. La plataforma es nebbuler.com, nativa LATAM, 0% comisión. ¿Alguien en r/colombia ha explorado esto?`,
  },
  mexico: {
    subreddit: 'mexico',
    title: 'Los consultores mexicanos regalamos nuestro expertise en redes — ¿alguien más nota esto?',
    text: `Soy consultor financiero. El mes pasado publiqué análisis que ayudó a ~3,000 personas a tomar decisiones. Cobré $0 por ese contenido. Vi el caso de alguien en CDMX con newsletter de finanzas personales, 180 suscriptores a $550 MXN/mes — son $99,000 pesos mensuales recurrentes. La plataforma que usa es nebbuler.com (0% comisión, pagos en pesos). ¿Alguien ha intentado algo similar? ¿Hay mercado real en México para esto?`,
  },
  argentina: {
    subreddit: 'argentina',
    title: 'Con el cepo y la inflación — ¿los profesionales argentinos están monetizando sus análisis?',
    text: `Contexto económico argentino aparte, hay algo curioso: el mercado de análisis económico en pesos es enorme ahora. Todo el mundo quiere entender qué está pasando. Un economista que conozco tiene 250 suscriptores pagando por su análisis mensual usando nebbuler.com. 0% comisión, sin complicaciones con dólares. ¿Alguien en r/argentina está en esto o conoce casos similares?`,
  },
  Entrepreneur: {
    subreddit: 'Entrepreneur',
    title: 'Newsletter de pago for LATAM professionals — a gap in the market nobody is filling',
    text: `Been looking at the creator economy in Latin America. Substack has 3M+ paying subscribers, almost all English. The Spanish-language professional content market is virtually empty. Economists, lawyers, doctors in Chile/Colombia/Mexico are giving away analysis that people clearly want to pay for. Nebbuler.com is building the infrastructure for this (0% commission, local currency payments via MercadoPago). Has anyone here built a professional newsletter business in LATAM? What was the hardest part?`,
  },
}

const ROTATION: string[] = ['chile', 'colombia', 'mexico', 'argentina', 'Entrepreneur', 'chile', 'colombia']
const COOLDOWN_HOURS = 48

// ---------------------------------------------------------------------------
// Reddit API interna (sin app registration — usa la misma API del sitio web)
// ---------------------------------------------------------------------------
async function redditLogin(username: string, password: string): Promise<{ cookie: string; modhash: string } | null> {
  const res = await fetch('https://www.reddit.com/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      'Origin': 'https://www.reddit.com',
      'Referer': 'https://www.reddit.com/login',
    },
    body: new URLSearchParams({
      user: username,
      passwd: password,
      api_type: 'json',
    }).toString(),
  })

  if (!res.ok) return null

  const data = await res.json() as { json?: { errors?: string[][]; data?: { modhash?: string } } }
  const errors = data?.json?.errors ?? []
  if (errors.length > 0) {
    console.error('[post-reddit] Login error:', errors)
    return null
  }

  const modhash = data?.json?.data?.modhash ?? ''
  const setCookie = res.headers.get('set-cookie') ?? ''
  // Extraer reddit_session cookie
  const cookie = setCookie
    .split(',')
    .map((c: string) => c.trim().split(';')[0])
    .filter((c: string) => c.startsWith('reddit_session') || c.startsWith('token_v2'))
    .join('; ')

  if (!cookie && !modhash) return null
  return { cookie, modhash }
}

async function redditSubmit(opts: {
  cookie: string
  modhash: string
  subreddit: string
  title: string
  text: string
}): Promise<{ ok: boolean; postId?: string; error?: string }> {
  const res = await fetch('https://www.reddit.com/api/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      'Origin': 'https://www.reddit.com',
      'Referer': `https://www.reddit.com/r/${opts.subreddit}/submit`,
      'Cookie': opts.cookie,
      'X-Modhash': opts.modhash,
    },
    body: new URLSearchParams({
      api_type: 'json',
      kind: 'self',
      sr: opts.subreddit,
      title: opts.title,
      text: opts.text,
      resubmit: 'true',
      sendreplies: 'true',
      uh: opts.modhash,
    }).toString(),
  })

  const data = await res.json() as { json?: { errors?: string[][]; data?: { id?: string; url?: string } } }
  const errors = data?.json?.errors ?? []
  if (errors.length > 0) {
    return { ok: false, error: errors.map((e: string[]) => e.join(': ')).join(' | ') }
  }

  const postId = data?.json?.data?.id ?? 'unknown'
  return { ok: true, postId }
}

// ---------------------------------------------------------------------------
// Helpers Supabase
// ---------------------------------------------------------------------------
function adminClient() {
  return createServiceClient()
}

async function wasPostedRecently(subreddit: string): Promise<boolean> {
  const supabase = adminClient()
  const cutoff = new Date(Date.now() - COOLDOWN_HOURS * 60 * 60 * 1000).toISOString()
  const { data } = await supabase
    .from('social_posted_content')
    .select('id')
    .eq('platform', 'reddit')
    .ilike('text', `%${subreddit}%`)
    .gte('posted_at', cutoff)
    .limit(1)
  return (data?.length ?? 0) > 0
}

async function saveResult(subreddit: string, title: string, success: boolean, errorMsg?: string) {
  const supabase = adminClient()
  await supabase.from('social_posted_content').insert({
    platform: 'reddit',
    text: `[${subreddit}] ${title}`,
    image_url: null,
    posted_at: new Date().toISOString(),
    success,
    error_message: errorMsg ?? null,
  })
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------
export async function GET(req: Request) {
  const authHeader = req.headers.get('Authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  if (!process.env.REDDIT_USERNAME || !process.env.REDDIT_PASSWORD) {
    return NextResponse.json({
      ok: false,
      skipped: true,
      reason: 'Reddit credentials not configured. Set REDDIT_USERNAME and REDDIT_PASSWORD in Vercel env vars.',
    })
  }

  const dayOfWeek = new Date().getDay()
  const subredditKey = ROTATION[dayOfWeek]
  const template = TEMPLATES[subredditKey]

  const alreadyPosted = await wasPostedRecently(subredditKey)
  if (alreadyPosted) {
    return NextResponse.json({
      ok: true,
      skipped: true,
      reason: `Ya se posteó en r/${subredditKey} en las últimas ${COOLDOWN_HOURS}h.`,
      subreddit: subredditKey,
    })
  }

  try {
    const session = await redditLogin(process.env.REDDIT_USERNAME, process.env.REDDIT_PASSWORD)
    if (!session) {
      const msg = 'Login fallido — credenciales incorrectas o cuenta bloqueada'
      await saveResult(subredditKey, template.title, false, msg)
      return NextResponse.json({ ok: false, error: msg }, { status: 500 })
    }

    const result = await redditSubmit({
      cookie: session.cookie,
      modhash: session.modhash,
      subreddit: template.subreddit,
      title: template.title,
      text: template.text,
    })

    await saveResult(subredditKey, template.title, result.ok, result.error)

    return NextResponse.json({
      ok: result.ok,
      subreddit: template.subreddit,
      postId: result.postId,
      error: result.error,
      postedAt: new Date().toISOString(),
    }, { status: result.ok ? 200 : 500 })

  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[post-reddit] Error:', msg)
    await saveResult(subredditKey, template.title, false, msg)
    return NextResponse.json({ ok: false, error: msg }, { status: 500 })
  }
}
