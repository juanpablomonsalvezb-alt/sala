import { NextRequest } from 'next/server'
import { creators } from '@/data/creators'

export const runtime = 'nodejs'
export const maxDuration = 30

const SYSTEM_PROMPT = `Eres el Observatorio de Nebbuler, un asistente especializado en análisis económico, legal, financiero y de salud pública para Chile y Latinoamérica.

Responde de forma rigurosa pero accesible, como un profesional que explica a alguien inteligente sin jerga innecesaria. Usa ejemplos de Chile y LATAM cuando sea posible. Sé conciso: máximo 300 palabras por respuesta.

Al final de cada respuesta, si es relevante, incluye una sección "Leer más en Nebbuler:" con 1-2 creadores de la siguiente lista que sean pertinentes al tema. Usa el formato exacto:
[CREADORES_RELEVANTES]
- [Nombre del creador] · [Specialty] → nebbuler.com/[slug]
[/CREADORES_RELEVANTES]

Lista de profesionales verificados en Nebbuler:
${creators.map((c) => `- ${c.name} (${c.specialty}) — ${c.bio.slice(0, 100)} → slug: ${c.slug}`).join('\n')}

Si la pregunta no es sobre economía, derecho, finanzas, salud pública u otras disciplinas profesionales, responde amablemente que el Observatorio se especializa en esos temas.`

interface Message {
  role: 'user' | 'assistant'
  content: string
}

// Fallback de respuestas simuladas cuando no hay SDK de Anthropic
function getSimulatedResponse(question: string): string {
  const q = question.toLowerCase()

  if (q.includes('tpm') || q.includes('hipoteca') || q.includes('banco central')) {
    return `La Tasa de Política Monetaria (TPM) es el instrumento principal con el que el Banco Central de Chile regula el costo del crédito en la economía. Cuando el Banco Central sube la TPM, los bancos encarecen sus tasas de colocación — incluyendo las hipotecarias.

En términos prácticos: si tienes un crédito hipotecario a tasa variable referenciado en el índice de cámara (TCC o TAB), una alza de 100 puntos base en la TPM puede traducirse en un aumento de $30.000–$60.000 mensuales en una deuda típica de UF 3.000 a 20 años.

El Consejo del Banco Central se reúne 8 veces al año para decidir si ajusta la TPM. Sus señales se comunican en el Informe de Política Monetaria (IPoM) trimestral.

[CREADORES_RELEVANTES]
- Rodrigo Fuentes Marín · MACROECONOMÍA Y POLÍTICA MONETARIA → nebbuler.com/rodrigo-fuentes-marin
[/CREADORES_RELEVANTES]`
  }

  if (q.includes('spa') || q.includes('sociedad') || q.includes('tributar') || q.includes('impuesto')) {
    return `Una SpA (Sociedad por Acciones) tributa en Chile bajo el Impuesto de Primera Categoría (IDPC) a una tasa del 27% sobre sus rentas netas. Sus socios o accionistas, al retirar utilidades o recibir dividendos, las integran con el Global Complementario (personas naturales domiciliadas en Chile) o el Impuesto Adicional (no residentes).

El sistema de integración vigente es parcial: el 65% del IDPC pagado puede acreditarse contra el impuesto final del socio. Esto implica que la carga tributaria total efectiva varía según el bracket del Global Complementario del dueño.

La SpA es la estructura preferida para startups chilenas porque permite modelar series de acciones con derechos distintos (liquidation preference, antidilución), a diferencia de las sociedades de responsabilidad limitada.

[CREADORES_RELEVANTES]
- Matías Cornejo Silva · DERECHO TRIBUTARIO Y PLANIFICACIÓN FISCAL → nebbuler.com/matias-cornejo-silva
[/CREADORES_RELEVANTES]`
  }

  if (q.includes('ebitda') || q.includes('flujo de caja') || q.includes('valoracion') || q.includes('valoración')) {
    return `El EBITDA (Earnings Before Interest, Taxes, Depreciation and Amortization) mide la generación operativa bruta de una empresa antes de cargos financieros y no monetarios. El flujo de caja libre (FCF), en cambio, deduce el capex de mantenimiento necesario para sostener el negocio.

La diferencia es crítica: una empresa puede mostrar EBITDA de $10M pero generar solo $3M de FCF si es intensiva en activos (minería, retail). Usar el múltiplo EV/EBITDA sin entender la intensidad de capital puede llevar a sobrevaluar activos del sector industrial o de infraestructura.

Para valuar correctamente, los analistas usan el EBITDA como métrica comparativa (comparable companies), pero validan con DCF sobre FCF para entender el valor intrínseco.

[CREADORES_RELEVANTES]
- Carolina Vega Toro · FINANZAS CORPORATIVAS Y VALORACIÓN → nebbuler.com/carolina-vega-toro
[/CREADORES_RELEVANTES]`
  }

  if (q.includes('inflacion') || q.includes('inflación') || q.includes('latam') || q.includes('precios')) {
    return `La inflación en América Latina en 2025-2026 muestra una bifurcación marcada. Chile y Colombia han logrado convergencia hacia sus metas (3% y 3-4% respectivamente), mientras Argentina mantiene una inercia inflacionaria estructural aunque con tendencia descendente desde los máximos de 2024.

Los factores que mantienen presión inflacionaria en la región son: servicios con alta indexación salarial, depreciaciones cambiarias en países con vulnerabilidades de cuenta corriente, y rigideces en el mercado de arriendos urbanos.

El riesgo más relevante para Chile en 2026 es la inflación de servicios: componentes como transporte urbano, educación y salud muestran resistencia a la baja incluso con brecha del producto negativa.

[CREADORES_RELEVANTES]
- Rodrigo Fuentes Marín · MACROECONOMÍA Y POLÍTICA MONETARIA → nebbuler.com/rodrigo-fuentes-marin
[/CREADORES_RELEVANTES]`
  }

  return `Gracias por tu pregunta. El Observatorio de Nebbuler conecta con profesionales verificados —economistas, abogados tributarios, analistas financieros y médicos epidemiólogos— que publican análisis sobre este tipo de temas.

Para respuestas más precisas y actualizadas, te recomiendo suscribirte directamente a los especialistas de Nebbuler que escriben sobre esta área. Puedes explorar el directorio completo en nebbuler.com/directorio.

Si tu pregunta es sobre economía, política monetaria, derecho tributario, finanzas corporativas o salud pública, reformúlala con más contexto y el Observatorio podrá orientarte mejor.`
}

export async function POST(request: NextRequest) {
  try {
    const { question, history = [] } = await request.json() as {
      question: string
      history: Message[]
    }

    if (!question || typeof question !== 'string') {
      return new Response('Bad request', { status: 400 })
    }

    // Intentar usar el SDK de Anthropic dinámicamente
    let anthropicAvailable = false
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const Anthropic = require('@anthropic-ai/sdk').default
      anthropicAvailable = !!Anthropic && !!process.env.ANTHROPIC_API_KEY
    } catch {
      anthropicAvailable = false
    }

    if (anthropicAvailable) {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const Anthropic = require('@anthropic-ai/sdk').default
      const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

      const messages: Message[] = [
        ...history.slice(-6),
        { role: 'user' as const, content: question },
      ]

      const stream = await client.messages.stream({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 500,
        system: SYSTEM_PROMPT,
        messages,
      })

      const encoder = new TextEncoder()
      const readable = new ReadableStream({
        async start(controller) {
          for await (const chunk of stream) {
            if (
              chunk.type === 'content_block_delta' &&
              chunk.delta.type === 'text_delta'
            ) {
              controller.enqueue(encoder.encode(chunk.delta.text))
            }
          }
          controller.close()
        },
      })

      return new Response(readable, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'no-cache',
          'X-Accel-Buffering': 'no',
        },
      })
    } else {
      // Fallback simulado
      const responseText = getSimulatedResponse(question)

      const encoder = new TextEncoder()
      const readable = new ReadableStream({
        async start(controller) {
          // Simular streaming palabra por palabra
          const words = responseText.split(' ')
          for (const word of words) {
            controller.enqueue(encoder.encode(word + ' '))
            await new Promise((r) => setTimeout(r, 25))
          }
          controller.close()
        },
      })

      return new Response(readable, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'no-cache',
          'X-Accel-Buffering': 'no',
        },
      })
    }
  } catch (err) {
    console.error('[pregunta] error:', err)
    return new Response('Error interno', { status: 500 })
  }
}
