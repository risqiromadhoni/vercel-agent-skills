// SOURCE: skills/react-best-practices/rules/client-swr-dedup.md
// HASH: defdf522cbcc21449d308e690dea29643edf9e478b8572746780a174e35359a6
'use client'

import { useEffect, useState } from 'react'

export function UserList() {
  const [users, setUsers] = useState([])
  useEffect(() => {
    fetch('/api/users')
      .then(r => r.json())
      .then(setUsers)
  }, [])
}
