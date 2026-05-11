'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { Creator } from '@/types/database'

const NAV_ITEMS = [
  { icon: '◆', label: 'Inicio',        href: '/dashboard' },
  { icon: '✦', label: 'Publicaciones', href: '/dashboard/publicaciones' },
  { icon: '◉', label: 'Suscriptores',  href: '/dashboard/suscriptores' },
  { icon: '$', label: 'Ingresos',      href: '/dashboard/ingresos' },
  { icon: '▲', label: 'Analíticas',    href: '/dashboard/analiticas' },
  { icon: '⚙', label: 'Configuración', href: '/dashboard/configuracion' },
]

export default function SidebarWrapper({
  creator,
  isSuperAdmin = false,
}: {
  creator: Creator | null
  isSuperAdmin?: boolean
}) {
  const pathname = usePathname()

  const initials = creator?.name
    ? creator.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()
    : 'SA'

  const planLabel =
    creator?.plan === 'pro' ? 'Plan Pro · 0% comisión' :
    creator?.plan === 'creator' ? 'Plan Creator · 0% comisión' :
    'Plan Libre'

  return (
    <aside className="w-[220px] flex-shrink-0 bg-white border-r border-[#DEDEDE] flex flex-col h-full">

      {/* Logo */}
      <div className="px-6 py-5 border-b border-[#DEDEDE]">
        <Link href="/">
          <span className="text-[15px] font-bold tracking-[0.18em] text-[#121212] uppercase hover:text-[#C41C1C] transition-colors"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            NEBBULER
          </span>
        </Link>
      </div>

      {/* User info */}
      <div className="px-5 py-5 border-b border-[#DEDEDE]">
        <div className="w-9 h-9 rounded-full bg-[#121212] flex items-center justify-center mb-3">
          <span className="text-white text-[13px] font-medium" style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}>
            {initials}
          </span>
        </div>
        <p className="text-[13px] font-semibold text-[#121212] leading-snug" style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}>
          {creator?.name ?? 'Mi sala'}
        </p>
        {isSuperAdmin && (
          <span className="inline-flex mt-1 text-[9px] font-bold uppercase tracking-[0.12em] bg-[#C41C1C] text-white px-1.5 py-0.5">
            SUPERADMIN
          </span>
        )}
        {!isSuperAdmin && (
          creator?.slug ? (
            <Link href={`/${creator.slug}`} className="text-[12px] text-[#C41C1C] hover:underline mt-0.5 inline-block"
              style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}>
              Ver mi sala →
            </Link>
          ) : (
            <Link href="/abrir" className="text-[12px] text-[#C41C1C] hover:underline mt-0.5 inline-block"
              style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}>
              Configura tu sala →
            </Link>
          )
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = item.href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(item.href)
          return (
            <Link key={item.label} href={item.href}
              className={`w-full flex items-center gap-3 px-5 py-2.5 transition-colors ${isActive ? 'bg-[#F7F7F7] text-[#121212]' : 'text-[#666666] hover:text-[#121212] hover:bg-[#F7F7F7]'}`}>
              <span className="text-[11px] w-3.5 flex-shrink-0 text-center leading-none">{item.icon}</span>
              <span className={`text-[13px] ${isActive ? 'font-semibold text-[#121212]' : 'font-normal'}`}
                style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}>
                {item.label}
              </span>
              {isActive && <span className="ml-auto w-1 h-4 bg-[#C41C1C] rounded-full" />}
            </Link>
          )
        })}

        {/* Admin link — solo superadmin */}
        {isSuperAdmin && (
          <>
            <div className="mx-5 my-2 border-t border-[#DEDEDE]" />
            <Link href="/dashboard/admin"
              className={`w-full flex items-center gap-3 px-5 py-2.5 transition-colors ${pathname.startsWith('/dashboard/admin') ? 'bg-[#FFF0F0] text-[#C41C1C]' : 'text-[#C41C1C] hover:bg-[#FFF0F0]'}`}>
              <span className="text-[11px] w-3.5 flex-shrink-0 text-center leading-none">▲</span>
              <span className={`text-[13px] ${pathname.startsWith('/dashboard/admin') ? 'font-semibold' : 'font-normal'}`}
                style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}>
                Administración
              </span>
              {pathname.startsWith('/dashboard/admin') && <span className="ml-auto w-1 h-4 bg-[#C41C1C] rounded-full" />}
            </Link>
          </>
        )}
      </nav>

      {/* Plan status */}
      <div className="px-5 py-4 border-t border-[#DEDEDE]">
        <p className="text-[11px] text-[#666666] font-medium" style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}>
          {isSuperAdmin ? 'Acceso total · Nebbuler' : planLabel}
        </p>
        {!isSuperAdmin && (
          <Link href="/precios" className="mt-1.5 text-[12px] text-[#C41C1C] font-medium hover:underline inline-block"
            style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}>
            Actualizar plan
          </Link>
        )}
      </div>
    </aside>
  )
}
