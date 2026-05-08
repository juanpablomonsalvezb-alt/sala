import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

// Rutas que requieren sesión activa
const PROTECTED_PREFIXES = ['/dashboard']

// Rutas completamente públicas (exactas o con prefijo dinámico)
const PUBLIC_EXACT = new Set([
  '/',
  '/explorar',
  '/entrar',
  '/registro',
  '/precios',
  '/para-creadores',
  '/abrir',
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
