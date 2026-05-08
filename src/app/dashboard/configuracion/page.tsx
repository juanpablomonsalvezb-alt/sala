import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Creator } from '@/types/database'
import ConfiguracionForm from './_components/ConfiguracionForm'

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ConfiguracionPage() {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/entrar')

  const { data: creatorRaw } = await db
    .from('sala_creators')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle()

  const creator = creatorRaw as Creator | null
  if (!creator) redirect('/abrir')

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
                sala.lat/
                <span className="text-[#C41C1C]">{creator!.slug}</span>
              </p>
            </div>
            <a
              href={`/${creator!.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[12px] font-medium text-[#C41C1C] hover:underline"
              style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
            >
              Ver sala →
            </a>
          </div>

          <ConfiguracionForm creator={creator!} />
        </div>
      </main>
    </>
  )
}
