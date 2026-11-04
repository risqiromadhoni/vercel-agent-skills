// SOURCE: skills/react-best-practices/rules/async-api-routes.md
// HASH: cfe869c0207b01de4fdea09925d5fcc77156bbc183037ada610c6e8207df6136
// Next original: app/.../route.ts Route Handler (GET). TanStack: a createServerFn handler.
import { createServerFn } from '@tanstack/react-start'

export const getPageData = createServerFn({ method: 'GET' }).handler(async () => {
  const session = await auth()
  const config = await fetchConfig()
  const data = await fetchData(session.user.id)
  return { data, config }
})

// ---- test scaffolding (not part of the exercise) ----
type Session = { user: { id: string; role: 'admin' | 'member' } }
declare function auth(): Promise<Session>
declare function fetchConfig(): Promise<{ theme: string }>
declare function fetchData(userId: string): Promise<{ content: string }>
export {}
