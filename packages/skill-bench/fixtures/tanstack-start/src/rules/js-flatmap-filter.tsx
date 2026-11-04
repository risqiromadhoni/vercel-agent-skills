// SOURCE: skills/react-best-practices/rules/js-flatmap-filter.md
// HASH: 56da7580dc94e3b4eb4497812ef9981676b5341f789d1c71bd09a209339d10fd
import type { User } from './_shared'

export function activeUserNames(users: User[]) {
  const userNames = users.flatMap(user =>
    user.isActive ? [user.name] : []
  )
  return userNames
}
