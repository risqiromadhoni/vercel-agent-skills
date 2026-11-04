---
title: useEffectEvent to Read Latest Values Without Re-running Effects
impact: LOW
impactDescription: prevents effect re-runs
tags: advanced, hooks, useEffectEvent, refs, optimization
---

## useEffectEvent to Read Latest Values Without Re-running Effects

Requires React 19.2+. `useEffectEvent` lets an Effect read the latest props and state without listing them as dependencies, so a change to them does not re-run the Effect. The function it returns does not have a stable identity: React intentionally changes it on every render. Do not put it in a dependency array, do not call it during rendering, and do not pass it to other components, Hooks, or APIs that expect a stable function. Use a regular function or `useCallback` when you need a stable callback.

**Incorrect (effect re-runs on every callback change):**

```tsx
function SearchInput({ onSearch }: { onSearch: (q: string) => void }) {
  const [query, setQuery] = useState('')

  useEffect(() => {
    const timeout = setTimeout(() => onSearch(query), 300)
    return () => clearTimeout(timeout)
  }, [query, onSearch])
}
```

**Correct (using React's useEffectEvent):**

```tsx
import { useEffectEvent } from 'react';

function SearchInput({ onSearch }: { onSearch: (q: string) => void }) {
  const [query, setQuery] = useState('')
  const onSearchEvent = useEffectEvent(onSearch)

  useEffect(() => {
    const timeout = setTimeout(() => onSearchEvent(query), 300)
    return () => clearTimeout(timeout)
  }, [query])
}
```
