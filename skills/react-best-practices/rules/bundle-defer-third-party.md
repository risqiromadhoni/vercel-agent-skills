---
title: Defer Non-Critical Third-Party Libraries
impact: MEDIUM
impactDescription: loads after hydration
tags: bundle, third-party, analytics, defer
---

## Defer Non-Critical Third-Party Libraries

Analytics, logging, and error tracking don't block user interaction. Load them after hydration.

**Incorrect (blocks initial bundle):**

```tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

**Correct (loads after hydration):**

```tsx
'use client'

import dynamic from 'next/dynamic'

// components/analytics.client.tsx
export const Analytics = dynamic(
  () => import('@vercel/analytics/react').then((m) => m.Analytics),
  { ssr: false }
)
```

Import `Analytics` from `components/analytics.client.tsx` in `app/layout.tsx` (a Server Component) in place of the static import. `ssr: false` is only allowed in Client Components; Next.js errors if it is used in a Server Component.

Reference: [Lazy loading in Next.js](https://nextjs.org/docs/app/guides/lazy-loading)
