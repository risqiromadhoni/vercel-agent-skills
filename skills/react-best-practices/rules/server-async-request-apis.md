---
title: Await params, searchParams, cookies() and headers()
impact: HIGH
impactDescription: synchronous access is removed in Next.js 16
tags: server, nextjs, params, searchParams, cookies, headers, async
---

## Await params, searchParams, cookies() and headers()

**Impact: HIGH (synchronous access to these request APIs is removed in Next.js 16)**

Since Next.js 15, `params`, `searchParams`, `cookies()`, `headers()` and `draftMode()` are asynchronous. Next.js 16 removes the temporary synchronous compatibility, so these values can only be read asynchronously. In Server Components, Route Handlers and page props, await them. In Client Components, which cannot be `async`, unwrap a `params` promise that a Server Component passes down with React's `use()`.

To migrate existing code, run `npx @next/codemod@canary next-async-request-api .`.

**Incorrect (synchronous access, removed in Next.js 16):**

```tsx
// app/products/[id]/page.tsx
import { cookies, headers } from 'next/headers'

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ q?: string }>
}) {
  const id = params.id // not allowed: params is a Promise
  const q = searchParams.q // not allowed: searchParams is a Promise
  const token = cookies().get('token') // not allowed: cookies() must be awaited
  const agent = headers().get('user-agent') // not allowed: headers() must be awaited
  return <div>{id} {q} {token?.value} {agent}</div>
}
```

**Correct (await the values in a Server Component):**

```tsx
// app/products/[id]/page.tsx
import { cookies, headers } from 'next/headers'

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ q?: string }>
}) {
  const { id } = await params
  const { q } = await searchParams
  const token = (await cookies()).get('token')
  const agent = (await headers()).get('user-agent')
  return <div>{id} {q} {token?.value} {agent}</div>
}
```

**Correct (unwrap the params promise with use() in a Client Component):**

```tsx
// app/products/[id]/product-tabs.tsx (Client Component)
'use client'

import { use } from 'react'

// params is passed down as a promise from the Server Component
export function ProductTabs({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  return <Tabs productId={id} />
}
```

Reference: [Upgrading to version 16](https://nextjs.org/docs/app/guides/upgrading/version-16), [Upgrading to version 15](https://nextjs.org/docs/app/guides/upgrading/version-15)
