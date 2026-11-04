// SOURCE: skills/composition-patterns/rules/state-lift-state.md
// HASH: 4b9633e18422f21a8a0bfe9689b95428171fdfdf2e0cd4a595d2eed15ece97cf
import { useState } from 'react'

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

// ---- test scaffolding (not part of the exercise) ----
declare const initialState: { input: string }
declare function useForwardMessage(): () => void
declare const Composer: {
  Frame: (props: any) => null
  Input: (props: any) => null
  Footer: (props: any) => null
}
declare function Dialog(props: any): null
declare function MessagePreview(props: any): null
declare function DialogActions(props: any): null
declare function CancelButton(props: any): null
declare function ForwardButton(props: any): null
export {}
