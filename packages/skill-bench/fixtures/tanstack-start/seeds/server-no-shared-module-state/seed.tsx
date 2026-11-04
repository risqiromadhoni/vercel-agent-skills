// SOURCE: skills/react-best-practices/rules/server-no-shared-module-state.md
// HASH: 669f54f18bd3e73296794bcaffedd5e14ff9310b5e6a38d3fdb6976d2724d6bb
// Next original: async Server Component Page and Dashboard (RSC). TanStack: a createServerFn handler.
import { createServerFn } from '@tanstack/react-start'

let currentUser: Session | null = null

export const loadDashboard = createServerFn({ method: 'GET' }).handler(async () => {
  currentUser = await auth()
  return { name: renderName() }
})

function renderName() {
  return currentUser?.user.id ?? 'anonymous'
}

// ---- test scaffolding (not part of the exercise) ----
type Session = { user: { id: string; role: 'admin' | 'member' } }
declare function auth(): Promise<Session | null>
export {}
