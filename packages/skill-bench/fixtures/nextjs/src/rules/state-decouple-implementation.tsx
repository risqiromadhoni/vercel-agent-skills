// SOURCE: skills/composition-patterns/rules/state-decouple-implementation.md
// HASH: 641ec27dfdec9f923f601a3e56535fffab767a387e41e06ad8c4ab7ca67d5dcd
'use client'

import { useRef } from 'react'
import { Composer, type ComposerActions, type ComposerState } from './_shared'

// Provider handles all state management details
export function ChannelProvider({
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

// Stand-in for the channel hook the example assumes.
function useGlobalChannel(_channelId: string): {
  state: ComposerState
  update: ComposerActions['update']
  submit: ComposerActions['submit']
} {
  return {
    state: { input: '', attachments: [], isSubmitting: false },
    update: () => {},
    submit: () => {},
  }
}
