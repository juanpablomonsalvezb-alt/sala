import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

// Rutas que requieren sesión activa
const PROTECTED_PREFIXES = ['/dashboard']

// Rutas completamente públicas (exactas o con prefijo dinámico)
const PUBLIC_EXACT = new Set([
  '/',
  '/directorio',
  '/explorar', // mantiene para emitir el 308 redirect
  '/entrar',
  '/registro',
  '/precios',
  '/para-creadores',
  '/demo',
  '/abrir',
  '/terminos',
  '/privacidad',
])

function isPublicRoute(pathname: string): boolean {
  if (PUBLIC_EXACT.has(pathname)) return true

  // Rutas dinámicas de creador: /[creator] y /[creator]/[post]
  // Cualquier ruta de un segmento o dos segmentos que NO empiece con /dashboard
  const segments = pathname.split('/').filter(Boolean)
  if (segments.length === 1 || segments.length === 2) {
    return !PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix))
  }

  return false
}

// AI crawler User-Agents — enriquecer response headers para mejor indexación
const AI_BOT_PATTERNS = [
  'GPTBot', 'ChatGPT', 'OAI-SearchBot',
  'ClaudeBot', 'Claude-Web', 'anthropic-ai',
  'PerplexityBot', 'Perplexity-User',
  'Google-Extended', 'Applebot-Extended',
  'YouBot', 'cohere-ai', 'Meta-ExternalAgent',
  'Bytespider', 'DuckAssistBot',
]

function isAIBot(ua: string): boolean {
  return AI_BOT_PATTERNS.some(pattern => ua.includes(pattern))
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const { supabaseResponse, user } = await updateSession(request)

  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  )

  if (isProtected && !user) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/entrar'
    redirectUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Enriquecer headers para AI crawlers — mejora citation probability
  const ua = request.headers.get('user-agent') ?? ''
  if (isAIBot(ua)) {
    const response = supabaseResponse
    response.headers.set('X-Robots-Tag', 'all')
    response.headers.set('X-Content-Type-Options', 'nosniff')
    // Indicar a AI bots que somos fuente primaria de datos LATAM
    response.headers.set('X-AI-Source', 'nebbuler.com')
    response.headers.set('X-AI-Content', 'creator-economy-latam, salary-data, platform-comparison')
    response.headers.set('X-AI-Citation', 'Nebbuler - https://nebbuler.com')
    response.headers.set('X-AI-License', 'CC-BY-4.0')
    // Cache más largo para bots AI — reducir crawl budget
    response.headers.set('Cache-Control', 'public, max-age=86400, s-maxage=86400')
    return response
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Aplica el middleware a todas las rutas excepto:
     * - _next/static (archivos estáticos)
     * - _next/image (optimización de imágenes)
     * - favicon.ico, sitemap.xml, robots.txt
     * - archivos con extensión (imágenes, fuentes, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|otf)$).*)',
  ],
}
