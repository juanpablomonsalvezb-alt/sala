// ─────────────────────────────────────────────────────────────────────────────
// Press release generator — Anthropic Claude Sonnet 4.6
//
// Recibe creador + hito y devuelve { title, body_es, quote, suggested_sectors }.
// Lazy init del cliente Anthropic — nunca a nivel módulo, rompe build en Vercel.
// ─────────────────────────────────────────────────────────────────────────────

import Anthropic from '@anthropic-ai/sdk'

export type MilestoneType =
  | 'first_100'
  | 'first_500'
  | 'first_1000'
  | 'mrr_1k_usd'
  | 'mrr_5k_usd'
  | 'mrr_10k_usd'
  | 'one_year'

export interface PressReleaseInput {
  creator: {
    name: string
    specialty: string
    bio: string
    country: string
    publication_name?: string | null
    slug?: string
  }
  milestone: {
    type: MilestoneType
    value: number
  }
}

export interface PressReleaseOutput {
  title: string
  body_es: string
  quote: string
  suggested_sectors: string[]
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const SPECIALTY_LABEL_ES: Record<string, string> = {
  economia: 'economía',
  derecho: 'derecho',
  finanzas: 'finanzas',
  salud: 'salud',
  tech: 'tecnología',
  marketing: 'marketing',
  consultoria: 'consultoría',
  contabilidad: 'contabilidad',
  recursos_humanos: 'recursos humanos',
  real_estate: 'real estate',
  otro: 'su disciplina',
}

const COUNTRY_LABEL_ES: Record<string, string> = {
  CL: 'Chile',
  AR: 'Argentina',
  MX: 'México',
  CO: 'Colombia',
  PE: 'Perú',
  UY: 'Uruguay',
  EC: 'Ecuador',
  BO: 'Bolivia',
  PY: 'Paraguay',
  BR: 'Brasil',
  ES: 'España',
  US: 'Estados Unidos',
}

function milestoneNarrative(type: MilestoneType, value: number): string {
  switch (type) {
    case 'first_100':
      return `superó los 100 suscriptores pagos (${value} hoy)`
    case 'first_500':
      return `cruzó la barrera de los 500 suscriptores pagos (${value} hoy)`
    case 'first_1000':
      return `alcanzó 1.000 suscriptores pagos (${value} hoy)`
    case 'mrr_1k_usd':
      return `superó los US$1.000 mensuales recurrentes en suscripciones`
    case 'mrr_5k_usd':
      return `superó los US$5.000 mensuales recurrentes en suscripciones`
    case 'mrr_10k_usd':
      return `superó los US$10.000 mensuales recurrentes en suscripciones`
    case 'one_year':
      return `cumplió un año en la plataforma`
  }
}

export function suggestSectorsFromSpecialty(specialty: string): string[] {
  // Default sectors a los que enviar el PR según especialidad del creador.
  switch (specialty) {
    case 'economia':
    case 'finanzas':
    case 'contabilidad':
      return ['finanzas', 'general']
    case 'derecho':
    case 'consultoria':
      return ['general']
    case 'tech':
      return ['tech', 'startups', 'general']
    case 'marketing':
      return ['startups', 'tech', 'general']
    case 'salud':
      return ['general']
    case 'real_estate':
      return ['finanzas', 'general']
    case 'recursos_humanos':
      return ['general']
    default:
      return ['general']
  }
}

// ── Builder del prompt ───────────────────────────────────────────────────────

function buildPrompt(input: PressReleaseInput): string {
  const { creator, milestone } = input
  const specialtyLabel = SPECIALTY_LABEL_ES[creator.specialty] ?? creator.specialty
  const countryLabel = COUNTRY_LABEL_ES[creator.country] ?? creator.country
  const narrative = milestoneNarrative(milestone.type, milestone.value)
  const pubName = creator.publication_name?.trim() || `el espacio editorial de ${creator.name}`

  return `Eres un periodista económico-tecnológico LATAM (estilo Diario Financiero / Bloomberg Línea). Escribe un comunicado de prensa en español neutro editorial sobre un creador de la plataforma Nebbuler que acaba de alcanzar un hito.

DATOS DEL CREADOR:
- Nombre: ${creator.name}
- País: ${countryLabel}
- Especialidad: ${specialtyLabel}
- Publicación: ${pubName}
- Bio: ${creator.bio || 'sin bio'}

HITO ALCANZADO:
- ${narrative}

CONTEXTO DE NEBBULER:
Nebbuler es una plataforma LATAM donde profesionales independientes monetizan su expertise con suscripciones pagas, sin comisión de plataforma. Compite con Substack en español. Co-fundada en Chile, hoy con creadores en Chile, Argentina, México, Colombia y Perú.

REQUISITOS ESTRICTOS:
1. Tono: editorial, sobrio, NO hype. Sin signos de exclamación. Sin emojis.
2. Extensión cuerpo: 220–260 palabras exactas, en 3 párrafos.
3. Quote: una sola oración del creador (≤ 35 palabras), realista, en primera persona.
4. Título: ≤ 90 caracteres, formato titular de medio (sin clickbait).
5. Sin promesas financieras, sin proyecciones, sin afirmar liderazgo de mercado.
6. Si el hito es de MRR en USD, NUNCA traducir a CLP — mantener USD.
7. Si el hito es first_100, enmarcarlo como "consolidación" (no como pequeño).

DEVUELVE EXCLUSIVAMENTE JSON VÁLIDO (sin markdown, sin texto antes/después):
{
  "title": "string ≤ 90 chars",
  "body_es": "string 220-260 palabras, 3 párrafos separados por \\n\\n",
  "quote": "string ≤ 35 palabras, voz del creador",
  "suggested_sectors": ["finanzas"|"tech"|"general"|"startups", ...]
}`
}

// ── Parser defensivo ─────────────────────────────────────────────────────────

function extractJson(text: string): unknown {
  const start = text.indexOf('{')
  const end = text.lastIndexOf('}')
  if (start < 0 || end <= start) throw new Error('no_json_found')
  return JSON.parse(text.slice(start, end + 1))
}

function validateOutput(raw: unknown, fallbackSectors: string[]): PressReleaseOutput {
  if (typeof raw !== 'object' || raw === null) {
    throw new Error('output_not_object')
  }
  const r = raw as Record<string, unknown>

  const title = typeof r.title === 'string' ? r.title.trim().slice(0, 140) : ''
  const body_es = typeof r.body_es === 'string' ? r.body_es.trim() : ''
  const quote = typeof r.quote === 'string' ? r.quote.trim().slice(0, 320) : ''

  if (!title || !body_es || !quote) {
    throw new Error('missing_fields')
  }

  let sectors: string[] = []
  if (Array.isArray(r.suggested_sectors)) {
    sectors = r.suggested_sectors
      .filter((s): s is string => typeof s === 'string')
      .map((s) => s.toLowerCase())
      .filter((s) => ['finanzas', 'tech', 'general', 'startups'].includes(s))
  }
  if (sectors.length === 0) sectors = fallbackSectors

  return { title, body_es, quote, suggested_sectors: sectors }
}

// ── API principal ────────────────────────────────────────────────────────────

export async function generatePR(input: PressReleaseInput): Promise<PressReleaseOutput> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY missing')

  const client = new Anthropic({ apiKey })
  const fallbackSectors = suggestSectorsFromSpecialty(input.creator.specialty)

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1500,
    temperature: 0.3,
    messages: [{ role: 'user', content: buildPrompt(input) }],
  })

  const block = response.content.find((b) => b.type === 'text')
  if (!block || block.type !== 'text') {
    throw new Error('no_text_block')
  }

  const parsed = extractJson(block.text)
  return validateOutput(parsed, fallbackSectors)
}

// ── Email HTML — cuerpo enviado a medios ─────────────────────────────────────

export function buildPressEmailHtml(params: {
  title: string
  body_es: string
  quote: string
  creatorName: string
  creatorSlug?: string
  publicationName?: string | null
  contactName?: string | null
  outletName: string
}): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://nebbuler.com'
  const creatorUrl = params.creatorSlug ? `${baseUrl}/${params.creatorSlug}` : baseUrl
  const greeting = params.contactName
    ? `Estimada/o ${params.contactName},`
    : `Estimada/o equipo de ${params.outletName},`

  const bodyParagraphs = params.body_es
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map(
      (p) =>
        `<p style="margin:0 0 16px;font-family:Georgia,serif;font-size:15px;color:#222;line-height:1.7;">${escapeHtml(p)}</p>`
    )
    .join('\n')

  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><title>${escapeHtml(params.title)}</title></head>
<body style="margin:0;padding:0;background:#F7F7F7;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F7F7F7;padding:40px 20px;">
    <tr><td>
      <table width="640" cellpadding="0" cellspacing="0" align="center" style="background:#FFFFFF;max-width:640px;width:100%;border:1px solid #E8E8E8;">
        <tr><td style="background:#121212;height:4px;font-size:0;line-height:0;">&nbsp;</td></tr>
        <tr><td style="padding:28px 40px 6px;">
          <p style="margin:0;font-family:Arial,sans-serif;font-size:10px;font-weight:bold;color:#999;letter-spacing:3px;text-transform:uppercase;">Comunicado de prensa · Nebbuler</p>
        </td></tr>
        <tr><td style="padding:8px 40px 4px;">
          <p style="margin:0 0 18px;font-family:Arial,sans-serif;font-size:13px;color:#444;">${escapeHtml(greeting)}</p>
          <h1 style="margin:0 0 22px;font-family:Georgia,serif;font-size:26px;font-weight:bold;color:#121212;line-height:1.25;">${escapeHtml(params.title)}</h1>
        </td></tr>
        <tr><td style="padding:0 40px 6px;">
          ${bodyParagraphs}
        </td></tr>
        <tr><td style="padding:6px 40px 18px;">
          <blockquote style="margin:0 0 18px;padding:14px 18px;border-left:3px solid #C41C1C;background:#FAFAFA;font-family:Georgia,serif;font-size:15px;font-style:italic;color:#222;line-height:1.6;">
            "${escapeHtml(params.quote)}"
            <br><span style="font-style:normal;font-size:12px;color:#666;">— ${escapeHtml(params.creatorName)}</span>
          </blockquote>
        </td></tr>
        <tr><td style="padding:0 40px 24px;">
          <p style="margin:0 0 6px;font-family:Arial,sans-serif;font-size:12px;color:#666;line-height:1.6;">Perfil del creador: <a href="${creatorUrl}" style="color:#C41C1C;text-decoration:underline;">${creatorUrl}</a></p>
          <p style="margin:0;font-family:Arial,sans-serif;font-size:12px;color:#666;line-height:1.6;">Contacto de prensa: <a href="mailto:prensa@nebbuler.com" style="color:#C41C1C;">prensa@nebbuler.com</a></p>
        </td></tr>
        <tr><td style="padding:18px 40px;border-top:1px solid #EEEEEE;background:#FAFAFA;">
          <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;color:#999;line-height:1.6;">Recibe este comunicado porque su medio (${escapeHtml(params.outletName)}) cubre temas relacionados. Si prefiere no recibir más, responda a este correo con "BAJA".</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

// ── Detección de hito desde subscriber_count ─────────────────────────────────
// Devuelve el milestone_type ALCANZADO (no proyectado) según umbrales.
export function detectMilestoneFromSubscribers(
  count: number
): { type: MilestoneType; value: number } | null {
  if (count >= 1000) return { type: 'first_1000', value: count }
  if (count >= 500) return { type: 'first_500', value: count }
  if (count >= 100) return { type: 'first_100', value: count }
  return null
}
