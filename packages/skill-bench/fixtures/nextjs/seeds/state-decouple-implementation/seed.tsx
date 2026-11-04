// SOURCE: skills/composition-patterns/rules/state-decouple-implementation.md
// HASH: ccaf7a968dced1afd2f492fd626f99e7605bdc84fa02f889559725db0563d409
'use client'

import type { ChangeEvent, ReactNode } from 'react'

export function ChannelComposer({ channelId }: { channelId: string }) {
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

// ---- test scaffolding (not part of the exercise) ----
function useGlobalChannelState(_channelId: string): { input: string } {
  throw new Error('seed stand-in: useGlobalChannelState')
}

function useChannelSync(_channelId: string): {
  submit: () => void
  updateInput: (value: string) => void
} {
  throw new Error('seed stand-in: useChannelSync')
}

const Composer = {
  Frame({ children }: { children?: ReactNode }) {
    return <form>{children}</form>
  },
  Input(_props: { value: string; onChange: (e: ChangeEvent<HTMLInputElement>) => void }) {
    return <input />
  },
  Submit(_props: { onClick: () => void }) {
    return <button />
  },
}
