import Link from 'next/link'
import { creators as allCreators } from '@/data/creators'
import { getRecommendations } from '@/lib/recommendations'

interface AlsoReadingProps {
  currentSlug: string
}

export function AlsoReading({ currentSlug }: AlsoReadingProps) {
  const recs = getRecommendations(currentSlug, allCreators, 3)
  if (recs.length === 0) return null

  return (
    <section className="border-t border-[#DEDEDE] mt-12 pt-8">
      <p className="font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-[#999] mb-1">
        También en Nebbuler
      </p>
      <p className="font-serif text-[16px] font-bold text-[#121212] mb-1">
        Profesionales relacionados
      </p>
      <p className="font-sans text-[13px] text-[#666] mb-5">
        Quienes siguen este newsletter también leen:
      </p>
      <div className="space-y-2">
        {recs.map(c => (
          <Link
            key={c.slug}
            href={`/${c.slug}`}
            className="flex items-center gap-3 p-3 border border-[#DEDEDE] hover:bg-[#F7F7F7] transition-colors group"
          >
            <div className="flex-shrink-0 w-9 h-9 rounded-full bg-[#F7F7F7] border border-[#DEDEDE] flex items-center justify-center font-serif font-bold text-[13px] text-[#121212]">
              {c.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-serif text-[13px] font-bold text-[#121212] truncate group-hover:text-[#C41C1C] transition-colors">
                {c.name}
              </p>
              <p className="font-sans text-[11px] text-[#999] uppercase tracking-wide truncate">
                {c.specialty}
              </p>
            </div>
            <div className="flex-shrink-0 text-right">
              <p className="font-sans text-[12px] font-bold text-[#121212]">
                ${c.price_clp.toLocaleString('es-CL')}
              </p>
              <p className="font-sans text-[10px] text-[#999]">/mes</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
