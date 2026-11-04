---
title: "React 19 Refs and Context: ref Prop, Context Provider, use()"
impact: MEDIUM
impactDescription: removes forwardRef wrappers and clarifies context reads
tags: react19, refs, context, hooks
---

## React 19 Refs and Context: ref Prop, Context Provider, use()

> **React 19+ only.** Skip this if you're on React 18 or earlier.

In React 19, `ref` is a regular prop for function components, so `forwardRef` is no longer necessary. react.dev says `forwardRef` will be deprecated in a future release. It still works today, so keep it when the code must also run on React 18.

**Incorrect (forwardRef in new React 19-only code):**

```tsx
import { forwardRef } from 'react'

const ComposerInput = forwardRef<HTMLTextAreaElement, React.ComponentProps<'textarea'>>(
  (props, ref) => {
    return <textarea ref={ref} {...props} />
  }
)
```

**Correct (ref as a prop):**

```tsx
function ComposerInput({
  ref,
  ...props
}: React.ComponentProps<'textarea'> & { ref?: React.Ref<HTMLTextAreaElement> }) {
  return <textarea ref={ref} {...props} />
}
```

`useContext` is still fully supported. It remains the simplest choice for reading context at the top of a component.

**Correct (useContext is still fine):**

```tsx
import { createContext, useContext } from 'react'

const ThemeContext = createContext('light')

function Button() {
  const theme = useContext(ThemeContext)
  return <button className={theme}>Save</button>
}
```

`use(Context)` is an alternative. Unlike `useContext`, it can be called inside a condition or after an early return. It must still run during render, inside a component or a hook. Context is not supported in Server Components, so keep context reads in Client Components.

**Correct (use(Context) for a conditional read):**

```tsx
import { createContext, use } from 'react'

const ThemeContext = createContext('light')

function Badge({ show }: { show: boolean }) {
  if (!show) return null
  const theme = use(ThemeContext)
  return <span className={theme}>New</span>
}
```

`<Context value>` is the React 19 provider form. `<Context.Provider>` is the legacy form. It still works and is not yet deprecated, so existing code can keep it.

**Correct (Context as provider instead of .Provider):**

```tsx
import { createContext } from 'react'

const ThemeContext = createContext('light')

function App({ children }: { children: React.ReactNode }) {
  return <ThemeContext value="dark">{children}</ThemeContext>
}
```

Reference: [forwardRef](https://react.dev/reference/react/forwardRef), [use](https://react.dev/reference/react/use), [createContext](https://react.dev/reference/react/createContext)
