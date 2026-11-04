// SOURCE: skills/react-best-practices/rules/rerender-dependencies.md
// HASH: ac6021700a68960b2bd6a9d95ec72b2adedf3204cfcc4d5803eeba1a0ae12579
'use client'

import { useEffect } from 'react'

export function useLogUserId(user: { id: string }) {
  useEffect(() => {
    console.log(user.id)
  }, [user.id])
}
