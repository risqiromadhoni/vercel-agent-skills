// SOURCE: skills/react-best-practices/rules/rerender-dependencies.md
// HASH: 71bddc312cad5edc5dfbafe496ae557fb9653f3b6bd2e9be9d5b3760a8fa336a
'use client'

import { useEffect } from 'react'

export function UserEffect({ user }: { user: { id: string } }) {
  useEffect(() => {
    console.log(user.id)
  }, [user])
}
