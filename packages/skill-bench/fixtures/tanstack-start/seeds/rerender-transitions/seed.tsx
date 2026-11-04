// SOURCE: skills/react-best-practices/rules/rerender-transitions.md
// HASH: e92f8d820e6610afe655d7b2ff0b7e21ca7c949185d16fa836fc5bec5b3705db
import { useEffect, useState } from 'react'

function ScrollTracker() {
  const [scrollY, setScrollY] = useState(0)
  useEffect(() => {
    const handler = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])
}

export { ScrollTracker }
