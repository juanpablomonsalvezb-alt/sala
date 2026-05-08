import Link from 'next/link'

type PaywallGateProps = {
  creatorName: string
  creatorSlug: string
  price_clp: number
  isAuthenticated: boolean
  isSubscribed: boolean
  postCount?: number
}

function formatPrice(clp: number): string {
  return '$' + clp.toLocaleString('es-CL')
}

const benefits = (postCount?: number): string[] => [
  'Acceso completo a este análisis',
  postCount
    ? `Todo el archivo (${postCount} publicaciones)`
    : 'Todo el archivo',
  'Nuevas entregas directamente a tu correo',
]

export default function PaywallGate({
  creatorName,
  creatorSlug,
  price_clp,
  isAuthenticated,
  isSubscribed,
  postCount,
}: PaywallGateProps) {
  if (isSubscribed) return null

  const ctaHref = isAuthenticated
    ? `/suscribirse/${creatorSlug}`
    : `/registro?next=/suscribirse/${creatorSlug}`

  const ctaLabel = isAuthenticated ? 'Suscribirme' : 'Crear cuenta gratis'

  return (
    <>
      {/* Fade mask */}
      <div className="h-24 bg-gradient-to-b from-transparent to-white -mb-1 pointer-events-none" />

      {/* Contenedor principal */}
      <div className="border-t-2 border-[#C41C1C] bg-[#F7F7F7] p-8">
        {/* Título */}
        <h3 className="font-serif text-xl font-bold text-[#121212] mb-1">
          {creatorName}
        </h3>

        {/* Subtítulo */}
        <p className="text-sm font-sans text-[#666] mb-5">
          {formatPrice(price_clp)} / mes · Cancela cuando quieras
        </p>

        {/* Beneficios */}
        <ul className="space-y-2">
          {benefits(postCount).map((benefit) => (
            <li key={benefit} className="flex items-start gap-2 text-sm font-sans text-[#121212]">
              <span className="text-[#C41C1C] leading-none mt-[2px]">·</span>
              <span>{benefit}</span>
            </li>
          ))}
        </ul>

        {/* CTA principal */}
        <Link
          href={ctaHref}
          className="block w-full bg-[#121212] text-white font-sans text-xs font-bold tracking-[0.1em] uppercase px-6 py-3 text-center hover:bg-[#C41C1C] transition-colors mt-5"
        >
          {ctaLabel}
        </Link>

        {/* Link secundario — solo si autenticado */}
        {isAuthenticated && (
          <Link
            href={`/entrar?next=/suscribirse/${creatorSlug}`}
            className="text-xs font-sans text-[#C41C1C] underline mt-3 block text-center"
          >
            ¿Ya eres suscriptor? Entrar →
          </Link>
        )}
      </div>
    </>
  )
}
