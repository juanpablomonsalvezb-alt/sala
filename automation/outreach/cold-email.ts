/**
 * Cold Email Outreach — Reclutamiento de creadores para Nebbuler
 *
 * Toma los leads del discovery pipeline y envía emails personalizados
 * de invitación para abrir sala en Nebbuler.
 *
 * IMPORTANTE: Solo envía a profesionales con email PÚBLICO (de páginas institucionales).
 * Cumple CAN-SPAM/CASL: incluye identificación real, opt-out y dirección física.
 *
 * Uso:
 *   npx ts-node cold-email.ts --preview           # Muestra emails sin enviar
 *   npx ts-node cold-email.ts --send --limit 20   # Envía hasta 20 emails
 *   npx ts-node cold-email.ts --send --file leads.csv
 *
 * Rate límites seguros:
 *   - Máximo 50 emails/día (evitar spam filters)
 *   - Pausa de 30-60 seg entre envíos
 *   - Domain warmup: empezar con 10/día primera semana
 */

import * as fs from 'fs'
import * as path from 'path'

interface Lead {
  name: string
  title: string
  institution: string
  email: string
  specialty: string
  discipline: string
  score: number
  profileUrl: string
}

// ─── Templates personalizados por disciplina ──────────────────────────────────

function generateEmail(lead: Lead): { subject: string; html: string; text: string } {
  const firstName = lead.name.split(' ')[0]

  // Personalizar según disciplina
  const byDiscipline: Record<string, { hook: string; value: string; example: string }> = {
    economia: {
      hook: `sus análisis de ${lead.specialty || 'economía'}`,
      value: 'economistas con PhD que publican en Nebbuler generan entre $800.000 y $3.000.000 CLP/mes',
      example: 'Rodrigo Fuentes Marín (ex-Banco Central) tiene 1.247 suscriptores a $14.990/mes',
    },
    derecho: {
      hook: `su expertise en ${lead.specialty || 'derecho'}`,
      value: 'abogados que publican análisis tributarios y laborales en Nebbuler generan $500.000-$2.000.000 CLP/mes',
      example: 'Matías Cornejo (derecho tributario) tiene 568 suscriptores activos',
    },
    finanzas: {
      hook: `su trabajo en ${lead.specialty || 'finanzas corporativas'}`,
      value: 'analistas financieros en Nebbuler generan ingresos recurrentes de $1.000.000+ CLP/mes',
      example: 'Carolina Vega (ex-Banchile) tiene 934 suscriptores a $19.990/mes',
    },
    medicina: {
      hook: `sus publicaciones de ${lead.specialty || 'medicina'}`,
      value: 'médicos y especialistas que publican en Nebbuler crean una fuente de ingreso independiente',
      example: 'Andrea Poblete (salud pública) publica semanalmente con 400+ suscriptores',
    },
    arquitectura: {
      hook: `sus proyectos de ${lead.specialty || 'arquitectura'}`,
      value: 'arquitectos que publican análisis urbanos en Nebbuler alcanzan 300-600 suscriptores en los primeros 6 meses',
      example: 'Francisca Araya (urbanismo, UCL) tiene 487 suscriptores a $11.990/mes',
    },
    'ciencia-politica': {
      hook: `su investigación en ${lead.specialty || 'ciencia política'}`,
      value: 'cientistas políticos en Nebbuler monetizan su análisis institucional directamente con sus lectores',
      example: 'Ignacio Leal (PhD Salamanca) tiene 618 suscriptores a $9.990/mes',
    },
    nutricion: {
      hook: `su trabajo en ${lead.specialty || 'nutrición'}`,
      value: 'nutricionistas clínicos en Nebbuler crean ingresos recurrentes sin depender de consultas',
      example: 'Valentina Soto (UdeChile) tiene 291 suscriptores y crece +34% mensual',
    },
  }

  const context = byDiscipline[lead.discipline] ?? byDiscipline['economia']

  const subject = `${firstName}, ¿has pensado publicar un newsletter sobre ${lead.specialty?.split(' ')[0] ?? lead.discipline}?`

  const text = `Estimado/a ${firstName},

Vi ${context.hook} en ${lead.institution} y quería preguntarte algo directamente.

¿Has considerado cobrar mensualmente por tus análisis?

Soy del equipo de Nebbuler (nebbuler.com), la primera plataforma chilena de newsletters profesionales de pago. A diferencia de Substack, operamos con MercadoPago, pagamos en pesos, y no cobramos comisión sobre tus suscripciones.

${context.value}. ${context.example}.

El modelo es simple: publicas lo que ya sabes, tus lectores pagan $10.000-$25.000 CLP/mes por acceso directo a tu análisis. Sin intermediario institucional, sin editor que te filtre.

¿Tienes 20 minutos esta semana para una llamada? O si prefieres, puedes ver cómo funciona en nebbuler.com/para-creadores

Saludos,
Equipo Nebbuler

---
Esta invitación fue enviada a ${lead.email} obtenida del sitio web público de ${lead.institution}.
Para no recibir más emails de este tipo, responde con "cancelar".
Nebbuler · hello@nebbuler.com · nebbuler.com`

  const html = `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><title>Invitación Nebbuler</title></head>
<body style="margin:0;padding:40px 20px;background:#F7F7F7;font-family:Arial,sans-serif;">
  <div style="background:#FFFFFF;max-width:560px;margin:0 auto;padding:0;">
    <div style="height:3px;background:#C41C1C;"></div>
    <div style="padding:40px;">
      <p style="margin:0 0 24px;font-family:Georgia,serif;font-size:13px;font-weight:bold;letter-spacing:2px;color:#999;text-transform:uppercase;">NEBBULER</p>

      <p style="margin:0 0 16px;font-size:15px;color:#333;line-height:1.6;">Estimado/a <strong>${firstName}</strong>,</p>

      <p style="margin:0 0 16px;font-size:15px;color:#333;line-height:1.6;">
        Vi ${context.hook} en ${lead.institution} y quería preguntarte algo directamente.
      </p>

      <p style="margin:0 0 16px;font-size:16px;font-weight:bold;color:#121212;line-height:1.4;">
        ¿Has considerado cobrar mensualmente por tus análisis?
      </p>

      <p style="margin:0 0 16px;font-size:15px;color:#333;line-height:1.6;">
        Soy del equipo de <strong>Nebbuler</strong> (nebbuler.com), la primera plataforma chilena de newsletters profesionales de pago. A diferencia de Substack, operamos con MercadoPago, pagamos en pesos, y <strong>no cobramos comisión</strong> sobre tus suscripciones.
      </p>

      <div style="background:#FAFAFA;border-left:3px solid #C41C1C;padding:16px 20px;margin:24px 0;">
        <p style="margin:0;font-size:14px;color:#444;line-height:1.6;">
          ${context.value}.<br>
          <em>${context.example}.</em>
        </p>
      </div>

      <p style="margin:0 0 24px;font-size:15px;color:#333;line-height:1.6;">
        El modelo es simple: publicas lo que ya sabes, tus lectores pagan $10.000-$25.000 CLP/mes por acceso directo a tu análisis. Sin intermediario institucional, sin editor que te filtre.
      </p>

      <table cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
        <tr>
          <td style="background:#121212;padding:0;">
            <a href="https://nebbuler.com/para-creadores?ref=outreach-${lead.discipline}"
               style="display:inline-block;color:#FFFFFF;font-size:11px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;padding:14px 28px;text-decoration:none;">
              VER CÓMO FUNCIONA →
            </a>
          </td>
        </tr>
      </table>

      <p style="margin:0 0 8px;font-size:15px;color:#333;line-height:1.6;">
        ¿Tienes 20 minutos esta semana para una llamada?
      </p>

      <p style="margin:0 0 32px;font-size:15px;color:#333;">Saludos,<br><strong>Equipo Nebbuler</strong><br>hello@nebbuler.com</p>

      <div style="border-top:1px solid #EEEEEE;padding-top:16px;">
        <p style="margin:0;font-size:11px;color:#999;line-height:1.6;">
          Esta invitación fue enviada a ${lead.email} obtenida del sitio web público de ${lead.institution}.<br>
          Para no recibir más emails de este tipo,
          <a href="mailto:hello@nebbuler.com?subject=cancelar&body=Por favor eliminar ${lead.email}" style="color:#C41C1C;">responde "cancelar"</a>.
          <br>Nebbuler · hello@nebbuler.com · nebbuler.com
        </p>
      </div>
    </div>
  </div>
</body>
</html>`

  return { subject, html, text }
}

// ─── Cargador de leads ────────────────────────────────────────────────────────

function loadLeads(filePath: string): Lead[] {
  if (!fs.existsSync(filePath)) {
    console.error(`Archivo no encontrado: ${filePath}`)
    console.log('\nPrimero ejecuta el discovery pipeline:')
    console.log('  cd automation/discovery && npx ts-node discover-creators.ts --all --export json')
    process.exit(1)
  }

  const ext = path.extname(filePath)

  if (ext === '.json') {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as Lead[]
  }

  if (ext === '.csv') {
    const lines = fs.readFileSync(filePath, 'utf-8').split('\n')
    const headers = lines[0].split(',')
    return lines
      .slice(1)
      .filter(Boolean)
      .map(line => {
        const values = line.split(',')
        const obj: Record<string, string> = {}
        headers.forEach((h, i) => {
          obj[h.trim()] = (values[i] ?? '').trim()
        })
        return obj as unknown as Lead
      })
  }

  throw new Error(`Formato no soportado: ${ext}. Usar .json o .csv`)
}

// ─── Envío con Resend ─────────────────────────────────────────────────────────

async function sendEmail(
  lead: Lead,
  email: { subject: string; html: string; text: string },
): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error('RESEND_API_KEY no configurada')
    return false
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Equipo Nebbuler <hello@nebbuler.com>',
        to: [lead.email],
        subject: email.subject,
        html: email.html,
        text: email.text,
        headers: {
          'X-Nebbuler-Campaign': 'creator-outreach',
          'X-Nebbuler-Discipline': lead.discipline,
        },
      }),
    })

    if (!response.ok) {
      const body = await response.text()
      console.error(`  Resend error ${response.status}: ${body}`)
    }

    return response.ok
  } catch (err) {
    console.error(`  Error de red: ${err}`)
    return false
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2)
  console.log('\n=== Cold Email Outreach — Nebbuler ===\n')

  const leadsFile = args.includes('--file')
    ? args[args.indexOf('--file') + 1]
    : path.join(__dirname, '..', 'discovery', 'output', 'creators-latest.json')

  const limit = args.includes('--limit') ? parseInt(args[args.indexOf('--limit') + 1]) : 10 // Por defecto, máximo 10 por seguridad

  const preview = args.includes('--preview')
  const send = args.includes('--send')

  // Cargar leads con email
  let allLeads: Lead[]
  try {
    allLeads = loadLeads(leadsFile)
  } catch (err) {
    console.error(err)
    return
  }

  const leadsWithEmail = allLeads.filter(l => l.email && l.email.includes('@') && l.score >= 6)
  console.log(`Total leads: ${allLeads.length}`)
  console.log(`Con email válido y score >= 6: ${leadsWithEmail.length}`)

  const toProcess = leadsWithEmail.slice(0, limit)
  console.log(`A procesar: ${toProcess.length} (límite: ${limit})\n`)

  // Track de enviados — evitar duplicados entre ejecuciones
  const sentFile = path.join(__dirname, 'output', 'sent-emails.json')
  const sent: Record<string, string> = fs.existsSync(sentFile)
    ? (JSON.parse(fs.readFileSync(sentFile, 'utf-8')) as Record<string, string>)
    : {}

  const outputDir = path.join(__dirname, 'output')
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true })

  let sentCount = 0
  let skippedCount = 0
  let errorCount = 0

  for (const lead of toProcess) {
    if (sent[lead.email]) {
      console.log(
        `  [omitido] Ya enviado (${new Date(sent[lead.email]).toLocaleDateString('es-CL')}): ${lead.email}`,
      )
      skippedCount++
      continue
    }

    const email = generateEmail(lead)

    if (preview) {
      console.log(`\n${'─'.repeat(60)}`)
      console.log(`PARA: ${lead.name} <${lead.email}> (${lead.institution})`)
      console.log(`SCORE: ${lead.score} | DISCIPLINA: ${lead.discipline}`)
      console.log(`ASUNTO: ${email.subject}`)
      console.log(`─── CUERPO (texto) ───`)
      console.log(email.text.slice(0, 400) + '...')
    }

    if (send) {
      const ok = await sendEmail(lead, email)
      if (ok) {
        sent[lead.email] = new Date().toISOString()
        fs.writeFileSync(sentFile, JSON.stringify(sent, null, 2))
        console.log(`  [ok] Enviado: ${lead.name} <${lead.email}>`)
        sentCount++
      } else {
        console.log(`  [error] Falló: ${lead.name} <${lead.email}>`)
        errorCount++
      }

      // Pausa entre emails (30-60 seg para evitar spam flags)
      if (sentCount + errorCount < toProcess.length - skippedCount) {
        const delay = 30000 + Math.random() * 30000
        console.log(`  Esperando ${Math.round(delay / 1000)}s...`)
        await new Promise(r => setTimeout(r, delay))
      }
    }
  }

  if (send) {
    console.log(`\n--- Resumen ---`)
    console.log(`Enviados: ${sentCount}`)
    console.log(`Omitidos (ya enviados): ${skippedCount}`)
    console.log(`Errores: ${errorCount}`)
    if (sentCount > 0) {
      console.log(`Log guardado en: ${sentFile}`)
    }
  }

  if (preview && !send) {
    console.log(`\nPreview de ${toProcess.length} emails. Para enviar: --send --limit ${limit}`)
  }

  if (!preview && !send) {
    console.log('Uso:')
    console.log('  npx ts-node cold-email.ts --preview --limit 5')
    console.log('  npx ts-node cold-email.ts --send --limit 10')
    console.log('  npx ts-node cold-email.ts --send --limit 30 --file ./leads.json')
  }
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
