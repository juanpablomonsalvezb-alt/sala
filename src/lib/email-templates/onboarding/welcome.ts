// Stage 0 — Bienvenida + 3 posts top del creador.
// Se envía el mismo día que se crea la suscripción.

import {
  BASE_URL,
  clickUrl,
  escapeHtml,
  OnboardingContext,
  unsubscribeUrl,
  wrapEditorial,
} from './_shared'

export interface WelcomePost {
  title: string
  slug: string
  excerpt: string | null
  publishedAt: string | null
}

export interface WelcomeEmail {
  subject: string
  html: string
}

export function buildWelcomeEmail(
  ctx: OnboardingContext,
  topPosts: WelcomePost[],
): WelcomeEmail {
  const stage = 'welcome' as const
  const subject = `Bienvenido a ${ctx.creator.name} — esto es lo que viene`
  const greeting = ctx.subscriber.firstName
    ? `Hola ${escapeHtml(ctx.subscriber.firstName)},`
    : 'Hola,'

  const postsHtml = topPosts.length
    ? topPosts
        .map((p) => {
          const postPath = `/${ctx.creator.slug}/${p.slug}`
          const trackedUrl = clickUrl(ctx.subscriptionId, stage, postPath, `top:${p.slug}`)
          const date = p.publishedAt
            ? new Date(p.publishedAt).toLocaleDateString('es-CL', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })
            : ''
          return `
        <tr><td style="padding:0 0 24px 0;border-bottom:1px solid #EEEAE0;margin-bottom:24px;">
          ${date ? `<p style="margin:0 0 6px;font-family:Arial,Helvetica,sans-serif;font-size:10px;letter-spacing:2px;color:#999999;text-transform:uppercase;">${escapeHtml(date)}</p>` : ''}
          <h3 style="margin:0 0 10px;font-family:Georgia,serif;font-size:18px;font-weight:bold;color:#121212;line-height:1.3;">
            <a href="${trackedUrl}" style="color:#121212;text-decoration:none;">${escapeHtml(p.title)}</a>
          </h3>
          ${p.excerpt ? `<p style="margin:0 0 12px;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#555555;line-height:1.65;">${escapeHtml(p.excerpt.slice(0, 180))}${p.excerpt.length > 180 ? '…' : ''}</p>` : ''}
          <a href="${trackedUrl}" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:bold;letter-spacing:2px;color:#C41C1C;text-decoration:none;text-transform:uppercase;">Leer &rarr;</a>
        </td></tr>`
        })
        .join('')
    : ''

  const subsLink = clickUrl(ctx.subscriptionId, stage, '/mis-suscripciones', 'my-subs')

  const inner = `
    <p style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:10px;letter-spacing:3px;color:#C41C1C;text-transform:uppercase;font-weight:bold;">Tu suscripción comenzó</p>
    <h1 style="margin:0 0 22px;font-family:Georgia,serif;font-size:30px;font-weight:bold;color:#121212;line-height:1.2;">Bienvenido a ${escapeHtml(ctx.creator.name)}</h1>
    <p style="margin:0 0 16px;font-family:Georgia,serif;font-size:17px;color:#333333;line-height:1.65;">${greeting}</p>
    <p style="margin:0 0 16px;font-family:Georgia,serif;font-size:17px;color:#333333;line-height:1.65;">Gracias por sumarte a <strong>${escapeHtml(ctx.creator.publicationName)}</strong>. Cada análisis llega directo a tu correo apenas se publica, sin algoritmos de por medio.</p>
    ${ctx.creator.bio ? `<p style="margin:0 0 28px;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#666666;line-height:1.7;font-style:italic;border-left:3px solid #EEEAE0;padding-left:14px;">${escapeHtml(ctx.creator.bio.slice(0, 280))}</p>` : ''}

    ${
      topPosts.length
        ? `
    <p style="margin:32px 0 18px;font-family:Arial,Helvetica,sans-serif;font-size:10px;letter-spacing:3px;color:#888888;text-transform:uppercase;font-weight:bold;">Para empezar — sus 3 análisis más leídos</p>
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      ${postsHtml}
    </table>`
        : ''
    }

    <p style="margin:32px 0 22px;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#666666;line-height:1.7;">¿Tienes varias suscripciones en Nebbuler? Gestiona todas desde un solo lugar.</p>

    <table cellpadding="0" cellspacing="0" border="0">
      <tr><td style="background:#121212;">
        <a href="${subsLink}" style="display:inline-block;background:#121212;color:#FFFFFF;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;padding:14px 28px;text-decoration:none;">Ver mis suscripciones &rarr;</a>
      </td></tr>
    </table>
  `

  return {
    subject,
    html: wrapEditorial({
      subject,
      publicationName: ctx.creator.publicationName,
      preheader: `Tus 3 análisis recomendados de ${ctx.creator.name} para empezar.`,
      inner,
      subscriptionId: ctx.subscriptionId,
      stage,
      unsubscribeUrl: unsubscribeUrl(ctx.unsubscribeToken),
    }),
  }
}
