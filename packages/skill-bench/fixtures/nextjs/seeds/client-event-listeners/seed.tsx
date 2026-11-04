// SOURCE: skills/react-best-practices/rules/client-event-listeners.md
// HASH: 180da912cc6c9d0fcb37cc4073310966bc3405151a7a808f436132d29d96772a
'use client'

import { useEffect } from 'react'

export function useKeyboardShortcut(key: string, callback: () => void) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.metaKey && e.key === key) {
        callback()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [key, callback])
}
