// SOURCE: skills/composition-patterns/rules/state-lift-state.md
// HASH: 4b9633e18422f21a8a0bfe9689b95428171fdfdf2e0cd4a595d2eed15ece97cf
'use client'

import { useState } from 'react'
import type { ReactNode } from 'react'

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
export function ForwardMessageDialog() {
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

// ---- test scaffolding (not part of the exercise) ----
const initialState = { input: '' }

function useForwardMessage(): () => void {
  throw new Error('seed stand-in: useForwardMessage')
}

const Composer = {
  Frame({ children }: { children?: ReactNode }) {
    return <form>{children}</form>
  },
  Input() {
    return <input />
  },
  Footer() {
    return <footer />
  },
}

function Dialog({ children }: { children?: ReactNode }) {
  return <div role="dialog">{children}</div>
}

function MessagePreview() {
  return <p />
}

function DialogActions({ children }: { children?: ReactNode }) {
  return <div>{children}</div>
}

function CancelButton() {
  return <button />
}

function ForwardButton() {
  return <button />
}
