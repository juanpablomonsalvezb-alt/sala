'use client'

import { useState, useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react'

export function PWAInstallPrompt() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (localStorage.getItem('pwa-closed')) setVisible(false)
  }, [])

  if (!visible) return null

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 9999,
      background: '#111827',
      color: 'white',
      padding: '16px 24px',
      display: 'flex',
      alignItems: 'center',
      gap: '24px',
      justifyContent: 'space-between',
      borderTop: '1px solid #374151'
    }}>
      <div>
        <div style={{ fontWeight: 700, fontSize: 14 }}>Descarga la app de Nebbuler</div>
        <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>Escanea el QR con tu móvil</div>
      </div>
      <div style={{ background: 'white', padding: 8, borderRadius: 8 }}>
        <QRCodeSVG value="https://nebbuler.com" size={80} fgColor="#111827" bgColor="#ffffff" />
      </div>
      <button
        onClick={() => { localStorage.setItem('pwa-closed', '1'); setVisible(false) }}
        style={{ background: 'none', border: 'none', color: '#9CA3AF', fontSize: 24, cursor: 'pointer', padding: '0 8px', lineHeight: 1 }}
      >×</button>
    </div>
  )
}
