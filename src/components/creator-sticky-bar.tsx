'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface CreatorStickyBarProps {
  slug: string
  price_clp: number
  name: string
}

export function CreatorStickyBar({ slug, price_clp, name }: CreatorStickyBarProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 300)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#DEDEDE] px-6 py-3 flex items-center justify-between">
      <span className="font-sans text-sm text-[#121212]">
        <span className="font-bold">{name}</span>
        {' · '}${price_clp.toLocaleString('es-CL')}/mes
      </span>
      <Link
        href={`/suscribirse/${slug}`}
        className="bg-[#C41C1C] text-white font-sans text-xs font-bold tracking-[0.1em] uppercase px-6 py-2 hover:bg-[#a01515] transition-colors"
      >
        Suscribirse
      </Link>
    </div>
  )
}
