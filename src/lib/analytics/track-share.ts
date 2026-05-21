/**
 * Tracking de shares para magnet tools virales.
 *
 * Emite eventos a PostHog desde el cliente. Si PostHog no está cargado
 * o ANALYTICS_ENABLED es false, falla silenciosamente.
 */

export type ShareTool = 'leaderboard' | 'pulse' | 'calculadora'
export type ShareChannel =
  | 'twitter'
  | 'linkedin'
  | 'whatsapp'
  | 'instagram'
  | 'telegram'
  | 'copy_link'

export type ShareEvent =
  | 'share_leaderboard'
  | 'share_pulse'
  | 'share_calculadora'

const EVENT_BY_TOOL: Record<ShareTool, ShareEvent> = {
  leaderboard: 'share_leaderboard',
  pulse: 'share_pulse',
  calculadora: 'share_calculadora',
}

export function trackShare(
  tool: ShareTool,
  channel: ShareChannel,
  extra?: Record<string, unknown>
): void {
  if (typeof window === 'undefined') return
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ph = (window as any).posthog
    if (ph?.capture) {
      ph.capture(EVENT_BY_TOOL[tool], { channel, tool, ...extra })
    }
    // Espejo en Umami si está disponible
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const umami = (window as any).umami
    if (umami?.track) {
      umami.track(EVENT_BY_TOOL[tool], { channel, ...extra })
    }
  } catch {
    // Analytics nunca debe romper la UX
  }
}

/**
 * Construye URLs de share para cada canal con texto + URL pre-cargados.
 */
export function buildShareUrl(
  channel: Exclude<ShareChannel, 'copy_link' | 'instagram'>,
  url: string,
  text: string
): string {
  const encUrl = encodeURIComponent(url)
  const encText = encodeURIComponent(text)
  switch (channel) {
    case 'twitter':
      return `https://twitter.com/intent/tweet?text=${encText}&url=${encUrl}`
    case 'linkedin':
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encUrl}`
    case 'whatsapp':
      return `https://wa.me/?text=${encText}%20${encUrl}`
    case 'telegram':
      return `https://t.me/share/url?url=${encUrl}&text=${encText}`
  }
}
