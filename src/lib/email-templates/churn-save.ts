// ─────────────────────────────────────────────────────────────────────────────
// Email template: Save Offer (anti-churn predictivo)
//
// Tono editorial NYT — Playfair Display + Georgia, fondo crema #FAFAF7, rojo
// Nebbuler #C41C1C como acento. Tres CTAs:
//   1. PRIMARIO   "Pausar 30 días gratis"  →  /api/subscription/pause?token=...
//   2. SECUNDARIO "Mantener suscripción"   →  /[creatorSlug]
//   3. DISCRETO   "Cancelar definitivamente" como link de texto (transparencia)
//
// Headers Gmail-compliant (List-Unsubscribe-Post) los aplica el caller en
// los headers SMTP — esta función devuelve solo el HTML del cuerpo y los
// subjects propuestos para A/B futuro.
// ─────────────────────────────────────────────────────────────────────────────

export interface ChurnSaveTemplateInput {
  subscriberFirstName: string | null
  creatorName: string
  creatorSlug: string
  publicationName: string
  priceClp: number
  baseUrl: string
  pauseToken: string         // firma server-side, no PII
  unsubscribeToken: string
}

export interface ChurnSaveTemplateOutput {
  subject: string
  subjectVariants: string[]  // para A/B testing futuro
  html: string
  text: string
}

const ACCENT = '#C41C1C'
const INK = '#121212'
const CREAM = '#FAFAF7'
const RULE = '#DEDEDE'
const MUTED = '#666666'

function escape(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function formatCLP(n: number): string {
  return n.toLocaleString('es-CL')
}

export function buildChurnSaveEmail(input: ChurnSaveTemplateInput): ChurnSaveTemplateOutput {
  const greeting = input.subscriberFirstName
    ? `Hola ${escape(input.subscriberFirstName)},`
    : 'Hola,'

  const creatorName = escape(input.creatorName)
  const publication = escape(input.publicationName)

  const pauseUrl = `${input.baseUrl}/api/subscription/pause?token=${encodeURIComponent(input.pauseToken)}`
  const keepUrl = `${input.baseUrl}/${input.creatorSlug}`
  const cancelUrl = `${input.baseUrl}/dashboard/preferencias?action=cancel&slug=${encodeURIComponent(input.creatorSlug)}`
  const unsubUrl = `${input.baseUrl}/api/unsubscribe?token=${encodeURIComponent(input.unsubscribeToken)}`

  const subjectVariants = [
    `¿Quieres pausar tu suscripcion a ${input.creatorName}?`,
    `${input.creatorName} noto que llevas un tiempo sin leer`,
    `Una pausa antes de cancelar ${input.publicationName}?`,
  ]
  const subject = subjectVariants[0]

  const text = [
    greeting,
    '',
    `Notamos que llevas un tiempo sin leer los analisis de ${input.creatorName}.`,
    '',
    'Antes de cancelar, queremos ofrecerte una alternativa:',
    '',
    `Pausa tu suscripcion 30 dias, sin cargo: ${pauseUrl}`,
    `Mantener suscripcion activa: ${keepUrl}`,
    `Cancelar definitivamente: ${cancelUrl}`,
    '',
    `Tu suscripcion actual: $${formatCLP(input.priceClp)} CLP/mes.`,
    '',
    `— El equipo de ${publication}`,
    '',
    `Si no quieres recibir mas correos: ${unsubUrl}`,
  ].join('\n')

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escape(subject)}</title>
</head>
<body style="margin:0;padding:0;background:${CREAM};font-family:Georgia,'Times New Roman',serif;color:${INK};">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:${CREAM};padding:32px 16px;">
  <tr><td align="center">
    <table role="presentation" width="560" cellspacing="0" cellpadding="0" border="0" style="background:#ffffff;border:1px solid ${RULE};">
      <!-- Kicker -->
      <tr><td style="padding:28px 36px 0;">
        <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:${MUTED};font-weight:700;">
          ${publication} &nbsp;&middot;&nbsp; Editorial
        </p>
      </td></tr>

      <!-- Headline -->
      <tr><td style="padding:14px 36px 0;">
        <h1 style="margin:0;font-family:'Playfair Display',Georgia,serif;font-size:30px;line-height:1.18;color:${INK};font-weight:700;letter-spacing:-0.01em;">
          ¿Quieres pausar antes de cancelar?
        </h1>
      </td></tr>

      <!-- Rule -->
      <tr><td style="padding:18px 36px 0;">
        <div style="height:2px;background:${ACCENT};width:48px;"></div>
      </td></tr>

      <!-- Body -->
      <tr><td style="padding:22px 36px 0;font-family:Georgia,'Times New Roman',serif;font-size:16px;line-height:1.65;color:${INK};">
        <p style="margin:0 0 14px;">${greeting}</p>
        <p style="margin:0 0 14px;">
          Notamos que llevas un tiempo sin leer los analisis de
          <strong style="color:${INK};">${creatorName}</strong>.
          Antes de cancelar, queremos ofrecerte algo distinto.
        </p>
        <p style="margin:0 0 14px;">
          Pausa tu suscripcion <strong>30 dias sin cargo</strong>. Sigues en la lista,
          no se te cobra, y reactivas cuando vuelvas a tener tiempo.
        </p>
      </td></tr>

      <!-- CTA primario -->
      <tr><td style="padding:24px 36px 0;" align="center">
        <a href="${pauseUrl}" style="display:inline-block;padding:14px 28px;background:${INK};color:#ffffff;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;text-decoration:none;">
          Pausar 30 dias gratis
        </a>
      </td></tr>

      <!-- CTA secundario -->
      <tr><td style="padding:14px 36px 0;" align="center">
        <a href="${keepUrl}" style="display:inline-block;padding:13px 26px;background:#ffffff;color:${INK};border:1px solid ${INK};font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;text-decoration:none;">
          Mantener suscripcion
        </a>
      </td></tr>

      <!-- Precio recordatorio -->
      <tr><td style="padding:24px 36px 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:${MUTED};text-align:center;">
        Tu suscripcion actual: <strong style="color:${INK};">$${formatCLP(input.priceClp)} CLP/mes</strong>
      </td></tr>

      <!-- Link discreto cancelar (transparencia) -->
      <tr><td style="padding:24px 36px 28px;text-align:center;">
        <a href="${cancelUrl}" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:${MUTED};text-decoration:underline;">
          Cancelar definitivamente
        </a>
      </td></tr>

      <!-- Rule -->
      <tr><td style="padding:0 36px;">
        <div style="height:1px;background:${RULE};"></div>
      </td></tr>

      <!-- Firma -->
      <tr><td style="padding:22px 36px 28px;font-family:Georgia,'Times New Roman',serif;font-size:14px;color:${MUTED};line-height:1.55;">
        <p style="margin:0;">— El equipo de ${publication}</p>
      </td></tr>
    </table>

    <!-- Footer -->
    <table role="presentation" width="560" cellspacing="0" cellpadding="0" border="0" style="margin-top:18px;">
      <tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:${MUTED};text-align:center;line-height:1.6;padding:0 16px;">
        Recibiste este correo porque tienes una suscripcion activa con ${creatorName} en Nebbuler.<br>
        <a href="${unsubUrl}" style="color:${MUTED};text-decoration:underline;">Dejar de recibir correos</a>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`

  return { subject, subjectVariants, html, text }
}
