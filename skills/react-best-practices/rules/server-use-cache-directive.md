---
title: Cache Shared Data with 'use cache' and Tag-Based Invalidation
impact: HIGH
impactDescription: runs shared reads once per cache lifetime instead of once per request
tags: server, cache, use-cache, cache-components, cacheLife, cacheTag, updateTag
---

## Cache Shared Data with 'use cache' and Tag-Based Invalidation

**Impact: HIGH (shared reads run once per cache lifetime instead of once per request)**

Data that is the same for every user, such as a product catalog or CMS content, should be cached explicitly. Re-running the query on every request repeats identical work. Mark the function with `'use cache'`, give it a lifetime with `cacheLife()`, and tag it with `cacheTag()`. When the data changes, expire the tag from the Server Action that wrote it with `updateTag()`, so the next request sees the new data without waiting for the lifetime to end. Keep request-dependent reads (`cookies()`, `headers()`, `searchParams`) out of the shared cached function and render them behind a `<Suspense>` boundary.

Requirements and related APIs: `'use cache'` needs `cacheComponents: true` in `next.config.ts` (Next.js 16). `fetch` is uncached by default since Next.js 15, so cache shared fetches with `'use cache'` rather than relying on `fetch` alone. `unstable_cache` is superseded by `'use cache'` in Next.js 16; keep it only for apps that do not enable Cache Components.

**Incorrect (same query runs on every request):**

```tsx
// app/products/page.tsx
export default async function ProductsPage() {
  // Runs for every request, even though every user sees the same products
  const products = await db.product.findMany({ where: { published: true } })
  return <ProductList products={products} />
}
```

**Correct (cache the shared read with a lifetime and a tag):**

```tsx
// lib/products.ts
import { cacheLife, cacheTag } from 'next/cache'

export async function getProducts() {
  'use cache'
  cacheLife('hours')
  cacheTag('products')

  return db.product.findMany({ where: { published: true } })
}
```

**Correct (expire the tag in the Server Action that writes):**

```ts
// app/products/actions.ts
'use server'

import { updateTag } from 'next/cache'

export async function updateProduct(id: string, data: ProductInput) {
  await db.product.update({ where: { id }, data })
  updateTag('products') // the next request sees the new data immediately
}
```

**Correct (per-user data stays outside the cache, behind Suspense):**

```tsx
// app/products/page.tsx
import { Suspense } from 'react'
import { getProducts } from '@/lib/products'
import { CartCount } from '@/components/cart-count'

export default async function ProductsPage() {
  const products = await getProducts() // shared and cached

  return (
    <>
      <ProductList products={products} />
      <Suspense fallback={null}>
        <CartCount /> {/* reads cookies() at request time */}
      </Suspense>
    </>
  )
}
```

Reference: [use cache directive](https://nextjs.org/docs/app/api-reference/directives/use-cache), [Caching](https://nextjs.org/docs/app/getting-started/caching)
