import Link from 'next/link'

type CreatorCardProps = {
  name: string
  slug: string
  specialty: string
  bio: string
  price_clp: number
  subscriber_count: number
  verified?: boolean
  discipline_name_es?: string
  publish_frequency: string
  plan: 'free' | 'creator' | 'pro'
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}

function formatPrice(clp: number): string {
  return '$' + clp.toLocaleString('es-CL')
}

export default function CreatorCard({
  name,
  slug,
  specialty,
  bio,
  price_clp,
  subscriber_count,
  verified,
  publish_frequency,
  plan,
}: CreatorCardProps) {
  return (
    <Link
      href={`/${slug}`}
      className="block border border-[#DEDEDE] bg-white p-6 hover:bg-[#F7F7F7] transition-colors group"
    >
      {/* Avatar inicial */}
      <div className="w-11 h-11 bg-[#121212] text-white font-sans text-xs font-bold flex items-center justify-center">
        {getInitials(name)}
      </div>

      {/* Especialidad */}
      <p className="text-[10px] font-sans font-bold tracking-[0.15em] uppercase text-[#C41C1C] mt-3 mb-1">
        {specialty}
      </p>

      {/* Nombre */}
      <h3 className="font-serif text-base font-bold text-[#121212] leading-tight group-hover:text-[#C41C1C] transition-colors">
        {name}
      </h3>

      {/* Bio */}
      <p className="text-xs font-sans text-[#666] leading-relaxed mt-2 line-clamp-2">
        {bio}
      </p>

      {/* Badge verificado */}
      {verified && (
        <p className="text-[9px] font-sans font-bold tracking-[0.1em] uppercase text-[#065F46] border-l-2 border-[#C41C1C] pl-2 mt-2">
          EXPERTO RECONOCIDO POR NEBBULER
        </p>
      )}

      {/* Footer */}
      <div className="border-t border-[#DEDEDE] mt-4 pt-4 flex justify-between items-center">
        <span className="text-xs font-sans">
          <span className="font-bold text-[#121212]">{formatPrice(price_clp)}</span>
          <span className="text-[#999]">/mes</span>
        </span>
        <span className="text-xs font-sans text-[#999]">
          <span className="font-bold text-[#121212]">
            {subscriber_count.toLocaleString('es-CL')}
          </span>{' '}
          suscriptores
        </span>
      </div>
    </Link>
  )
}
