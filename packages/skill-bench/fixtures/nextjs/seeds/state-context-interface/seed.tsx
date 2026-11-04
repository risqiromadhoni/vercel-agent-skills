// SOURCE: skills/composition-patterns/rules/state-context-interface.md
// HASH: 0b2c02955869e900718ee9c99efe944492c7b7b5ee82547b7195ee28dbfb20fe
'use client'

export function ComposerInput() {
  // Tightly coupled to a specific hook
  const { input, setInput } = useChannelComposerState()
  return <textarea value={input} onChange={(e) => setInput(e.target.value)} />
}

// ---- test scaffolding (not part of the exercise) ----
function useChannelComposerState(): { input: string; setInput: (value: string) => void } {
  throw new Error('seed stand-in: useChannelComposerState')
}
