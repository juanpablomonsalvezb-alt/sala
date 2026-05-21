// ─────────────────────────────────────────────────────────────────────────────
// Cron diario: scan LinkedIn → outreach queue
//
// Detecta profesionales LATAM con posts virales o señales claras de querer
// monetizar su expertise. Para cada candidato, llama Claude Sonnet con un
// prompt estructurado que devuelve specialty, score y un DM personalizado.
// Inserta en `sala_outreach_targets` con status='pending' para que el
// superadmin lo revise en /dashboard/admin/outreach.
//
// Schedule: 0 7 * * *  (07:00 UTC = 04:00 AM Santiago)
//
// LinkedIn no expone una API pública de búsqueda por hashtag con engagement,
// y el scraping del SERP de LinkedIn requiere cookies de sesión + reCAPTCHA.
// Estrategia híbrida:
//   1. Si `LINKEDIN_ACCESS_TOKEN` está presente, intentar UGC search vía API
//      oficial (limitada — solo posts del propio token holder). Mantenido por
//      compatibilidad con el helper `linkedin-client.ts`.
//   2. Fallback realista: Google CSE / búsqueda pública (sin autenticación).
//      Las URLs públicas de LinkedIn salen indexadas en Google con título y
//      descripción. Parseamos resultados con un regex tolerante.
//   3. Si `DEV_MODE=1`, insertar 3 candidatos mock para poder iterar la UI
//      sin depender de tráfico real.
//
// La calidad de la señal NUNCA debería confiar solo en el scrape. Por eso:
//   - El prompt de Claude penaliza fuerte cuando no hay engagement claro.
//   - El score < 0.5 entra igual a la cola pero queda escondido por defecto
//     en la UI (filter='pending' muestra solo >= 0.5 por defecto).
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from 'next/server'
import { createClient as createServiceSupabase } from '@supabase/supabase-js'
import Anthropic from '@anthropic-ai/sdk'
import { isAuthorizedCron } from '@/lib/cron-auth'

export const runtime = 'nodejs'
export const maxDuration = 60

// ── Configuración hardcoded ──────────────────────────────────────────────────
const TARGET_SPECIALTIES = [
  'economia',
  'derecho',
  'finanzas',
  'salud',
  'tech',
  'marketing',
  'consultoria',
  'contabilidad',
  'recursos_humanos',
  'real_estate',
] as const

const TARGET_COUNTRIES = ['CL', 'AR', 'MX', 'CO', 'PE', 'UY', 'EC', 'BO', 'PY'] as const

const MAX_NEW_PER_RUN = 20

// Hashtags y queries que típicamente arrastran posts de profesionales LATAM
// con señales de monetización / audiencia editorial.
const SEARCH_HASHTAGS = [
  'newsletter',
  'emprendimiento',
  'consultoria',
  'monetizar',
  'creadordecontenido',
  'asesoria',
  'finanzaspersonales',
  'derecho',
  'economia',
]

// ── Tipos ────────────────────────────────────────────────────────────────────
interface RawCandidate {
  profile_url: string
  full_name: string | null
  headline: string | null
  followers_count: number | null
  signal_post_url: string | null
  signal_post_excerpt: string | null
  signal_engagement: number | null
}

interface AiVerdict {
  specialty: string
  country: string
  ai_score: number
  signal_reason: string
  ai_pitch_draft: string
}

// ── Supabase service ─────────────────────────────────────────────────────────
function adminSupabase() {
  const key = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!key) throw new Error('SUPABASE_SECRET_KEY missing')
  return createServiceSupabase(process.env.NEXT_PUBLIC_SUPABASE_URL!, key)
}

// ─────────────────────────────────────────────────────────────────────────────
// Fuente 1: LinkedIn API oficial (limitada — solo posts del token holder)
// ─────────────────────────────────────────────────────────────────────────────
async function fetchFromLinkedInApi(): Promise<RawCandidate[]> {
  const token = process.env.LINKEDIN_ACCESS_TOKEN
  if (!token) return []
  // La API REST oficial NO permite buscar posts por hashtag sin Marketing
  // Developer Platform aprobado. Mantenemos el hook por si en el futuro se
  // agrega un endpoint w_member_social que sí permita esto.
  // Por ahora retornamos array vacío: la fuente real es el scrape público.
  return []
}

// ─────────────────────────────────────────────────────────────────────────────
// Fuente 2: Google search público (sin auth) — busca URLs de linkedin.com/posts
// indexadas con un hashtag y país.
// ─────────────────────────────────────────────────────────────────────────────
async function fetchFromPublicSearch(): Promise<RawCandidate[]> {
  const out: RawCandidate[] = []

  for (const hashtag of SEARCH_HASHTAGS) {
    const query = encodeURIComponent(`site:linkedin.com/posts ${hashtag} (Chile OR México OR Argentina OR Colombia OR Perú)`)
    const url = `https://www.google.com/search?q=${query}&num=10&hl=es`

    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
          'Accept-Language': 'es-419,es;q=0.9',
        },
      })

      if (!res.ok) continue
      const html = await res.text()

      // Regex tolerante: extrae bloques con linkedin.com/posts/<slug>
      const postRegex = /https:\/\/[a-z]{0,3}\.?linkedin\.com\/posts\/([a-z0-9-_]+)[-_]([a-z0-9-_]+)/gi
      const seen = new Set<string>()
      let match: RegExpExecArray | null

      while ((match = postRegex.exec(html)) !== null) {
        const fullUrl = match[0].split('?')[0]
        if (seen.has(fullUrl)) continue
        seen.add(fullUrl)

        const slug = match[1] // ej: "lucas-lacoste-economia"
        const nameGuess = slug
          .replace(/[-_]/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase())
          .trim()

        const profileUrl = `https://www.linkedin.com/in/${slug}`

        out.push({
          profile_url: profileUrl,
          full_name: nameGuess,
          headline: null,
          followers_count: null,
          signal_post_url: fullUrl,
          signal_post_excerpt: `Post detectado via #${hashtag}`,
          signal_engagement: null,
        })

        if (out.length >= MAX_NEW_PER_RUN * 2) break
      }
    } catch (err) {
      console.warn('[scan-linkedin] public search fallo para', hashtag, err)
    }

    if (out.length >= MAX_NEW_PER_RUN * 2) break
  }

  return out
}

// ─────────────────────────────────────────────────────────────────────────────
// Fuente 3: Mock para desarrollo local (DEV_MODE=1)
// ─────────────────────────────────────────────────────────────────────────────
function fetchMockCandidates(): RawCandidate[] {
  return [
    {
      profile_url: 'https://www.linkedin.com/in/mock-economista-cl',
      full_name: 'María Fernanda Soto',
      headline: 'Economista · ex-Banco Central · escribo sobre macroeconomía LATAM',
      followers_count: 8400,
      signal_post_url: 'https://www.linkedin.com/posts/mock-economista-cl-1',
      signal_post_excerpt:
        'Después de 5 años en consultoría dejé todo para escribir mi propio newsletter sobre política monetaria LATAM. Buscando plataforma que no se quede con el 30%.',
      signal_engagement: 1240,
    },
    {
      profile_url: 'https://www.linkedin.com/in/mock-abogado-ar',
      full_name: 'Tomás Iglesias',
      headline: 'Abogado tributarista · partner en estudio · 14k seguidores',
      followers_count: 14200,
      signal_post_url: 'https://www.linkedin.com/posts/mock-abogado-ar-1',
      signal_post_excerpt:
        'Voy a abrir membresía paga para empresarios PyME — análisis semanal de cambios tributarios en Argentina. ¿Substack o algo regional?',
      signal_engagement: 880,
    },
    {
      profile_url: 'https://www.linkedin.com/in/mock-finanzas-mx',
      full_name: 'Ana Rivas',
      headline: 'CFO advisor · ex-Bain · finanzas para founders',
      followers_count: 5600,
      signal_post_url: 'https://www.linkedin.com/posts/mock-finanzas-mx-1',
      signal_post_excerpt:
        'Empecé a cobrar US$19/mes por mi newsletter de modelado financiero para founders LATAM. 130 suscriptores en 2 semanas.',
      signal_engagement: 612,
    },
  ]
}

// ─────────────────────────────────────────────────────────────────────────────
// Llamada a Claude — califica candidato + genera DM
// ─────────────────────────────────────────────────────────────────────────────
async function classifyWithClaude(c: RawCandidate, anthropic: Anthropic): Promise<AiVerdict | null> {
  const prompt = `Analiza este perfil de LinkedIn y su post viral. Determina si es un buen candidato para Nebbuler (plataforma LATAM donde profesionales monetizan su expertise con suscripciones a US$19/mes sin comisión).

Perfil: ${c.full_name ?? 'desconocido'} — ${c.headline ?? 'sin headline'} — ${c.followers_count ?? 0} followers
Post (excerpt): ${c.signal_post_excerpt ?? 'sin excerpt'}
Engagement: ${c.signal_engagement ?? 0} reactions

Devuelve SOLO JSON válido:
{
  "specialty": "economia|derecho|finanzas|salud|tech|marketing|consultoria|contabilidad|recursos_humanos|real_estate|otro",
  "country": "CL|AR|MX|CO|PE|UY|EC|BO|PY|otro",
  "ai_score": 0.0-1.0,
  "signal_reason": "razón corta (máx 60 chars)",
  "ai_pitch_draft": "DM personalizado en español, tono profesional pero cercano, máx 600 chars, mencionar su contenido específico, link a invite"
}

Criterios para score:
- 0.9+: profesional senior, audiencia >5k, contenido editorial premium, signal claro de querer monetizar
- 0.7-0.9: buena audiencia, contenido relevante, signal indirecto
- 0.5-0.7: audiencia mediana, contenido OK
- <0.5: no es buen fit`

  try {
    const res = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 600,
      temperature: 0.4,
      messages: [{ role: 'user', content: prompt }],
    })

    const block = res.content.find((b) => b.type === 'text')
    if (!block || block.type !== 'text') return null

    // Extraer el primer bloque JSON balanceado
    const text = block.text
    const start = text.indexOf('{')
    const end = text.lastIndexOf('}')
    if (start < 0 || end <= start) return null

    const parsed = JSON.parse(text.slice(start, end + 1))

    // Validación defensiva
    if (typeof parsed !== 'object' || parsed === null) return null
    const verdict: AiVerdict = {
      specialty: typeof parsed.specialty === 'string' ? parsed.specialty : 'otro',
      country: typeof parsed.country === 'string' ? parsed.country : 'otro',
      ai_score: typeof parsed.ai_score === 'number' ? Math.max(0, Math.min(1, parsed.ai_score)) : 0,
      signal_reason:
        typeof parsed.signal_reason === 'string' ? parsed.signal_reason.slice(0, 60) : 'sin razón',
      ai_pitch_draft:
        typeof parsed.ai_pitch_draft === 'string' ? parsed.ai_pitch_draft.slice(0, 600) : '',
    }
    return verdict
  } catch (err) {
    console.warn('[scan-linkedin] claude fallo para', c.profile_url, err)
    return null
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Handler principal
// ─────────────────────────────────────────────────────────────────────────────
export async function GET(req: Request) {
  if (!isAuthorizedCron(req)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'anthropic_key_missing' }, { status: 500 })
  }

  const anthropic = new Anthropic({ apiKey })
  const supabase = adminSupabase()

  // 1. Recolectar candidatos
  let raw: RawCandidate[] = []
  const devMode = process.env.DEV_MODE === '1'

  if (devMode) {
    raw = fetchMockCandidates()
  } else {
    const [fromApi, fromSearch] = await Promise.all([
      fetchFromLinkedInApi(),
      fetchFromPublicSearch(),
    ])
    raw = [...fromApi, ...fromSearch]
  }

  if (raw.length === 0) {
    return NextResponse.json({
      ok: true,
      message: 'no_candidates',
      inserted: 0,
      skipped: 0,
      mode: devMode ? 'dev' : 'live',
    })
  }

  // 2. Deduplicar contra DB existente
  const profileUrls = raw.map((r) => r.profile_url)
  const { data: existing } = await supabase
    .from('sala_outreach_targets')
    .select('profile_url')
    .in('profile_url', profileUrls)

  const existingSet = new Set((existing ?? []).map((r: { profile_url: string }) => r.profile_url))
  const fresh = raw.filter((r) => !existingSet.has(r.profile_url)).slice(0, MAX_NEW_PER_RUN)

  // 3. Clasificar con Claude (en serie para no martillar la API)
  let inserted = 0
  let skipped = 0
  const errors: string[] = []

  for (const candidate of fresh) {
    const verdict = await classifyWithClaude(candidate, anthropic)
    if (!verdict) {
      skipped++
      continue
    }

    // Validar specialty y country contra whitelist
    const specialty = (TARGET_SPECIALTIES as readonly string[]).includes(verdict.specialty)
      ? verdict.specialty
      : 'otro'
    const country = (TARGET_COUNTRIES as readonly string[]).includes(verdict.country)
      ? verdict.country
      : 'otro'

    const { error } = await supabase.from('sala_outreach_targets').insert({
      platform: 'linkedin',
      profile_url: candidate.profile_url,
      full_name: candidate.full_name,
      headline: candidate.headline,
      country,
      specialty,
      followers_count: candidate.followers_count ?? 0,
      signal_post_url: candidate.signal_post_url,
      signal_post_excerpt: candidate.signal_post_excerpt?.slice(0, 300) ?? null,
      signal_engagement: candidate.signal_engagement ?? 0,
      signal_reason: verdict.signal_reason,
      ai_score: verdict.ai_score,
      ai_pitch_draft: verdict.ai_pitch_draft,
      status: 'pending',
    })

    if (error) {
      // 23505 = unique violation (alguien insertó en paralelo). Ignorar.
      if (error.code === '23505') {
        skipped++
      } else {
        errors.push(`${candidate.profile_url}: ${error.code} ${error.message}`)
        skipped++
      }
    } else {
      inserted++
    }
  }

  return NextResponse.json({
    ok: true,
    mode: devMode ? 'dev' : 'live',
    candidates_found: raw.length,
    fresh_after_dedup: fresh.length,
    inserted,
    skipped,
    errors: errors.slice(0, 5),
  })
}
