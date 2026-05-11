import { redirect } from 'next/navigation'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import type { Creator } from '@/types/database'
import ConfiguracionForm from './_components/ConfiguracionForm'
import MPConnectSection from './_components/MPConnectSection'

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ConfiguracionPage({
  searchParams,
}: {
  searchParams: Promise<{ mp_connected?: string; mp_disconnected?: string; mp_error?: string }>
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/entrar')

  // Leer datos del creador incluyendo estado MP (service role para campos sensibles)
  const service = createServiceClient()
  const { data: creatorRaw } = await service
    .from('sala_creators')
    .select('*, mp_user_id, mp_connected_at')
    .eq('user_id', user.id)
    .maybeSingle()

  const creator = creatorRaw as Creator | null
  if (!creator) redirect('/abrir')

  const mpConnected = !!creator.mp_user_id
  const mpUserId    = creator.mp_user_id ?? null
  const mpConnectedAt = creator.mp_connected_at ?? null

  const params = await searchParams
  const mpFlash = params.mp_connected     ? 'connected'
    : params.mp_disconnected ? 'disconnected'
    : params.mp_error        ? ('error:' + params.mp_error)
    : null

  return (
    <>
      {/* Header */}
      <div className="bg-white border-b border-[#DEDEDE] px-8 py-5 flex-shrink-0">
        <h1
          className="text-[22px] font-bold text-[#121212] leading-tight"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Configuración
        </h1>
        <p
          className="text-[13px] text-[#666666] mt-0.5"
          style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
        >
          Gestiona tu perfil público y los ajustes de tu sala
        </p>
      </div>

      <main className="flex-1 overflow-y-auto">
        <div className="px-8 py-7 max-w-[720px]">
          {/* URL actual */}
          <div className="bg-white border border-[#DEDEDE] px-6 py-4 mb-6 flex items-center justify-between">
            <div>
              <p
                className="text-[11px] uppercase tracking-[0.14em] text-[#666666] font-medium mb-1"
                style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
              >
                URL de tu sala
              </p>
              <p
                className="text-[15px] font-medium text-[#121212]"
                style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
              >
                nebbuler.com/
                <span className="text-[#C41C1C]">{creator.slug}</span>
              </p>
            </div>
            <a
              href={`/${creator.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[12px] font-medium text-[#C41C1C] hover:underline"
              style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
            >
              Ver sala →
            </a>
          </div>

          {/* Cuenta de pagos — solo visible cuando MP_APP_ID está configurado */}
          {process.env.MP_APP_ID && (
            <MPConnectSection
              connected={mpConnected}
              mpUserId={mpUserId}
              mpConnectedAt={mpConnectedAt}
              flash={mpFlash}
            />
          )}

          <ConfiguracionForm creator={creator} />
        </div>
      </main>
    </>
  )
}
