import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { Creator } from '@/types/database'
import { createCheckoutSession } from './actions'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
  return (
    !url.includes('placeholder') &&
    url.startsWith('https://') &&
    !key.includes('placeholder') &&
    key.length > 20
  )
}

function formatPriceCLP(n: number): string {
  return `$${n.toLocaleString('es-CL')}`
}

// ─── Mock fallback ────────────────────────────────────────────────────────────

const MOCK_CREATOR: Creator = {
  id: 'mock-1',
  user_id: 'mock-user-1',
  name: 'Rodrigo Fuentes',
  slug: 'rodrigo-fuentes',
  specialty: 'ANÁLISIS FINANCIERO',
  bio: 'Economista con 12 años en banca de inversión. Explico lo que los medios simplifican de más.',
  bio_long: null,
  linkedin_url: null,
  price_clp: 9990,
  plan: 'pro',
  publish_frequency: 'Publica cada jueves',
  created_at: '2024-03-01T00:00:00Z',
  subscriber_count: 847,
  stripe_account_id: null,
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ creator: string }>
}): Promise<Metadata> {
  const { creator: slug } = await params
  return {
    title: `Suscribirse — Nebbuler`,
    description: `Suscríbete al espacio de ${slug} en Nebbuler`,
  }
}

// ─── Componentes ──────────────────────────────────────────────────────────────

function Nav() {
  return (
    <header>
      <div className="h-[3px] bg-[#C41C1C] w-full" />
      <div className="border-b border-[#DEDEDE] py-3 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="font-serif text-[22px] font-bold text-[#121212] leading-none"
            style={{ letterSpacing: '-0.01em' }}
          >
            NEBBULER
          </Link>
          <Link
            href="/entrar"
            className="font-sans text-[12px] font-medium px-4 py-1.5 border border-[#DEDEDE] text-[#666666] hover:border-[#121212] hover:text-[#121212] transition-colors duration-150"
          >
            Iniciar sesión
          </Link>
        </div>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="border-t border-[#DEDEDE] py-6 px-6">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <span className="font-sans text-[11px] font-semibold uppercase tracking-widest text-[#666666]">
          NEBBULER · CHILE · 2026
        </span>
        <a
          href="mailto:hello@nebbuler.com"
          className="font-sans text-[12px] text-[#666666] hover:text-[#121212] transition-colors duration-150"
        >
          hello@nebbuler.com
        </a>
      </div>
    </footer>
  )
}

function CheckoutForm({
  creator,
}: {
  creator: Creator
}) {
  const priceLabel = `${formatPriceCLP(creator.price_clp)}/mes`

  return (
    <form
      action={async () => {
        'use server'
        await createCheckoutSession(creator.slug)
      }}
    >
      <div className="max-w-lg mx-auto">
        {/* Header del creador */}
        <div className="border-b border-[#DEDEDE] pb-8 mb-8">
          <div className="flex items-start gap-5">
            <div
              className="w-16 h-16 bg-[#F7F7F7] border border-[#DEDEDE] flex items-center justify-center shrink-0"
              aria-hidden="true"
            >
              <span className="font-serif text-[24px] font-bold text-[#121212]">
                {creator.name.charAt(0)}
              </span>
            </div>
            <div>
              <span className="section-label mb-1">{creator.specialty}</span>
              <h1
                className="font-serif text-[26px] font-bold text-[#121212] leading-tight"
                style={{ letterSpacing: '-0.01em' }}
              >
                {creator.name}
              </h1>
              <p className="font-sans text-[13px] text-[#666666] mt-1">
                {creator.subscriber_count.toLocaleString('es-CL')} suscriptores
              </p>
            </div>
          </div>
          <p className="font-sans text-[14px] text-[#666666] leading-relaxed mt-5">
            {creator.bio}
          </p>
        </div>

        {/* Resumen de la suscripción */}
        <div className="border border-[#DEDEDE] p-6 mb-6 bg-[#F7F7F7]">
          <span className="section-label-dark mb-4 inline-block">RESUMEN</span>
          <div className="flex items-center justify-between mb-3">
            <span className="font-sans text-[14px] text-[#121212]">
              Suscripción mensual a {creator.name}
            </span>
            <span className="font-sans text-[14px] font-semibold text-[#121212]">
              {priceLabel}
            </span>
          </div>
          <hr className="nyt-rule mb-3" />
          <div className="space-y-2">
            {[
              'Acceso inmediato a todos los artículos',
              'Archivo completo desbloqueado',
              'Notificaciones de nuevas publicaciones',
              'Cancela cuando quieras. Sin permanencia.',
            ].map((benefit) => (
              <div key={benefit} className="flex items-start gap-2">
                <span className="font-serif text-[#C41C1C] mt-0.5 leading-none text-[14px]">
                  —
                </span>
                <span className="font-sans text-[13px] text-[#666666]">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <button
          type="submit"
          className="w-full font-sans text-[14px] font-semibold py-4 bg-[#C41C1C] text-white hover:bg-[#a01515] transition-colors duration-150 mb-3"
        >
          Suscribirse con Stripe · {priceLabel}
        </button>
        <p className="font-sans text-[11px] text-[#666666] text-center">
          Pago seguro vía Stripe. Cancela en cualquier momento.
        </p>

        {/* Volver */}
        <div className="text-center mt-6">
          <Link
            href={`/${creator.slug}`}
            className="font-sans text-[12px] text-[#666666] hover:text-[#121212] transition-colors duration-150"
          >
            ← Volver a la sala de {creator.name}
          </Link>
        </div>
      </div>
    </form>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function SuscribirsePage({
  params,
}: {
  params: Promise<{ creator: string }>
}) {
  const { creator: slug } = await params

  let creator: Creator | null = null

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient()
      const { data, error } = await supabase
        .from('sala_creators')
        .select('*')
        .eq('slug', slug)
        .single()

      if (error || !data) notFound()
      creator = data
    } catch {
      if (slug === 'rodrigo-fuentes') {
        creator = MOCK_CREATOR
      } else {
        notFound()
      }
    }
  } else {
    if (slug === 'rodrigo-fuentes') {
      creator = MOCK_CREATOR
    } else {
      notFound()
    }
  }

  if (!creator) notFound()

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Nav />
      <main className="flex-1 py-16 px-6">
        <CheckoutForm creator={creator} />
      </main>
      <Footer />
    </div>
  )
}
