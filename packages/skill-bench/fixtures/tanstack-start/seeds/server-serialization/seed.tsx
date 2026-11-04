// SOURCE: skills/react-best-practices/rules/server-serialization.md
// HASH: 349355f37a92066aa85b40a7cbf4eea4c407da9c40413a14bf76330a3c76f76d
// Next original: async Server Component Page; the server-to-client boundary carries the whole user.
// TanStack: a createServerFn returns the full user, and the route component receives all of it.
import { createServerFn } from '@tanstack/react-start'

const getUser = createServerFn({ method: 'GET' }).handler(async () => fetchUser())

async function Page() {
  const user = await getUser()  // 50 fields
  return <Profile user={user} />
}

// Next original: 'use client'
function Profile({ user }: { user: User }) {
  return <div>{user.name}</div>  // uses 1 field
}

// ---- test scaffolding (not part of the exercise) ----
type User = { id: string; name: string; email: string }
declare function fetchUser(): Promise<User>
export {}
