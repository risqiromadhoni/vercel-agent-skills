---
title: Dynamic Imports for Heavy Components
impact: CRITICAL
impactDescription: directly affects TTI and LCP
tags: bundle, dynamic-import, code-splitting, next-dynamic
---

## Dynamic Imports for Heavy Components

Use `next/dynamic` to lazy-load large components not needed on initial render.

**Incorrect (Monaco bundles with main chunk ~300KB):**

```tsx
import { MonacoEditor } from './monaco-editor'

function CodePanel({ code }: { code: string }) {
  return <MonacoEditor value={code} />
}
```

**Correct (Monaco loads on demand):**

```tsx
'use client'

import dynamic from 'next/dynamic'

// components/monaco-editor.client.tsx
export const MonacoEditor = dynamic(
  () => import('./monaco-editor').then((m) => m.MonacoEditor),
  { ssr: false }
)
```

Import `MonacoEditor` from `components/monaco-editor.client.tsx` in a Server Component (for example `app/page.tsx`) like any other component. `ssr: false` is only allowed in Client Components; Next.js errors if `next/dynamic` is called with it in a Server Component.

Reference: [Lazy loading in Next.js](https://nextjs.org/docs/app/guides/lazy-loading)
