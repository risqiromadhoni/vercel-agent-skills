// SOURCE: skills/react-best-practices/rules/js-combine-iterations.md
// HASH: 36bfeb66d1c0f6a95b52b68a29c1e225366de7629c1cc22853f9428c0eb1d60b
export function groupUsers(users: User[]) {
  const admins = users.filter(u => u.isAdmin)
  const testers = users.filter(u => u.isTester)
  const inactive = users.filter(u => !u.isActive)
}

// ---- test scaffolding (not part of the exercise) ----
interface User {
  id: string
  isAdmin: boolean
  isTester: boolean
  isActive: boolean
}
