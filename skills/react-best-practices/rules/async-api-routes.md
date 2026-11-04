---
title: Prevent Waterfall Chains in API Routes
impact: CRITICAL
impactDescription: 2-10× improvement
tags: api-routes, server-actions, waterfalls, parallelization
---

## Prevent Waterfall Chains in API Routes

In API routes and Server Actions, start independent operations immediately, even if you don't await them yet.

**Incorrect (config waits for auth, data waits for both):**

```typescript
export async function GET(request: Request) {
  const session = await auth()
  const config = await fetchConfig()
  const data = await fetchData(session.user.id)
  return Response.json({ data, config })
}
```

**Correct (auth and config start immediately):**

```typescript
export async function GET(request: Request) {
  const sessionPromise = auth()
  const configPromise = fetchConfig()
  const dataPromise = sessionPromise.then((session) => fetchData(session.user.id))
  const [config, data] = await Promise.all([configPromise, dataPromise])
  return Response.json({ data, config })
}
```

A promise that rejects before anything has attached a handler to it is reported as an unhandled rejection, which can crash the process, so each started promise must be consumed right away: `Promise.all` takes `configPromise` and `dataPromise`, and the `.then` takes `sessionPromise`.

For operations with more complex dependency chains, use `better-all` to automatically maximize parallelism (see Dependency-Based Parallelization).
