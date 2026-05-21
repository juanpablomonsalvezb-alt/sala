import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { CancelSubscriptionButton } from './_cancel-button'

export const metadata = {
  title: 'Mis suscripciones — Nebbuler',
  description: 'Gestiona tus suscripciones activas a creadores de Nebbuler.',
}

interface ActiveSubscriptionRow {
  id: string
  creator_id: string
  status: string
  price_clp: number
  last_paid_at: string | null
  created_at: string
  cancelled_at: string | null
  sala_creators: {
    name: string | null
    display_name: string | null
    username: string | null
    slug: string | null
    specialty: string | null
  } | null
}

function formatCLP(n: number): string {
  return n.toLocaleString('es-CL')
}

function formatDate(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('es-CL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default async function MisSuscripciones() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?next=/mis-suscripciones')
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any
  const { data } = await db
    .from('sala_subscriptions')
    .select(
      'id, creator_id, status, price_clp, last_paid_at, created_at, cancelled_at, sala_creators ( name, display_name, username, slug, specialty )'
    )
    .eq('subscriber_id', user.id)
    .order('created_at', { ascending: false })

  const subs = (data as ActiveSubscriptionRow[] | null) ?? []
  const active = subs.filter((s) => s.status === 'active' || s.status === 'past_due')
  const ended = subs.filter((s) => !['active', 'past_due'].includes(s.status))

  return (
    <main className="min-h-screen bg-[#FAFAF7] py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-10">
          <Link
            href="/"
            className="text-[13px] text-[#666666] hover:text-[#121212] inline-flex items-center gap-1"
          >
            ← Volver a Nebbuler
          </Link>
          <h1
            className="text-[34px] font-bold text-[#121212] tracking-tight mt-4"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Mis suscripciones
          </h1>
          <p className="text-[15px] text-[#666666] mt-2">
            Gestiona los creadores a los que estás suscrito. Al cancelar dejas de ser cobrado/a en
            la próxima fecha de renovación y mantienes acceso hasta entonces.
          </p>
        </div>

        {active.length === 0 && ended.length === 0 && (
          <div className="bg-white border border-[#DEDEDE] p-8 text-center">
            <p className="text-[15px] text-[#666666]">
              Aún no estás suscrito/a a ningún creador.
            </p>
            <Link
              href="/creadores"
              className="inline-block mt-4 bg-[#121212] text-white text-[13px] font-medium px-5 py-2.5"
            >
              Explorar creadores →
            </Link>
          </div>
        )}

        {active.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-[11px] uppercase tracking-[0.14em] text-[#666666] font-medium mb-3">
              Activas ({active.length})
            </h2>
            {active.map((sub) => {
              const creator = sub.sala_creators
              const name = creator?.display_name ?? creator?.name ?? 'Creador'
              const handle = creator?.username ?? creator?.slug ?? ''
              return (
                <article
                  key={sub.id}
                  className="bg-white border border-[#DEDEDE] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3
                        className="text-[18px] font-semibold text-[#121212]"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                      >
                        {name}
                      </h3>
                      {sub.status === 'past_due' && (
                        <span className="text-[10px] uppercase tracking-wider bg-[#FFE7C2] text-[#7A4A00] px-2 py-0.5">
                          Pago pendiente
                        </span>
                      )}
                    </div>
                    {creator?.specialty && (
                      <p className="text-[13px] text-[#666666]">{creator.specialty}</p>
                    )}
                    <p className="text-[13px] text-[#666666] mt-2">
                      ${formatCLP(sub.price_clp)} CLP/mes · Último cobro:{' '}
                      {formatDate(sub.last_paid_at ?? sub.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    {handle && (
                      <Link
                        href={`/${handle}`}
                        className="text-[13px] text-[#121212] underline underline-offset-2 hover:no-underline"
                      >
                        Ver perfil
                      </Link>
                    )}
                    <CancelSubscriptionButton
                      subscriptionId={sub.id}
                      creatorName={name}
                    />
                  </div>
                </article>
              )
            })}
          </section>
        )}

        {ended.length > 0 && (
          <section className="space-y-4 mt-10">
            <h2 className="text-[11px] uppercase tracking-[0.14em] text-[#666666] font-medium mb-3">
              Anteriores ({ended.length})
            </h2>
            {ended.map((sub) => {
              const creator = sub.sala_creators
              const name = creator?.display_name ?? creator?.name ?? 'Creador'
              return (
                <article
                  key={sub.id}
                  className="bg-white border border-[#DEDEDE] p-5 flex items-center justify-between opacity-70"
                >
                  <div>
                    <h3 className="text-[15px] font-medium text-[#121212]">{name}</h3>
                    <p className="text-[12px] text-[#666666] mt-1">
                      {sub.status === 'cancelled' ? 'Cancelada' : sub.status} el{' '}
                      {formatDate(sub.cancelled_at)}
                    </p>
                  </div>
                </article>
              )
            })}
          </section>
        )}
      </div>
    </main>
  )
}
