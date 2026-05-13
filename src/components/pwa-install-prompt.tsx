'use client'

import { useEffect, useRef } from 'react'
import { QRCodeSVG } from 'qrcode.react'

export function PWAInstallPrompt() {
  const bannerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const banner = bannerRef.current
    if (!banner) return
    const dismissed = localStorage.getItem('nebbuler-pwa-dismissed')
    if (dismissed) {
      banner.style.display = 'none'
    }
  }, [])

  function handleDismiss() {
    localStorage.setItem('nebbuler-pwa-dismissed', 'true')
    if (bannerRef.current) bannerRef.current.style.display = 'none'
  }

  return (
    <div
      ref={bannerRef}
      className="fixed bottom-0 left-0 right-0 z-[9999] bg-gray-900 text-white border-t border-gray-700 shadow-2xl"
    >
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm">Descarga la app de Nebbuler</p>
          <p className="text-xs text-gray-400 mt-0.5">
            <span className="hidden sm:inline">Escanea el código QR con tu móvil para instalar</span>
            <span className="sm:hidden">Instala la app en tu celular</span>
          </p>
        </div>
        <div className="hidden sm:block bg-white p-2 rounded-lg flex-shrink-0">
          <QRCodeSVG value="https://nebbuler.com" size={88} level="H" fgColor="#111827" bgColor="#ffffff" />
        </div>
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 text-gray-400 hover:text-white text-2xl font-bold px-2 leading-none"
          aria-label="Cerrar"
        >
          ×
        </button>
      </div>
    </div>
  )
}
