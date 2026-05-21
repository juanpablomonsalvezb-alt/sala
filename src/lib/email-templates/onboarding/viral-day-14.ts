// Stage 3 — Día 14: invitación a compartir un quote favorito.
// Loop viral: cada quote compartido amplifica el alcance del creador.

import {
  BASE_URL,
  clickUrl,
  escapeHtml,
  OnboardingContext,
  unsubscribeUrl,
  wrapEditorial,
} from './_shared'

export interface ViralQuote {
  text: string
  postTitle: string
  postSlug: string
}

export interface ViralEmail {
  subject: string
  html: string
}

export function buildViralDay14Email(
  ctx: OnboardingContext,
  quotes: ViralQuote[],
): ViralEmail {
  const stage = 'viral_day_14' as const
  const subject = `Comparte tu cita favorita de ${ctx.creator.name}`
  const greeting = ctx.subscriber.firstName
    ? `Hola ${escapeHtml(ctx.subscriber.firstName)},`
    : 'Hola,'

  const quoteBlock = (q: ViralQuote, i: number): string => {
    const postUrl = `${BASE_URL}/${ctx.creator.slug}/${q.postSlug}`
    const quoteText = `"${q.text}" — ${ctx.creator.name}`
    const twHref = clickUrl(
      ctx.subscriptionId,
      stage,
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(quoteText)}&url=${encodeURIComponent(postUrl)}`,
      `share:tw:${i + 1}`,
    )
    const liHref = clickUrl(
      ctx.subscriptionId,
      stage,
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`,
      `share:li:${i + 1}`,
    )
    const waHref = clickUrl(
      ctx.subscriptionId,
      stage,
      `https://wa.me/?text=${encodeURIComponent(quoteText + ' ' + postUrl)}`,
      `share:wa:${i + 1}`,
    )

    return `
      <tr><td style="padding:0 0 28px 0;border-bottom:1px solid #EEEAE0;">
        <p style="margin:0 0 14px;font-family:Georgia,serif;font-size:18px;font-weight:normal;color:#121212;line-height:1.55;font-style:italic;">&ldquo;${escapeHtml(q.text.slice(0, 220))}${q.text.length > 220 ? '…' : ''}&rdquo;</p>
        <p style="margin:0 0 16px;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:1px;color:#999999;text-transform:uppercase;">De: ${escapeHtml(q.postTitle)}</p>
        <table cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="padding-right:8px;"><a href="${twHref}" style="display:inline-block;background:#121212;color:#FFFFFF;font-family:Arial,Helvetica,sans-serif;font-size:10px;font-weight:bold;letter-spacing:2px;padding:10px 16px;text-decoration:none;text-transform:uppercase;">Twitter</a></td>
            <td style="padding-right:8px;"><a href="${liHref}" style="display:inline-block;background:#121212;color:#FFFFFF;font-family:Arial,Helvetica,sans-serif;font-size:10px;font-weight:bold;letter-spacing:2px;padding:10px 16px;text-decoration:none;text-transform:uppercase;">LinkedIn</a></td>
            <td><a href="${waHref}" style="display:inline-block;background:#121212;color:#FFFFFF;font-family:Arial,Helvetica,sans-serif;font-size:10px;font-weight:bold;letter-spacing:2px;padding:10px 16px;text-decoration:none;text-transform:uppercase;">WhatsApp</a></td>
          </tr>
        </table>
      </td></tr>`
  }

  const quotesHtml = quotes.length
    ? quotes.slice(0, 3).map(quoteBlock).join('')
    : `<tr><td style="padding:0 0 28px 0;"><p style="margin:0;font-family:Georgia,serif;font-size:16px;color:#666666;font-style:italic;">Aún no tenemos quotes destacados — pero apenas ${escapeHtml(ctx.creator.name)} publique uno nuevo, te llegará al correo y podrás compartirlo.</p></td></tr>`

  const inner = `
    <p style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:10px;letter-spacing:3px;color:#C41C1C;text-transform:uppercase;font-weight:bold;">Día 14 · Comparte una cita</p>
    <h1 style="margin:0 0 22px;font-family:Georgia,serif;font-size:28px;font-weight:bold;color:#121212;line-height:1.25;">Una idea que valga la pena compartir</h1>
    <p style="margin:0 0 28px;font-family:Georgia,serif;font-size:17px;color:#333333;line-height:1.7;">${greeting} ¿hay alguna frase de los últimos análisis de ${escapeHtml(ctx.creator.name)} que te haya marcado? Compártela con un click y haz crecer la conversación.</p>

    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      ${quotesHtml}
    </table>

    <p style="margin:24px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#999999;line-height:1.7;font-style:italic;">Cada quote que compartes ayuda a ${escapeHtml(ctx.creator.name)} a llegar a más personas — y a Nebbuler a sostener este tipo de periodismo.</p>
  `

  return {
    subject,
    html: wrapEditorial({
      subject,
      publicationName: ctx.creator.publicationName,
      preheader: `Comparte una cita destacada de ${ctx.creator.name} con un click.`,
      inner,
      subscriptionId: ctx.subscriptionId,
      stage,
      unsubscribeUrl: unsubscribeUrl(ctx.unsubscribeToken),
    }),
  }
}
