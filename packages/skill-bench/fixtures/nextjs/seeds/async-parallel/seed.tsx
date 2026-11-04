// SOURCE: skills/react-best-practices/rules/async-parallel.md
// HASH: 6a5276e933c0ce0d758ef1288c96997b56b030373302d26a21633f33758c4253
export async function loadPage() {
  const user = await fetchUser()
  const posts = await fetchPosts()
  const comments = await fetchComments()
}

// ---- test scaffolding (not part of the exercise) ----
async function fetchUser(): Promise<{ id: string }> {
  throw new Error('seed stand-in: fetchUser')
}

async function fetchPosts(): Promise<{ id: string }[]> {
  throw new Error('seed stand-in: fetchPosts')
}

async function fetchComments(): Promise<{ id: string }[]> {
  throw new Error('seed stand-in: fetchComments')
}
