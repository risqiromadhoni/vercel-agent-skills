// SOURCE: skills/react-best-practices/rules/js-tosorted-immutable.md
// HASH: c2c3735c61ebc850939c53143b84e2e169287fc6cd4e2cd9b0cfd5ba9b8aac22
import { useMemo } from 'react'

function UserList({ users }: { users: User[] }) {
  // Mutates the users prop array!
  const sorted = useMemo(
    () => users.sort((a, b) => a.name.localeCompare(b.name)),
    [users]
  )
  return <div>{sorted.map(renderUser)}</div>
}

// ---- test scaffolding (not part of the exercise) ----
type User = { name: string }
function renderUser(user: User) {
  return <span key={user.name}>{user.name}</span>
}
