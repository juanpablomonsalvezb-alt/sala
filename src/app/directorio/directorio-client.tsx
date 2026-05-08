'use client'

import { useState } from 'react'
import CreatorCard from '@/components/creator-card'
import DisciplineFilter from '@/components/discipline-filter'

type DirectorioClientProps = {
  creators: Array<{
    id: string
    slug: string
    name: string
    specialty: string
    bio: string
    price_clp: number
    subscriber_count: number
    verified?: boolean
    publish_frequency: string
    plan: 'free' | 'creator' | 'pro'
    discipline?: string
  }>
  disciplines: Array<{ id: string; name_es: string; icon?: string }>
}

export default function DirectorioClient({ creators, disciplines }: DirectorioClientProps) {
  const [selected, setSelected] = useState('all')

  const filtered =
    selected === 'all'
      ? creators
      : creators.filter((c) => c.discipline === selected)

  return (
    <>
      {/* Filter bar */}
      <div className="border-b border-[#DEDEDE] bg-white sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6">
          <DisciplineFilter
            disciplines={disciplines}
            selected={selected}
            onChange={setSelected}
          />
        </div>
      </div>

      {/* Creator grid */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <p className="font-serif text-[22px] text-[#666] italic">
              No hay profesionales en esta disciplina todavía.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#DEDEDE]">
            {filtered.map((creator) => (
              <div key={creator.id} className="bg-white">
                <CreatorCard
                  name={creator.name}
                  slug={creator.slug}
                  specialty={creator.specialty}
                  bio={creator.bio}
                  price_clp={creator.price_clp}
                  subscriber_count={creator.subscriber_count}
                  verified={creator.verified}
                  publish_frequency={creator.publish_frequency}
                  plan={creator.plan}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
