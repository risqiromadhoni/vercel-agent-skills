---
title: Hoist RegExp Creation
impact: LOW-MEDIUM
impactDescription: avoids recreation
tags: javascript, regexp, optimization, memoization
---

## Hoist RegExp Creation

Don't create RegExp inside render. Hoist to module scope or memoize with `useMemo()`.

**Incorrect (new RegExp every render):**

```tsx
function Highlighter({ text, query }: Props) {
  const regex = new RegExp(`(${query})`, 'gi')
  const parts = text.split(regex)
  return <>{parts.map((part, i) => i % 2 === 1 ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>)}</>
}
```

**Correct (memoize or hoist):**

```tsx
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function Highlighter({ text, query }: Props) {
  const regex = useMemo(
    () => new RegExp(`(${escapeRegex(query)})`, 'gi'),
    [query]
  )
  const parts = text.split(regex)
  return <>{parts.map((part, i) => i % 2 === 1 ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>)}</>
}
```

**Warning (global regex has mutable state):**

Global regex (`/g`) has mutable `lastIndex` state:

```typescript
const regex = /foo/g
regex.test('foo')  // true, lastIndex = 3
regex.test('foo')  // false, lastIndex = 0
```

If the React Compiler is enabled (`reactCompiler: true` in Next.js 16; off by default), this manual memoization is unnecessary for new code; keep existing memoization in place.
