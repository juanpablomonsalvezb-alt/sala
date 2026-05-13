'use client'

import { useEffect, useState } from 'react'
import { X, Download, QrCode } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Detectar si es móvil
    const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    setIsMobile(mobile)

    // Check if previously dismissed (solo aplica en móvil)
    const dismissed = localStorage.getItem('nebbuler-pwa-dismissed')

    // En desktop: SIEMPRE mostrar el QR (sin importar localStorage)
    // En móvil: respetar localStorage
    if (!mobile) {
      setShowPrompt(true)
      return
    }

    if (dismissed && mobile) {
      return
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      const promptEvent = e as BeforeInstallPromptEvent
      setDeferredPrompt(promptEvent)
      setShowPrompt(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') {
        setShowPrompt(false)
        setDeferredPrompt(null)
        localStorage.setItem('nebbuler-pwa-dismissed', 'true')
      }
    } else {
      // Si no hay deferredPrompt, solo cerrar el banner
      setShowPrompt(false)
      localStorage.setItem('nebbuler-pwa-dismissed', 'true')
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem('nebbuler-pwa-dismissed', 'true')
  }

  if (!showPrompt) {
    return null
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up">
      <div className="bg-[#121212] text-white px-6 py-4 shadow-lg">
        <div className="container mx-auto max-w-4xl flex items-center justify-between gap-6">
          {!isMobile ? (
            <>
              {/* DESKTOP: Mostrar QR para escanear */}
              <div className="flex items-center gap-4 flex-1">
                <div className="flex items-center gap-3">
                  <QrCode className="w-5 h-5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm">Descarga Nebbuler</p>
                    <p className="text-xs text-gray-300">Escanea el código con tu móvil</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-3 rounded flex-shrink-0">
                <QRCodeSVG
                  value="https://nebbuler.com"
                  size={100}
                  level="H"
                  includeMargin={false}
                  fgColor="#121212"
                  bgColor="#ffffff"
                />
              </div>

              <button
                onClick={handleDismiss}
                className="p-2 hover:bg-gray-800 rounded transition-colors flex-shrink-0"
                aria-label="Cerrar"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              {/* MÓVIL: Mostrar botón de instalar */}
              <div className="flex items-center gap-3 flex-1">
                <Download className="w-5 h-5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-sm">Instala Nebbuler</p>
                  <p className="text-xs text-gray-300">Accede desde tu home screen</p>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <button
                  onClick={handleInstall}
                  className="px-4 py-2 bg-white text-[#121212] font-semibold text-sm rounded hover:bg-gray-100 transition-colors whitespace-nowrap"
                >
                  Instalar
                </button>
                <button
                  onClick={handleDismiss}
                  className="p-2 hover:bg-gray-800 rounded transition-colors"
                  aria-label="Cerrar"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
