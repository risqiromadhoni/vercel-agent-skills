// SOURCE: skills/react-best-practices/rules/client-swr-dedup.md
// HASH: 8dc956825a97a84d09aba9dd0875e33b55f58e25aad376bd3276d9b934f8b097
'use client'

import useSWR from 'swr'

// Stand-in for the fetcher the example assumes.
async function fetcher(_url: string): Promise<unknown> {
  throw new Error('fixture stand-in: fetcher')
}

export function UserList() {
  const { data: users } = useSWR('/api/users', fetcher)
}
