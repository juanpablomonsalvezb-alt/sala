// Stage 2 — Día 7: encuesta de 1 pregunta sobre qué temas quieren leer.

import {
  escapeHtml,
  OnboardingContext,
  responseUrl,
  unsubscribeUrl,
  wrapEditorial,
} from './_shared'

export interface SurveyEmail {
  subject: string
  html: string
}

const DEFAULT_OPTIONS = [
  'Análisis profundo de coyuntura',
  'Casos prácticos y precedentes',
  'Entrevistas con expertos',
]

export function buildSurveyDay7Email(
  ctx: OnboardingContext,
  options: string[] = DEFAULT_OPTIONS,
): SurveyEmail {
  const stage = 'survey_day_7' as const
  const subject = 'Una pregunta para mejorar tu experiencia'
  const greeting = ctx.subscriber.firstName
    ? `Hola ${escapeHtml(ctx.subscriber.firstName)},`
    : 'Hola,'

  const optionButton = (label: string, value: string): string => {
    const href = responseUrl(ctx.subscriptionId, stage, value, '/dashboard/preferencias?gracias=1')
    return `
      <tr><td style="padding:0 0 12px 0;">
        <a href="${href}" style="display:block;background:#FFFFFF;border:1px solid #DDD7C8;color:#121212;font-family:Georgia,serif;font-size:15px;padding:14px 20px;text-decoration:none;line-height:1.4;">${escapeHtml(label)}</a>
      </td></tr>`
  }

  const otherHref = responseUrl(
    ctx.subscriptionId,
    stage,
    'other',
    `/dashboard/preferencias?survey=open&creator=${encodeURIComponent(ctx.creator.slug)}`,
  )

  const inner = `
    <p style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:10px;letter-spacing:3px;color:#C41C1C;text-transform:uppercase;font-weight:bold;">Día 7 · Encuesta breve</p>
    <h1 style="margin:0 0 22px;font-family:Georgia,serif;font-size:28px;font-weight:bold;color:#121212;line-height:1.25;">¿Qué te gustaría que ${escapeHtml(ctx.creator.name)} cubriera próximamente?</h1>
    <p style="margin:0 0 24px;font-family:Georgia,serif;font-size:17px;color:#333333;line-height:1.7;">${greeting} llevas una semana suscrito y nos ayudaría mucho saber qué tipo de análisis valoras más. Toca una opción — tu respuesta llega directo a ${escapeHtml(ctx.creator.name)}.</p>

    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 18px;">
      ${options.map((o, i) => optionButton(o, `opt_${i + 1}:${o.slice(0, 60)}`)).join('')}
      <tr><td style="padding:6px 0 0;">
        <a href="${otherHref}" style="display:block;background:#121212;color:#FFFFFF;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:bold;letter-spacing:2px;padding:14px 20px;text-decoration:none;text-transform:uppercase;text-align:center;">Otro (responder en texto libre) &rarr;</a>
      </td></tr>
    </table>

    <p style="margin:24px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#999999;line-height:1.7;font-style:italic;">Tu respuesta es anónima respecto a otros lectores. Solo ${escapeHtml(ctx.creator.name)} la ve para orientar próximos análisis.</p>
  `

  return {
    subject,
    html: wrapEditorial({
      subject,
      publicationName: ctx.creator.publicationName,
      preheader: `¿Qué te gustaría que ${ctx.creator.name} cubriera próximamente?`,
      inner,
      subscriptionId: ctx.subscriptionId,
      stage,
      unsubscribeUrl: unsubscribeUrl(ctx.unsubscribeToken),
    }),
  }
}
