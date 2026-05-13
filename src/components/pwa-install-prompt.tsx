'use client'

import { useState, useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react'

export function PWAInstallPrompt() {
  const [visible, setVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    if (localStorage.getItem('pwa-closed')) return
    const mobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
    setIsMobile(mobile)
    setVisible(true)
  }, [])

  const close = () => {
    localStorage.setItem('pwa-closed', '1')
    setVisible(false)
  }

  if (!visible) return null

  /* ── Móvil: banner compacto inferior ─────────────────────────────────── */
  if (isMobile) {
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent)
    return (
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        background: '#111827',
        color: 'white',
        padding: '14px 20px',
        borderTop: '1px solid #374151',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 700, fontSize: 13, marginBottom: 6 }}>
              Instalar app de Nebbuler
            </p>
            {isIOS ? (
              <ol style={{ paddingLeft: 16, margin: 0, fontSize: 12, color: '#D1D5DB', lineHeight: 1.6 }}>
                <li>Toca el ícono compartir <strong style={{ color: '#fff' }}>⎙</strong> en Safari</li>
                <li>Selecciona <strong style={{ color: '#fff' }}>"Agregar a inicio"</strong></li>
              </ol>
            ) : (
              <ol style={{ paddingLeft: 16, margin: 0, fontSize: 12, color: '#D1D5DB', lineHeight: 1.6 }}>
                <li>Toca el menú <strong style={{ color: '#fff' }}>⋮</strong> del navegador</li>
                <li>Selecciona <strong style={{ color: '#fff' }}>"Agregar a pantalla de inicio"</strong></li>
              </ol>
            )}
          </div>
          <button
            onClick={close}
            style={{ background: 'none', border: 'none', color: '#9CA3AF', fontSize: 22, cursor: 'pointer', padding: '0 4px', lineHeight: 1, marginTop: -2 }}
            aria-label="Cerrar"
          >×</button>
        </div>
      </div>
    )
  }

  /* ── Desktop: banner con QR + instrucciones por OS ───────────────────── */
  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 9999,
      background: '#111827',
      color: 'white',
      padding: '16px 28px',
      borderTop: '1px solid #374151',
    }}>
      <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 28 }}>

        {/* QR */}
        <div style={{ background: 'white', padding: 8, borderRadius: 8, flexShrink: 0 }}>
          <QRCodeSVG value="https://nebbuler.com" size={76} fgColor="#111827" bgColor="#ffffff" />
        </div>

        {/* Título + instrucciones */}
        <div style={{ flex: 1 }}>
          <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 10 }}>
            Instala Nebbuler en tu móvil
          </p>
          <div style={{ display: 'flex', gap: 36, flexWrap: 'wrap' }}>
            {/* Android */}
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 5 }}>
                Android
              </p>
              <ol style={{ paddingLeft: 16, margin: 0, fontSize: 12, color: '#D1D5DB', lineHeight: 1.75 }}>
                <li>Escanea el QR con tu cámara</li>
                <li>Toca el menú <strong style={{ color: '#fff' }}>⋮</strong> del navegador</li>
                <li>Selecciona <strong style={{ color: '#fff' }}>"Agregar a pantalla de inicio"</strong></li>
              </ol>
            </div>
            {/* iOS */}
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 5 }}>
                iPhone / iPad
              </p>
              <ol style={{ paddingLeft: 16, margin: 0, fontSize: 12, color: '#D1D5DB', lineHeight: 1.75 }}>
                <li>Escanea el QR con la cámara</li>
                <li>Toca el ícono compartir <strong style={{ color: '#fff' }}>⎙</strong> en Safari</li>
                <li>Selecciona <strong style={{ color: '#fff' }}>"Agregar a inicio"</strong></li>
              </ol>
            </div>
          </div>
        </div>

        {/* Botón cerrar */}
        <button
          onClick={close}
          style={{ background: 'none', border: 'none', color: '#9CA3AF', fontSize: 26, cursor: 'pointer', padding: '0 6px', lineHeight: 1, flexShrink: 0 }}
          aria-label="Cerrar"
        >×</button>
      </div>
    </div>
  )
}
