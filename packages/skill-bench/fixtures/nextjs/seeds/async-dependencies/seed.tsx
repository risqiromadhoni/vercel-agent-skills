// SOURCE: skills/react-best-practices/rules/async-dependencies.md
// HASH: 843bdb92314294003090eb8cf600c1d1762011d1bf703a09b22ec7f15c75bce9
export async function loadProfile() {
  const [user, config] = await Promise.all([
    fetchUser(),
    fetchConfig()
  ])
  const profile = await fetchProfile(user.id)
}

// ---- test scaffolding (not part of the exercise) ----
async function fetchUser(): Promise<{ id: string }> {
  throw new Error('seed stand-in: fetchUser')
}

async function fetchConfig(): Promise<{ theme: string }> {
  throw new Error('seed stand-in: fetchConfig')
}

async function fetchProfile(_userId: string): Promise<{ bio: string }> {
  throw new Error('seed stand-in: fetchProfile')
}
