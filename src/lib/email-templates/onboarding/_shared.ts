// Helpers compartidos para los 5 templates de la secuencia de onboarding.
// Diseño NYT editorial: serif Georgia + crema #FAFAF7 + barra roja Nebbuler.
// Toda función es pura: recibe params, devuelve string HTML.

export const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://nebbuler.com'

export type OnboardingStage =
  | 'welcome'
  | 'tips_day_3'
  | 'survey_day_7'
  | 'viral_day_14'
  | 'nps_day_30'

export interface OnboardingCreator {
  id: string
  name: string
  slug: string
  bio: string | null
  publicationName: string
}

export interface OnboardingSubscriber {
  id: string
  email: string
  firstName: string
}

export interface OnboardingContext {
  subscriptionId: string
  subscriber: OnboardingSubscriber
  creator: OnboardingCreator
  unsubscribeToken: string
}

// Token-aware tracking helpers (best-effort, no requieren auth en el endpoint)
export function pixelUrl(subscriptionId: string, stage: OnboardingStage): string {
  return `${BASE_URL}/api/track/onboarding/pixel?sub_id=${encodeURIComponent(subscriptionId)}&stage=${stage}`
}

export function clickUrl(
  subscriptionId: string,
  stage: OnboardingStage,
  target: string,
  data?: string,
): string {
  const u = new URL(`${BASE_URL}/api/track/onboarding`)
  u.searchParams.set('sub_id', subscriptionId)
  u.searchParams.set('stage', stage)
  u.searchParams.set('action', 'click')
  u.searchParams.set('to', target)
  if (data) u.searchParams.set('data', data)
  return u.toString()
}

export function responseUrl(
  subscriptionId: string,
  stage: OnboardingStage,
  data: string,
  redirectTo?: string,
): string {
  const u = new URL(`${BASE_URL}/api/track/onboarding`)
  u.searchParams.set('sub_id', subscriptionId)
  u.searchParams.set('stage', stage)
  u.searchParams.set('action', 'response')
  u.searchParams.set('data', data)
  if (redirectTo) u.searchParams.set('to', redirectTo)
  return u.toString()
}

export function unsubscribeUrl(token: string): string {
  return `${BASE_URL}/api/unsubscribe?token=${encodeURIComponent(token)}`
}

// Escape mínimo para evitar romper el HTML del email con texto del usuario.
export function escapeHtml(input: string | null | undefined): string {
  if (!input) return ''
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

// Wrapper editorial NYT — crema #FAFAF7, serif Georgia, barra roja superior.
// Todos los templates lo usan para mantener voz visual consistente.
export function wrapEditorial(args: {
  subject: string
  publicationName: string
  preheader: string
  inner: string
  subscriptionId: string
  stage: OnboardingStage
  unsubscribeUrl: string
}): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(args.subject)}</title>
</head>
<body style="margin:0;padding:0;background:#FAFAF7;font-family:Georgia,'Times New Roman',serif;color:#121212;">
  <span style="display:none !important;visibility:hidden;opacity:0;color:transparent;height:0;width:0;overflow:hidden;">${escapeHtml(args.preheader)}</span>
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FAFAF7;padding:40px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background:#FFFFFF;border:1px solid #E8E4DA;">
        <tr><td style="background:#C41C1C;height:4px;font-size:0;line-height:0;">&nbsp;</td></tr>

        <tr><td style="padding:26px 44px 18px;border-bottom:1px solid #EEEAE0;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td>
                <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:10px;font-weight:bold;letter-spacing:3px;color:#888888;text-transform:uppercase;">${escapeHtml(args.publicationName)}</p>
                <p style="margin:2px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:10px;letter-spacing:1px;color:#BBBBBB;">EN NEBBULER</p>
              </td>
              <td align="right">
                <a href="${BASE_URL}" style="font-family:Georgia,serif;font-size:14px;font-weight:bold;color:#121212;text-decoration:none;letter-spacing:3px;">NEBBULER</a>
              </td>
            </tr>
          </table>
        </td></tr>

        <tr><td style="padding:36px 44px 28px;">
          ${args.inner}
        </td></tr>

        <tr><td style="padding:22px 44px;border-top:1px solid #EEEAE0;background:#FAFAF7;">
          <p style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#999999;line-height:1.65;">
            Recibes este correo porque estás suscrito a <strong style="color:#121212;">${escapeHtml(args.publicationName)}</strong> en Nebbuler. Esta serie de bienvenida termina automáticamente a los 30 días.
          </p>
          <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#BBBBBB;">
            <a href="${args.unsubscribeUrl}" style="color:#C41C1C;text-decoration:underline;">Cancelar suscripción</a>
            &nbsp;&middot;&nbsp;
            <a href="${BASE_URL}/dashboard/preferencias" style="color:#999999;text-decoration:underline;">Preferencias</a>
            &nbsp;&middot;&nbsp;
            <a href="${BASE_URL}" style="color:#AAAAAA;text-decoration:none;">nebbuler.com</a>
          </p>
        </td></tr>
      </table>

      <img src="${pixelUrl(args.subscriptionId, args.stage)}" width="1" height="1" alt="" style="display:block;border:0;width:1px;height:1px;" />
    </td></tr>
  </table>
</body>
</html>`
}
