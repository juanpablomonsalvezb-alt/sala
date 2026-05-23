// Landing del referido — nebbuler.com/r/[username]
//
// Página pública (no-indexable) a la que llegan los visitantes desde un link
// de referido. Si el slug existe en sala_creators, mostramos un hero editorial
// estilo NYT con CTA principal que pasa por /api/referrals/claim (setea cookie
// nb_referrer y redirige a /registro). Si no existe, redirect('/') sin
// notFound para no romper la UX del link compartido.

import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient as createServiceSupabase } from '@supabase/supabase-js'
import { normalizeUsername } from '@/lib/referral-helpers'

export const revalidate = 3600

type Props = {
  params: Promise<{ username: string }>
}

type Referrer = {
  slug: string
  name: string
  bio: string
  specialty: string
  cover_image_url: string | null
  publication_name: string | null
}

function adminSupabase() {
  const key = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!key) throw new Error('SUPABASE_SECRET_KEY missing')
  return createServiceSupabase(process.env.NEXT_PUBLIC_SUPABASE_URL!, key)
}

async function getReferrer(username: string): Promise<Referrer | null> {
  try {
    const supabase = adminSupabase()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase.from('sala_creators') as any)
      .select('slug, name, bio, specialty, cover_image_url, publication_name')
      .eq('slug', username)
      .maybeSingle()
    return (data as Referrer) ?? null
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username: raw } = await params
  const username = normalizeUsername(raw)
  if (!username) {
    return {
      title: 'Nebbuler',
      robots: { index: false, follow: false },
    }
  }

  const referrer = await getReferrer(username)
  const name = referrer?.name ?? 'Un creador'
  const title = `${name} te invita a Nebbuler`
  const description = referrer?.bio
    ? `${referrer.bio} — Únete y obtén 1 mes gratis.`
    : 'Crea tu sala en Nebbuler desde este link y obtén 1 mes gratis.'

  return {
    title,
    description,
    robots: { index: false, follow: false },
    openGraph: {
      title,
      description,
      images: referrer?.slug
        ? [{ url: `/api/og/creator/${referrer.slug}`, width: 1200, height: 630 }]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export default async function ReferralLandingPage({ params }: Props) {
  const { username: raw } = await params
  const username = normalizeUsername(raw)
  if (!username) {
    redirect('/')
  }

  const referrer = await getReferrer(username)
  if (!referrer) {
    redirect('/')
  }

  const initials = referrer.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const claimHref = `/api/referrals/claim?ref=${encodeURIComponent(username)}&next=/registro`
  const salaHref = `/${referrer.slug}`

  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: referrer.name,
    description: referrer.bio,
    jobTitle: referrer.specialty,
    url: `https://nebbuler.com/${referrer.slug}`,
    image: referrer.cover_image_url ?? undefined,
  }

  return (
    <main
      className="min-h-screen bg-[#FAFAF7] px-6 py-16"
      style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
    >
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />

      <div className="mx-auto max-w-2xl">
        {/* Marca */}
        <div className="mb-12 text-center">
          <Link
            href="/"
            className="inline-block text-[12px] font-bold uppercase tracking-[0.24em] text-[#121212] hover:text-[#C41C1C] transition-colors"
            style={{ fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif" }}
          >
            NEBBULER
          </Link>
          <div className="mt-3 inline-block border border-[#C41C1C]/30 bg-[#FFF0F0] px-3 py-1">
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#C41C1C]">
              Invitación personal
            </span>
          </div>
        </div>

        {/* Hero editorial */}
        <div className="border border-[#E5E5E5] bg-white p-10 sm:p-14">
          <div className="flex flex-col items-center text-center">
            {/* Avatar */}
            {referrer.cover_image_url ? (
              <div className="relative mb-6 h-24 w-24 overflow-hidden rounded-full border-2 border-[#121212]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={referrer.cover_image_url}
                  alt={referrer.name}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#121212]">
                <span
                  className="text-[28px] font-bold text-white"
                  style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                >
                  {initials}
                </span>
              </div>
            )}

            {/* Especialidad */}
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[#666]">
              {referrer.specialty}
            </p>

            {/* Título principal */}
            <h1
              className="mb-5 text-[32px] sm:text-[42px] font-bold leading-[1.1] text-[#121212]"
              style={{ fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif" }}
            >
              {referrer.name} te invita a Nebbuler
            </h1>

            {/* Bio */}
            {referrer.bio && (
              <p
                className="mb-8 max-w-lg text-[16px] leading-relaxed text-[#444] italic"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
              >
                “{referrer.bio}”
              </p>
            )}

            {/* Pitch */}
            <div className="mb-8 max-w-md border-t border-b border-[#E5E5E5] py-6">
              <p className="text-[15px] leading-relaxed text-[#121212]">
                Crea tu sala desde este link y obtén{' '}
                <strong className="text-[#C41C1C]">1 mes gratis</strong>.
                <br />
                <span className="text-[14px] text-[#666]">
                  {referrer.name.split(' ')[0]} también.
                </span>
              </p>
            </div>

            {/* CTAs */}
            <div className="flex w-full max-w-sm flex-col gap-3">
              <a
                href={claimHref}
                className="flex items-center justify-center gap-2 bg-[#C41C1C] px-6 py-4 text-[14px] font-bold uppercase tracking-[0.1em] text-white transition-all hover:bg-[#A01515] active:scale-[0.98]"
              >
                Crear mi sala gratis
                <span aria-hidden>→</span>
              </a>
              <Link
                href={salaHref}
                className="flex items-center justify-center gap-2 border border-[#121212] bg-white px-6 py-3.5 text-[13px] font-medium text-[#121212] transition-all hover:bg-[#F7F7F7]"
              >
                Ver la sala de {referrer.name.split(' ')[0]}
              </Link>
            </div>

            <p className="mt-6 text-[11px] text-[#999]">
              0% de comisión · Sin tarjeta para empezar · Cancela cuando quieras
            </p>
          </div>
        </div>

        {/* Cómo funciona */}
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { n: '01', t: 'Haz click', d: 'Te llevamos a crear tu sala con un beneficio activo.' },
            { n: '02', t: 'Crea tu sala', d: 'En 3 minutos tu espacio editorial está online.' },
            { n: '03', t: 'Mes gratis', d: 'Ambos lo reciben al activarse tu suscripción.' },
          ].map((s) => (
            <div key={s.n} className="border border-[#E5E5E5] bg-white p-5">
              <p
                className="mb-2 text-[11px] font-bold tracking-[0.18em] text-[#C41C1C]"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
              >
                {s.n}
              </p>
              <p className="mb-1 text-[14px] font-semibold text-[#121212]">{s.t}</p>
              <p className="text-[12px] leading-relaxed text-[#666]">{s.d}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <a
            href="https://nebbuler.com?ref=badge"
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium tracking-[0.06em] text-black/40 hover:text-black/70 bg-black/[0.03] hover:bg-black/[0.06] border border-black/[0.06] transition-all no-underline"
          >
            Powered by <span className="font-bold">Nebbuler</span>
          </a>
        </div>
      </div>
    </main>
  )
}
