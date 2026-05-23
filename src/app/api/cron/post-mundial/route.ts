import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { postOriginalTweet } from '@/lib/x-client'
import { publishLinkedInPost } from '@/lib/linkedin-client'
import { canPublish, incrementRateLimit } from '@/lib/social'
import { isAuthorizedCron } from '@/lib/cron-auth'

export const runtime = 'nodejs'
export const maxDuration = 60

const MUNDIAL_TEMPLATES = [
  `Faltan pocos días para el Mundial.

Hice algo que me habría gustado encontrar: un calendario con los 72 partidos que se agrega a tu Google Calendar o Apple Calendar con un solo clic.

Se ajusta automáticamente a tu zona horaria.

Filtra por selección. Sin app. Sin registro.

fifa2026.nebbuler.com/calendario`,

  `72 partidos. 12 grupos. 48 selecciones. Un solo clic.

Todos los horarios del Mundial 2026 en tu calendario personal. Se ajusta solo a tu zona horaria.

Google Calendar, Apple Calendar, Outlook.

Pásalo a quien siga el Mundial.

fifa2026.nebbuler.com/calendario`,

  `¿Ya sabes a qué hora juega tu selección?

Depende de tu ciudad. El mismo partido puede ser a las 10 AM o a las 2 PM.

Hicimos un calendario que detecta tu zona horaria y te muestra los 72 partidos en TU hora local.

Un clic. Gratis. Sin app.

fifa2026.nebbuler.com/calendario`,

  `El Mundial empieza el 11 de junio en 14 ciudades de 3 países.

72 partidos solo en fase de grupos. Cada uno a una hora distinta según dónde vivas.

Un calendario que descargas en un clic. Se sincroniza con Google Calendar, Apple Calendar u Outlook.

Filtra por selección. Horarios automáticos.

fifa2026.nebbuler.com/calendario`,

  `La herramienta que todo hincha necesita antes del 11 de junio:

Los 72 partidos del Mundial 2026 → directo a tu calendario.

Un botón. Tu zona horaria. Sin buscar horarios en 15 sitios distintos.

Compártelo con tu grupo de WhatsApp.

fifa2026.nebbuler.com/calendario`,

  `No es una app. No necesitas registrarte. No cuesta nada.

Es un calendario con todos los partidos del Mundial 2026 que se agrega a tu teléfono con un clic.

Los horarios se ajustan solos a tu zona horaria. Puedes filtrar por selección.

fifa2026.nebbuler.com/calendario`,

  `México, Argentina, Brasil, Chile, Colombia, Ecuador, Uruguay, Paraguay.

Cada selección tiene sus propios horarios según tu zona horaria.

Un clic y todos los partidos de tu equipo aparecen en Google Calendar o Apple Calendar.

Gratis. Sin app. Sin publicidad.

fifa2026.nebbuler.com/calendario`,

  `¿Cuántas pestañas vas a abrir buscando horarios del Mundial?

Solución: un calendario que descargás en un clic con los 72 partidos de la fase de grupos.

Detecta tu zona horaria automáticamente. Funciona en Google Calendar, Apple Calendar y Outlook.

Podés filtrar solo los partidos de tu selección.

fifa2026.nebbuler.com/calendario`,
]

function adminClient() {
  const key = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key)
}

export async function GET(req: Request) {
  if (!isAuthorizedCron(req)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const now = new Date()
  if (now > new Date('2026-07-05T00:00:00Z')) {
    return NextResponse.json({ ok: true, skipped: true, reason: 'Mundial campaign ended' })
  }

  const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000)
  const template = MUNDIAL_TEMPLATES[dayOfYear % MUNDIAL_TEMPLATES.length]

  const supabase = adminClient()
  const results: { platform: string; ok: boolean; error?: string }[] = []

  const xEnabled = process.env.X_ENABLED !== 'false'
  const xLimit = await canPublish('x')
  if (xEnabled && xLimit.ok) {
    try {
      await postOriginalTweet(template)
      await incrementRateLimit('x')
      await supabase.from('social_posted_content').insert({
        platform: 'x', text: `[mundial] ${template}`, image_url: null,
        posted_at: now.toISOString(), success: true,
      })
      results.push({ platform: 'x', ok: true })
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      results.push({ platform: 'x', ok: false, error: msg })
    }
  }

  const liLimit = await canPublish('linkedin')
  if (liLimit.ok) {
    try {
      await publishLinkedInPost(template)
      await incrementRateLimit('linkedin')
      await supabase.from('social_posted_content').insert({
        platform: 'linkedin', text: `[mundial] ${template}`, image_url: null,
        posted_at: now.toISOString(), success: true,
      })
      results.push({ platform: 'linkedin', ok: true })
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      results.push({ platform: 'linkedin', ok: false, error: msg })
    }
  }

  return NextResponse.json({
    ok: results.some(r => r.ok),
    template,
    results,
    postedAt: now.toISOString(),
  }, { status: results.some(r => r.ok) ? 200 : 500 })
}
