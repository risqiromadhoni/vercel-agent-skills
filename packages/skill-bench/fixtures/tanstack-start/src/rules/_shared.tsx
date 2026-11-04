// Stand-ins shared by the rule examples in this fixture. None of this is a real data layer or UI kit.
// Each export exists only so that a Correct example compiles once its imports and types are added.
// Data functions return fixed sample values, so routes that use them render instead of throwing.
// Nothing here runs at module load: rule files wrap their top-level fragments in functions.
import { createContext, use, type ReactNode, type RefObject } from 'react'

export interface User {
  id: string
  name: string
  email?: string
  role?: 'admin' | 'member'
  isAdmin?: boolean
  isTester?: boolean
  isActive?: boolean
  avatarUrl?: string
  followers?: number
  posts?: number
  updatedAt?: number
}

export interface Session {
  user: { id: string; role: 'admin' | 'member' }
}

export interface Message {
  id: string
  author: User
  content: string
}

export interface Attachment {
  id: string
  name: string
}

export interface Item {
  id: string
  name: string
  category: string
  price: number
}

export interface Project {
  id: string
  name: string
  updatedAt: number
}

export interface Order {
  id: string
  userId: string
  total: number
}

export interface Post {
  id: string
  title: string
}

export interface Comment {
  id: string
  body: string
}

export interface Connection {
  on(event: string, handler: () => void): void
  connect(): void
  disconnect(): void
}

// Data access. Stand-ins that return sample values.
export const db = {
  user: {
    async findUnique(args: { where: { id: string | number } }): Promise<User | null> {
      return { id: String(args.where.id), name: 'Ada' }
    },
    async delete(args: { where: { id: string } }): Promise<User> {
      return { id: args.where.id, name: 'Deleted user' }
    },
  },
}

export async function auth(): Promise<Session | null> {
  return { user: { id: 'user-1', role: 'member' } }
}

export async function verifySession(): Promise<Session | null> {
  return auth()
}

export function unauthorized(message: string): Error {
  return new Error(message)
}

export async function fetchUser(): Promise<User> {
  return { id: 'user-1', name: 'Ada' }
}

export async function fetchConfig(): Promise<{ theme: string }> {
  return { theme: 'light' }
}

export async function fetchProfile(_userId: string): Promise<{ bio: string }> {
  return { bio: 'Stand-in bio' }
}

export async function fetchData(_userId?: string): Promise<{ content: string }> {
  return { content: 'Stand-in content' }
}

export async function fetchPosts(): Promise<Post[]> {
  return [{ id: 'p1', title: 'Stand-in post' }]
}

export async function fetchComments(): Promise<Comment[]> {
  return [{ id: 'c1', body: 'Stand-in comment' }]
}

export async function fetchHeader(): Promise<string> {
  return 'Stand-in header'
}

export async function fetchSidebarItems(): Promise<string[]> {
  return ['Inbox', 'Sent']
}

export async function fetchUserData(userId: string): Promise<{ id: string }> {
  return { id: userId }
}

export function processUserData(data: { id: string }): { ok: boolean; id: string } {
  return { ok: true, id: data.id }
}

export async function fetchResults(_query: string): Promise<Item[]> {
  return []
}

export async function getChat(id: string): Promise<{ id: string; author: string }> {
  return { id, author: 'user-1' }
}

export async function getUser(id: string): Promise<User> {
  return { id, name: 'Ada' }
}

export async function getFlag(): Promise<boolean> {
  return false
}

export function createConnection(_roomId: string): Connection {
  return { on() {}, connect() {}, disconnect() {} }
}

export function loadFromStorage(): void {}

export function checkAuthToken(): void {}

export function renderItem(item: string) {
  return <li key={item}>{item}</li>
}

export function searchItems(_query: string): Item[] {
  return []
}

export function saveToRecentSearches(_query: string): void {}

export function prefetchTopResults(_items: Item[]): void {}

export const analytics = {
  track(_event: string, _props?: Record<string, unknown>): void {},
}

// Lazy-load targets. Dynamic imports in rule examples point at this module (or at real route
// modules) because the fixture has no separate monaco-editor, animation-frames or pages/* files.
export const frames: string[] = []

export function MonacoEditor(_props: { value?: string }) {
  return <textarea />
}

// Third-party analytics component stand-in (the Next original imported @vercel/analytics/react).
export function Analytics() {
  return null
}

// UI stand-ins.
export function Skeleton() {
  return <div className="skeleton" />
}

export function Spinner() {
  return <div className="spinner" />
}

export function Avatar({ user, id }: { user?: User; id?: string }) {
  return <img alt="" data-id={user?.id ?? id} />
}

export function ResultsList({ results }: { results: unknown[] }) {
  return (
    <ul>
      {results.map((_, i) => (
        <li key={i} />
      ))}
    </ul>
  )
}

// Composer context, shared by the composition-patterns examples. The DOM is the platform:
// textarea for input, button onClick for actions, form for submit.
export interface ComposerState {
  input: string
  attachments: Attachment[]
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

export const ComposerContext = createContext<ComposerContextValue | null>(null)

export function ComposerProvider({
  children,
  state,
  actions,
  meta,
}: ComposerContextValue & { children: ReactNode }) {
  return <ComposerContext value={{ state, actions, meta }}>{children}</ComposerContext>
}

// Throws outside a provider, so callers always get a non-null value.
export function useComposer(): ComposerContextValue {
  const ctx = use(ComposerContext)
  if (!ctx) throw new Error('useComposer must be used within a ComposerProvider')
  return ctx
}
