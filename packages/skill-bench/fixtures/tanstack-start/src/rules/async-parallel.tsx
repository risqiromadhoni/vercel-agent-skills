// SOURCE: skills/react-best-practices/rules/async-parallel.md
// HASH: 878b708f979147366daaab9625a8dc57d04cdda1f86b3e703e9b1e12e042008b
import { fetchComments, fetchPosts, fetchUser } from './_shared'

export async function loadProfilePage() {
  const [user, posts, comments] = await Promise.all([
    fetchUser(),
    fetchPosts(),
    fetchComments()
  ])
  return { user, posts, comments }
}
