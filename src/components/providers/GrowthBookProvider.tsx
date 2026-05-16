'use client'

// GrowthBook A/B testing provider — EXPERIMENTS_ENABLED=true/false
// Only controls UI/copy in marketing pages — NEVER business logic
// Self-initializes on mount, exposes via context for useExperiment hook

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { GrowthBook } from '@growthbook/growthbook-react'
import { EXPERIMENTS_ENABLED, GROWTHBOOK_CLIENT_KEY, EXPERIMENT_DEFAULTS } from '@/lib/experiments/growthbook'

interface GrowthBookContextValue {
  gb: GrowthBook | null
  ready: boolean
  getFeature: (key: string, fallback: string) => string
}

const GrowthBookContext = createContext<GrowthBookContextValue>({
  gb: null,
  ready: false,
  getFeature: (_key, fallback) => fallback,
})

export function GrowthBookProvider({ children, userId }: { children: ReactNode; userId?: string }) {
  const [gb, setGb] = useState<GrowthBook | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!EXPERIMENTS_ENABLED || !GROWTHBOOK_CLIENT_KEY) {
      setReady(true)
      return
    }

    import('@/lib/experiments/growthbook').then(({ initGrowthBook }) => {
      return initGrowthBook(userId ? { id: userId } : {})
    }).then((instance) => {
      setGb(instance)
      setReady(true)
    }).catch(() => {
      setReady(true)
    })
  }, [userId])

  const getFeature = (key: string, fallback: string): string => {
    if (!gb || !ready) return fallback
    try {
      return gb.getFeatureValue(key, fallback)
    } catch {
      return fallback
    }
  }

  return (
    <GrowthBookContext.Provider value={{ gb, ready, getFeature }}>
      {children}
    </GrowthBookContext.Provider>
  )
}

// Hook for use in marketing/onboarding components
export function useExperiment(feature: string, fallback: string): string {
  const ctx = useContext(GrowthBookContext)
  return ctx.getFeature(feature, fallback) ?? EXPERIMENT_DEFAULTS[feature as keyof typeof EXPERIMENT_DEFAULTS] ?? fallback
}

// Self-initializing version (no children wrapping needed)
export function GrowthBookBootstrap({ userId }: { userId?: string }) {
  useEffect(() => {
    if (!EXPERIMENTS_ENABLED || !GROWTHBOOK_CLIENT_KEY) return
    import('@/lib/experiments/growthbook').then(({ initGrowthBook }) => {
      initGrowthBook(userId ? { id: userId } : {}).catch(() => {})
    }).catch(() => {})
  }, [userId])

  return null
}
