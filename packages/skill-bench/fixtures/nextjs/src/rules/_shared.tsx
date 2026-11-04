// Stand-ins for identifiers that several Correct examples use without defining them.
// Typed and tiny. Nothing here does network or file IO; async stand-ins throw if called.
// Single-use stand-ins live at the bottom of the stub that needs them.
//
// Composer context, hook and compound parts are defined once in their rule stubs and
// re-exported here, so the composition examples share one context.

export { Composer } from './architecture-compound-components'
export { ComposerContext, useComposer } from './state-context-interface'
export type {
  ComposerActions,
  ComposerContextValue,
  ComposerMeta,
  ComposerState,
} from './state-context-interface'

export interface User {
  id: string
  name: string
  email: string
  isAdmin: boolean
  isTester: boolean
  isActive: boolean
  avatarUrl: string
  followers: number
  posts: number
}

export interface Project {
  id: string
  name: string
  updatedAt: number
}

export interface Item {
  id: string
}

export interface Result {
  id: string
  title: string
}

export interface Frame {
  id: number
}

export const frames: Frame[] = []

export async function fetchUser(): Promise<User> {
  throw new Error('fixture stand-in: fetchUser')
}

export async function fetchConfig(): Promise<{ theme: string }> {
  throw new Error('fixture stand-in: fetchConfig')
}

export async function fetchData(_userId?: string): Promise<{ content: string }> {
  throw new Error('fixture stand-in: fetchData')
}

export const db = {
  user: {
    async findUnique(_args: { where: { id: string | number } }): Promise<User | null> {
      throw new Error('fixture stand-in: db.user.findUnique')
    },
    async delete(_args: { where: { id: string } }): Promise<User> {
      throw new Error('fixture stand-in: db.user.delete')
    },
  },
  product: {
    async findMany(_args: { where: { published: boolean } }): Promise<Array<{ id: string }>> {
      throw new Error('fixture stand-in: db.product.findMany')
    },
  },
}

export function Skeleton() {
  return <div aria-busy="true" />
}

export function ResultsList({ results }: { results: Array<{ id: string }> }) {
  return (
    <ul>
      {results.map((r) => (
        <li key={r.id} />
      ))}
    </ul>
  )
}

export function ForwardMessageComposer(_props: { messageId?: string }) {
  return null
}

export function MonacoEditor() {
  return null
}

export function Analytics() {
  return null
}
