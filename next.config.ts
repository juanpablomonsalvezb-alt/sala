import type { NextConfig } from "next"
import withPWAInit from "@ducanh2912/next-pwa"
import { withSentryConfig } from "@sentry/nextjs"

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  fallbacks: {
    document: "/offline",
  },
  workboxOptions: {
    skipWaiting: true,
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/nebbuler\.com\/.*/i,
        handler: "NetworkFirst",
        options: {
          cacheName: "nebbuler-pages",
          expiration: { maxEntries: 64, maxAgeSeconds: 24 * 60 * 60 },
        },
      },
      {
        urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
        handler: "CacheFirst",
        options: {
          cacheName: "google-fonts",
          expiration: { maxEntries: 10, maxAgeSeconds: 365 * 24 * 60 * 60 },
        },
      },
      {
        urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|avif|ico)$/i,
        handler: "CacheFirst",
        options: {
          cacheName: "static-images",
          expiration: { maxEntries: 64, maxAgeSeconds: 30 * 24 * 60 * 60 },
        },
      },
    ],
  },
})

const nextConfig: NextConfig = {
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  compress: true,

  turbopack: {},

  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'utfs.io' },
      { protocol: 'https', hostname: '*.ufs.sh' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' }, // Google avatar
      { protocol: 'https', hostname: 'media.licdn.com' },           // LinkedIn avatar
    ],
  },

  serverExternalPackages: ['agent-twitter-client', '@roamhq/wrtc', '@roamhq/wrtc-darwin-x64'],

  experimental: {
    optimizePackageImports: [
      '@tabler/icons-react',
      'lucide-react',
      'framer-motion',
      'recharts',
    ],
  },

  async rewrites() {
    return [
      { source: '/.well-known/ai-plugin.json', destination: '/api/well-known/ai-plugin' },
      { source: '/.well-known/openapi.yaml',   destination: '/api/well-known/openapi' },
    ]
  },

  async redirects() {
    return [
      { source: '/invite/:code', destination: '/vip/:code', permanent: true },
    ]
  },

  async headers() {
    // CSP — defensa en profundidad contra XSS.
    // 'unsafe-inline' es necesario para Next.js (estilos inline y JSON-LD).
    // 'unsafe-eval' es necesario para algunos polyfills/runtimes de Next 16.
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com https://*.vercel-analytics.com https://cloud.umami.is https://app.posthog.com https://us.i.posthog.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data: https://fonts.gstatic.com",
      "worker-src 'self'",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.mercadopago.com https://*.vercel-analytics.com https://*.vercel-insights.com https://*.meilisearch.io https://app.posthog.com https://us.i.posthog.com https://cdn.growthbook.io https://app.formbricks.com https://cloud.umami.is https://api.umami.is",
      "frame-src https://www.youtube.com https://www.youtube-nocookie.com https://player.vimeo.com https://www.mercadopago.cl https://auth.mercadopago.cl",
      "frame-ancestors 'self'",
      "form-action 'self' https://auth.mercadopago.cl https://www.mercadopago.cl",
      "base-uri 'self'",
      "object-src 'none'",
      "upgrade-insecure-requests",
    ].join('; ')

    return [
      // ISR cache headers: creator profiles (24h revalidation)
      {
        source: '/([^/]+)$',
        headers: [
          { key: 'Cache-Control', value: 'public, s-maxage=86400, stale-while-revalidate=604800' },
          { key: 'X-Frame-Options',           value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options',    value: 'nosniff' },
          { key: 'Referrer-Policy',           value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',        value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Strict-Transport-Security',      value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'Content-Security-Policy-Report-Only', value: csp },
        ],
      },
      // ISR cache headers: articles (1h revalidation)
      {
        source: '/([^/]+)/([^/]+)$',
        headers: [
          { key: 'Cache-Control', value: 'public, s-maxage=3600, stale-while-revalidate=86400' },
          { key: 'X-Frame-Options',           value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options',    value: 'nosniff' },
          { key: 'Referrer-Policy',           value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',        value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Strict-Transport-Security',      value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'Content-Security-Policy-Report-Only', value: csp },
        ],
      },
      // Trending articles (1h revalidation)
      {
        source: '/tendencia/:slug',
        headers: [
          { key: 'Cache-Control', value: 'public, s-maxage=3600, stale-while-revalidate=86400' },
          { key: 'X-Frame-Options',           value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options',    value: 'nosniff' },
          { key: 'Referrer-Policy',           value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',        value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Strict-Transport-Security',      value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'Content-Security-Policy-Report-Only', value: csp },
        ],
      },
      // Embed iframe routes — deben ser embebibles cross-origin.
      // Estos headers se aplican ANTES del catch-all '/(.*)' para que
      // X-Frame-Options no sobrescriba lo que setea el route handler.
      {
        source: '/embed/iframe/:creator',
        headers: [
          { key: 'X-Frame-Options',           value: 'ALLOWALL' },
          { key: 'X-Content-Type-Options',    value: 'nosniff' },
          { key: 'Referrer-Policy',           value: 'strict-origin-when-cross-origin' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
        ],
      },
      // embed.js — script público accesible desde cualquier origen
      {
        source: '/embed.js',
        headers: [
          { key: 'X-Content-Type-Options',    value: 'nosniff' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Cache-Control',             value: 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800' },
        ],
      },
      // .well-known — acceso público para crawlers de IA
      {
        source: '/.well-known/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Content-Type', value: 'application/json' },
          { key: 'Cache-Control', value: 'public, max-age=86400' },
        ],
      },
      // Default headers for all other routes
      {
        source: '/((?!embed/iframe|embed\\.js).*)',
        headers: [
          { key: 'X-Frame-Options',           value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options',    value: 'nosniff' },
          { key: 'Referrer-Policy',           value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',        value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Strict-Transport-Security',      value: 'max-age=63072000; includeSubDomains; preload' },
          // CSP enforcing (audit 2026-05-21). La whitelist cubre PostHog,
          // GrowthBook, Formbricks, Umami, MercadoPago, Supabase, Vercel,
          // Meilisearch, YouTube y Vimeo. Si aparece un recurso legítimo no
          // cubierto, agregarlo arriba en la constante `csp`.
          { key: 'Content-Security-Policy-Report-Only', value: csp },
        ],
      },
    ]
  },
}

// Sentry: envolvemos DESPUÉS de PWA. withSentryConfig sube source maps al
// build (si SENTRY_AUTH_TOKEN está presente) y conecta los webpack plugins
// para que stacktraces en producción sean legibles. Si no hay AUTH_TOKEN,
// el build sigue funcionando sin upload — solo se pierde la des-minificación
// en el dashboard de Sentry.
const sentryBuildOptions = {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,

  // Silenciar logs del plugin durante el build (Vercel ya es ruidoso)
  silent: !process.env.CI,

  // No exponer source maps públicamente en producción
  hideSourceMaps: true,

  // Nota: disableLogger fue deprecado en Sentry SDK 10.x. El tree-shake del
  // logger ahora se hace vía webpack.treeshake.removeDebugLogging (no
  // soportado con Turbopack que es lo que usamos), así que no lo seteamos.

  // No subir source maps si falta el auth token (evita errores de build
  // en previews / locales / forks que no tienen el secret)
  sourcemaps: {
    disable: !process.env.SENTRY_AUTH_TOKEN,
  },

  // Telemetría del plugin de build hacia Sentry — apagada para no consumir
  telemetry: false,
}

export default withSentryConfig(withPWA(nextConfig), sentryBuildOptions)
