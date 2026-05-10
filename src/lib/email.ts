import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM = 'Nebbuler <notificaciones@nebbuler.com>'

export async function sendNewPostNotification(params: {
  subscriberEmails: string[]
  creatorName: string
  creatorSlug: string
  publicationName: string
  postTitle: string
  postExcerpt: string
  postSlug: string
  isFree: boolean
}): Promise<void> {
  if (!params.subscriberEmails.length) return

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://nebbuler.com'
  const postUrl = `${baseUrl}/${params.creatorSlug}/${params.postSlug}`
  const accessLabel = params.isFree ? 'Lectura gratuita' : 'Exclusivo para suscriptores'

  const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${params.postTitle}</title>
</head>
<body style="margin:0;padding:0;background:#F7F7F7;font-family:Georgia,'Times New Roman',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F7F7F7;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border:1px solid #DEDEDE;">

          <tr><td style="height:3px;background:#C41C1C;"></td></tr>

          <tr>
            <td style="padding:24px 40px;border-bottom:1px solid #DEDEDE;">
              <a href="${baseUrl}" style="font-family:Georgia,serif;font-size:18px;font-weight:700;color:#121212;text-decoration:none;letter-spacing:0.05em;">NEBBULER</a>
            </td>
          </tr>

          <tr>
            <td style="padding:40px 40px 0;">
              <p style="margin:0;font-family:Inter,Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:#999999;">${params.publicationName}</p>
            </td>
          </tr>

          <tr>
            <td style="padding:12px 40px 0;">
              <h1 style="margin:0;font-family:Georgia,serif;font-size:28px;font-weight:700;color:#121212;line-height:1.2;">${params.postTitle}</h1>
            </td>
          </tr>

          <tr>
            <td style="padding:16px 40px 0;">
              <p style="margin:0;font-family:Inter,Arial,sans-serif;font-size:16px;color:#666666;line-height:1.6;">${params.postExcerpt}</p>
            </td>
          </tr>

          <tr>
            <td style="padding:20px 40px 0;">
              <span style="display:inline-block;font-family:Inter,Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;background:#121212;color:#ffffff;padding:4px 10px;">${accessLabel}</span>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 40px 40px;">
              <a href="${postUrl}" style="display:inline-block;background:#C41C1C;color:#ffffff;font-family:Inter,Arial,sans-serif;font-size:14px;font-weight:600;text-decoration:none;padding:14px 28px;">Leer publicación →</a>
            </td>
          </tr>

          <tr><td style="border-top:1px solid #DEDEDE;"></td></tr>

          <tr>
            <td style="padding:24px 40px;">
              <p style="margin:0;font-family:Inter,Arial,sans-serif;font-size:12px;color:#999999;line-height:1.6;">
                Recibes este correo porque eres suscriptor de <strong>${params.publicationName}</strong> en Nebbuler.<br/>
                <a href="${baseUrl}" style="color:#999999;">nebbuler.com</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

  // Resend permite hasta 50 destinatarios por llamada
  const BATCH = 50
  for (let i = 0; i < params.subscriberEmails.length; i += BATCH) {
    const batch = params.subscriberEmails.slice(i, i + BATCH)
    await resend.emails.send({
      from: FROM,
      to: batch,
      subject: `${params.postTitle} — ${params.publicationName}`,
      html,
    })
  }
}
