'use client'

import { useMemo } from 'react'

// Client: transform there
export function ClientList({ usernames }: { usernames: string[] }) {
  const sorted = useMemo(() => [...usernames].sort(), [usernames])
  return (
    <ul>
      {sorted.map((name) => (
        <li key={name}>{name}</li>
      ))}
    </ul>
  )
}
