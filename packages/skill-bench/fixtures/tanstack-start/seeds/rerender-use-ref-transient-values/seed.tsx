// SOURCE: skills/react-best-practices/rules/rerender-use-ref-transient-values.md
// HASH: 3e1e606c0a325464e4796e5fe39b73b9be3444f4a6649d97e0bba0656dc1a04c
import { useEffect, useState } from 'react'

function Tracker() {
  const [lastX, setLastX] = useState(0)

  useEffect(() => {
    const onMove = (e: MouseEvent) => setLastX(e.clientX)
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: lastX,
        width: 8,
        height: 8,
        background: 'black',
      }}
    />
  )
}

export { Tracker }
