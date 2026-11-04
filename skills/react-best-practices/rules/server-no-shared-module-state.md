---
title: Avoid Shared Module State for Request Data
impact: HIGH
impactDescription: prevents concurrency bugs and request data leaks
tags: server, rsc, ssr, concurrency, security, state
---

## Avoid Shared Module State for Request Data

For React Server Components and client components rendered during SSR, avoid using mutable module-level variables to share request-scoped data. Server renders can run concurrently in the same process. If one render writes to shared module state and another render reads it, you can get race conditions, cross-request contamination, and security bugs where one user's data appears in another user's response.

Treat module scope on the server as process-wide shared memory, not request-local state.

**Incorrect (request data leaks across concurrent renders):**

```tsx
let currentUser: User | null = null

export default async function Page() {
  currentUser = await auth()
  return <Dashboard />
}

async function Dashboard() {
  return <div>{currentUser?.name}</div>
}
```

If two requests overlap, request A can set `currentUser`, then request B overwrites it before request A finishes rendering `Dashboard`.

**Correct (keep request data local to the render tree):**

```tsx
export default async function Page() {
  const user = await auth()
  return <Dashboard user={user} />
}

function Dashboard({ user }: { user: User | null }) {
  return <div>{user?.name}</div>
}
```

Module scope is memory shared by every request in the process. It is safe for immutable, request-independent values (fonts, config, compiled regexes): read them once at module scope. It is acceptable for bounded caches keyed only on request-independent inputs, with authorization checked outside the cache. It is never safe for request-scoped data such as the current user, session, or headers. On Next.js 16 with Cache Components, prefer `'use cache'` (or `'use cache: remote'` when instances must share entries) over a hand-rolled LRU. An in-process LRU cannot be invalidated across instances. A rejected promise hoisted to module scope stays rejected until the process restarts, so wrap it with a retry.

For static assets and config, see [Hoist Static I/O to Module Level](./server-hoist-static-io.md).
