'use client'

// GrowthStackProvider — wraps PostHog + GrowthBook + Formbricks bootstrap
// Single entry point for all growth integrations
// Usage: wrap any page/layout that needs analytics and experiments
//
// Example (public pages):
//   <GrowthStackProvider>
//     {children}
//   </GrowthStackProvider>
//
// Example (authenticated pages, with user data):
//   <GrowthStackProvider userId={user.id} userEmail={user.email}>
//     {children}
//   </GrowthStackProvider>

import { type ReactNode } from 'react'
import { PostHogBootstrap } from './PostHogProvider'
import { GrowthBookBootstrap } from './GrowthBookProvider'
import { FormbricksBootstrap } from './FormbricksBootstrap'

interface GrowthStackProviderProps {
  children: ReactNode
  userId?: string
  userEmail?: string
  enableSurveys?: boolean
}

export function GrowthStackProvider({
  children,
  userId,
  userEmail,
  enableSurveys = false,
}: GrowthStackProviderProps) {
  return (
    <>
      <PostHogBootstrap />
      <GrowthBookBootstrap userId={userId} />
      {enableSurveys && userId && userEmail && (
        <FormbricksBootstrap userId={userId} email={userEmail} />
      )}
      {children}
    </>
  )
}
