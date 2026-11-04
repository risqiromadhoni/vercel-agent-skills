// SOURCE: skills/react-best-practices/rules/rerender-simple-expression-in-memo.md
// HASH: d997c201129203a13cc4152c6fa722dce812aa8d71b920c27ba98eb7de8920b4
import { Skeleton } from './_shared'

type Props = {
  user: { isLoading: boolean }
  notifications: { isLoading: boolean }
}

export function Header({ user, notifications }: Props) {
  const isLoading = user.isLoading || notifications.isLoading

  if (isLoading) return <Skeleton />
  // return some markup
}
