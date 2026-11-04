---
title: Cross-Request LRU Caching
impact: HIGH
impactDescription: caches across requests
tags: server, cache, lru, cross-request
---

## Cross-Request LRU Caching

`React.cache()` only works within one request. For data shared across sequential requests (user clicks button A then button B), an LRU cache can work, under the scope rules below.

Module scope is memory shared by every request in the process. It is safe for immutable, request-independent values (fonts, config, compiled regexes): read them once at module scope. It is acceptable for bounded caches keyed only on request-independent inputs, with authorization checked outside the cache. It is never safe for request-scoped data such as the current user, session, or headers. On Next.js 16 with Cache Components, prefer `'use cache'` (or `'use cache: remote'` when instances must share entries) over a hand-rolled LRU. An in-process LRU cannot be invalidated across instances. A rejected promise hoisted to module scope stays rejected until the process restarts, so wrap it with a retry.

**Correct (LRU cache keyed on request-independent inputs):**

```typescript
import { LRUCache } from 'lru-cache'

const cache = new LRUCache<string, any>({
  max: 1000,
  ttl: 5 * 60 * 1000  // 5 minutes
})

export async function getUser(id: string) {
  const cached = cache.get(id)
  if (cached) return cached

  const user = await db.user.findUnique({ where: { id } })
  cache.set(id, user)
  return user
}

// Request 1: DB query, result cached
// Request 2: cache hit, no DB query
```

Use when sequential user actions hit multiple endpoints needing the same data within seconds.

**With Vercel's [Fluid Compute](https://vercel.com/docs/fluid-compute):** LRU caching is especially effective because multiple concurrent requests can share the same function instance and cache. Entries stay on the instance that holds them, so no external storage like Redis is needed, but the cache is not shared across instances.

**In traditional serverless:** Each invocation runs in isolation, so consider Redis for cross-process caching.

Reference: [https://github.com/isaacs/node-lru-cache](https://github.com/isaacs/node-lru-cache)
