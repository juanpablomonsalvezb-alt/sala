'use client'

import { useEffect } from 'react'

export function PostViewTracker({ postId }: { postId: string }) {
  useEffect(() => {
    // Dedup por sesión: cada post se cuenta una sola vez por tab/sesión
    try {
      const key = `nb_view_${postId}`
      if (sessionStorage.getItem(key)) return
      sessionStorage.setItem(key, '1')
    } catch {
      // sessionStorage no disponible (modo incógnito + cookie bloqueada) — seguir
    }

    fetch('/api/track/view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId }),
    }).catch(() => {})
  }, [postId])

  return null
}
