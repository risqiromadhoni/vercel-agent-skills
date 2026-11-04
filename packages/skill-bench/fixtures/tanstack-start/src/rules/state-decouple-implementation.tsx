// SOURCE: skills/composition-patterns/rules/state-decouple-implementation.md
// HASH: 641ec27dfdec9f923f601a3e56535fffab767a387e41e06ad8c4ab7ca67d5dcd
import { useRef, useState, type ReactNode } from 'react'
import { Composer } from './architecture-compound-components'
import type { ComposerState } from './_shared'

// Stand-in for a channel store: local state behind the shape the provider expects.
function useGlobalChannel(_channelId: string) {
  const [state, setState] = useState<ComposerState>({ input: '', attachments: [], isSubmitting: false })
  return { state, update: setState, submit: () => {} }
}

// Provider handles all state management details
export function ChannelProvider({
  channelId,
  children,
}: {
  channelId: string
  children: ReactNode
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
export function ChannelComposer() {
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
export function Channel({ channelId }: { channelId: string }) {
  return (
    <ChannelProvider channelId={channelId}>
      <ChannelComposer />
    </ChannelProvider>
  )
}
