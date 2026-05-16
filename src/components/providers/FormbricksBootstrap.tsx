'use client'

// Formbricks in-app surveys — SURVEYS_ENABLED=true/false
// Self-initializing after full render. Only for authenticated users.
// Add <FormbricksBootstrap userId="..." email="..." /> to dashboard layouts.
// NEVER add to checkout or payment flows.

import { useEffect } from 'react'
import { initFormbricks, SURVEYS_ENABLED, FORMBRICKS_ENV_ID } from '@/lib/feedback/formbricks'

interface FormbricksBootstrapProps {
  userId: string
  email: string
}

export function FormbricksBootstrap({ userId, email }: FormbricksBootstrapProps) {
  useEffect(() => {
    if (!SURVEYS_ENABLED || !FORMBRICKS_ENV_ID) return
    // Delay init until after full render to avoid blocking
    const timer = setTimeout(() => {
      initFormbricks(userId, email).catch(() => {})
    }, 2000)
    return () => clearTimeout(timer)
  }, [userId, email])

  return null
}
