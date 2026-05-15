import { Suspense } from 'react'
import { DesuscribirBoletinContent } from './content'

export const metadata = {
  title: 'Cancelar Boletín Profesional — Nebbuler',
  description: 'Cancela tu suscripción al Boletín Profesional de Nebbuler.',
  robots: { index: false, follow: false },
}

export default function DesuscribirBoletinPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center">
          <p className="font-sans text-[14px] text-[#AAAAAA]">Procesando...</p>
        </div>
      }
    >
      <DesuscribirBoletinContent />
    </Suspense>
  )
}
