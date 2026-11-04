// SOURCE: skills/react-best-practices/rules/rerender-simple-expression-in-memo.md
// HASH: 788910188d05a1a36a9f4cab47841988a037d3faea8cb799094e24297acbe812
'use client'

import { useMemo } from 'react'

export function Header({ user, notifications }: Props) {
  const isLoading = useMemo(() => {
    return user.isLoading || notifications.isLoading
  }, [user.isLoading, notifications.isLoading])

  if (isLoading) return <Skeleton />
  // return some markup
}

// ---- test scaffolding (not part of the exercise) ----
interface Props {
  user: { isLoading: boolean }
  notifications: { isLoading: boolean }
}

function Skeleton() {
  return <div aria-busy="true" />
}
