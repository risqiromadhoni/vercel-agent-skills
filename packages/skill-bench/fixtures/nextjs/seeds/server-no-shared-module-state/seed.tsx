// SOURCE: skills/react-best-practices/rules/server-no-shared-module-state.md
// HASH: 669f54f18bd3e73296794bcaffedd5e14ff9310b5e6a38d3fdb6976d2724d6bb
let currentUser: User | null = null

export default async function Page() {
  currentUser = await auth()
  return <Dashboard />
}

async function Dashboard() {
  return <div>{currentUser?.name}</div>
}

// ---- test scaffolding (not part of the exercise) ----
interface User {
  id: string
  name: string
}

async function auth(): Promise<User> {
  throw new Error('seed stand-in: auth')
}
