// SOURCE: skills/react-best-practices/rules/js-flatmap-filter.md
// HASH: 801e80cf19bba762f5809d4f0f8e7c041fd2df1890f8ef995f4a774fe4b21a4a
export function activeNames(users: User[]) {
  const userNames = users
    .map(user => user.isActive ? user.name : null)
    .filter(Boolean)
}

// ---- test scaffolding (not part of the exercise) ----
interface User {
  name: string
  isActive: boolean
}
