// SOURCE: skills/react-best-practices/rules/js-early-exit.md
// HASH: 3ee1f3b176a4a72220c4da256b6b13653c712aecf946f79bad986e72f3fe169f
import type { User } from './_shared'

export function validateUsers(users: User[]) {
  for (const user of users) {
    if (!user.email) {
      return { valid: false, error: 'Email required' }
    }
    if (!user.name) {
      return { valid: false, error: 'Name required' }
    }
  }

  return { valid: true }
}
