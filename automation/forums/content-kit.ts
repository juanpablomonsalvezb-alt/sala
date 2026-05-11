/**
 * Forum Content Kit — Nebbuler
 *
 * Genera posts listos para publicar en comunidades específicas.
 * Cada template respeta las reglas de la plataforma destino.
 * El link a Nebbuler va en la firma, no en el cuerpo del post.
 *
 * Uso:
 *   npx ts-node content-kit.ts --list
 *   npx ts-node content-kit.ts --template reddit-chile-inflacion
 *   npx ts-node content-kit.ts --template linkedin-newsletter-launch
 *   npx ts-node content-kit.ts --all
 */

import * as fs from 'fs'
import * as path from 'path'

// ─── Reglas por plataforma ────────────────────────────────────────────────────

const PLATFORM_RULES: Record<
  string,
  {
    maxSelfPromotion: string
    tone: string
    linkPolicy: string
    bestPractices: string[]
    warningLabel: string
  }
> = {
  reddit: {
    maxSelfPromotion: 'Regla 9:1 de Reddit — 9 contribuciones de valor por cada 1 con link propio',
    tone: 'Conversacional, directo. Sin jerga corporativa. Emojis mínimos o ninguno.',
    linkPolicy:
      'Link a Nebbuler SOLO en la firma. En el cuerpo, NO. Poner link en comentario propio si el subreddit lo permite.',
    bestPractices: [
      'Responder completo, sin dejar nada para "click aquí"',
      'Participar en otras discusiones antes de publicar contenido propio',
      'Responder TODOS los comentarios de tu post en las primeras 3 horas',
      'Evitar posts puramente promocionales hasta los 3 meses de antigüedad en el subreddit',
      'Usar flair si el subreddit lo tiene disponible',
      'Si alguien te pide más info, dar más info — no mandar a tu newsletter directamente',
    ],
    warningLabel: 'ANTI-SPAM',
  },
  linkedin: {
    maxSelfPromotion: 'Ilimitado si el contenido es genuinamente valioso',
    tone: 'Profesional pero personal. Primera persona singular. Narrativa antes que argumentación.',
    linkPolicy:
      'El link en el PRIMER COMENTARIO, NO en el post principal. LinkedIn penaliza posts con links externos en el feed.',
    bestPractices: [
      'Hook de 2 líneas que genere curiosidad antes del "...ver más"',
      'Párrafos de 1-2 líneas máximo (el feed lo exige)',
      'Terminar siempre con una pregunta abierta para generar comentarios',
      'Publicar martes o miércoles entre 8:00-10:00 AM hora Chile',
      'Responder TODOS los comentarios en las primeras 2 horas (el algoritmo lo premia)',
      'No usar más de 3 hashtags relevantes al final',
      'Poner el link de tu newsletter en el primer comentario con "Link en comentarios →"',
    ],
    warningLabel: 'ALGORITMO',
  },
  hackernews: {
    maxSelfPromotion: 'Solo con prefijo Show HN o Ask HN cuando aplica exactamente',
    tone: 'Técnico, preciso, sin hipérboles. La comunidad penaliza el "startup speak". Ser honesto sobre limitaciones.',
    linkPolicy: 'Link en el título del post (forma estándar de HN). CERO links en comentarios excepto fuentes.',
    bestPractices: [
      'Formato: Show HN: [Nombre del producto] – [descripción honesta en 1 línea]',
      'Primer comentario: detalles técnicos del stack, decisiones de arquitectura, por qué construiste esto',
      'Responder preguntas con honestidad incluyendo debilidades — HN respeta la transparencia',
      'Publicar entre 9:00-12:00 AM hora San Francisco (17:00-20:00 Chile)',
      'No responder a críticas con defensividad — agradece y explica',
    ],
    warningLabel: 'TECNICO',
  },
  producthunt: {
    maxSelfPromotion: 'Plataforma de lanzamiento — 100% autopromotivo es esperado y bienvenido',
    tone: 'Entusiasta pero honesto. Tagline < 60 caracteres. Problem-solution framing.',
    linkPolicy: 'Link directo al producto en el listing. Primer comentario: contexto del founder.',
    bestPractices: [
      'Lanzar martes o miércoles (más votos que lunes o fines de semana)',
      'Tener al menos 50 upvoters confirmados de tu red el día del lanzamiento',
      'Primer hunter con historial en PH mejora resultados significativamente',
      'Galería de 3-5 screenshots de calidad premium (no mockups genéricos)',
      'Video de demo de 2-3 minutos, editado, con subtítulos',
      'Responder CADA comentario el día del lanzamiento — PH premia la actividad del founder',
      'Publicar el launch en tu newsletter el día anterior como "preview exclusivo para suscriptores"',
    ],
    warningLabel: 'LAUNCH',
  },
  'quora-es': {
    maxSelfPromotion: 'Firma con link al final de cada respuesta. Máximo 1 link propio por respuesta.',
    tone: 'Experto accesible. Primera persona. Ejemplos locales (Chile/LATAM).',
    linkPolicy: 'Link de Nebbuler solo en la firma al final. NO en el cuerpo de la respuesta.',
    bestPractices: [
      'Responder la pregunta directamente en el primer párrafo',
      'Mínimo 400-600 palabras para que rankee en Google',
      'Incluir subtítulos en negrita para el SEO de Quora',
      'Buscar la misma pregunta en Google — responder también las variantes que aparezcan',
      'Agregar la respuesta a tu "Espacio" en Quora si tienes uno',
      'Compartir la respuesta publicada en tu newsletter y redes',
    ],
    warningLabel: 'SEO',
  },
}

// ─── Templates de contenido ───────────────────────────────────────────────────

interface ContentTemplate {
  title?: () => string
  tagline?: () => string
  body: () => string
  platform: string
  creator: string
  topic: string
  notes?: string
}

const CONTENT_TEMPLATES: Record<string, ContentTemplate> = {
  // ── Reddit Chile — Economía ───────────────────────────────────────────────
  'reddit-chile-inflacion': {
    platform: 'reddit',
    creator: 'Rodrigo Fuentes Marín',
    topic: 'Inflación IPC servicios Chile 2026',
    title: () =>
      'Análisis: por qué la inflación en Chile no baja al ritmo que espera el mercado (IPC servicios atrapado)',
    body: () => `Llevo meses siguiendo los datos del INE y hay algo que se subestima en los medios generales.

**El problema real: el IPC servicios está pegado en ~5%**

Mientras la inflación de bienes ha bajado casi a niveles normales (2-3%), la inflación de servicios sigue por encima del 5%. Este es el "último kilómetro" del proceso de desinflación que el Banco Central tiene que resolver.

¿Por qué importa? Porque el IPC servicios está fuertemente correlacionado con salarios y expectativas de largo plazo. No responde de la misma forma a la política monetaria que los bienes transables.

**Los datos actuales:**
- Inflación de bienes: ~2.4%
- Inflación de servicios: ~5.1%
- Meta del Banco Central: 3%

**Por qué el BC no puede recortar rápido**

Cada recorte de TPM prematuro que reactive el consumo vuelve a presionar los precios de servicios. Es el dilema clásico del aterrizaje suave: si mueves antes de tiempo, el avión rebota.

El mercado a veces sobreestima la velocidad de normalización porque mira el IPC total, no el componente de servicios.

**Lo que históricamente pasa en ciclos similares**

En el ciclo 2008-2010 y en el post-COVID europeo, la inflación de servicios tardó entre 12 y 18 meses adicionales en converger después de que la inflación de bienes ya estaba normalizada. No es un fenómeno chileno exclusivo.

¿Alguien más ha estado mirando este componente? ¿Tienen una lectura diferente sobre el timing de la TPM?

---
*Rodrigo Fuentes Marín — Analizo macroeconomía y política monetaria en nebbuler.com/rodrigo-fuentes-marin*`,
    notes: 'Publicar en r/chileeconomia y r/chile. Responder comentarios con datos adicionales del INE.',
  },

  'reddit-chile-tributario': {
    platform: 'reddit',
    creator: 'Matías Cornejo Silva',
    topic: 'F22 declaración tardía consecuencias',
    title: () =>
      'Guía práctica: consecuencias reales de no declarar el F22 a tiempo en Chile (más allá de "te multan")',
    body: () => `En temporada de renta aparecen muchos posts con dudas similares, así que armo un resumen de lo que pasa concretamente si no declaras o declaras tarde.

**Fechas clave del proceso 2026:**
- 1-30 de abril: período de devoluciones y declaraciones sin cargo
- 1-31 de mayo: declaraciones con posibles recargos según situación
- Después del 31 de mayo: multas automáticas

**Qué pasa concretamente si no declaras:**

**1. Multa automática**
El SII puede cursar infracción bajo el artículo 97 N°2 del Código Tributario. La multa es el 10% del impuesto con tope de 1.5 UTM (aproximadamente $96.000-$100.000 CLP en 2026 según el valor vigente).

**2. Intereses penales**
1.5% mensual sobre el impuesto no pagado. Se acumulan sobre el capital más los intereses anteriores — no es lineal, es compuesto.

**3. Declaración de oficio**
Si no declaras, el SII puede declarar en tu nombre con estimaciones propias. Históricamente estas estimaciones te perjudican porque el SII usa los ingresos brutos sin los créditos y gastos que tú tendrías derecho a deducir.

**4. Bloqueo de RUT ante el SII**
En casos extremos (deuda tributaria antigua + no declaración reiterada), el RUT puede quedar con restricciones para emitir documentos tributarios.

**Un punto clave que confunde a mucha gente:**
Si te van a *devolver* impuestos, el plazo del 30 de abril/31 de mayo no te presiona de la misma forma (pierdes la devolución oportuna, pero no incurres en multa por impuesto no pagado). El problema real es cuando tienes *impuesto a pagar*.

Casos que tienen más dudas frecuentes: boletas honorarios, segunda categoría con empleador y trabajo independiente simultáneo, dividendos de empresas. Si tienen preguntas específicas, con gusto respondo en los comentarios.

---
*Matías Cornejo Silva — Derecho Tributario y Planificación Fiscal en nebbuler.com/matias-cornejo-silva*
*Consideraciones generales. Para situaciones específicas, consulta con un especialista.*`,
    notes: 'Ideal publicar en abril en r/chile y r/finanzaspersonales. No dar consejo tributario específico en comentarios.',
  },

  'reddit-chile-laboral': {
    platform: 'reddit',
    creator: 'Pablo Herrera Zúñiga',
    topic: 'Despido indirecto y teletrabajo',
    title: () =>
      '¿Cuándo se puede reclamar despido indirecto en Chile? Especialmente en contexto de teletrabajo',
    body: () => `El despido indirecto (o autodespido) es una de las figuras laborales más mal entendidas en Chile, y con el teletrabajo ha tomado una dimensión nueva. Lo explico con los supuestos concretos que aplica el Tribunal Laboral de Santiago.

**Qué es el despido indirecto**

El artículo 171 del Código del Trabajo permite al trabajador poner término al contrato invocando incumplimientos graves del empleador, y exigir el pago de indemnización por años de servicio como si hubiese sido despedido.

En otras palabras: tú renuncias, pero por culpa del empleador, y tienes derecho al mismo monto que si te hubieran despedido sin causa justificada.

**Las causales más frecuentes que se acogen:**

- **Falta de pago o pago tardío reiterado de remuneraciones** (la más sólida probatoriamente)
- **Actos u omisiones que afecten gravemente la dignidad del trabajador** (acoso, hostigamiento)
- **Incumplimiento grave de las obligaciones del contrato** — aquí entra lo interesante del teletrabajo

**El teletrabajo y los nuevos criterios del Tribunal Laboral**

En el último año, el Tribunal Laboral de Santiago ha acogido despidos indirectos en casos donde el empleador:
- Modificó unilateralmente las condiciones de conectividad o equipamiento prometido en el contrato de teletrabajo
- Exigió estar disponible fuera del horario pactado sin compensación ni acuerdo escrito
- Redujo funciones o responsabilidades significativamente sin proceso formal

**Lo que NO alcanza para despido indirecto:**

- Ambiente de trabajo incómodo o tensión con el jefe (sin conducta objetiva documentada)
- Cambios razonables de horario dentro de los márgenes del contrato
- No renovar beneficios voluntarios que no estaban en el contrato

**El procedimiento si decides ejercer este derecho:**

1. Comunicar por escrito al empleador invocando el artículo 171 (con notario o correo certificado)
2. Tienes 60 días hábiles desde el hecho que lo motiva para presentar la denuncia al Tribunal Laboral
3. El empleador puede enervar la acción pagando lo adeudado dentro de cierto plazo

Si tienen un caso concreto, comenten la situación general (sin datos que los identifiquen) y veo si tiene elementos para prosperar.

---
*Pablo Herrera Zúñiga — Derecho Laboral y Relaciones Colectivas en nebbuler.com/pablo-herrera-zuniga*
*Esto es orientación general, no consejo jurídico para tu caso específico.*`,
    notes: 'Publicar en r/chile y r/Derecho. Responder consultas generales en comentarios, no casos específicos.',
  },

  // ── LinkedIn ──────────────────────────────────────────────────────────────
  'linkedin-newsletter-launch': {
    platform: 'linkedin',
    creator: 'Carolina Vega Toro',
    topic: 'Lanzamiento newsletter finanzas corporativas',
    title: () => 'Por qué dejé el mundo corporativo para cobrar directamente por mis análisis',
    body: () => `Después de 9 años cerrando transacciones de M&A en Banchile, tomé la decisión más inusual de mi carrera.

Empecé a publicar análisis y cobrar por ello directamente.

No por el dinero (aunque funciona).

Sino porque el modelo de consultoría institucional tiene un problema que nadie habla en voz alta:

El conocimiento se diluye en el camino.

Lo que yo sé sobre valoración de empresas medianas en Chile llega a tres lugares:
→ Un informe que lee el cliente (confidencial, se archiva)
→ Una presentación que edita un socio senior (filtrada)
→ Un análisis que duerme en un servidor (invisible)

Ninguno llega al CFO de una empresa familiar que va a vender su negocio el próximo año y necesita entender realmente cómo lo van a valorar.

Hoy más de 900 profesionales leen mis análisis cada semana.
Muchos son exactamente esa persona que describí.

¿Has pensado en publicar independiente con tu expertise?

[Link en comentarios →]`,
    notes:
      'Poner link a nebbuler.com/carolina-vega-toro en el PRIMER COMENTARIO, no en el post. Publicar martes o miércoles 8-10am.',
  },

  'linkedin-ia-empresas': {
    platform: 'linkedin',
    creator: 'Alejandro Vásquez Mora',
    topic: 'IA en empresas chilenas error de evaluación',
    title: () => 'El error que destruye el 80% de los proyectos de IA empresarial antes de llegar a producción',
    body: () => `Llevo meses asesorando empresas del IPSA en proyectos de IA.

El patrón de fracaso es casi siempre el mismo.

No es el modelo.
No es la infraestructura.
No es el equipo técnico.

Es la evaluación.

Las empresas compran un LLM, hacen un piloto donde manualmente revisan 50 outputs y dicen "funciona bien".

Ese no es un benchmark. Es una anécdota.

Un sistema de evaluación real tiene:
→ Dataset de al menos 200 casos con ground truth validado por expertos del dominio
→ Métricas definidas antes de ver los resultados (no después)
→ Tests de regresión automáticos para cada cambio de modelo o prompt
→ Monitoreo en producción de los casos donde el modelo tiene baja confianza

Sin eso, estás volando a ciegas y el accidente va a ocurrir en producción.

¿Qué métricas están usando en sus proyectos de IA?

[Análisis completo en comentarios →]`,
    notes: 'Poner link a nebbuler.com/alejandro-vasquez-mora en el primer comentario.',
  },

  'linkedin-salud-publica': {
    platform: 'linkedin',
    creator: 'Andrea Poblete Ríos',
    topic: 'Listas de espera sistema salud Chile',
    title: () => 'Los 847.000 casos en lista de espera quirúrgica en Chile no se van a resolver con más presupuesto',
    body: () => `Fui asesora técnica del MINSAL durante años.

La respuesta política cuando sube la lista de espera siempre es la misma:
"Vamos a poner más recursos."

El problema es estructural, no financiero.

Los tres problemas que nadie en la política de salud quiere tocar:

**1. El modelo de oferta, no de demanda**
Los hospitales públicos organizan su capacidad por oferta histórica, no por análisis de la demanda real actual. El envejecimiento demográfico está cambiando el perfil epidemiológico más rápido que el sistema puede adaptarse.

**2. Los incentivos del sistema**
Un médico de hospital público no tiene incentivos para reducir la lista de espera. Un privado sí. Sin cambiar los incentivos, el dinero adicional no produce proporcionalmente más cirugías.

**3. Los datos**
La lista de 847.000 está subestimada. No incluye a las personas que "desistieron" del sistema público y se fueron al privado o simplemente dejaron de consultar. El número real de demanda no resuelta es probablemente el doble.

¿Qué le cambiarías al modelo?

[Análisis completo con datos RNAO en comentarios →]`,
    notes: 'Link a nebbuler.com/andrea-poblete-rios en el primer comentario.',
  },

  // ── Hacker News ───────────────────────────────────────────────────────────
  'hackernews-launch': {
    platform: 'hackernews',
    creator: 'Nebbuler',
    topic: 'Show HN launch',
    title: () => 'Show HN: Nebbuler – Paid newsletter platform for Spanish-speaking professionals (Chile/LATAM)',
    body: () => `Built Nebbuler (nebbuler.com) to solve a specific infrastructure gap: Latin American professionals who want to monetize newsletters can't use Substack or Beehiiv effectively because Stripe isn't available in most LATAM countries.

**The concrete problem:**
A Chilean economist charging $14,990 CLP/month (~$15 USD) to subscribers faces:
- Stripe unavailable in Chile → no native processing
- USD pricing creates psychological friction for local audiences
- Currency conversion fees eat 3-5% of revenue
- Complex tax compliance when converting to USD and back

**What we built:**
- MercadoPago preapproval API for recurring payments (dominant in Chile, Argentina, Colombia, Mexico)
- Pricing in local currency — subscribers pay in CLP, ARS, COP, MXN
- 0% commission on subscription revenue (flat $29,990 CLP/month creator fee)
- Verified professional profiles (lawyers, economists, doctors, architects)
- Full subscriber list ownership and data export

**Current state:**
11 verified creators, mostly economists and lawyers in Chile. Combined subscriber count ~5,200. Monthly revenue per creator ranges from $760K to $17M CLP.

**Stack:**
Next.js 16 (App Router), Supabase, Vercel, MercadoPago Preapproval API, TypeScript throughout.

**What I'd love feedback on:**
1. The 0% commission model — is the flat fee sustainable or does it break at scale?
2. Go-to-market for Argentina given the currency situation (we use ARS but it's volatile)
3. Any prior art in this space we should know about

Happy to answer anything.`,
    notes:
      'Publicar entre 9am-12pm hora San Francisco. Preparar comentario con detalles técnicos adicionales del stack para publicar inmediatamente después del post.',
  },

  // ── Product Hunt ──────────────────────────────────────────────────────────
  'producthunt-launch': {
    platform: 'producthunt',
    creator: 'Nebbuler',
    topic: 'Product Hunt launch day',
    title: () => 'Nebbuler — Paid newsletters for Latin American professionals',
    tagline: () => 'The newsletter platform built for LATAM: MercadoPago, local currency, 0% commission',
    body: () => `Hola Product Hunt!

We built Nebbuler because every professional we know in Chile and Latin America had the same problem: they want to charge for their expertise, but the global newsletter tools don't work for our region.

**Why existing tools fail in LATAM:**
Stripe isn't available in most Latin American countries. Substack and Beehiiv both rely on Stripe for payments, which means:
- Creators have to collect payments in USD via workarounds
- Subscribers face currency conversion friction
- Revenue is in USD, but expenses are in local currency

**What Nebbuler does differently:**

MercadoPago is our primary payment processor. 150M+ active users across Chile, Argentina, Colombia, Mexico. Subscribers pay in their local currency — no conversion, no friction.

Creator pricing: flat $29,990 CLP/month (~$30 USD), 0% commission on subscription revenue. A creator with 1,000 subscribers at $15/month keeps 100% of $15,000/month minus payment processing fees.

**Who's using it today:**
Our 11 verified creators are professionals with real domain expertise:
- Economists (ex Banco Central de Chile)
- Corporate finance specialists (ex M&A bankers)
- Tax lawyers (specialized in restructuring)
- Public health epidemiologists (ex MINSAL)
- Political scientists, architects, civil engineers

All verified via LinkedIn OAuth + credential review.

**What we'd love feedback on:**
How do we expand beyond Chile while the MercadoPago integration varies by country? Argentina is our second market but ARS volatility is a real challenge.

Ask us anything!`,
    notes:
      'Lanzar martes o miércoles. Preparar al menos 50 upvoters de la red. Responder TODOS los comentarios durante el día del launch.',
  },
}

// ─── Funciones ────────────────────────────────────────────────────────────────

function printTemplate(key: string, template: ContentTemplate): void {
  const rules = PLATFORM_RULES[template.platform]

  console.log('\n' + '═'.repeat(70))
  console.log(`TEMPLATE: ${key}`)
  console.log(`Plataforma: ${template.platform.toUpperCase()}  |  Creador: ${template.creator}`)
  console.log(`Tema: ${template.topic}`)
  console.log('─'.repeat(70))

  if (template.title) {
    console.log('\nTITULO:')
    console.log(template.title())
  }

  if (template.tagline) {
    console.log('\nTAGLINE:')
    console.log(template.tagline())
  }

  console.log('\nCONTENIDO:')
  console.log(template.body())

  if (template.notes) {
    console.log('\nNOTAS DE PUBLICACION:')
    console.log(template.notes)
  }

  if (rules) {
    console.log(`\nREGLAS DE ${template.platform.toUpperCase()} [${rules.warningLabel}]:`)
    console.log(`Link policy: ${rules.linkPolicy}`)
    rules.bestPractices.forEach(p => console.log(`  • ${p}`))
  }

  console.log('═'.repeat(70))
}

function saveTemplate(key: string, template: ContentTemplate, outputDir: string): string {
  const lines: string[] = []

  if (template.title) lines.push(`# ${template.title()}`, '')
  if (template.tagline) lines.push(`*${template.tagline()}*`, '')
  lines.push(template.body())

  if (template.notes) {
    lines.push('', '---', '', `**Notas de publicación:** ${template.notes}`)
  }

  const rules = PLATFORM_RULES[template.platform]
  if (rules) {
    lines.push(
      '',
      `---`,
      '',
      `**Reglas de ${template.platform}:**`,
      `- ${rules.linkPolicy}`,
      ...rules.bestPractices.map(p => `- ${p}`)
    )
  }

  const filePath = path.join(outputDir, `${key}.md`)
  fs.writeFileSync(filePath, lines.join('\n') + '\n')
  return filePath
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2)
  const outputDir = path.join(__dirname, 'output', 'content-kit')
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true })

  console.log('\n=== Forum Content Kit — Nebbuler ===')
  console.log('Templates de contenido para foros y plataformas.')
  console.log('Regla de oro: link a Nebbuler SOLO en la firma, nunca en el cuerpo.\n')

  // ── --list ────────────────────────────────────────────────────────────────
  if (args.includes('--list') || args.length === 0) {
    console.log('Templates disponibles:\n')

    const byPlatform = Object.entries(CONTENT_TEMPLATES).reduce<Record<string, string[]>>(
      (acc, [key, t]) => {
        if (!acc[t.platform]) acc[t.platform] = []
        acc[t.platform].push(key)
        return acc
      },
      {}
    )

    for (const [platform, keys] of Object.entries(byPlatform)) {
      console.log(`${platform.toUpperCase()}`)
      keys.forEach(k => {
        const t = CONTENT_TEMPLATES[k]
        console.log(`  ${k.padEnd(40)} ${t.creator}`)
      })
      console.log('')
    }

    console.log('\nReglas por plataforma:\n')
    for (const [platform, rules] of Object.entries(PLATFORM_RULES)) {
      console.log(`${platform.toUpperCase()} [${rules.warningLabel}]`)
      console.log(`  ${rules.linkPolicy}`)
    }

    console.log('\nUso:')
    console.log('  npx ts-node content-kit.ts --template reddit-chile-inflacion')
    console.log('  npx ts-node content-kit.ts --all')
    return
  }

  // ── --template [key] ──────────────────────────────────────────────────────
  if (args.includes('--template')) {
    const templateKey = args[args.indexOf('--template') + 1]

    if (!templateKey) {
      console.error('Especifica el nombre del template: --template [nombre]')
      return
    }

    const template = CONTENT_TEMPLATES[templateKey]
    if (!template) {
      console.error(`Template "${templateKey}" no encontrado.`)
      console.error('Templates disponibles: ' + Object.keys(CONTENT_TEMPLATES).join(', '))
      return
    }

    printTemplate(templateKey, template)
    const filePath = saveTemplate(templateKey, template, outputDir)
    console.log(`\nGuardado en: ${filePath}`)
    return
  }

  // ── --all ─────────────────────────────────────────────────────────────────
  if (args.includes('--all')) {
    console.log(`Generando todos los templates (${Object.keys(CONTENT_TEMPLATES).length})...\n`)

    for (const [key, template] of Object.entries(CONTENT_TEMPLATES)) {
      const filePath = saveTemplate(key, template, outputDir)
      console.log(`  ${key.padEnd(40)} -> ${path.basename(filePath)}`)
    }

    console.log(`\nTodos los templates exportados en: ${outputDir}`)

    // Generar índice
    const indexPath = path.join(outputDir, 'INDEX.md')
    const indexLines = [
      '# Forum Content Kit — Nebbuler',
      '',
      `Generado: ${new Date().toISOString().slice(0, 10)}`,
      '',
      '## Templates disponibles',
      '',
    ]

    for (const [key, template] of Object.entries(CONTENT_TEMPLATES)) {
      indexLines.push(
        `### [${key}](./${key}.md)`,
        `- **Plataforma:** ${template.platform}`,
        `- **Creador:** ${template.creator}`,
        `- **Tema:** ${template.topic}`,
        ''
      )
    }

    indexLines.push(
      '## Regla de oro',
      '',
      '> El link a Nebbuler va SIEMPRE en la firma, NUNCA en el cuerpo del post.',
      '> Primero valor genuino. Después, al final, la firma con el link.',
      ''
    )

    fs.writeFileSync(indexPath, indexLines.join('\n'))
    console.log(`Índice generado: ${indexPath}`)
    return
  }

  // ── Help ──────────────────────────────────────────────────────────────────
  console.log(`Comandos:
  --list                 Lista todos los templates disponibles
  --template [nombre]    Muestra y exporta un template específico
  --all                  Exporta todos los templates a archivos .md

Ejemplos:
  npx ts-node content-kit.ts --list
  npx ts-node content-kit.ts --template reddit-chile-inflacion
  npx ts-node content-kit.ts --template linkedin-newsletter-launch
  npx ts-node content-kit.ts --all
`)
}

main().catch(err => {
  console.error('Error fatal:', err)
  process.exit(1)
})
