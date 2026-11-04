// SOURCE: skills/react-best-practices/rules/client-passive-event-listeners.md
// HASH: d79079d1ddfdc699f315a70488cbe056ae22a5bbf656c7f4d43ee06d22f977c7
import { useEffect } from 'react'

export function usePassiveListeners() {
  useEffect(() => {
    const handleTouch = (e: TouchEvent) => console.log(e.touches[0].clientX)
    const handleWheel = (e: WheelEvent) => console.log(e.deltaY)

    document.addEventListener('touchstart', handleTouch, { passive: true })
    document.addEventListener('wheel', handleWheel, { passive: true })

    return () => {
      document.removeEventListener('touchstart', handleTouch)
      document.removeEventListener('wheel', handleWheel)
    }
  }, [])
}
