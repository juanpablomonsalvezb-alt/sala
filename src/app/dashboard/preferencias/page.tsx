import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import PreferencesPanel from '@/components/notifications/PreferencesPanel'
import ApplyToAllForm from './_apply-all-form'

export const metadata = {
  title: 'Preferencias de notificación — Nebbuler',
  description:
    'Elige por qué canal quieres recibir los nuevos análisis de los creadores a los que sigues.',
}

export const dynamic = 'force-dynamic'

type Channel = 'email' | 'whatsapp' | 'both'

interface SubRow {
  id: string
  creator_id: string
  status: string
  channel_preference: Channel | null
  sala_creators: {
    name: string | null
    display_name: string | null
    slug: string | null
    username: string | null
    specialty: string | null
  } | null
}

interface ProfileRow {
  phone_number: string | null
  phone_verified: boolean | null
}

function maskPhone(p: string | null | undefined): string {
  if (!p) return ''
  if (p.length <= 5) return p
  // Mostrar prefijo + ****
  return `${p.slice(0, Math.max(p.length - 4, 4))}****`
}

export default async function PreferenciasPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/entrar?next=/dashboard/preferencias')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any

  const [profileRes, subsRes] = await Promise.all([
    db
      .from('sala_profiles')
      .select('phone_number, phone_verified')
      .eq('id', user.id)
      .maybeSingle(),
    db
      .from('sala_subscriptions')
      .select(
        'id, creator_id, status, channel_preference, sala_creators ( name, display_name, slug, username, specialty )'
      )
      .eq('subscriber_id', user.id)
      .eq('status', 'active')
      .order('created_at', { ascending: false }),
  ])

  const profile = (profileRes.data as ProfileRow | null) ?? null
  const subs = (subsRes.data as SubRow[] | null) ?? []

  const hasVerifiedPhone = Boolean(profile?.phone_verified && profile?.phone_number)

  return (
    <main className="min-h-screen bg-[#FAFAF7] py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-10">
          <Link
            href="/mis-suscripciones"
            className="text-[13px] text-[#666666] hover:text-[#121212] inline-flex items-center gap-1"
          >
            ← Volver a mis suscripciones
          </Link>
          <h1
            className="text-[34px] font-bold text-[#121212] tracking-tight mt-4"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Preferencias de notificación
          </h1>
          <p className="text-[15px] text-[#666666] mt-2">
            Elige por qué canal quieres enterarte de cada nuevo análisis. En LATAM, los
            suscriptores que activan WhatsApp leen ~5× más posts.
          </p>
        </div>

        {/* Phone status global */}
        <section className="bg-white border border-[#DEDEDE] p-6 sm:p-8 mb-8">
          <h2
            className="text-[18px] font-bold text-[#121212] mb-1"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Tu teléfono
          </h2>
          {hasVerifiedPhone ? (
            <div className="flex items-center justify-between gap-3 mt-3">
              <div>
                <p className="text-[15px] text-[#121212] font-mono">
                  {maskPhone(profile?.phone_number)}
                </p>
                <p className="text-[11px] text-[#1A7A3A] mt-0.5 inline-flex items-center gap-1">
                  <span aria-hidden>●</span> Verificado para WhatsApp
                </p>
              </div>
              <Link
                href="#cambiar-telefono"
                className="text-[12px] text-[#666666] underline underline-offset-2 hover:text-[#121212]"
              >
                Cambiar
              </Link>
            </div>
          ) : (
            <p className="text-[13px] text-[#666666] mt-2">
              Aún no tienes un teléfono verificado. Selecciona WhatsApp en cualquiera de
              tus suscripciones para configurarlo.
            </p>
          )}
        </section>

        {/* Apply to all */}
        {subs.length > 1 && (
          <section className="bg-white border border-[#DEDEDE] p-6 sm:p-8 mb-8">
            <h2
              className="text-[18px] font-bold text-[#121212] mb-1"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Aplicar a todas
            </h2>
            <p className="text-[13px] text-[#666666] mb-4">
              Aplica una misma preferencia a tus {subs.length} suscripciones activas.
            </p>
            <ApplyToAllForm />
          </section>
        )}

        {/* Per-subscription panels */}
        {subs.length === 0 ? (
          <div className="bg-white border border-[#DEDEDE] p-8 text-center">
            <p className="text-[15px] text-[#666666]">
              Aún no estás suscrito/a a ningún creador.
            </p>
            <Link
              href="/explorar"
              className="inline-block mt-4 bg-[#121212] text-white text-[13px] font-medium px-5 py-2.5"
            >
              Explorar creadores →
            </Link>
          </div>
        ) : (
          <section className="space-y-6" id="cambiar-telefono">
            <h2 className="text-[11px] uppercase tracking-[0.14em] text-[#666666] font-medium">
              Por suscripción ({subs.length})
            </h2>
            {subs.map((s) => {
              const creator = s.sala_creators
              const name = creator?.display_name ?? creator?.name ?? 'Creador'
              return (
                <div key={s.id}>
                  <div className="px-1 mb-2">
                    <h3
                      className="text-[18px] font-semibold text-[#121212]"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      {name}
                    </h3>
                    {creator?.specialty && (
                      <p className="text-[12px] text-[#666666]">{creator.specialty}</p>
                    )}
                  </div>
                  <PreferencesPanel
                    subscriptionId={s.id}
                    initialPrefs={{
                      phone: profile?.phone_number ?? null,
                      channel_preference: s.channel_preference ?? 'email',
                      phone_verified: profile?.phone_verified ?? false,
                    }}
                    showTitle={false}
                  />
                </div>
              )
            })}
          </section>
        )}
      </div>
    </main>
  )
}
