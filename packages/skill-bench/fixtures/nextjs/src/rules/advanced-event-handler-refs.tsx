// SOURCE: skills/react-best-practices/rules/advanced-event-handler-refs.md
// HASH: 58476b77d06eb43e6c09ee33949a10ddcb6c25a788391fd2a1270276314983e5
'use client'

import { useEffect, useRef } from 'react'

export function useWindowEvent(event: string, handler: (e: Event) => void) {
  const handlerRef = useRef(handler)
  useEffect(() => {
    handlerRef.current = handler
  }, [handler])

  useEffect(() => {
    const listener = (e: Event) => handlerRef.current(e)
    window.addEventListener(event, listener)
    return () => window.removeEventListener(event, listener)
  }, [event])
}
