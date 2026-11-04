# React Composition Patterns

**Version 1.0.0**  
Vercel Engineering  
November 2026

> **Note:**  
> This document is mainly for agents and LLMs to follow when maintaining,  
> generating, or refactoring React codebases using composition. Humans  
> may also find it useful, but guidance here is optimized for automation  
> and consistency by AI-assisted workflows.

---

## Abstract

Composition patterns for building flexible, maintainable React components. Avoid boolean prop proliferation by using compound components, lifting state, and composing internals. These patterns make codebases easier for both humans and AI agents to work with as they scale.

---

## Table of Contents

1. [Component Architecture](#1-component-architecture) — **HIGH**
   - 1.1 [Avoid Boolean Prop Proliferation](#11-avoid-boolean-prop-proliferation)
   - 1.2 [Use Compound Components](#12-use-compound-components)
2. [State Management](#2-state-management) — **MEDIUM**
   - 2.1 [Decouple State Management from UI](#21-decouple-state-management-from-ui)
   - 2.2 [Define Generic Context Interfaces for Dependency Injection](#22-define-generic-context-interfaces-for-dependency-injection)
   - 2.3 [Lift State into Provider Components](#23-lift-state-into-provider-components)
3. [Implementation Patterns](#3-implementation-patterns) — **MEDIUM**
   - 3.1 [Create Explicit Component Variants](#31-create-explicit-component-variants)
   - 3.2 [Prefer Composing Children Over Render Props](#32-prefer-composing-children-over-render-props)
4. [React 19 APIs](#4-react-19-apis) — **MEDIUM**
   - 4.1 [React 19 Refs and Context: ref Prop, Context Provider, use()](#41-react-19-refs-and-context-ref-prop-context-provider-use)

---

## 1. Component Architecture

**Impact: HIGH**

Fundamental patterns for structuring components to avoid prop
proliferation and enable flexible composition.

### 1.1 Avoid Boolean Prop Proliferation

**Impact: CRITICAL (prevents unmaintainable component variants)**

Don't add boolean props that switch a component between modes or behaviors, like `isThread`, `isEditing` or `isDMThread`. Each mode boolean doubles the possible states and creates conditional logic nobody can follow. Use composition instead.

Booleans that mirror a DOM attribute are fine. `disabled`, `checked` and `required` map one-to-one onto the element and add no hidden mode.

**Incorrect: boolean props create exponential complexity**

```tsx
function Composer({
  onSubmit,
  isThread,
  channelId,
  isDMThread,
  dmId,
  isEditing,
  isForwarding,
}: Props) {
  return (
    <form>
      <Header />
      <Input />
      {isDMThread ? (
        <AlsoSendToDMField id={dmId} />
      ) : isThread ? (
        <AlsoSendToChannelField id={channelId} />
      ) : null}
      {isEditing ? (
        <EditActions />
      ) : isForwarding ? (
        <ForwardActions />
      ) : (
        <DefaultActions />
      )}
      <Footer onSubmit={onSubmit} />
    </form>
  )
}
```

**Correct: composition eliminates conditionals**

```tsx
// Channel composer
function ChannelComposer() {
  return (
    <Composer.Frame>
      <Composer.Header />
      <Composer.Input />
      <Composer.Footer>
        <Composer.Attachments />
        <Composer.Formatting />
        <Composer.Emojis />
        <Composer.Submit />
      </Composer.Footer>
    </Composer.Frame>
  )
}

// Thread composer - adds "also send to channel" field
function ThreadComposer({ channelId }: { channelId: string }) {
  return (
    <Composer.Frame>
      <Composer.Header />
      <Composer.Input />
      <AlsoSendToChannelField id={channelId} />
      <Composer.Footer>
        <Composer.Formatting />
        <Composer.Emojis />
        <Composer.Submit />
      </Composer.Footer>
    </Composer.Frame>
  )
}

// Edit composer - different footer actions
function EditMessageComposer() {
  return (
    <Composer.Frame>
      <Composer.Input />
      <Composer.Footer>
        <Composer.Formatting />
        <Composer.Emojis />
        <Composer.CancelEdit />
        <Composer.SaveEdit />
      </Composer.Footer>
    </Composer.Frame>
  )
}
```

When a component has two or three mutually exclusive modes, a discriminated-union `variant` prop is a middle ground. Each branch carries only the props its mode needs, so an impossible combination fails to type-check: `type ComposerProps = { variant: 'thread'; channelId: string } | { variant: 'edit'; messageId: string }`. Prefer separate components when the modes differ in layout or behavior.

Each variant is explicit about what it renders. We can share internals without sharing a single monolithic parent.

Reference: [https://react.dev/learn/passing-props-to-a-component](https://react.dev/learn/passing-props-to-a-component)

### 1.2 Use Compound Components

**Impact: HIGH (enables flexible composition without prop drilling)**

Structure complex components as compound components with a shared context. Each subcomponent accesses shared state via context, not props. Consumers compose the pieces they need.

Before you reach for context, try the lighter tools first: pass props, then pass JSX as `children`. Only when several nested parts need the same state does a compound component with a shared context earn its keep.

**Incorrect: monolithic component with render props**

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

**Correct: compound components with shared context**

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

Reference: [https://react.dev/learn/passing-data-deeply-with-context](https://react.dev/learn/passing-data-deeply-with-context), [https://react.dev/reference/react/createContext](https://react.dev/reference/react/createContext), [https://nextjs.org/docs/app/getting-started/server-and-client-components](https://nextjs.org/docs/app/getting-started/server-and-client-components)

---

## 2. State Management

**Impact: MEDIUM**

Patterns for lifting state and managing shared context across
composed components.

### 2.1 Decouple State Management from UI

**Impact: MEDIUM (enables swapping state implementations without changing UI)**

The provider component should be the only place that knows how state is managed. UI components consume the context interface—they don't know if state comes from useState, Zustand, or server-synced data.

**Incorrect: UI coupled to state implementation**

```tsx
function ChannelComposer({ channelId }: { channelId: string }) {
  // UI component knows about global state implementation
  const state = useGlobalChannelState(channelId)
  const { submit, updateInput } = useChannelSync(channelId)

  return (
    <Composer.Frame>
      <Composer.Input
        value={state.input}
        onChange={(e) => updateInput(e.target.value)}
      />
      <Composer.Submit onClick={() => submit()} />
    </Composer.Frame>
  )
}
```

**Correct: state management isolated in provider**

```tsx
// Provider handles all state management details
function ChannelProvider({
  channelId,
  children,
}: {
  channelId: string
  children: React.ReactNode
}) {
  const { state, update, submit } = useGlobalChannel(channelId)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  return (
    <Composer.Provider
      state={state}
      actions={{ update, submit }}
      meta={{ inputRef }}
    >
      {children}
    </Composer.Provider>
  )
}

// UI component only knows about the context interface
function ChannelComposer() {
  return (
    <Composer.Frame>
      <Composer.Header />
      <Composer.Input />
      <Composer.Footer>
        <Composer.Submit />
      </Composer.Footer>
    </Composer.Frame>
  )
}

// Usage
function Channel({ channelId }: { channelId: string }) {
  return (
    <ChannelProvider channelId={channelId}>
      <ChannelComposer />
    </ChannelProvider>
  )
}
```

**Different providers, same UI:**

```tsx
// Local state for ephemeral forms
function ForwardMessageProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState(initialState)
  const forwardMessage = useForwardMessage()

  return (
    <Composer.Provider
      state={state}
      actions={{ update: setState, submit: forwardMessage }}
    >
      {children}
    </Composer.Provider>
  )
}

// Global synced state for channels
function ChannelProvider({
  channelId,
  children,
}: {
  channelId: string
  children: React.ReactNode
}) {
  const { state, update, submit } = useGlobalChannel(channelId)

  return (
    <Composer.Provider state={state} actions={{ update, submit }}>
      {children}
    </Composer.Provider>
  )
}
```

The same `Composer.Input` component works with both providers because it only depends on the context interface, not the implementation.

Reference: [https://react.dev/learn/sharing-state-between-components](https://react.dev/learn/sharing-state-between-components), [https://react.dev/learn/passing-data-deeply-with-context](https://react.dev/learn/passing-data-deeply-with-context)

### 2.2 Define Generic Context Interfaces for Dependency Injection

**Impact: HIGH (enables dependency-injectable state across use-cases)**

Define a **generic interface** for your component context with three parts: `state`, `actions`, and `meta`. This interface is a contract that any provider can implement—enabling the same UI components to work with completely different state implementations.

**Core principle:** Lift state, compose internals, make state dependency-injectable.

**Incorrect: UI coupled to specific state implementation**

```tsx
function ComposerInput() {
  // Tightly coupled to a specific hook
  const { input, setInput } = useChannelComposerState()
  return <textarea value={input} onChange={(e) => setInput(e.target.value)} />
}
```

**Correct: generic interface enables dependency injection**

```tsx
// Define a GENERIC interface that any provider can implement
interface ComposerState {
  input: string
  attachments: Attachment[]
  isSubmitting: boolean
}

interface ComposerActions {
  update: (updater: (state: ComposerState) => ComposerState) => void
  submit: () => void
}

interface ComposerMeta {
  inputRef: React.RefObject<HTMLTextAreaElement | null>
}

interface ComposerContextValue {
  state: ComposerState
  actions: ComposerActions
  meta: ComposerMeta
}

const ComposerContext = createContext<ComposerContextValue | null>(null)

// Read the context through this hook, not use(ComposerContext) directly.
// It throws outside a provider, so callers always get a non-null value.
function useComposer() {
  const ctx = use(ComposerContext)
  if (!ctx) throw new Error('useComposer must be used within a ComposerProvider')
  return ctx
}
```

**UI components consume the interface, not the implementation:**

```tsx
function ComposerInput() {
  const {
    state,
    actions: { update },
    meta,
  } = useComposer()

  // This component works with ANY provider that implements the interface
  return (
    <textarea
      ref={meta.inputRef}
      value={state.input}
      onChange={(e) => update((s) => ({ ...s, input: e.target.value }))}
    />
  )
}
```

**Different providers implement the same interface:**

```tsx
// Provider A: Local state for ephemeral forms
function ForwardMessageProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState(initialState)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const submit = useForwardMessage()

  return (
    <ComposerContext
      value={{
        state,
        actions: { update: setState, submit },
        meta: { inputRef },
      }}
    >
      {children}
    </ComposerContext>
  )
}

// Provider B: Global synced state for channels
function ChannelProvider({
  channelId,
  children,
}: {
  channelId: string
  children: React.ReactNode
}) {
  // Stub signature: useGlobalChannel(channelId: string) => { state: ComposerState; update: ComposerActions['update']; submit: ComposerActions['submit'] }
  const { state, update, submit } = useGlobalChannel(channelId)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  return (
    <ComposerContext
      value={{
        state,
        actions: { update, submit },
        meta: { inputRef },
      }}
    >
      {children}
    </ComposerContext>
  )
}
```

**The same composed UI works with both:**

```tsx
// Works with ForwardMessageProvider (local state)
<ForwardMessageProvider>
  <Composer.Frame>
    <Composer.Input />
    <Composer.Submit />
  </Composer.Frame>
</ForwardMessageProvider>

// Works with ChannelProvider (global synced state)
<ChannelProvider channelId="abc">
  <Composer.Frame>
    <Composer.Input />
    <Composer.Submit />
  </Composer.Frame>
</ChannelProvider>
```

**Custom UI outside the component can access state and actions:**

```tsx
function ForwardMessageDialog() {
  return (
    <ForwardMessageProvider>
      <Dialog>
        {/* The composer UI */}
        <Composer.Frame>
          <Composer.Input placeholder="Add a message, if you'd like." />
          <Composer.Footer>
            <Composer.Formatting />
            <Composer.Emojis />
          </Composer.Footer>
        </Composer.Frame>

        {/* Custom UI OUTSIDE the composer, but INSIDE the provider */}
        <MessagePreview />

        {/* Actions at the bottom of the dialog */}
        <DialogActions>
          <CancelButton />
          <ForwardButton />
        </DialogActions>
      </Dialog>
    </ForwardMessageProvider>
  )
}

// This button lives OUTSIDE Composer.Frame but can still submit based on its context!
function ForwardButton() {
  const {
    actions: { submit },
  } = useComposer()
  return <button onClick={submit}>Forward</button>
}

// This preview lives OUTSIDE Composer.Frame but can read composer's state!
function MessagePreview() {
  const { state } = useComposer()
  return <Preview message={state.input} attachments={state.attachments} />
}
```

The provider boundary is what matters—not the visual nesting. Components that need shared state don't have to be inside the `Composer.Frame`. They just need to be within the provider.

The `ForwardButton` and `MessagePreview` are not visually inside the composer box, but they can still access its state and actions. This is the power of lifting state into providers.

The UI is reusable bits you compose together. The state is dependency-injected by the provider. Swap the provider, keep the UI.

Reference: [https://react.dev/learn/passing-data-deeply-with-context](https://react.dev/learn/passing-data-deeply-with-context), [https://react.dev/reference/react/createContext](https://react.dev/reference/react/createContext), [https://react.dev/reference/react/use](https://react.dev/reference/react/use)

### 2.3 Lift State into Provider Components

**Impact: HIGH (enables state sharing outside component boundaries)**

Move state management into dedicated provider components. This allows sibling components outside the main UI to access and modify state without prop drilling or awkward refs.

**Incorrect: state trapped inside component**

```tsx
function ForwardMessageComposer() {
  const [state, setState] = useState(initialState)
  const forwardMessage = useForwardMessage()

  return (
    <Composer.Frame>
      <Composer.Input />
      <Composer.Footer />
    </Composer.Frame>
  )
}

// Problem: How does this button access composer state?
function ForwardMessageDialog() {
  return (
    <Dialog>
      <ForwardMessageComposer />
      <MessagePreview /> {/* Needs composer state */}
      <DialogActions>
        <CancelButton />
        <ForwardButton /> {/* Needs to call submit */}
      </DialogActions>
    </Dialog>
  )
}
```

**Incorrect: useEffect to sync state up**

```tsx
function ForwardMessageDialog() {
  const [input, setInput] = useState('')
  return (
    <Dialog>
      <ForwardMessageComposer onInputChange={setInput} />
      <MessagePreview input={input} />
    </Dialog>
  )
}

function ForwardMessageComposer({ onInputChange }) {
  const [state, setState] = useState(initialState)
  useEffect(() => {
    onInputChange(state.input) // Sync on every change 😬
  }, [state.input])
}
```

**Incorrect: reading state from ref on submit**

```tsx
function ForwardMessageDialog() {
  const stateRef = useRef(null)
  return (
    <Dialog>
      <ForwardMessageComposer stateRef={stateRef} />
      <ForwardButton onClick={() => submit(stateRef.current)} />
    </Dialog>
  )
}
```

**Correct: state lifted to provider**

```tsx
function ForwardMessageProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState(initialState)
  const forwardMessage = useForwardMessage()
  const inputRef = useRef<HTMLTextAreaElement>(null)

  return (
    <Composer.Provider
      state={state}
      actions={{ update: setState, submit: forwardMessage }}
      meta={{ inputRef }}
    >
      {children}
    </Composer.Provider>
  )
}

function ForwardMessageDialog() {
  return (
    <ForwardMessageProvider>
      <Dialog>
        <ForwardMessageComposer />
        <MessagePreview /> {/* Custom components can access state and actions */}
        <DialogActions>
          <CancelButton />
          <ForwardButton /> {/* Custom components can access state and actions */}
        </DialogActions>
      </Dialog>
    </ForwardMessageProvider>
  )
}

function ForwardButton() {
  const { actions } = useComposer()
  return <button onClick={actions.submit}>Forward</button>
}
```

The ForwardButton lives outside the Composer.Frame but still has access to the submit action because it's within the provider. Even though it's a one-off component, it can still access the composer's state and actions from outside the UI itself.

**Key insight:** Components that need shared state don't have to be visually nested inside each other—they just need to be within the same provider.

Reference: [https://react.dev/learn/sharing-state-between-components](https://react.dev/learn/sharing-state-between-components), [https://react.dev/learn/you-might-not-need-an-effect](https://react.dev/learn/you-might-not-need-an-effect)

---

## 3. Implementation Patterns

**Impact: MEDIUM**

Specific techniques for implementing compound components and
context providers.

### 3.1 Create Explicit Component Variants

**Impact: MEDIUM (self-documenting code, no hidden conditionals)**

Instead of one component with many boolean props, create explicit variant components. Each variant composes the pieces it needs. The code documents itself.

**Incorrect: one component, many modes**

```tsx
// What does this component actually render?
<Composer
  isThread
  isEditing={false}
  channelId='abc'
  showAttachments
  showFormatting={false}
/>
```

**Correct: explicit variants**

```tsx
export function ComposerVariants() {
  return (
    <>
      {/* Immediately clear what this renders */}
      <ThreadComposer channelId="abc" />

      {/* Or */}
      <EditMessageComposer messageId="xyz" />

      {/* Or */}
      <ForwardMessageComposer messageId="123" />
    </>
  )
}
```

Each implementation is unique, explicit and self-contained. Yet they can each use shared parts.

**Implementation:**

```tsx
function ThreadComposer({ channelId }: { channelId: string }) {
  return (
    <ThreadProvider channelId={channelId}>
      <Composer.Frame>
        <Composer.Input />
        <AlsoSendToChannelField channelId={channelId} />
        <Composer.Footer>
          <Composer.Formatting />
          <Composer.Emojis />
          <Composer.Submit />
        </Composer.Footer>
      </Composer.Frame>
    </ThreadProvider>
  )
}

function EditMessageComposer({ messageId }: { messageId: string }) {
  return (
    <EditMessageProvider messageId={messageId}>
      <Composer.Frame>
        <Composer.Input />
        <Composer.Footer>
          <Composer.Formatting />
          <Composer.Emojis />
          <Composer.CancelEdit />
          <Composer.SaveEdit />
        </Composer.Footer>
      </Composer.Frame>
    </EditMessageProvider>
  )
}

function ForwardMessageComposer({ messageId }: { messageId: string }) {
  return (
    <ForwardMessageProvider messageId={messageId}>
      <Composer.Frame>
        <Composer.Input placeholder="Add a message, if you'd like." />
        <Composer.Footer>
          <Composer.Formatting />
          <Composer.Emojis />
          <Composer.Mentions />
        </Composer.Footer>
      </Composer.Frame>
    </ForwardMessageProvider>
  )
}
```

Each variant is explicit about:

- What provider/state it uses
- What UI elements it includes
- What actions are available

No boolean prop combinations to reason about. No impossible states.

Reference: [https://react.dev/learn/passing-props-to-a-component](https://react.dev/learn/passing-props-to-a-component)

### 3.2 Prefer Composing Children Over Render Props

**Impact: MEDIUM (cleaner composition, better readability)**

Use `children` for composition instead of `renderX` props. Children are more readable, compose naturally, and don't require understanding callback signatures.

**Incorrect: render props**

```tsx
function Composer({
  renderHeader,
  renderFooter,
  renderActions,
}: {
  renderHeader?: () => React.ReactNode
  renderFooter?: () => React.ReactNode
  renderActions?: () => React.ReactNode
}) {
  return (
    <form>
      {renderHeader?.()}
      <Input />
      {renderFooter ? renderFooter() : <DefaultFooter />}
      {renderActions?.()}
    </form>
  )
}

// Usage is awkward and inflexible
return (
  <Composer
    renderHeader={() => <CustomHeader />}
    renderFooter={() => (
      <>
        <Formatting />
        <Emojis />
      </>
    )}
    renderActions={() => <SubmitButton />}
  />
)
```

**Correct: compound components with children**

```tsx
function ComposerFrame({ children }: { children: React.ReactNode }) {
  return <form>{children}</form>
}

function ComposerFooter({ children }: { children: React.ReactNode }) {
  return <footer className='flex'>{children}</footer>
}

// Usage is flexible
return (
  <Composer.Frame>
    <CustomHeader />
    <Composer.Input />
    <Composer.Footer>
      <Composer.Formatting />
      <Composer.Emojis />
      <SubmitButton />
    </Composer.Footer>
  </Composer.Frame>
)
```

**When render props are appropriate:**

```tsx
// Render props work well when you need to pass data back
<List
  data={items}
  renderItem={({ item, index }) => <Item item={item} index={index} />}
/>
```

Use render props when the parent needs to provide data or state to the child. Use children when composing static structure. A render prop that exists only to share stateful logic is better replaced by a custom hook: the caller calls the hook directly and renders from its return value, with no extra nesting.

Reference: [https://react.dev/learn/passing-props-to-a-component](https://react.dev/learn/passing-props-to-a-component), [https://react.dev/learn/reusing-logic-with-custom-hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)

---

## 4. React 19 APIs

**Impact: MEDIUM**

React 19+ only. `ref` is a regular prop (forwardRef unnecessary), `<Context value>` replaces `.Provider`, `use(Context)` allows conditional reads.

### 4.1 React 19 Refs and Context: ref Prop, Context Provider, use()

**Impact: MEDIUM (removes forwardRef wrappers and clarifies context reads)**

> **React 19+ only.** Skip this if you're on React 18 or earlier.

In React 19, `ref` is a regular prop for function components, so `forwardRef` is no longer necessary. react.dev says `forwardRef` will be deprecated in a future release. It still works today, so keep it when the code must also run on React 18.

**Incorrect: forwardRef in new React 19-only code**

```tsx
import { forwardRef } from 'react'

const ComposerInput = forwardRef<HTMLTextAreaElement, React.ComponentProps<'textarea'>>(
  (props, ref) => {
    return <textarea ref={ref} {...props} />
  }
)
```

**Correct: ref as a prop**

```tsx
function ComposerInput({
  ref,
  ...props
}: React.ComponentProps<'textarea'> & { ref?: React.Ref<HTMLTextAreaElement> }) {
  return <textarea ref={ref} {...props} />
}
```

`useContext` is still fully supported. It remains the simplest choice for reading context at the top of a component.

**Correct: useContext is still fine**

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

**Correct: Context as provider instead of .Provider**

```tsx
import { createContext } from 'react'

const ThemeContext = createContext('light')

function App({ children }: { children: React.ReactNode }) {
  return <ThemeContext value="dark">{children}</ThemeContext>
}
```

Reference: [https://react.dev/reference/react/forwardRef](https://react.dev/reference/react/forwardRef), [https://react.dev/reference/react/use](https://react.dev/reference/react/use), [https://react.dev/reference/react/createContext](https://react.dev/reference/react/createContext)

---

## References

1. [https://react.dev](https://react.dev)
2. [https://react.dev/learn/passing-data-deeply-with-context](https://react.dev/learn/passing-data-deeply-with-context)
3. [https://react.dev/reference/react/use](https://react.dev/reference/react/use)
