// SOURCE: skills/react-best-practices/rules/server-dedup-props.md
// HASH: 2b12785f5c86de990d8abbd7b019e5037a533e5fca9642be8ffd3d60c1c54922
// Next original: RSC props crossing the Server to Client boundary. TanStack: a createServerFn result feeds the client component.
import { createServerFn } from '@tanstack/react-start'

const getUsernames = createServerFn({ method: 'GET' }).handler(async () => fetchUsernames())

export async function UserList() {
  const usernames = await getUsernames()
  // RSC: sends 6 strings (2 arrays × 3 items)
  return <ClientList usernames={usernames} usernamesOrdered={usernames.toSorted()} />
}

// ---- test scaffolding (not part of the exercise) ----
declare function fetchUsernames(): Promise<string[]>
declare function ClientList(props: any): null
export {}
