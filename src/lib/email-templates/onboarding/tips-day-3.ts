// Stage 1 — Día 3: cómo aprovechar mejor la suscripción.

import {
  clickUrl,
  escapeHtml,
  OnboardingContext,
  unsubscribeUrl,
  wrapEditorial,
} from './_shared'

export interface TipsEmail {
  subject: string
  html: string
}

export function buildTipsDay3Email(ctx: OnboardingContext): TipsEmail {
  const stage = 'tips_day_3' as const
  const subject = `Tu suscripción a ${ctx.creator.name}: 3 formas de aprovecharla mejor`
  const greeting = ctx.subscriber.firstName
    ? `Hola ${escapeHtml(ctx.subscriber.firstName)},`
    : 'Hola,'

  const tip1Url = clickUrl(ctx.subscriptionId, stage, '/dashboard/preferencias', 'tip-whatsapp')
  const tip2Url = clickUrl(ctx.subscriptionId, stage, `/${ctx.creator.slug}`, 'tip-share')
  const tip3Url = clickUrl(ctx.subscriptionId, stage, '/dashboard/referidos', 'tip-refer')

  const tipBlock = (
    n: string,
    title: string,
    body: string,
    href: string,
    cta: string,
  ): string => `
    <tr><td style="padding:0 0 28px 0;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="width:36px;padding:0 14px 0 0;vertical-align:top;">
            <div style="width:32px;height:32px;background:#FAFAF7;border:1px solid #E8E4DA;text-align:center;line-height:30px;font-family:Georgia,serif;font-size:14px;font-weight:bold;color:#C41C1C;">${n}</div>
          </td>
          <td style="vertical-align:top;">
            <h3 style="margin:0 0 8px;font-family:Georgia,serif;font-size:18px;font-weight:bold;color:#121212;line-height:1.3;">${title}</h3>
            <p style="margin:0 0 12px;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#555555;line-height:1.7;">${body}</p>
            <a href="${href}" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:bold;letter-spacing:2px;color:#C41C1C;text-decoration:none;text-transform:uppercase;">${cta} &rarr;</a>
          </td>
        </tr>
      </table>
    </td></tr>`

  const inner = `
    <p style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:10px;letter-spacing:3px;color:#C41C1C;text-transform:uppercase;font-weight:bold;">Día 3 · Guía rápida</p>
    <h1 style="margin:0 0 22px;font-family:Georgia,serif;font-size:28px;font-weight:bold;color:#121212;line-height:1.25;">Tres formas de sacarle más a tu suscripción</h1>
    <p style="margin:0 0 28px;font-family:Georgia,serif;font-size:17px;color:#333333;line-height:1.7;">${greeting} llevas 3 días suscrito a <strong>${escapeHtml(ctx.creator.publicationName)}</strong>. Estas son tres cosas concretas que la gran mayoría de lectores no hace — y que sí marcan la diferencia.</p>

    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      ${tipBlock(
        '1',
        'Activa notificaciones por WhatsApp',
        'Los nuevos análisis te llegan también por WhatsApp (gratis, sin app) para que no se pierdan entre tu correo. Toma menos de 30 segundos configurarlo.',
        tip1Url,
        'Activar WhatsApp',
      )}
      ${tipBlock(
        '2',
        `Comparte un análisis que te haya gustado`,
        `Cada vez que compartes un análisis, ayudas a ${escapeHtml(ctx.creator.name)} a llegar a más personas — y nos demuestras qué temas resuenan. Entra al perfil y elige tu favorito.`,
        tip2Url,
        `Ver perfil de ${escapeHtml(ctx.creator.name)}`,
      )}
      ${tipBlock(
        '3',
        'Refiere a un colega y gana 1 mes gratis',
        'Por cada colega que se suscriba con tu código, te regalamos un mes adicional. Sin límite. Funciona para todas tus suscripciones en Nebbuler.',
        tip3Url,
        'Obtener mi código',
      )}
    </table>

    <p style="margin:24px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#999999;line-height:1.7;font-style:italic;">No tienes que hacer las tres. Empieza por la que más te sirva.</p>
  `

  return {
    subject,
    html: wrapEditorial({
      subject,
      publicationName: ctx.creator.publicationName,
      preheader: 'Tres acciones rápidas para sacarle más a tu suscripción.',
      inner,
      subscriptionId: ctx.subscriptionId,
      stage,
      unsubscribeUrl: unsubscribeUrl(ctx.unsubscribeToken),
    }),
  }
}
