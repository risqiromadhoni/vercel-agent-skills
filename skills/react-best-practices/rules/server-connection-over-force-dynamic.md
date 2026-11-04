---
title: Use connection() Instead of force-dynamic for Request-Time Values
impact: MEDIUM
impactDescription: keeps the rest of the page static and cached
tags: server, rendering, dynamic, connection, suspense, cache-components
---

## Use connection() Instead of force-dynamic for Request-Time Values

**Impact: MEDIUM (only the component that needs a request-time value is rendered per request)**

`export const dynamic = 'force-dynamic'` makes the whole route dynamic, so every part of the page is rendered per request even when only one value, such as a timestamp or a random ID, must differ between requests. `connection()` from `next/server` marks just the component that needs it: awaiting it stops prerendering at that point, and the code after it runs only when a request arrives. Wrap that component in `<Suspense>` so the surrounding shell stays static and cacheable. With Cache Components enabled, the page-level `force-dynamic` setting is no longer needed. On Next.js 16.3+ with Cache Components, prefer `io()` (`import { io } from 'next/cache'`) to keep code out of the static shell: it suspends the same way but can also be cached and prefetched, and `connection()` is only needed when rendering must wait for a real user request.

**Incorrect (route-wide force-dynamic for one value):**

```tsx
// app/page.tsx
export const dynamic = 'force-dynamic'

export default async function Page() {
  // Only this value must differ per request, but the whole route is now dynamic
  const requestTime = Date.now()
  return (
    <main>
      <Header />
      <ProductCatalog />
      <p>Rendered at {requestTime}</p>
    </main>
  )
}
```

**Correct (connection() inside a Suspense-wrapped child):**

```tsx
// app/page.tsx
import { Suspense } from 'react'
import { connection } from 'next/server'

export default function Page() {
  return (
    <main>
      <Header />
      <ProductCatalog />
      <Suspense fallback={<p>Loading time...</p>}>
        <RequestTime />
      </Suspense>
    </main>
  )
}

async function RequestTime() {
  await connection() // prerendering stops here; the lines below run per request
  return <p>Rendered at {Date.now()}</p>
}
```

Reference: [connection](https://nextjs.org/docs/app/api-reference/functions/connection)
