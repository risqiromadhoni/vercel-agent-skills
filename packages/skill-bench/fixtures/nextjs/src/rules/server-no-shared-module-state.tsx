// SOURCE: skills/react-best-practices/rules/server-no-shared-module-state.md
// HASH: 6e91297d363244a58554d4541fc8943cb3812951af2be82cf8cf1294e477c36d
import type { User } from './_shared'

// Stand-in for the per-request session lookup.
async function auth(): Promise<User | null> {
  return null
}

export default async function Page() {
  const user = await auth()
  return <Dashboard user={user} />
}

function Dashboard({ user }: { user: User | null }) {
  return <div>{user?.name}</div>
}
