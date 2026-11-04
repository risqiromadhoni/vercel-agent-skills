// SOURCE: skills/react-best-practices/rules/rerender-memo.md
// HASH: 90e0cb23382595de1a825248de4553bed923220a564a3382bec8ba909e62f183
'use client'

import { useMemo } from 'react'

export function Profile({ user, loading }: Props) {
  const avatar = useMemo(() => {
    const id = computeAvatarId(user)
    return <Avatar id={id} />
  }, [user])

  if (loading) return <Skeleton />
  return <div>{avatar}</div>
}

// ---- test scaffolding (not part of the exercise) ----
interface User {
  id: string
  name: string
}

interface Props {
  user: User
  loading: boolean
}

function computeAvatarId(user: User): string {
  return user.id
}

function Avatar(_props: { id: string }) {
  return null
}

function Skeleton() {
  return <div aria-busy="true" />
}
