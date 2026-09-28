import Link from 'next/link'

/**
 * Sello "Sin IA". Solo se muestra en creadores con `verified = true` en
 * sala_creators (verificados a mano por Nebbuler, que además aceptaron la
 * política de /sin-ia). Nunca en perfiles de demostración.
 */
export function HumanBadge({ className = '' }: { className?: string }) {
  return (
    <Link
      href="/sin-ia"
      title="Qué significa este sello"
      className={`inline-flex items-center gap-1.5 text-[10px] font-sans font-medium tracking-[0.04em] text-[#555] hover:text-[#121212] transition-colors ${className}`}
    >
      <PenIcon />
      Escrito por un profesional verificado · Sin IA
    </Link>
  )
}

/** Etiqueta para perfiles de ejemplo: no son personas reales ni verificadas. */
export function DemoProfileLabel({ className = '' }: { className?: string }) {
  return (
    <span
      className={`inline-block text-[9px] font-sans font-bold uppercase tracking-[0.14em] text-[#999] border border-[#DEDEDE] px-1.5 py-0.5 ${className}`}
    >
      Perfil de demostración
    </span>
  )
}

function PenIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M12 20h9" strokeLinecap="round" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" strokeLinejoin="round" />
    </svg>
  )
}
