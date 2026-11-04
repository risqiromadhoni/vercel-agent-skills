// SOURCE: skills/composition-patterns/rules/state-context-interface.md
// HASH: 281b605eefde27a76dd15757dfa889ac7aabfdd8741fef955cd3baf85dd84176
import { createContext, use, type RefObject } from 'react'

// Define a GENERIC interface that any provider can implement
export interface ComposerState {
  input: string
  attachments: { id: string; name: string }[]
  isSubmitting: boolean
}

export interface ComposerActions {
  update: (updater: (state: ComposerState) => ComposerState) => void
  submit: () => void
}

export interface ComposerMeta {
  inputRef: RefObject<HTMLTextAreaElement | null>
}

export interface ComposerContextValue {
  state: ComposerState
  actions: ComposerActions
  meta: ComposerMeta
}

const ComposerContext = createContext<ComposerContextValue | null>(null)

// Read the context through this hook, not use(ComposerContext) directly.
// It throws outside a provider, so callers always get a non-null value.
export function useComposer() {
  const ctx = use(ComposerContext)
  if (!ctx) throw new Error('useComposer must be used within a ComposerProvider')
  return ctx
}
