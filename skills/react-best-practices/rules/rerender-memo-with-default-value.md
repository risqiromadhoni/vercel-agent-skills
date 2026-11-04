---
title: Extract Default Non-primitive Parameter Value from Memoized Component to Constant
impact: MEDIUM
impactDescription: keeps default function and object identity stable for effect and callback dependencies
tags: rerender, memo, optimization
---

## Extract Default Non-primitive Parameter Value from Memoized Component to Constant

When a memoized component has a default value for an optional non-primitive prop, such as an array, function, or object, the default is created fresh inside the component body on every render. Omitting the prop does not break `memo()`: the parent passes `undefined` on every render, so `memo()`'s shallow comparison still finds the props equal and skips the re-render. The problem happens inside the child. The new default identity changes on every render, which breaks anything that depends on identity, such as an effect or `useCallback` dependency array, or a prop passed to a memoized grandchild.

To address this issue, extract the default value into a constant so its identity is stable across renders.

**Incorrect (default `() => {}` is a new function on every render, so the effect re-runs):**

```tsx
const UserAvatar = memo(function UserAvatar({ userId, label, onClick = () => {} }: { userId: string; label: string; onClick?: () => void }) {
  useEffect(() => {
    // Re-runs when `label` changes, even though the subscription only depends on `userId`
    const unsubscribe = subscribeToPresence(userId, onClick)
    return unsubscribe
  }, [userId, onClick])

  return <span>{label}</span>
});

function Profile({ userId, label }: { userId: string; label: string }) {
  // Used without optional onClick; a label change re-renders the component
  return <UserAvatar userId={userId} label={label} />
}
```

**Correct (stable default value):**

```tsx
const NOOP = () => {};

const UserAvatar = memo(function UserAvatar({ userId, label, onClick = NOOP }: { userId: string; label: string; onClick?: () => void }) {
  useEffect(() => {
    const unsubscribe = subscribeToPresence(userId, onClick)
    return unsubscribe
  }, [userId, onClick])

  return <span>{label}</span>
});

function Profile({ userId, label }: { userId: string; label: string }) {
  // Used without optional onClick; a label change no longer resubscribes
  return <UserAvatar userId={userId} label={label} />
}
```
