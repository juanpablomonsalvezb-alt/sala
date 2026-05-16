'use client'

// PostHog provider — ANALYTICS_ENABLED=true/false
// Self-initializing: no need to wrap children — initializes on mount via useEffect
// Add <PostHogBootstrap /> to any layout or page as a standalone element

import { useEffect } from 'react'
import { POSTHOG_KEY, POSTHOG_HOST, ANALYTICS_ENABLED } from '@/lib/analytics/posthog'

export function PostHogBootstrap() {
  useEffect(() => {
    if (!ANALYTICS_ENABLED || !POSTHOG_KEY) return

    import('posthog-js').then(({ default: posthog }) => {
      if (posthog.__loaded) return
      posthog.init(POSTHOG_KEY, {
        api_host: POSTHOG_HOST,
        person_profiles: 'identified_only',
        capture_pageview: true,
        capture_pageleave: true,
        loaded: (ph) => {
          if (process.env.NODE_ENV === 'development') ph.debug()
        },
      })
    }).catch(() => {
      // PostHog load failure is non-critical
    })
  }, [])

  return null
}

// Optional: higher-order wrapper for pages that need PostHog context
import { type ReactNode } from 'react'

export function PostHogProvider({ children }: { children: ReactNode }) {
  return (
    <>
      <PostHogBootstrap />
      {children}
    </>
  )
}
