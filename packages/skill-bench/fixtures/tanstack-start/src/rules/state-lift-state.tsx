// SOURCE: skills/composition-patterns/rules/state-lift-state.md
// HASH: 0b4a35753b9c94536f5a34c9063c66f8c389a3171ccf31caf009d92343fdbac2
import { useRef, useState, type ReactNode } from 'react'
import { Composer } from './architecture-compound-components'
import { useComposer, type ComposerState } from './_shared'

const initialState: ComposerState = { input: '', attachments: [], isSubmitting: false }

// Stand-in: returns the handler that forwards the message.
function useForwardMessage(): () => void {
  return () => {}
}

function Dialog({ children }: { children: ReactNode }) {
  return <div role="dialog">{children}</div>
}

function DialogActions({ children }: { children: ReactNode }) {
  return <div>{children}</div>
}

function CancelButton() {
  return <button type="button">Cancel</button>
}

function MessagePreview() {
  return <p>Preview</p>
}

function ForwardMessageComposer() {
  return (
    <Composer.Frame>
      <Composer.Input />
      <Composer.Footer>
        <Composer.Submit />
      </Composer.Footer>
    </Composer.Frame>
  )
}

export function ForwardMessageProvider({ children }: { children: ReactNode }) {
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

function ForwardButton() {
  const { actions } = useComposer()
  return <button onClick={actions.submit}>Forward</button>
}
