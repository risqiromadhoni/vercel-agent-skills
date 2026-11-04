// SOURCE: skills/react-best-practices/rules/rerender-transitions.md
// HASH: 9147a181104803c80a37e1703dc2ec96e037798788c9269e69a21f67b7e8069c
'use client'

import { startTransition, useEffect, useState } from 'react'

export function ScrollTracker() {
  const [scrollY, setScrollY] = useState(0)
  useEffect(() => {
    const handler = () => {
      startTransition(() => setScrollY(window.scrollY))
    }
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])
}
