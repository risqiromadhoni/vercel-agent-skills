// SOURCE: skills/react-best-practices/rules/rerender-memo.md
// HASH: 3144818442e7c1ea0fc388cdd2bc69f451d0f52385f8b51c876bf6c2fea6626e
'use client'

import { memo, useMemo } from 'react'
import { Skeleton, type User } from './_shared'

// Stand-ins for the helpers the example assumes.
function computeAvatarId(user: User) {
  return user.id
}

function Avatar(_props: { id: string }) {
  return null
}

type Props = { user: User; loading: boolean }

const UserAvatar = memo(function UserAvatar({ user }: { user: User }) {
  const id = useMemo(() => computeAvatarId(user), [user])
  return <Avatar id={id} />
})

export function Profile({ user, loading }: Props) {
  if (loading) return <Skeleton />
  return (
    <div>
      <UserAvatar user={user} />
    </div>
  )
}
