import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Nebbuler — Expertos de LATAM, sin filtros',
    short_name: 'Nebbuler',
    description: 'Contenido experto de América Latina: economía, derecho, impuestos, negocios y salud, escrito por profesionales. Sello Sin IA para autores verificados.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FFFFFF',
    theme_color: '#0A0A0A',
    orientation: 'portrait',
    categories: ['news', 'education', 'business'],
    lang: 'es',
    icons: [
      { src: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icons/icon-384x384.png', sizes: '384x384', type: 'image/png' },
      { src: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png', purpose: 'maskable' },
    ],
  }
}
