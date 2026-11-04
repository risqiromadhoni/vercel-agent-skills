// SOURCE: skills/react-best-practices/rules/js-combine-iterations.md
// HASH: b73c7fdbaf8b59b0a504c376c32d10c7fb6a4d8f53c2fed9a8b64a814608be8d
import type { User } from './_shared'

export function partitionUsers(users: User[]) {
  const admins: User[] = []
  const testers: User[] = []
  const inactive: User[] = []

  for (const user of users) {
    if (user.isAdmin) admins.push(user)
    if (user.isTester) testers.push(user)
    if (!user.isActive) inactive.push(user)
  }

  return { admins, testers, inactive }
}
