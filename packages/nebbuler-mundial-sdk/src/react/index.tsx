/**
 * React component for embedding Nebbuler Mundial data in your site.
 *
 * Usage:
 *   import { MundialWidget } from 'nebbuler-mundial-sdk/react'
 *   <MundialWidget seleccion="argentina" theme="dark" />
 */

import { useEffect, useState } from 'react'
import { getSeleccion, type Seleccion } from '../index'

export interface MundialWidgetProps {
  seleccion: string
  theme?: 'dark' | 'light'
  showAttribution?: boolean
  utmSource?: string
}

export function MundialWidget({
  seleccion,
  theme = 'dark',
  showAttribution = true,
  utmSource,
}: MundialWidgetProps) {
  const [data, setData] = useState<Seleccion | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    getSeleccion(seleccion)
      .then((d) => !cancelled && setData(d))
      .catch((e: Error) => !cancelled && setError(e.message))
    return () => {
      cancelled = true
    }
  }, [seleccion])

  const palette =
    theme === 'dark'
      ? {
          bg: '#050505',
          fg: '#FFFFFF',
          muted: 'rgba(255,255,255,0.55)',
          border: 'rgba(255,255,255,0.1)',
          accent: '#C41C1C',
        }
      : {
          bg: '#FFFFFF',
          fg: '#0A0A0A',
          muted: 'rgba(0,0,0,0.55)',
          border: 'rgba(0,0,0,0.1)',
          accent: '#C41C1C',
        }

  const styles = {
    root: {
      fontFamily: 'ui-sans-serif, system-ui, sans-serif',
      background: palette.bg,
      color: palette.fg,
      padding: 20,
      borderRadius: 0,
      border: `1px solid ${palette.border}`,
      maxWidth: 360,
    } as const,
    header: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      paddingBottom: 12,
      borderBottom: `1px solid ${palette.border}`,
      marginBottom: 14,
    },
    flag: { fontSize: 48, lineHeight: 1 },
    title: { fontSize: 20, fontWeight: 700, margin: 0, letterSpacing: '-0.01em' },
    subtitle: { fontSize: 12, color: palette.muted, fontStyle: 'italic', marginTop: 2 },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 },
    cell: { border: `1px solid ${palette.border}`, padding: 10 },
    label: {
      fontSize: 9,
      letterSpacing: '0.15em',
      textTransform: 'uppercase' as const,
      color: palette.muted,
      marginBottom: 4,
    },
    value: { fontSize: 16, fontWeight: 700 },
    accentValue: { fontSize: 16, fontWeight: 700, color: palette.accent },
    footer: {
      marginTop: 14,
      paddingTop: 10,
      borderTop: `1px solid ${palette.border}`,
      fontSize: 10,
      color: palette.muted,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    link: { color: palette.accent, textDecoration: 'none', fontWeight: 600 },
  }

  if (error) {
    return (
      <div style={styles.root}>
        <p style={styles.label}>Nebbuler Mundial Widget</p>
        <p style={{ ...styles.value, color: palette.accent }}>Error: {error}</p>
      </div>
    )
  }

  if (!data) {
    return (
      <div style={styles.root}>
        <p style={styles.label}>Cargando…</p>
      </div>
    )
  }

  const utm = utmSource ? `?utm_source=${encodeURIComponent(utmSource)}&utm_medium=sdk` : ''

  return (
    <div style={styles.root}>
      <div style={styles.header}>
        <span style={styles.flag}>{data.bandera}</span>
        <div>
          <h3 style={styles.title}>{data.pais}</h3>
          <p style={styles.subtitle}>{data.apodo}</p>
        </div>
      </div>

      <div style={styles.grid}>
        <div style={styles.cell}>
          <p style={styles.label}>Moneda</p>
          <p style={styles.value}>{data.moneda}</p>
        </div>
        <div style={styles.cell}>
          <p style={styles.label}>Creadores</p>
          <p style={styles.value}>~{data.creadores_potenciales}</p>
        </div>
        <div style={styles.cell}>
          <p style={styles.label}>Comisión</p>
          <p style={styles.accentValue}>0%</p>
        </div>
      </div>

      {showAttribution && (
        <div style={styles.footer}>
          <span>Programa La Sombra · Mundial 2026</span>
          <a
            href={`https://nebbuler.com/mundial/${data.slug}${utm}`}
            target="_blank"
            rel="noopener"
            style={styles.link}
          >
            nebbuler.com →
          </a>
        </div>
      )}
    </div>
  )
}
