// SOURCE: skills/react-best-practices/rules/rerender-memo.md
// HASH: 90e0cb23382595de1a825248de4553bed923220a564a3382bec8ba909e62f183
import { useMemo } from 'react'

function Profile({ user, loading }: Props) {
  const avatar = useMemo(() => {
    const id = computeAvatarId(user)
    return <Avatar id={id} />
  }, [user])

  if (loading) return <Skeleton />
  return <div>{avatar}</div>
}

// ---- test scaffolding (not part of the exercise) ----
type User = { id: string; name: string }
type Props = { user: User; loading: boolean }
declare function computeAvatarId(user: User): string
declare function Avatar(props: any): null
declare function Skeleton(props: any): null
export {}
