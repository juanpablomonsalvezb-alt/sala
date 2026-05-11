import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  compress: true,

  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'utfs.io' },
      { protocol: 'https', hostname: '*.ufs.sh' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' }, // Google avatar
      { protocol: 'https', hostname: 'media.licdn.com' },           // LinkedIn avatar
    ],
  },

  experimental: {
    optimizePackageImports: [
      '@tabler/icons-react',
      'lucide-react',
      'framer-motion',
      'recharts',
    ],
  },

  async headers() {
    // CSP — defensa en profundidad contra XSS.
    // 'unsafe-inline' es necesario para Next.js (estilos inline y JSON-LD).
    // 'unsafe-eval' es necesario para algunos polyfills/runtimes de Next 16.
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com https://*.vercel-analytics.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data: https://fonts.gstatic.com",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.mercadopago.com https://*.vercel-analytics.com https://*.vercel-insights.com",
      "frame-src https://www.youtube.com https://www.youtube-nocookie.com https://player.vimeo.com https://www.mercadopago.cl https://auth.mercadopago.cl",
      "frame-ancestors 'self'",
      "form-action 'self' https://auth.mercadopago.cl https://www.mercadopago.cl",
      "base-uri 'self'",
      "object-src 'none'",
      "upgrade-insecure-requests",
    ].join('; ')

    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options',           value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options',    value: 'nosniff' },
          { key: 'Referrer-Policy',           value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',        value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'Content-Security-Policy',   value: csp },
        ],
      },
    ]
  },
}

export default nextConfig
