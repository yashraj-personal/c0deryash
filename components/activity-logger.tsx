'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

const SESSION_KEY = 'site-session-id'

function sessionId() {
  const existing = window.sessionStorage.getItem(SESSION_KEY)
  if (existing) return existing
  const id = crypto.randomUUID()
  window.sessionStorage.setItem(SESSION_KEY, id)
  return id
}

export function ActivityLogger() {
  useEffect(() => {
    const supabase = createClient()
    const log = (eventName: string, metadata: Record<string, unknown> = {}) => {
      void supabase.from('site_activity_logs').insert({
        event_name: eventName,
        pathname: window.location.pathname,
        metadata,
        session_id: sessionId(),
      })
    }

    log('page_view', { referrer: document.referrer || null })
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      const control = target.closest('button, a, input, select, textarea') as HTMLElement | null
      if (!control) return
      log('interaction', {
        tag: control.tagName.toLowerCase(),
        label: (control.getAttribute('aria-label') || control.textContent || '').trim().slice(0, 160),
      })
    }
    document.addEventListener('click', onClick, { passive: true })
    return () => document.removeEventListener('click', onClick)
  }, [])

  return null
}
