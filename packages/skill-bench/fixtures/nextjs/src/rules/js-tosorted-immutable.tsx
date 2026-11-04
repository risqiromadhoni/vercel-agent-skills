// SOURCE: skills/react-best-practices/rules/js-tosorted-immutable.md
// HASH: 199614269da445f336cb388420c2395c06941faa20ec3de377fa3644bd7fd689
'use client'

import { useMemo } from 'react'
import type { User } from './_shared'

export function UserList({ users }: { users: User[] }) {
  // Creates new sorted array, original unchanged
  const sorted = useMemo(
    () => users.toSorted((a, b) => a.name.localeCompare(b.name)),
    [users]
  )
  return <div>{sorted.map(renderUser)}</div>
}

// Stand-in for the row renderer the example assumes.
function renderUser(user: User) {
  return <span>{user.name}</span>
}
