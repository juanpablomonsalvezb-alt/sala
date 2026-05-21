import Link from 'next/link'
import { createClient as createServiceSupabase } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'
import { normalizeInviteCode } from '@/lib/invite-helpers'
import { InviteRedeemButton } from './_redeem-button'

export const dynamic = 'force-dynamic'

interface ValidateRow {
  is_valid: boolean
  reason: string
  display_name: string | null
  grants_plan: string | null
}

interface PageProps {
  params: Promise<{ code: string }>
}

function adminSupabase() {
  const key = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!key) return null
  return createServiceSupabase(process.env.NEXT_PUBLIC_SUPABASE_URL!, key)
}

async function validateCode(rawCode: string) {
  const code = normalizeInviteCode(rawCode)
  if (!code) return { valid: false as const, reason: 'invalid_format' }
  const admin = adminSupabase()
  if (!admin) return { valid: false as const, reason: 'config_error' }
  const { data } = await admin.rpc('sala_validate_invite', { p_code: code })
  const row = Array.isArray(data) ? (data[0] as ValidateRow | undefined) : (data as ValidateRow | null)
  if (!row || !row.is_valid) {
    return { valid: false as const, reason: row?.reason ?? 'not_found' }
  }
  return {
    valid: true as const,
    code,
    displayName: row.display_name,
    grantsPlan: row.grants_plan,
  }
}

const ERROR_MESSAGES: Record<string, { title: string; body: string }> = {
  not_found: {
    title: 'Código no encontrado',
    body: 'El código que abriste no existe. Verifica que esté escrito correctamente.',
  },
  revoked: {
    title: 'Código revocado',
    body: 'Este código fue revocado por el equipo de Nebbuler. Si crees que es un error, contáctanos.',
  },
  expired: {
    title: 'Código expirado',
    body: 'Este código ya no es válido. Pide uno nuevo a tu contacto en Nebbuler.',
  },
  used_up: {
    title: 'Código ya utilizado',
    body: 'Este código alcanzó el límite de redenciones. Pide uno nuevo a tu contacto en Nebbuler.',
  },
  invalid_format: {
    title: 'Formato inválido',
    body: 'El código no tiene el formato esperado.',
  },
  config_error: {
    title: 'Error temporal',
    body: 'No pudimos validar tu código en este momento. Inténtalo en unos minutos.',
  },
}

export default async function InvitePage({ params }: PageProps) {
  const { code: rawCode } = await params
  const result = await validateCode(rawCode)

  if (!result.valid) {
    const err = ERROR_MESSAGES[result.reason] ?? ERROR_MESSAGES.not_found
    return (
      <main className="min-h-screen bg-[#FAFAF7] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white border border-[#DEDEDE] p-8 text-center">
          <p className="text-[11px] uppercase tracking-[0.14em] text-[#C41C1C] font-medium mb-3">
            Invitación inválida
          </p>
          <h1
            className="text-[28px] font-bold text-[#121212] tracking-tight"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            {err.title}
          </h1>
          <p className="text-[14px] text-[#666666] mt-3 leading-relaxed">{err.body}</p>
          <Link
            href="/"
            className="inline-block mt-6 text-[13px] text-[#121212] underline underline-offset-2"
          >
            Volver a Nebbuler
          </Link>
        </div>
      </main>
    )
  }

  // La cookie nb_invite se setea cuando el usuario hace click en el botón
  // (via /api/invites/claim), ya que cookies().set() no funciona en pages.

  // Si el usuario ya está autenticado, ofrecemos redimir directo.
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <main className="min-h-screen bg-[#FAFAF7] flex items-center justify-center px-4 py-12">
      <div className="max-w-xl w-full bg-white border border-[#121212] p-10">
        <div className="text-center mb-8">
          <p className="text-[11px] uppercase tracking-[0.14em] text-[#C41C1C] font-bold mb-3">
            Invitación VIP · Nebbuler
          </p>
          <h1
            className="text-[40px] font-bold text-[#121212] tracking-tight leading-[1.1]"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            {result.displayName
              ? `${result.displayName}, has sido invitado/a`
              : 'Has sido invitado/a'}
            <br />
            <span className="text-[#C41C1C]">a Nebbuler</span>
          </h1>
          <p className="text-[15px] text-[#444] mt-4 leading-relaxed max-w-md mx-auto">
            Tu invitación te da acceso completo a la plataforma <strong>sin pagar la tarifa
            mensual de US$19</strong>. Cobras a tus suscriptores el 100% de lo que pagan.
          </p>
        </div>

        <div className="bg-[#F7F7F7] border border-[#DEDEDE] p-5 mb-6">
          <p className="text-[11px] uppercase tracking-[0.14em] text-[#666666] font-medium mb-3">
            Lo que incluye
          </p>
          <ul className="space-y-2 text-[14px] text-[#121212]">
            <li className="flex items-start gap-2">
              <span className="text-[#C41C1C] font-bold">✓</span>
              <span>Sala de membresías propia (nebbuler.com/tu-nombre)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#C41C1C] font-bold">✓</span>
              <span>0% de comisión sobre tus suscripciones</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#C41C1C] font-bold">✓</span>
              <span>Editor premium · Analytics completo · Soporte prioritario</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#C41C1C] font-bold">✓</span>
              <span>Sin pagar la tarifa de plataforma (mientras tu invitación esté activa)</span>
            </li>
          </ul>
        </div>

        <div className="bg-[#FFFBEA] border border-[#EAB308] px-4 py-3 mb-6 text-[12px] text-[#7A5900]">
          Código: <code className="font-mono font-semibold">{result.code}</code>
        </div>

        {user ? (
          <InviteRedeemButton code={result.code} />
        ) : (
          <Link
            href={`/api/invites/claim?code=${result.code}&next=/registro`}
            className="block w-full text-center bg-[#121212] hover:bg-[#2a2a2a] text-white font-medium text-[14px] py-4 transition-colors"
          >
            Crear cuenta y abrir mi sala →
          </Link>
        )}

        <p className="text-[12px] text-[#888] mt-4 text-center">
          Al continuar aceptas los{' '}
          <Link href="/terminos" className="underline">términos</Link> y la{' '}
          <Link href="/privacidad" className="underline">política de privacidad</Link>.
        </p>
      </div>
    </main>
  )
}

export async function generateMetadata({ params }: PageProps) {
  const { code } = await params
  return {
    title: `Invitación · Nebbuler`,
    description: `Invitación VIP para abrir tu sala en Nebbuler sin pagar la tarifa de plataforma. Código ${code}.`,
    robots: { index: false, follow: false },
  }
}
