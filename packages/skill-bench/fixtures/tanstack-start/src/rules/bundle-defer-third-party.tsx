// SOURCE: skills/react-best-practices/rules/bundle-defer-third-party.md
// HASH: a3e9626d10f41856bab2872ca8f1ade1d7c4d374ec26985105717ed1559cd62a
// Next original: 'use client' + next/dynamic(() => import('@vercel/analytics/react'), { ssr: false }).
// TanStack Start renders lazy components on the server, so ssr:false becomes "mount first, then render":
// React.lazy fetches the chunk, and the component is only rendered after the client has mounted.
import { lazy, Suspense, useEffect, useState } from 'react'

const Analytics = lazy(() => import('./_shared').then((m) => ({ default: m.Analytics })))

export function DeferredAnalytics() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) return null
  return (
    <Suspense fallback={null}>
      <Analytics />
    </Suspense>
  )
}
