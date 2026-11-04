// SOURCE: skills/react-best-practices/rules/async-parallel.md
// HASH: 6a5276e933c0ce0d758ef1288c96997b56b030373302d26a21633f33758c4253
const user = await fetchUser()
const posts = await fetchPosts()
const comments = await fetchComments()

// ---- test scaffolding (not part of the exercise) ----
declare function fetchUser(): Promise<{ id: string; name: string }>
declare function fetchPosts(): Promise<unknown[]>
declare function fetchComments(): Promise<unknown[]>
export {}
