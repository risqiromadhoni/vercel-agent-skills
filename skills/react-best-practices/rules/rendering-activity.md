---
title: Use Activity Component for Show/Hide
impact: MEDIUM
impactDescription: preserves state/DOM
tags: rendering, activity, visibility, state-preservation
---

## Use Activity Component for Show/Hide

Requires React 19.2+. Use React's `<Activity>` to preserve state/DOM for expensive components that frequently toggle visibility.

**Correct (Activity instead of conditional mounting):**

```tsx
import { Activity } from 'react'

function Dropdown({ isOpen }: Props) {
  return (
    <Activity mode={isOpen ? 'visible' : 'hidden'}>
      <ExpensiveMenu />
    </Activity>
  )
}
```

Preserves state and DOM across hide/show. It does not make hidden children free: they still render at lower priority when their props change, and their Effects are unmounted while hidden.
