// SOURCE: skills/react-best-practices/rules/js-early-exit.md
// HASH: 2d3cf29f1a619786fa38ef5c1a81bed15ccdd61061cbd32c55736f096b8a90ce
export function validateUsers(users: User[]) {
  let hasError = false
  let errorMessage = ''

  for (const user of users) {
    if (!user.email) {
      hasError = true
      errorMessage = 'Email required'
    }
    if (!user.name) {
      hasError = true
      errorMessage = 'Name required'
    }
    // Continues checking all users even after error found
  }

  return hasError ? { valid: false, error: errorMessage } : { valid: true }
}

// ---- test scaffolding (not part of the exercise) ----
interface User {
  id: string
  name: string
  email: string
}
