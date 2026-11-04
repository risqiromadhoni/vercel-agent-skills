// SOURCE: skills/react-best-practices/rules/server-serialization.md
// HASH: 349355f37a92066aa85b40a7cbf4eea4c407da9c40413a14bf76330a3c76f76d
export async function Page() {
  const user = await fetchUser()  // 50 fields
  return <Profile user={user} />
}

'use client'
export function Profile({ user }: { user: User }) {
  return <div>{user.name}</div>  // uses 1 field
}

// ---- test scaffolding (not part of the exercise) ----
interface User {
  id: string
  name: string
  email: string
}

async function fetchUser(): Promise<User> {
  throw new Error('seed stand-in: fetchUser')
}
