// PostHog analytics — ANALYTICS_ENABLED=true/false
// Loads lazily, never blocks render, never tracks inside critical business flows

export const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY ?? ''
export const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://app.posthog.com'
export const ANALYTICS_ENABLED =
  process.env.ANALYTICS_ENABLED !== 'false' &&
  typeof process.env.NEXT_PUBLIC_POSTHOG_KEY === 'string' &&
  process.env.NEXT_PUBLIC_POSTHOG_KEY.length > 0

// Typed events — only navigation and conversion events (no business-critical flows)
export type AnalyticsEvent =
  | 'page_view'
  | 'signup_started'
  | 'signup_completed'
  | 'content_viewed'
  | 'content_shared'
  | 'creator_profile_viewed'
  | 'subscription_page_viewed'
  | 'search_performed'

export function track(event: AnalyticsEvent, properties?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return
  if (!ANALYTICS_ENABLED) return
  try {
    // posthog is loaded dynamically by PostHogProvider
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ph = (window as any).posthog
    if (ph?.capture) ph.capture(event, properties)
  } catch {
    // Never throw — analytics failure must be silent
  }
}

export function identifyUser(userId: string, traits?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return
  if (!ANALYTICS_ENABLED) return
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ph = (window as any).posthog
    if (ph?.identify) ph.identify(userId, traits)
  } catch {
    // Never throw
  }
}
