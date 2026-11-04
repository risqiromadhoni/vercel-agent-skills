// SOURCE: skills/react-best-practices/rules/rerender-simple-expression-in-memo.md
// HASH: 788910188d05a1a36a9f4cab47841988a037d3faea8cb799094e24297acbe812
import { useMemo } from 'react'

function Header({ user, notifications }: Props) {
  const isLoading = useMemo(() => {
    return user.isLoading || notifications.isLoading
  }, [user.isLoading, notifications.isLoading])

  if (isLoading) return <Skeleton />
  // return some markup
}

// ---- test scaffolding (not part of the exercise) ----
type Props = {
  user: { isLoading: boolean }
  notifications: { isLoading: boolean }
}
declare function Skeleton(props: any): null
export {}
