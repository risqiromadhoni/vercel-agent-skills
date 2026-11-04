// SOURCE: skills/react-best-practices/rules/js-tosorted-immutable.md
// HASH: c2c3735c61ebc850939c53143b84e2e169287fc6cd4e2cd9b0cfd5ba9b8aac22
'use client'

import { useMemo } from 'react'

export function UserList({ users }: { users: User[] }) {
  // Mutates the users prop array!
  const sorted = useMemo(
    () => users.sort((a, b) => a.name.localeCompare(b.name)),
    [users]
  )
  return <div>{sorted.map(renderUser)}</div>
}

// ---- test scaffolding (not part of the exercise) ----
interface User {
  id: string
  name: string
}

function renderUser(user: User) {
  return <p key={user.id}>{user.name}</p>
}
