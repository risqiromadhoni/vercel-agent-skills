// SOURCE: skills/react-best-practices/rules/rerender-memo.md
// HASH: 3144818442e7c1ea0fc388cdd2bc69f451d0f52385f8b51c876bf6c2fea6626e
import { memo, useMemo } from 'react'
import { Avatar, Skeleton, type User } from './_shared'

type Props = { user: User; loading: boolean }

function computeAvatarId(user: User): string {
  return user.id
}

export const UserAvatar = memo(function UserAvatar({ user }: { user: User }) {
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
