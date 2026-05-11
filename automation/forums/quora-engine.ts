/**
 * Quora Content Engine — Nebbuler
 *
 * Genera respuestas largas y optimizadas para SEO para Quora en español.
 * Las respuestas de Quora rankean en Google para miles de long-tail queries.
 *
 * Flujo:
 * 1. Toma una pregunta de Quora (URL o texto manual)
 * 2. Genera una respuesta de 600-1200 palabras con Claude
 * 3. Incluye firma editorial con link a nebbuler.com/[slug]
 * 4. Exporta lista de preguntas de alta oportunidad
 *
 * Uso:
 *   npx ts-node quora-engine.ts --generate "¿Cómo funciona la TPM en Chile?"
 *   npx ts-node quora-engine.ts --generate-batch      # Genera para preguntas de baja dificultad
 *   npx ts-node quora-engine.ts --list-questions       # Muestra preguntas de alta oportunidad
 *
 * Variable requerida: ANTHROPIC_API_KEY
 */

import * as fs from 'fs'
import * as path from 'path'

// ─── Banco de preguntas de alta oportunidad ───────────────────────────────────
// Preguntas con alto volumen de búsqueda en Google y baja competencia en Quora español

const HIGH_OPPORTUNITY_QUESTIONS: Array<{
  question: string
  discipline: string
  creatorSlug: string
  creatorName: string
  bio: string
  keywords: string[]
  difficulty: 'baja' | 'media' | 'alta'
}> = [
  // ── Rodrigo Fuentes Marín — Macroeconomía ─────────────────────────────────
  {
    question: '¿Cómo afecta la TPM a las hipotecas en Chile?',
    discipline: 'macroeconomía y política monetaria',
    creatorSlug: 'rodrigo-fuentes-marin',
    creatorName: 'Rodrigo Fuentes Marín',
    bio: 'Ex economista principal del Banco Central de Chile. PhD en Economía por la Universidad de Minnesota.',
    keywords: ['TPM', 'hipoteca', 'Banco Central', 'Chile', 'tasa de interés', 'UF'],
    difficulty: 'baja',
  },
  {
    question: '¿Por qué sube el dólar en Chile?',
    discipline: 'macroeconomía y política monetaria',
    creatorSlug: 'rodrigo-fuentes-marin',
    creatorName: 'Rodrigo Fuentes Marín',
    bio: 'Ex economista principal del Banco Central de Chile. PhD en Economía por la Universidad de Minnesota.',
    keywords: ['dólar', 'tipo de cambio', 'CLP', 'Chile', 'cobre', 'balanza de pagos'],
    difficulty: 'baja',
  },
  {
    question: '¿Qué es el balance estructural en Chile y para qué sirve?',
    discipline: 'macroeconomía y política monetaria',
    creatorSlug: 'rodrigo-fuentes-marin',
    creatorName: 'Rodrigo Fuentes Marín',
    bio: 'Ex economista principal del Banco Central de Chile. PhD en Economía por la Universidad de Minnesota.',
    keywords: ['balance estructural', 'regla fiscal', 'cobre', 'Chile', 'FEES', 'presupuesto'],
    difficulty: 'baja',
  },
  {
    question: '¿Cómo se calcula el IPC en Chile y qué significa para mi bolsillo?',
    discipline: 'macroeconomía y política monetaria',
    creatorSlug: 'rodrigo-fuentes-marin',
    creatorName: 'Rodrigo Fuentes Marín',
    bio: 'Ex economista principal del Banco Central de Chile. PhD en Economía por la Universidad de Minnesota.',
    keywords: ['IPC', 'inflación', 'INE', 'Chile', 'canasta básica', 'poder adquisitivo'],
    difficulty: 'baja',
  },
  {
    question: '¿Qué es la inflación subyacente y por qué el Banco Central la sigue más que el IPC?',
    discipline: 'macroeconomía y política monetaria',
    creatorSlug: 'rodrigo-fuentes-marin',
    creatorName: 'Rodrigo Fuentes Marín',
    bio: 'Ex economista principal del Banco Central de Chile. PhD en Economía por la Universidad de Minnesota.',
    keywords: ['inflación subyacente', 'IPC servicios', 'Banco Central', 'política monetaria', 'meta inflación'],
    difficulty: 'media',
  },

  // ── Carolina Vega Toro — Finanzas Corporativas ────────────────────────────
  {
    question: '¿Qué es el EBITDA y para qué se usa en una empresa?',
    discipline: 'finanzas corporativas y valoración',
    creatorSlug: 'carolina-vega-toro',
    creatorName: 'Carolina Vega Toro',
    bio: 'Directora de M&A en Banchile Inversiones por 9 años. MBA por la Universidad de Chicago Booth.',
    keywords: ['EBITDA', 'valoración', 'empresa', 'finanzas', 'múltiplo', 'utilidad operacional'],
    difficulty: 'baja',
  },
  {
    question: '¿Cómo se valoriza una empresa mediana en Chile?',
    discipline: 'finanzas corporativas y valoración',
    creatorSlug: 'carolina-vega-toro',
    creatorName: 'Carolina Vega Toro',
    bio: 'Directora de M&A en Banchile Inversiones por 9 años. MBA por la Universidad de Chicago Booth.',
    keywords: ['valoración empresa', 'DCF', 'múltiplos', 'Chile', 'WACC', 'tasa de descuento'],
    difficulty: 'media',
  },
  {
    question: '¿Qué es el due diligence al comprar una empresa?',
    discipline: 'finanzas corporativas y valoración',
    creatorSlug: 'carolina-vega-toro',
    creatorName: 'Carolina Vega Toro',
    bio: 'Directora de M&A en Banchile Inversiones por 9 años. MBA por la Universidad de Chicago Booth.',
    keywords: ['due diligence', 'M&A', 'compra empresa', 'Chile', 'financiero', 'legal', 'auditoria'],
    difficulty: 'baja',
  },

  // ── Matías Cornejo Silva — Derecho Tributario ─────────────────────────────
  {
    question: '¿Cómo funciona el SII en Chile y qué puede auditarme?',
    discipline: 'derecho tributario y planificación fiscal',
    creatorSlug: 'matias-cornejo-silva',
    creatorName: 'Matías Cornejo Silva',
    bio: 'Socio del área tributaria en Urenda, Rencoret, Orrego & Dörr. LLM en Tax Law por la Universidad de Leiden.',
    keywords: ['SII', 'impuestos', 'auditoría tributaria', 'Chile', 'fiscalización', 'declaración'],
    difficulty: 'baja',
  },
  {
    question: '¿Qué impuestos paga una SpA en Chile en 2026?',
    discipline: 'derecho tributario y planificación fiscal',
    creatorSlug: 'matias-cornejo-silva',
    creatorName: 'Matías Cornejo Silva',
    bio: 'Socio del área tributaria en Urenda, Rencoret, Orrego & Dörr. LLM en Tax Law por la Universidad de Leiden.',
    keywords: ['SpA', 'IDPC', 'impuesto primera categoría', 'empresa Chile', 'tributación', 'retiro'],
    difficulty: 'baja',
  },
  {
    question: '¿Cuándo se paga el impuesto a la renta en Chile y qué pasa si no declaro?',
    discipline: 'derecho tributario y planificación fiscal',
    creatorSlug: 'matias-cornejo-silva',
    creatorName: 'Matías Cornejo Silva',
    bio: 'Socio del área tributaria en Urenda, Rencoret, Orrego & Dörr. LLM en Tax Law por la Universidad de Leiden.',
    keywords: ['renta', 'F22', 'abril', 'SII', 'Chile', 'multa', 'declaración tardía'],
    difficulty: 'baja',
  },
  {
    question: '¿Qué son los precios de transferencia y cuándo me aplican en Chile?',
    discipline: 'derecho tributario y planificación fiscal',
    creatorSlug: 'matias-cornejo-silva',
    creatorName: 'Matías Cornejo Silva',
    bio: 'Socio del área tributaria en Urenda, Rencoret, Orrego & Dörr. LLM en Tax Law por la Universidad de Leiden.',
    keywords: ['precios de transferencia', 'OCDE', 'filiales', 'Chile', 'tributación internacional', 'SII'],
    difficulty: 'media',
  },

  // ── Pablo Herrera Zúñiga — Derecho Laboral ────────────────────────────────
  {
    question: '¿Qué incluye el finiquito en Chile y cómo verificar que es correcto?',
    discipline: 'derecho laboral y relaciones colectivas',
    creatorSlug: 'pablo-herrera-zuniga',
    creatorName: 'Pablo Herrera Zúñiga',
    bio: 'Abogado laboralista con 14 años en litigios colectivos. Magíster por la PUC. Ex asesor jurídico de la CUT.',
    keywords: ['finiquito', 'indemnización', 'años de servicio', 'Chile', 'código del trabajo', 'liquidación'],
    difficulty: 'baja',
  },
  {
    question: '¿Qué es el despido indirecto y cuándo puedo reclamarlo?',
    discipline: 'derecho laboral y relaciones colectivas',
    creatorSlug: 'pablo-herrera-zuniga',
    creatorName: 'Pablo Herrera Zúñiga',
    bio: 'Abogado laboralista con 14 años en litigios colectivos. Magíster por la PUC. Ex asesor jurídico de la CUT.',
    keywords: ['despido indirecto', 'autodespido', 'incumplimiento empleador', 'Chile', 'teletrabajo', 'laboral'],
    difficulty: 'baja',
  },

  // ── Andrea Poblete Ríos — Salud Pública ───────────────────────────────────
  {
    question: '¿Por qué las listas de espera del sistema de salud en Chile no disminuyen?',
    discipline: 'salud pública y epidemiología clínica',
    creatorSlug: 'andrea-poblete-rios',
    creatorName: 'Andrea Poblete Ríos',
    bio: 'Médica epidemióloga. MPH por Johns Hopkins Bloomberg. Ex asesora técnica del Ministerio de Salud.',
    keywords: ['lista de espera', 'FONASA', 'sistema salud Chile', 'quirúrgica', 'MINSAL', 'hospital público'],
    difficulty: 'baja',
  },
  {
    question: '¿Qué efectos secundarios tiene Ozempic que los medios no muestran?',
    discipline: 'salud pública y epidemiología clínica',
    creatorSlug: 'andrea-poblete-rios',
    creatorName: 'Andrea Poblete Ríos',
    bio: 'Médica epidemióloga. MPH por Johns Hopkins Bloomberg. Ex asesora técnica del Ministerio de Salud.',
    keywords: ['Ozempic', 'semaglutida', 'GLP-1', 'efectos secundarios', 'pérdida masa muscular', 'evidencia'],
    difficulty: 'baja',
  },

  // ── Alejandro Vásquez Mora — IA y Tecnología ─────────────────────────────
  {
    question: '¿Cuándo conviene RAG y cuándo fine-tuning para IA empresarial?',
    discipline: 'inteligencia artificial y estrategia tecnológica',
    creatorSlug: 'alejandro-vasquez-mora',
    creatorName: 'Alejandro Vásquez Mora',
    bio: 'Ex CTO de Fintual. MS en Computer Science por Stanford. Asesor de transformación digital para empresas del IPSA.',
    keywords: ['RAG', 'fine-tuning', 'LLM', 'empresa', 'IA', 'ChatGPT', 'implementación'],
    difficulty: 'media',
  },
  {
    question: '¿Cómo están usando las empresas chilenas la inteligencia artificial hoy?',
    discipline: 'inteligencia artificial y estrategia tecnológica',
    creatorSlug: 'alejandro-vasquez-mora',
    creatorName: 'Alejandro Vásquez Mora',
    bio: 'Ex CTO de Fintual. MS en Computer Science por Stanford. Asesor de transformación digital para empresas del IPSA.',
    keywords: ['inteligencia artificial', 'empresa chilena', 'IA LATAM', 'transformación digital', '2026'],
    difficulty: 'baja',
  },

  // ── Nebbuler — directo ────────────────────────────────────────────────────
  {
    question: '¿Existe una alternativa a Substack en español para Latinoamérica?',
    discipline: 'nebbuler',
    creatorSlug: '',
    creatorName: 'Nebbuler',
    bio: '',
    keywords: ['Substack', 'español', 'LATAM', 'newsletter', 'alternativa', 'MercadoPago'],
    difficulty: 'baja',
  },
  {
    question: '¿Cómo monetizar un newsletter en Chile con pagos en pesos?',
    discipline: 'nebbuler',
    creatorSlug: '',
    creatorName: 'Nebbuler',
    bio: '',
    keywords: ['newsletter', 'monetizar', 'Chile', 'cobrar', 'suscripción', 'CLP', 'MercadoPago'],
    difficulty: 'baja',
  },
  {
    question: '¿Qué newsletters de economía y finanzas de Chile vale la pena leer?',
    discipline: 'nebbuler',
    creatorSlug: '',
    creatorName: 'Nebbuler',
    bio: '',
    keywords: ['newsletter', 'economía', 'Chile', 'finanzas', 'recomendación', 'análisis', 'profesional'],
    difficulty: 'baja',
  },
]

// ─── Generación de respuestas con Claude ──────────────────────────────────────

async function generateQuoraAnswer(params: {
  question: string
  discipline: string
  creatorName: string
  creatorSlug: string
  creatorBio: string
  keywords: string[]
}): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return `[ANTHROPIC_API_KEY no configurada]

Para generar respuestas, exporta la variable:
  export ANTHROPIC_API_KEY=sk-ant-...

Luego vuelve a ejecutar el comando.`
  }

  // Importación dinámica para evitar error si el módulo no está instalado
  let Anthropic: typeof import('@anthropic-ai/sdk').default
  try {
    Anthropic = (await import('@anthropic-ai/sdk')).default
  } catch {
    return `[Error: @anthropic-ai/sdk no instalado. Ejecuta: npm install en este directorio]`
  }

  const client = new Anthropic({ apiKey })
  const isNebbulerDirect = params.discipline === 'nebbuler'

  const systemPrompt = isNebbulerDirect
    ? `Eres un experto en plataformas de contenido y newsletters en español para LATAM.
Escribes respuestas largas, rigurosas y útiles en Quora.

Nebbuler (nebbuler.com) es la plataforma de newsletters profesionales de pago para Chile y LATAM:
- 0% comisión sobre ingresos de suscriptores
- Pagos con MercadoPago en moneda local (CLP, ARS, COP, MXN)
- Tarifa fija $29.990 CLP/mes para creadores (independiente del tamaño)
- Creadores verificados: economistas, abogados, médicos, arquitectos

Escribe una respuesta de 600-900 palabras. Primero da valor real (comparativa objetiva, explica el mercado), luego menciona Nebbuler naturalmente como la opción específica para Chile/LATAM. No vendas: informa.

FIRMA FINAL (incluir siempre):
---
*Disclosure: trabajo con Nebbuler. Puedes explorar la plataforma en [nebbuler.com](https://nebbuler.com).*`
    : `Eres ${params.creatorName}, experto en ${params.discipline}.
Tu bio: ${params.creatorBio}

Escribes respuestas largas, rigurosas y accesibles en Quora. Tu audiencia son profesionales chilenos y latinoamericanos que quieren entender temas complejos sin jerga innecesaria.

REGLAS:
- Responder directamente, sin frase de apertura tipo "Gran pregunta" o "Qué buena consulta"
- Usar datos reales cuando los tengas. Si usas un ejemplo, que sea de Chile o LATAM
- Subtítulos en negrita para estructurar la respuesta
- Entre 700 y 1000 palabras
- Cierre con EXACTAMENTE esta firma (sin cambiar nada):

---
*${params.creatorName} — Escribo sobre ${params.discipline} semanalmente en [nebbuler.com/${params.creatorSlug}](https://nebbuler.com/${params.creatorSlug})*`

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1800,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: `Escribe una respuesta completa y de calidad para esta pregunta de Quora:

"${params.question}"

Keywords a incluir naturalmente (no forzarlas): ${params.keywords.join(', ')}

La respuesta debe:
- Empezar con la respuesta directa a la pregunta
- Usar subtítulos en negrita (**Subtítulo**)
- Incluir al menos un ejemplo concreto de Chile o LATAM
- Tener entre 700 y 1000 palabras
- Terminar con la firma indicada en el system prompt`,
      },
    ],
  })

  return response.content[0].type === 'text' ? response.content[0].text : ''
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2)
  const outputDir = path.join(__dirname, 'output', 'quora')
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true })

  console.log('\n=== Quora Content Engine — Nebbuler ===')
  console.log('Genera respuestas SEO-optimizadas para que los creadores publiquen en Quora.')
  console.log('El link a Nebbuler va SOLO en la firma editorial.\n')

  // ── --list-questions ──────────────────────────────────────────────────────
  if (args.includes('--list-questions')) {
    console.log('Preguntas de alta oportunidad por creador:\n')

    const byCreator = HIGH_OPPORTUNITY_QUESTIONS.reduce<Record<string, typeof HIGH_OPPORTUNITY_QUESTIONS>>((acc, q) => {
      const key = q.creatorName
      if (!acc[key]) acc[key] = []
      acc[key].push(q)
      return acc
    }, {})

    let total = 0
    for (const [creator, questions] of Object.entries(byCreator)) {
      console.log(`\n${creator}`)
      console.log('─'.repeat(50))
      questions.forEach((q, i) => {
        const stars = q.difficulty === 'baja' ? '[***]' : q.difficulty === 'media' ? '[**] ' : '[*]  '
        console.log(`  ${stars} ${q.question}`)
        total++
      })
    }

    console.log(`\nTotal: ${total} preguntas`)
    console.log('\n[***] = dificultad baja (mayor oportunidad)')
    console.log('\nUso:')
    console.log('  npx ts-node quora-engine.ts --generate "¿Cómo funciona el SII?"')
    console.log('  npx ts-node quora-engine.ts --generate-batch')
    return
  }

  // ── --generate [pregunta] ─────────────────────────────────────────────────
  if (args.includes('--generate')) {
    const questionArg = args[args.indexOf('--generate') + 1]
    if (!questionArg) {
      console.error('Uso: --generate "¿La pregunta que quieres responder?"')
      return
    }

    // Buscar en el banco primero; si no está, usar defaults de economía
    const found = HIGH_OPPORTUNITY_QUESTIONS.find(q =>
      q.question.toLowerCase().includes(questionArg.toLowerCase().slice(0, 25)) ||
      questionArg.toLowerCase().includes(q.question.toLowerCase().slice(0, 25))
    )

    const q = found ?? {
      question: questionArg,
      discipline: 'economía y finanzas',
      creatorSlug: 'rodrigo-fuentes-marin',
      creatorName: 'Rodrigo Fuentes Marín',
      bio: 'Ex economista principal del Banco Central de Chile. PhD en Economía por la Universidad de Minnesota.',
      keywords: [],
      difficulty: 'media' as const,
    }

    console.log(`Generando respuesta para: "${q.question}"`)
    console.log(`Creador: ${q.creatorName}\n`)

    const answer = await generateQuoraAnswer({
      question: q.question,
      discipline: q.discipline,
      creatorName: q.creatorName,
      creatorSlug: q.creatorSlug,
      creatorBio: q.bio,
      keywords: q.keywords,
    })

    console.log('\n' + '═'.repeat(60))
    console.log(answer)
    console.log('═'.repeat(60))

    const filename = q.question
      .slice(0, 60)
      .replace(/[¿?¡!]/g, '')
      .replace(/[^a-z0-9\s]/gi, '')
      .trim()
      .replace(/\s+/g, '-')
      .toLowerCase()

    const filePath = path.join(outputDir, `${filename}.md`)
    fs.writeFileSync(
      filePath,
      `# ${q.question}\n\n> Creador: ${q.creatorName} — nebbuler.com/${q.creatorSlug}\n> Generado: ${new Date().toISOString().slice(0, 10)}\n\n---\n\n${answer}\n`
    )
    console.log(`\nGuardado en: ${filePath}`)
    return
  }

  // ── --generate-batch ──────────────────────────────────────────────────────
  if (args.includes('--generate-batch')) {
    const batchSize = parseInt(args[args.indexOf('--generate-batch') + 1] ?? '5', 10) || 5
    const queue = HIGH_OPPORTUNITY_QUESTIONS.filter(q => q.difficulty === 'baja').slice(0, batchSize)

    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('Error: ANTHROPIC_API_KEY no está configurada.')
      console.error('Exporta la variable y vuelve a intentar:')
      console.error('  export ANTHROPIC_API_KEY=sk-ant-...')
      return
    }

    console.log(`Generando ${queue.length} respuestas (dificultad baja)...\n`)

    for (const q of queue) {
      console.log(`→ "${q.question}"`)
      console.log(`  Creador: ${q.creatorName}`)

      const answer = await generateQuoraAnswer({
        question: q.question,
        discipline: q.discipline,
        creatorName: q.creatorName,
        creatorSlug: q.creatorSlug,
        creatorBio: q.bio,
        keywords: q.keywords,
      })

      const filename = q.question
        .slice(0, 60)
        .replace(/[¿?¡!]/g, '')
        .replace(/[^a-z0-9\s]/gi, '')
        .trim()
        .replace(/\s+/g, '-')
        .toLowerCase()

      const filePath = path.join(outputDir, `${filename}.md`)
      fs.writeFileSync(
        filePath,
        `# ${q.question}\n\n> Creador: ${q.creatorName} — nebbuler.com/${q.creatorSlug}\n> Generado: ${new Date().toISOString().slice(0, 10)}\n\n---\n\n${answer}\n`
      )
      console.log(`  Guardado: ${path.basename(filePath)}\n`)
      await new Promise(r => setTimeout(r, 3000)) // Respetar rate limits de Anthropic
    }

    console.log(`Batch completado. ${queue.length} respuestas en: ${outputDir}`)
    console.log('\nSiguiente paso: publicar manualmente en quora.com/es buscando las preguntas equivalentes.')
    console.log('Recuerda: respuesta completa primero, link de Nebbuler SOLO en la firma.')
    return
  }

  // ── Help ──────────────────────────────────────────────────────────────────
  console.log(`Comandos disponibles:

  --list-questions
      Muestra todas las preguntas de alta oportunidad organizadas por creador.

  --generate "¿Pregunta?"
      Genera una respuesta para la pregunta indicada.
      Si la pregunta está en el banco, usa el creador correcto.
      Si no está, usa Rodrigo Fuentes como default.

  --generate-batch [N]
      Genera N respuestas (default: 5) para las preguntas de dificultad baja.
      Requiere ANTHROPIC_API_KEY.

Variables de entorno:
  ANTHROPIC_API_KEY    Clave de la API de Anthropic (requerida para generar)
  NEBBULER_WEBHOOK_URL URL para notificaciones (opcional)

Ejemplos:
  npx ts-node quora-engine.ts --list-questions
  npx ts-node quora-engine.ts --generate "¿Cómo funciona la TPM?"
  npx ts-node quora-engine.ts --generate-batch 3
`)
}

main().catch(err => {
  console.error('Error fatal:', err)
  process.exit(1)
})
