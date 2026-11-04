// SOURCE: skills/react-best-practices/rules/advanced-event-handler-refs.md
// HASH: 5145cc6b8185a60a2f8b6d3935d75614e4a32012025e846f47294363a0bd09d7
import { useEffect } from 'react'

function useWindowEvent(event: string, handler: (e: Event) => void) {
  useEffect(() => {
    window.addEventListener(event, handler)
    return () => window.removeEventListener(event, handler)
  }, [event, handler])
}

export {}
