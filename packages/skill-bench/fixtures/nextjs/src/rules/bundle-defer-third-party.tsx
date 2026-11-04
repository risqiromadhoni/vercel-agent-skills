// SOURCE: skills/react-best-practices/rules/bundle-defer-third-party.md
// HASH: a3e9626d10f41856bab2872ca8f1ade1d7c4d374ec26985105717ed1559cd62a
'use client'

import dynamic from 'next/dynamic'

// components/analytics.client.tsx
export const Analytics = dynamic(
  () => import('./_shared').then((m) => m.Analytics),
  { ssr: false }
)
