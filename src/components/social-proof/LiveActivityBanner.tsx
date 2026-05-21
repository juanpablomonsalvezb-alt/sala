'use client'

// Banner editorial discreto que rota eventos reales recientes (creadores,
// suscripciones, VIP) cada 6s. Polling cada 30s al endpoint cacheado por CDN.
// Estilo NYT: serif italic pequeña, separador rojo discreto, sin popups.

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'

type EventType = 'new_creator' | 'new_subscription' | 'vip_activated'

type ActivityEvent = {
  type: EventType
  actor_initial: string
  country_flag?: string
  country_name?: string
  target?: string
  target_slug?: string
  timestamp: string
  age_text: string
}

const POLL_MS = 30_000
const ROTATE_MS = 6_000
const MIN_EVENTS_TO_SHOW = 5

function eventCopy(ev: ActivityEvent): string {
  switch (ev.type) {
    case 'new_creator':
      return `${ev.actor_initial} acaba de abrir su sala`
    case 'new_subscription':
      return ev.target
        ? `${ev.actor_initial} se suscribió a ${ev.target}`
        : `${ev.actor_initial} se suscribió a un creador`
    case 'vip_activated':
      return `${ev.actor_initial} activó su acceso VIP`
    default:
      return `${ev.actor_initial} entró a Nebbuler`
  }
}

function eventHref(ev: ActivityEvent): string | null {
  if (ev.target_slug) return `/${ev.target_slug}`
  return null
}

export default function LiveActivityBanner() {
  const [events, setEvents] = useState<ActivityEvent[]>([])
  const [index, setIndex] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    let cancelled = false

    async function load() {
      try {
        const res = await fetch('/api/social-proof/recent-activity', {
          cache: 'no-store',
        })
        if (!res.ok) return
        const data = (await res.json()) as { events?: ActivityEvent[] }
        if (cancelled) return
        setEvents(data.events ?? [])
      } catch {
        // Silenciar errores de red — el componente se esconde solo.
      }
    }

    load()
    const pollId = setInterval(load, POLL_MS)
    return () => {
      cancelled = true
      clearInterval(pollId)
    }
  }, [])

  useEffect(() => {
    if (events.length < 2) return
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % events.length)
    }, ROTATE_MS)
    return () => clearInterval(id)
  }, [events.length])

  if (!mounted) return null
  if (events.length < MIN_EVENTS_TO_SHOW) return null

  const current = events[index % events.length]
  if (!current) return null

  const copy = eventCopy(current)
  const href = eventHref(current)
  const flag = current.country_flag ?? ''

  const inner = (
    <span className="flex items-center justify-center gap-2 sm:gap-3 text-[11px] sm:text-[12px] font-serif italic text-[#666]">
      <span aria-hidden className="inline-block h-[6px] w-[6px] rounded-full bg-[#C41C1C] animate-pulse" />
      {flag && (
        <span aria-hidden className="text-[14px] not-italic leading-none">
          {flag}
        </span>
      )}
      <span className="truncate">{copy}</span>
      <span className="hidden sm:inline text-[#C41C1C] not-italic">·</span>
      <span className="hidden sm:inline text-[#999] text-[10px] uppercase tracking-[0.1em] not-italic">
        {current.age_text}
      </span>
      {href && (
        <span className="hidden sm:inline text-[#C41C1C] not-italic font-bold" aria-hidden>
          {'→'}
        </span>
      )}
    </span>
  )

  return (
    <div
      className="w-full border-b border-[#E0E0E0] bg-[#FAFAF7]"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-center min-h-[32px] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${current.timestamp}-${current.type}-${index}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="w-full text-center"
          >
            {href ? (
              <Link
                href={href}
                className="inline-flex items-center hover:text-[#121212] transition-colors"
              >
                {inner}
              </Link>
            ) : (
              inner
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
