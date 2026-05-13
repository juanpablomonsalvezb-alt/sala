/**
 * Bing URL Submission API Integration
 * Notifica a Bing de URLs nuevas/modificadas en tiempo real
 * https://learn.microsoft.com/en-us/bing/webmaster-tools/url-submission-api
 */

const BING_API_KEY = process.env.BING_INDEXNOW_KEY || ''
const BING_HOST = 'nebbuler.com'

interface SubmitURLsRequest {
  host: string
  key: string
  keyLocation: string
  urlList: string[]
}

/**
 * Envía URLs a Bing IndexNow API para indexación inmediata
 * Máximo 10,000 URLs por día
 */
export async function submitToBing(urls: string[]): Promise<{
  success: boolean
  submitted: number
  error?: string
}> {
  if (!BING_API_KEY) {
    console.warn('BING_INDEXNOW_KEY no configurada')
    return { success: false, submitted: 0, error: 'API key not configured' }
  }

  const payload: SubmitURLsRequest = {
    host: BING_HOST,
    key: BING_API_KEY,
    keyLocation: `https://${BING_HOST}/robots.txt`, // Ubicación de la clave en robots.txt
    urlList: urls.slice(0, 10000), // Máximo 10k por solicitud
  }

  try {
    const response = await fetch('https://api.bing.microsoft.com/webmaster/api.svc/json/SubmitUrlBatch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      return {
        success: false,
        submitted: 0,
        error: `HTTP ${response.status}: ${response.statusText}`,
      }
    }

    return {
      success: true,
      submitted: urls.length,
    }
  } catch (error) {
    console.error('Error submitting URLs to Bing:', error)
    return {
      success: false,
      submitted: 0,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Envía URLs críticas a Bing después de publish
 * Llamar esto cuando se publica contenido nuevo
 */
export async function submitNewContent(creatorSlug: string, postSlug: string): Promise<void> {
  const url = `https://${BING_HOST}/${creatorSlug}/${postSlug}`
  await submitToBing([url])
}

/**
 * Envía batch de URLs para reindexación rápida
 */
export async function submitBatch(urls: string[]): Promise<void> {
  const result = await submitToBing(urls)
  if (result.success) {
    console.log(`✅ Bing: ${result.submitted} URLs submitted for indexing`)
  } else {
    console.error(`❌ Bing submission failed: ${result.error}`)
  }
}
