// Stage 4 — Día 30: NPS (0-10) + survey "qué te falta".

import {
  escapeHtml,
  OnboardingContext,
  responseUrl,
  unsubscribeUrl,
  wrapEditorial,
} from './_shared'

export interface NpsEmail {
  subject: string
  html: string
}

export function buildNpsDay30Email(ctx: OnboardingContext): NpsEmail {
  const stage = 'nps_day_30' as const
  const subject = `Un mes contigo — ¿cómo va?`
  const greeting = ctx.subscriber.firstName
    ? `Hola ${escapeHtml(ctx.subscriber.firstName)},`
    : 'Hola,'

  const npsButton = (score: number): string => {
    const href = responseUrl(
      ctx.subscriptionId,
      stage,
      `nps:${score}`,
      `/dashboard/preferencias?nps=${score}&creator=${encodeURIComponent(ctx.creator.slug)}`,
    )
    let bg = '#FFFFFF'
    let color = '#121212'
    let border = '1px solid #DDD7C8'
    if (score >= 9) {
      bg = '#2A7A47'
      color = '#FFFFFF'
      border = '1px solid #2A7A47'
    } else if (score >= 7) {
      bg = '#FAFAF7'
      color = '#121212'
      border = '1px solid #DDD7C8'
    } else {
      bg = '#FFFFFF'
      color = '#666666'
      border = '1px solid #E8E4DA'
    }
    return `<td style="padding:2px;text-align:center;">
      <a href="${href}" style="display:block;background:${bg};border:${border};color:${color};font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:bold;padding:12px 0;text-decoration:none;min-width:34px;">${score}</a>
    </td>`
  }

  const freeTextHref = responseUrl(
    ctx.subscriptionId,
    stage,
    'feedback_open',
    `/dashboard/preferencias?feedback=open&creator=${encodeURIComponent(ctx.creator.slug)}`,
  )

  const inner = `
    <p style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:10px;letter-spacing:3px;color:#C41C1C;text-transform:uppercase;font-weight:bold;">Día 30 · Una pregunta honesta</p>
    <h1 style="margin:0 0 22px;font-family:Georgia,serif;font-size:28px;font-weight:bold;color:#121212;line-height:1.25;">Un mes contigo — ¿cómo va?</h1>
    <p style="margin:0 0 18px;font-family:Georgia,serif;font-size:17px;color:#333333;line-height:1.7;">${greeting} llevas un mes suscrito a <strong>${escapeHtml(ctx.creator.publicationName)}</strong>. ¿Qué tan probable es que recomiendes esta suscripción a un colega?</p>
    <p style="margin:0 0 18px;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#888888;line-height:1.6;">0 = Nada probable &nbsp;·&nbsp; 10 = Muy probable</p>

    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;">
      <tr>
        ${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(npsButton).join('')}
      </tr>
    </table>

    <div style="height:1px;background:#EEEAE0;margin:28px 0;"></div>

    <h2 style="margin:0 0 14px;font-family:Georgia,serif;font-size:20px;font-weight:bold;color:#121212;line-height:1.3;">¿Hay algo que mejoraríamos?</h2>
    <p style="margin:0 0 22px;font-family:Georgia,serif;font-size:16px;color:#444444;line-height:1.7;">Tus respuestas ayudan a ${escapeHtml(ctx.creator.name)} a mejorar lo que entrega — y nos ayudan a nosotros a construir un mejor Nebbuler.</p>

    <table cellpadding="0" cellspacing="0" border="0">
      <tr><td style="background:#121212;">
        <a href="${freeTextHref}" style="display:inline-block;background:#121212;color:#FFFFFF;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:bold;letter-spacing:2px;padding:14px 28px;text-decoration:none;text-transform:uppercase;">Dejar un comentario &rarr;</a>
      </td></tr>
    </table>

    <p style="margin:32px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#999999;line-height:1.7;font-style:italic;">Este es el último correo de la secuencia de bienvenida. A partir de aquí solo recibirás los análisis nuevos de ${escapeHtml(ctx.creator.name)} y nada más.</p>
  `

  return {
    subject,
    html: wrapEditorial({
      subject,
      publicationName: ctx.creator.publicationName,
      preheader: `Un mes contigo — ¿qué tan probable es que recomiendes ${ctx.creator.name}?`,
      inner,
      subscriptionId: ctx.subscriptionId,
      stage,
      unsubscribeUrl: unsubscribeUrl(ctx.unsubscribeToken),
    }),
  }
}
