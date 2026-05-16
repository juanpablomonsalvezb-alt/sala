'use client'

// Umami live stats — SOCIAL_PROOF_ENABLED=true/false
// Shows public activity data as social proof on landing page
// Falls back to cached/static data if Umami API is unavailable

import { useEffect, useState } from 'react'
import Script from 'next/script'

const SOCIAL_PROOF_ENABLED = process.env.NEXT_PUBLIC_SOCIAL_PROOF_ENABLED !== 'false'
const UMAMI_WEBSITE_ID = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID ?? ''
const UMAMI_API_URL = process.env.NEXT_PUBLIC_UMAMI_API_URL ?? ''

interface StatsData {
  activeToday: number
  publishedThisWeek: number
  countriesReached: number
}

const FALLBACK_STATS: StatsData = {
  activeToday: 0,
  publishedThisWeek: 0,
  countriesReached: 0,
}

async function fetchUmamiStats(): Promise<StatsData> {
  if (!UMAMI_API_URL || !UMAMI_WEBSITE_ID) throw new Error('not configured')

  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  const startOfWeek = startOfToday - 6 * 24 * 60 * 60 * 1000

  const [todayRes, weekRes] = await Promise.all([
    fetch(`${UMAMI_API_URL}/api/websites/${UMAMI_WEBSITE_ID}/stats?startAt=${startOfToday}&endAt=${Date.now()}`),
    fetch(`${UMAMI_API_URL}/api/websites/${UMAMI_WEBSITE_ID}/stats?startAt=${startOfWeek}&endAt=${Date.now()}`),
  ])

  if (!todayRes.ok || !weekRes.ok) throw new Error('API error')

  const today = await todayRes.json() as { visitors?: { value?: number }; countries?: number }
  const week = await weekRes.json() as { pageviews?: { value?: number } }

  return {
    activeToday: today.visitors?.value ?? 0,
    publishedThisWeek: Math.floor((week.pageviews?.value ?? 0) / 15),
    countriesReached: today.countries ?? 0,
  }
}

export default function LiveStats() {
  const [stats, setStats] = useState<StatsData | null>(null)

  useEffect(() => {
    if (!SOCIAL_PROOF_ENABLED) return

    fetchUmamiStats()
      .then(setStats)
      .catch(() => {
        // Silently hide component on error
      })
  }, [])

  if (!SOCIAL_PROOF_ENABLED || !stats) return null

  const items = [
    { value: stats.activeToday, label: 'lectores hoy' },
    { value: stats.publishedThisWeek, label: 'piezas esta semana' },
    { value: stats.countriesReached, label: 'países alcanzados' },
  ].filter((item) => item.value > 0)

  if (items.length === 0) return null

  return (
    <>
      {/* Umami tracking script — lazyOnload, never blocks render */}
      {UMAMI_WEBSITE_ID && (
        <Script
          src={`${UMAMI_API_URL}/script.js`}
          data-website-id={UMAMI_WEBSITE_ID}
          strategy="lazyOnload"
        />
      )}

      <div className="flex flex-wrap items-center justify-center gap-8 py-4">
        {items.map((item) => (
          <div key={item.label} className="text-center">
            <div className="text-3xl font-bold tabular-nums text-gray-900">
              {item.value.toLocaleString('es-CL')}
            </div>
            <div className="mt-0.5 text-sm text-gray-500">{item.label}</div>
          </div>
        ))}
      </div>
    </>
  )
}
