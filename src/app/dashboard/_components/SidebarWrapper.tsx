'use client'

import { useState } from 'react'
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
  const [mobileOpen, setMobileOpen] = useState(false)

  const initials = creator?.name
    ? creator.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()
    : 'SA'

  const planLabel =
    creator?.plan === 'free'
      ? 'Plan inactivo · Completa tu pago'
      : 'Nebbuler · 0% comisión'

  const sidebarContent = (
    <>
      <div className="px-6 py-5 border-b border-[#DEDEDE] flex items-center justify-between">
        <Link href="/" onClick={() => setMobileOpen(false)}>
          <span
            className="text-[15px] font-bold tracking-[0.18em] text-[#121212] uppercase hover:text-[#C41C1C] transition-colors"
            style={{ fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif" }}
          >
            NEBBULER
          </span>
        </Link>
        <button
          onClick={() => setMobileOpen(false)}
          className="md:hidden text-[#666] hover:text-[#121212] text-[18px] leading-none p-1"
          aria-label="Cerrar menú"
        >
          ×
        </button>
      </div>

      <div className="px-5 py-5 border-b border-[#DEDEDE]">
        <div className="w-9 h-9 rounded-full bg-[#121212] flex items-center justify-center mb-3">
          <span
            className="text-white text-[13px] font-medium"
            style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
          >
            {initials}
          </span>
        </div>
        <p
          className="text-[13px] font-semibold text-[#121212] leading-snug"
          style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
        >
          {creator?.name ?? 'Mi sala'}
        </p>
        {isSuperAdmin && (
          <span className="inline-flex mt-1 text-[9px] font-bold uppercase tracking-[0.12em] bg-[#C41C1C] text-white px-1.5 py-0.5">
            SUPERADMIN
          </span>
        )}
        {!isSuperAdmin && (
          creator?.slug ? (
            <Link
              href={`/${creator.slug}`}
              className="text-[12px] text-[#C41C1C] hover:underline mt-0.5 inline-block"
              style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
            >
              Ver mi sala →
            </Link>
          ) : (
            <Link
              href="/abrir"
              className="text-[12px] text-[#C41C1C] hover:underline mt-0.5 inline-block"
              style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
            >
              Configura tu sala →
            </Link>
          )
        )}
      </div>

      <nav className="flex-1 py-3 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(item.href)
          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`w-full flex items-center gap-3 px-5 py-2.5 transition-colors ${
                isActive
                  ? 'bg-[#F7F7F7] text-[#121212]'
                  : 'text-[#666666] hover:text-[#121212] hover:bg-[#F7F7F7]'
              }`}
            >
              <span className="text-[11px] w-3.5 flex-shrink-0 text-center leading-none">
                {item.icon}
              </span>
              <span
                className={`text-[13px] ${isActive ? 'font-semibold text-[#121212]' : 'font-normal'}`}
                style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
              >
                {item.label}
              </span>
              {isActive && <span className="ml-auto w-1 h-4 bg-[#C41C1C] rounded-full" />}
            </Link>
          )
        })}

        {isSuperAdmin && (
          <>
            <div className="mx-5 my-2 border-t border-[#DEDEDE]" />
            <Link
              href="/dashboard/admin"
              onClick={() => setMobileOpen(false)}
              className={`w-full flex items-center gap-3 px-5 py-2.5 transition-colors ${
                pathname.startsWith('/dashboard/admin')
                  ? 'bg-[#FFF0F0] text-[#C41C1C]'
                  : 'text-[#C41C1C] hover:bg-[#FFF0F0]'
              }`}
            >
              <span className="text-[11px] w-3.5 flex-shrink-0 text-center leading-none">▲</span>
              <span
                className={`text-[13px] ${
                  pathname.startsWith('/dashboard/admin') ? 'font-semibold' : 'font-normal'
                }`}
                style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
              >
                Administración
              </span>
              {pathname.startsWith('/dashboard/admin') && (
                <span className="ml-auto w-1 h-4 bg-[#C41C1C] rounded-full" />
              )}
            </Link>
            <Link
              href="/dashboard/salud"
              onClick={() => setMobileOpen(false)}
              className={`w-full flex items-center gap-3 px-5 py-2.5 transition-colors ${
                pathname.startsWith('/dashboard/salud')
                  ? 'bg-[#FFF0F0] text-[#C41C1C]'
                  : 'text-[#C41C1C] hover:bg-[#FFF0F0]'
              }`}
            >
              <span className="text-[11px] w-3.5 flex-shrink-0 text-center leading-none">◎</span>
              <span
                className={`text-[13px] ${
                  pathname.startsWith('/dashboard/salud') ? 'font-semibold' : 'font-normal'
                }`}
                style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
              >
                Estado del sistema
              </span>
              {pathname.startsWith('/dashboard/salud') && (
                <span className="ml-auto w-1 h-4 bg-[#C41C1C] rounded-full" />
              )}
            </Link>
          </>
        )}
      </nav>

      <div className="px-5 py-4 border-t border-[#DEDEDE]">
        <p
          className="text-[11px] text-[#666666] font-medium"
          style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
        >
          {isSuperAdmin ? 'Acceso total · Nebbuler' : planLabel}
        </p>
        {!isSuperAdmin && (
          <Link
            href="/precios"
            className="mt-1.5 text-[12px] text-[#C41C1C] font-medium hover:underline inline-block"
            style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
          >
            Actualizar plan
          </Link>
        )}
      </div>
    </>
  )

  return (
    <>
      {/* Header móvil (solo <md) */}
      <header className="md:hidden sticky top-0 z-30 bg-white border-b border-[#DEDEDE] px-5 py-3 flex items-center justify-between">
        <Link href="/dashboard" className="font-bold text-[14px] tracking-[0.18em]" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
          NEBBULER
        </Link>
        <button
          onClick={() => setMobileOpen(true)}
          className="text-[#121212] p-2"
          aria-label="Abrir menú"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </header>

      {/* Sidebar — desktop fijo, mobile drawer */}
      <aside className="hidden md:flex w-[220px] flex-shrink-0 bg-white border-r border-[#DEDEDE] flex-col h-full">
        {sidebarContent}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="md:hidden fixed inset-y-0 left-0 z-50 w-[260px] bg-white border-r border-[#DEDEDE] flex flex-col">
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  )
}
