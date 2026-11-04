// SOURCE: skills/composition-patterns/rules/architecture-compound-components.md
// HASH: d731ec100befa6e9b1af059a4fdccc1fa692ebdaa941c8b1fead2cd94e493791
'use client'

import { ComposerContext, useComposer, type ComposerContextValue } from './state-context-interface'

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
