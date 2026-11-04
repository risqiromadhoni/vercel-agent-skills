// SOURCE: skills/react-best-practices/rules/client-passive-event-listeners.md
// HASH: 5e115ba05cba511e36ecda0585ad593697b9f94ecb2c93923391e60c1459e6bb
import { useEffect } from 'react'

useEffect(() => {
  const handleTouch = (e: TouchEvent) => console.log(e.touches[0].clientX)
  const handleWheel = (e: WheelEvent) => console.log(e.deltaY)

  document.addEventListener('touchstart', handleTouch)
  document.addEventListener('wheel', handleWheel)

  return () => {
    document.removeEventListener('touchstart', handleTouch)
    document.removeEventListener('wheel', handleWheel)
  }
}, [])
