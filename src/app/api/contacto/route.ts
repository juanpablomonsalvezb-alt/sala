import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { rateLimit, getClientIp } from '@/lib/rateLimit'

export const runtime = 'nodejs'

function getResend(): Resend {
  const key = process.env.RESEND_API_KEY
  if (!key) throw new Error('RESEND_API_KEY missing')
  return new Resend(key)
}

const RECIPIENT = 'juanpablo.monsalvezb@gmail.com'

// Email injection: validar que no haya CRLF (header injection en SMTP headers)
function isSafeEmail(email: string): boolean {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return false
  // Bloquear caracteres de control que puedan inyectar headers
  // eslint-disable-next-line no-control-regex
  return !/[\r\n\x00]/.test(email)
}

const INQUIRY_LABELS: Record<string, string> = {
  'creador':  'Quiero abrir mi sala como creador',
  'lector':   'Soy lector con una consulta',
  'prensa':   'Consulta de prensa / medios',
  'empresa':  'Propuesta comercial',
  'soporte':  'Soporte técnico',
  'otro':     'Otro',
}

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 10 mensajes / hora por IP. Frena bombs de email sin frustrar
    // a usuarios que reenvían tras error de validación.
    const ip = getClientIp(request.headers)
    const rl = rateLimit(`contacto:${ip}`, 10, 60 * 60 * 1000)
    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'Demasiadas solicitudes. Intenta más tarde.' },
        { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } }
      )
    }

    const body = await request.json()
    const { nombre, email, tipo, mensaje } = body as {
      nombre?: string
      email?: string
      tipo?: string
      mensaje?: string
    }

    // Validaciones
    if (!nombre || nombre.trim().length < 2) {
      return NextResponse.json({ error: 'El nombre es requerido.' }, { status: 400 })
    }
    if (!email || !isSafeEmail(email)) {
      return NextResponse.json({ error: 'Email inválido.' }, { status: 400 })
    }
    if (!mensaje || mensaje.trim().length < 10) {
      return NextResponse.json({ error: 'El mensaje es demasiado corto.' }, { status: 400 })
    }

    const tipoLabel = INQUIRY_LABELS[tipo ?? 'otro'] ?? 'Otro'
    const nombreLimpio = nombre.trim().slice(0, 100)
    const mensajeLimpio = mensaje.trim().slice(0, 5000)

    if (!process.env.RESEND_API_KEY) {
      console.error('[contacto] RESEND_API_KEY no configurada')
      return NextResponse.json({ error: 'Error de configuración.' }, { status: 500 })
    }

    await getResend().emails.send({
      from: 'Nebbuler Contacto <noreply@nebbuler.com>',
      to: RECIPIENT,
      replyTo: email,
      subject: `[Nebbuler] ${tipoLabel} — ${nombreLimpio}`,
      html: emailHtml({ nombre: nombreLimpio, email, tipo: tipoLabel, mensaje: mensajeLimpio }),
      text: `NEBBULER — CONTACTO\n\nNombre: ${nombreLimpio}\nEmail: ${email}\nTipo: ${tipoLabel}\n\nMensaje:\n${mensajeLimpio}`,
    })

    // Confirmación al remitente
    await getResend().emails.send({
      from: 'Nebbuler <noreply@nebbuler.com>',
      to: email,
      subject: 'Recibimos tu mensaje — Nebbuler',
      html: confirmationHtml(nombreLimpio),
    }).catch(() => {}) // no bloquear si falla la confirmación

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[contacto] error:', err)
    return NextResponse.json({ error: 'Error interno. Inténtalo de nuevo.' }, { status: 500 })
  }
}

function emailHtml(data: {
  nombre: string
  email: string
  tipo: string
  mensaje: string
}): string {
  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><title>Contacto Nebbuler</title></head>
<body style="margin:0;padding:40px 20px;background:#F7F7F7;font-family:Arial,sans-serif;">
  <div style="background:#FFFFFF;max-width:600px;margin:0 auto;">
    <div style="height:4px;background:#C41C1C;"></div>
    <div style="padding:40px;">
      <p style="margin:0 0 32px;font-family:Georgia,serif;font-size:11px;font-weight:bold;letter-spacing:3px;color:#999;text-transform:uppercase;">NEBBULER · CONTACTO</p>

      <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 32px;">
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #EEEEEE;font-size:12px;color:#999;width:120px;font-family:Arial,sans-serif;letter-spacing:1px;text-transform:uppercase;">Nombre</td>
          <td style="padding:12px 0;border-bottom:1px solid #EEEEEE;font-size:15px;color:#121212;font-family:Georgia,serif;font-weight:bold;">${data.nombre}</td>
        </tr>
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #EEEEEE;font-size:12px;color:#999;font-family:Arial,sans-serif;letter-spacing:1px;text-transform:uppercase;">Email</td>
          <td style="padding:12px 0;border-bottom:1px solid #EEEEEE;font-size:15px;color:#C41C1C;font-family:Arial,sans-serif;"><a href="mailto:${data.email}" style="color:#C41C1C;text-decoration:none;">${data.email}</a></td>
        </tr>
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #EEEEEE;font-size:12px;color:#999;font-family:Arial,sans-serif;letter-spacing:1px;text-transform:uppercase;">Consulta</td>
          <td style="padding:12px 0;border-bottom:1px solid #EEEEEE;font-size:14px;color:#444;font-family:Arial,sans-serif;">${data.tipo}</td>
        </tr>
      </table>

      <p style="margin:0 0 12px;font-size:12px;color:#999;letter-spacing:1px;text-transform:uppercase;font-family:Arial,sans-serif;">Mensaje</p>
      <div style="background:#FAFAFA;border-left:3px solid #C41C1C;padding:20px 24px;">
        <p style="margin:0;font-size:15px;color:#333;line-height:1.7;font-family:Georgia,serif;white-space:pre-wrap;">${data.mensaje.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
      </div>

      <div style="margin-top:32px;padding-top:24px;border-top:1px solid #EEEEEE;">
        <a href="mailto:${data.email}" style="display:inline-block;background:#121212;color:#FFFFFF;font-family:Arial,sans-serif;font-size:11px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;padding:12px 24px;text-decoration:none;">Responder →</a>
      </div>
    </div>
  </div>
</body>
</html>`
}

function confirmationHtml(nombre: string): string {
  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><title>Nebbuler</title></head>
<body style="margin:0;padding:40px 20px;background:#F7F7F7;font-family:Arial,sans-serif;">
  <div style="background:#FFFFFF;max-width:560px;margin:0 auto;">
    <div style="height:4px;background:#C41C1C;"></div>
    <div style="padding:48px 40px;">
      <p style="margin:0 0 32px;font-family:Georgia,serif;font-size:11px;font-weight:bold;letter-spacing:3px;color:#999;text-transform:uppercase;">NEBBULER</p>
      <h1 style="margin:0 0 16px;font-family:Georgia,serif;font-size:24px;font-weight:bold;color:#121212;">Recibimos tu mensaje, ${nombre.split(' ')[0]}.</h1>
      <p style="margin:0 0 24px;font-size:15px;color:#444;line-height:1.7;font-family:Arial,sans-serif;">Te responderemos a la brevedad. Mientras tanto, puedes explorar el directorio de profesionales verificados en Nebbuler.</p>
      <a href="https://nebbuler.com/directorio" style="display:inline-block;background:#121212;color:#FFFFFF;font-family:Arial,sans-serif;font-size:11px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;padding:12px 24px;text-decoration:none;">Ver directorio →</a>
      <div style="margin-top:40px;padding-top:24px;border-top:1px solid #EEEEEE;">
        <p style="margin:0;font-size:11px;color:#999;font-family:Arial,sans-serif;">nebbuler.com · hello@nebbuler.com</p>
      </div>
    </div>
  </div>
</body>
</html>`
}
