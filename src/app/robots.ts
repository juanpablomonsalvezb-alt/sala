import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/dashboard/',
          '/admin/',
          '/abrir',
          '/entrar',
          '/registro',
          '/recuperar-contrasena',
          '/nueva-contrasena',
          '/auth/',
          '/suscribirse/',
          '/widget/',
          '/embed/',
          '/*.json$',
          '/*.csv$',
        ],
      },
      // Googlebot específicamente — acceso completo
      {
        userAgent: 'Googlebot',
        allow: '/',
      },
    ],
    sitemap: [
      'https://nebbuler.com/sitemap.xml',
    ],
  }
}
