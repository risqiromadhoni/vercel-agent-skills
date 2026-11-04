---
title: Use Compound Components
impact: HIGH
impactDescription: enables flexible composition without prop drilling
tags: composition, compound-components, architecture
---

## Use Compound Components

Structure complex components as compound components with a shared context. Each
subcomponent accesses shared state via context, not props. Consumers compose the
pieces they need.

Before you reach for context, try the lighter tools first: pass props, then pass
JSX as `children`. Only when several nested parts need the same state does a
compound component with a shared context earn its keep.

**Incorrect (monolithic component with render props):**

```tsx
function Composer({
  renderHeader,
  renderFooter,
  renderActions,
  showAttachments,
  showFormatting,
  showEmojis,
}: Props) {
  return (
    <form>
      {renderHeader?.()}
      <Input />
      {showAttachments && <Attachments />}
      {renderFooter ? (
        renderFooter()
      ) : (
        <Footer>
          {showFormatting && <Formatting />}
          {showEmojis && <Emojis />}
          {renderActions?.()}
        </Footer>
      )}
    </form>
  )
}
```

**Correct (compound components with shared context):**

```tsx
'use client'

import { createContext } from 'react'

const ComposerContext = createContext<ComposerContextValue | null>(null)

function ComposerProvider({
  children,
  state,
  actions,
  meta,
}: ComposerContextValue & { children: React.ReactNode }) {
  return (
    <ComposerContext value={{ state, actions, meta }}>
      {children}
    </ComposerContext>
  )
}

function ComposerFrame({ children }: { children: React.ReactNode }) {
  return <form>{children}</form>
}

function ComposerHeader() {
  return <header />
}

function ComposerInput() {
  const {
    state,
    actions: { update },
    meta: { inputRef },
  } = useComposer()
  return (
    <textarea
      ref={inputRef}
      value={state.input}
      onChange={(e) => update((s) => ({ ...s, input: e.target.value }))}
    />
  )
}

function ComposerAttachments() {
  const { state } = useComposer()
  return (
    <ul>
      {state.attachments.map((a) => (
        <li key={a.id}>{a.name}</li>
      ))}
    </ul>
  )
}

function ComposerFooter({ children }: { children: React.ReactNode }) {
  return <footer className="flex">{children}</footer>
}

function ComposerFormatting() {
  return <div className="flex" />
}

function ComposerEmojis() {
  return <div className="flex" />
}

function ComposerMentions() {
  return <div className="flex" />
}

function ComposerCancelEdit() {
  return <button type="button">Cancel</button>
}

function ComposerSaveEdit() {
  return <button type="submit">Save</button>
}

function ComposerSubmit() {
  const {
    actions: { submit },
  } = useComposer()
  return (
    <button type="button" onClick={submit}>
      Send
    </button>
  )
}

// Export as compound component
export const Composer = {
  Provider: ComposerProvider,
  Frame: ComposerFrame,
  Header: ComposerHeader,
  Input: ComposerInput,
  Attachments: ComposerAttachments,
  Footer: ComposerFooter,
  Formatting: ComposerFormatting,
  Emojis: ComposerEmojis,
  Mentions: ComposerMentions,
  CancelEdit: ComposerCancelEdit,
  SaveEdit: ComposerSaveEdit,
  Submit: ComposerSubmit,
}
```

**Usage:**

```tsx
<Composer.Provider state={state} actions={actions} meta={meta}>
  <Composer.Frame>
    <Composer.Header />
    <Composer.Input />
    <Composer.Footer>
      <Composer.Formatting />
      <Composer.Submit />
    </Composer.Footer>
  </Composer.Frame>
</Composer.Provider>
```

Consumers explicitly compose exactly what they need. No hidden conditionals. And the state, actions and meta are dependency-injected by a parent provider, allowing multiple usages of the same component structure.

Components that read context must live in a `'use client'` module, as the Correct example does. A Server Component must not dot into an object exported from a client module. Writing `<Composer.Input />` in a Server Component throws "You cannot dot into a client module from a server component. You can only pass the imported name through." ([vercel/next.js#51593](https://github.com/vercel/next.js/issues/51593)). Export each part by name as well, for example `export { ComposerFrame, ComposerInput, ComposerSubmit }`, so Server Components can import the named exports directly.

A single `{ state, actions, meta }` value is a new object whenever the provider re-renders. Every consumer then re-renders on each state change, including consumers that only call actions, such as `Composer.Submit`. When that matters, split a stable `ComposerActionsContext` from `ComposerStateContext`, with memoized actions, so action-only consumers stop re-rendering. The React Compiler does not fix this. It can memoize the value object, but it cannot narrow which consumers subscribe to what changed.

Reference: [Passing Data Deeply with Context](https://react.dev/learn/passing-data-deeply-with-context), [createContext](https://react.dev/reference/react/createContext), [Next.js: Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)
