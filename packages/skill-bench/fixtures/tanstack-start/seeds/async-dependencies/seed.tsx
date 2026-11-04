// SOURCE: skills/react-best-practices/rules/async-dependencies.md
// HASH: 843bdb92314294003090eb8cf600c1d1762011d1bf703a09b22ec7f15c75bce9
const [user, config] = await Promise.all([
  fetchUser(),
  fetchConfig()
])
const profile = await fetchProfile(user.id)

// ---- test scaffolding (not part of the exercise) ----
declare function fetchUser(): Promise<{ id: string; name: string }>
declare function fetchConfig(): Promise<{ theme: string }>
declare function fetchProfile(userId: string): Promise<{ bio: string }>
export {}
