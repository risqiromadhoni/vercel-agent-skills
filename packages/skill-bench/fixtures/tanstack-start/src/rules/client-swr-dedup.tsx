// SOURCE: skills/react-best-practices/rules/client-swr-dedup.md
// HASH: 8dc956825a97a84d09aba9dd0875e33b55f58e25aad376bd3276d9b934f8b097
import useSWR from 'swr'
import type { User } from './_shared'

// Stand-in fetcher for the SWR key '/api/users'.
const fetcher = async (url: string): Promise<User[]> => {
  const res = await fetch(url)
  return res.json()
}

export function UserList() {
  const { data: users } = useSWR('/api/users', fetcher)
  return <ul>{users?.map((u) => <li key={u.id}>{u.name}</li>)}</ul>
}
