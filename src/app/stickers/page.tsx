import type { Metadata } from 'next'
import Link from 'next/link'
import { safeJsonLd } from '@/lib/rateLimit'

export const revalidate = 3600

const TITLE = 'Stickers Nebbuler Mundial 2026 · Pack gratis para WhatsApp'
const DESCRIPTION =
  'Pack de stickers temáticos del Mundial 2026 para WhatsApp y Telegram. Descarga gratis sin registro. 12 reacciones para mandar a tu hinchada durante cada partido.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: 'https://nebbuler.com/stickers' },
  openGraph: {
    title: 'Pack de stickers Mundial 2026 — Nebbuler',
    description: 'Stickers gratis para WhatsApp. 12 reacciones del Mundial. Sin registro.',
    url: 'https://nebbuler.com/stickers',
    type: 'website',
    images: [{ url: '/api/sticker/gol', width: 512, height: 512 }],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION },
}

const STICKERS = [
  { id: 'gol', label: 'GOOOOL' },
  { id: 'campeon', label: 'Campeón' },
  { id: 'vamos', label: 'Vamos!' },
  { id: 'llora', label: 'Lloro' },
  { id: 'penal', label: 'Penal' },
  { id: 'tarjeta', label: 'Afuera' },
  { id: 'silbato', label: 'VAR' },
  { id: 'fiesta', label: 'Copa' },
  { id: 'asado', label: 'Asado' },
  { id: 'mate', label: 'Con mate' },
  { id: 'cancha', label: 'A la cancha' },
  { id: 'hincha', label: 'Hinchada' },
]

const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: TITLE,
  description: DESCRIPTION,
  url: 'https://nebbuler.com/stickers',
  inLanguage: 'es',
  isAccessibleForFree: true,
}

export default function StickersPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(JSON_LD) }}
      />
      <div className="min-h-screen bg-[#050505] text-white">
        <header className="border-b border-white/10">
          <div className="h-[3px] bg-[#C41C1C]" />
          <div className="py-3 px-6">
            <div className="max-w-5xl mx-auto flex items-center justify-between">
              <Link href="/" className="font-serif text-[22px] font-bold tracking-tight">
                NEBBULER
              </Link>
              <Link
                href="/mundial"
                className="text-xs text-white/60 hover:text-white tracking-[0.15em] uppercase"
              >
                ← La Sombra
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-6 py-12 md:py-16">
          <div className="mb-10">
            <p className="text-[#C41C1C] text-xs font-bold tracking-[0.2em] uppercase mb-3">
              Pack de stickers · WhatsApp · Telegram
            </p>
            <h1 className="font-serif text-5xl md:text-6xl leading-[1] tracking-tight mb-4">
              12 stickers para el Mundial.<br />
              <span className="italic text-white/70">Gratis. Sin registro.</span>
            </h1>
            <p className="text-white/60 text-lg max-w-2xl">
              Click derecho → "Guardar imagen como…" sobre cualquier sticker. Después
              importalos a WhatsApp con cualquier app de stickers (Sticker.ly, Top Stickers,
              etc).
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-16">
            {STICKERS.map((s) => (
              <a
                key={s.id}
                href={`/api/sticker/${s.id}`}
                download={`nebbuler-${s.id}.png`}
                className="group block border border-white/10 hover:border-white/40 transition-colors"
              >
                <div className="aspect-square bg-white/[0.02] flex items-center justify-center overflow-hidden">
                  <img
                    src={`/api/sticker/${s.id}`}
                    alt={`Sticker ${s.label}`}
                    width={512}
                    height={512}
                    className="w-full h-full object-contain"
                    loading="lazy"
                  />
                </div>
                <div className="p-3 flex items-center justify-between">
                  <span className="text-sm">{s.label}</span>
                  <span className="text-[10px] text-white/40 group-hover:text-[#C41C1C] tracking-wider uppercase">
                    Descargar →
                  </span>
                </div>
              </a>
            ))}
          </div>

          <section className="pt-12 border-t border-white/10">
            <h2 className="font-serif text-2xl mb-4">Cómo usarlos en WhatsApp</h2>
            <ol className="space-y-3 text-white/70 list-decimal list-inside">
              <li>Tocá cada sticker que quieras y descárgalo.</li>
              <li>Abrí la app gratuita <strong>Sticker.ly</strong> o <strong>Top Stickers</strong> en tu teléfono.</li>
              <li>Creá un nuevo pack llamado "Nebbuler Mundial 2026".</li>
              <li>Subí las 12 imágenes que descargaste.</li>
              <li>"Add to WhatsApp" → listo. Todos tus contactos pueden recibirlos.</li>
            </ol>
          </section>

          <section className="mt-16 pt-12 border-t border-white/10">
            <p className="text-[#C41C1C] text-xs font-bold tracking-[0.2em] uppercase mb-3">
              ¿Sos creador deportivo LATAM?
            </p>
            <h2 className="font-serif text-3xl mb-4">
              Convertí tu hinchada en suscriptores pagos
            </h2>
            <p className="text-white/70 mb-6 max-w-2xl">
              Programa La Sombra de Nebbuler: 0% comisión variable hasta el 31 de julio para
              periodistas, podcasters y analistas deportivos LATAM. Cobrá en pesos a tu
              audiencia.
            </p>
            <Link
              href="/mundial"
              className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 font-medium hover:bg-white/90 transition-colors"
            >
              Ver Programa La Sombra →
            </Link>
          </section>
        </main>

        <footer className="border-t border-white/10 mt-12 py-8 px-6">
          <div className="max-w-5xl mx-auto text-xs text-white/40">
            <p>
              © 2026 Nebbuler · Stickers de uso libre, CC0. No afiliados con FIFA ni con el
              Mundial 2026 oficial.
            </p>
          </div>
        </footer>
      </div>
    </>
  )
}
