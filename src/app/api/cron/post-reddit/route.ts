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
    title: 'Los consultores mexicanos regalan su expertise en redes — ¿alguien más nota esto?',
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

// Orden de rotación por día de la semana (0=domingo … 6=sábado)
const ROTATION: string[] = ['chile', 'colombia', 'mexico', 'argentina', 'Entrepreneur', 'chile', 'colombia']

const COOLDOWN_HOURS = 48

// ---------------------------------------------------------------------------
// Helper admin Supabase (mismo patrón que post-content)
// ---------------------------------------------------------------------------
function adminClient() {
  return createServiceClient()
}

// ---------------------------------------------------------------------------
// Verificar si ya se posteó en ese subreddit en las últimas 48 h
// ---------------------------------------------------------------------------
async function wasPostedRecently(subreddit: string): Promise<boolean> {
  const supabase = adminClient()
  const cutoff = new Date(Date.now() - COOLDOWN_HOURS * 60 * 60 * 1000).toISOString()
  const { data, error } = await supabase
    .from('social_posted_content')
    .select('id')
    .eq('platform', 'reddit')
    .ilike('text', `%${subreddit}%`) // guardamos el subreddit en el campo text como prefijo
    .gte('posted_at', cutoff)
    .limit(1)

  if (error) {
    console.error('[post-reddit] Error consultando historial:', error)
    return false
  }
  return (data?.length ?? 0) > 0
}

// ---------------------------------------------------------------------------
// Guardar resultado en Supabase
// ---------------------------------------------------------------------------
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
  // Auth: Vercel Cron envía el header Authorization automáticamente
  const authHeader = req.headers.get('Authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  // Early return si no hay credenciales de Reddit
  if (
    !process.env.REDDIT_CLIENT_ID ||
    !process.env.REDDIT_CLIENT_SECRET ||
    !process.env.REDDIT_USERNAME ||
    !process.env.REDDIT_PASSWORD
  ) {
    return NextResponse.json({
      ok: false,
      skipped: true,
      reason: 'Reddit credentials not configured. Set REDDIT_CLIENT_ID, REDDIT_CLIENT_SECRET, REDDIT_USERNAME and REDDIT_PASSWORD in Vercel env vars.',
    })
  }

  // Seleccionar subreddit por día de la semana
  const dayOfWeek = new Date().getDay() // 0-6
  const subredditKey = ROTATION[dayOfWeek]
  const template = TEMPLATES[subredditKey]

  // Verificar cooldown de 48h
  const alreadyPosted = await wasPostedRecently(subredditKey)
  if (alreadyPosted) {
    return NextResponse.json({
      ok: true,
      skipped: true,
      reason: `Ya se posteó en r/${subredditKey} en las últimas ${COOLDOWN_HOURS}h. Cooldown activo.`,
      subreddit: subredditKey,
    })
  }

  // Publicar en Reddit usando snoowrap (import dinámico para compatibilidad ESM/CJS)
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Snoowrap = require('snoowrap')
    const r = new Snoowrap({
      userAgent: 'nebbuler-bot/1.0 by nebbuler',
      clientId: process.env.REDDIT_CLIENT_ID,
      clientSecret: process.env.REDDIT_CLIENT_SECRET,
      username: process.env.REDDIT_USERNAME,
      password: process.env.REDDIT_PASSWORD,
    })

    // Publicar post de texto (selfpost)
    const submission = await r.getSubreddit(template.subreddit).submitSelfpost({
      title: template.title,
      text: template.text,
    })

    const postId = (submission as unknown as { id: string }).id ?? 'unknown'

    await saveResult(subredditKey, template.title, true)

    return NextResponse.json({
      ok: true,
      subreddit: template.subreddit,
      postId,
      title: template.title,
      postedAt: new Date().toISOString(),
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[post-reddit] Error al publicar:', msg)
    await saveResult(subredditKey, template.title, false, msg)

    return NextResponse.json(
      { ok: false, subreddit: subredditKey, error: msg },
      { status: 500 }
    )
  }
}
