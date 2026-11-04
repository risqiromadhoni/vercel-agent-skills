// SOURCE: skills/composition-patterns/rules/state-lift-state.md
// HASH: 0b4a35753b9c94536f5a34c9063c66f8c389a3171ccf31caf009d92343fdbac2
'use client'

import { useRef, useState } from 'react'
import { Composer, ForwardMessageComposer, useComposer, type ComposerState } from './_shared'

// Stand-ins for the state, hook and dialog parts the example assumes.
const initialState: ComposerState = { input: '', attachments: [], isSubmitting: false }

function useForwardMessage() {
  return () => {}
}

function Dialog({ children }: { children: React.ReactNode }) {
  return <div role="dialog">{children}</div>
}

function DialogActions({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}

function CancelButton() {
  return <button type="button">Cancel</button>
}

function MessagePreview() {
  return <p />
}

export function ForwardMessageProvider({ children }: { children: React.ReactNode }) {
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

export function ForwardMessageDialog() {
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

export function ForwardButton() {
  const { actions } = useComposer()
  return <button onClick={actions.submit}>Forward</button>
}
