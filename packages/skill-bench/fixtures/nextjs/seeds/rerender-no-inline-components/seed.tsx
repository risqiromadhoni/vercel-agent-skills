// SOURCE: skills/react-best-practices/rules/rerender-no-inline-components.md
// HASH: a3141b9589688a1fe6bfc82aeecadf1fc05f72578d618f5d3dbe0ecc3131ccc9
export function UserProfile({ user, theme }: { user: User; theme: string }) {
  // Defined inside to access `theme` - BAD
  const Avatar = () => (
    <img
      src={user.avatarUrl}
      className={theme === 'dark' ? 'avatar-dark' : 'avatar-light'}
    />
  )

  // Defined inside to access `user` - BAD
  const Stats = () => (
    <div>
      <span>{user.followers} followers</span>
      <span>{user.posts} posts</span>
    </div>
  )

  return (
    <div>
      <Avatar />
      <Stats />
    </div>
  )
}

// ---- test scaffolding (not part of the exercise) ----
interface User {
  avatarUrl: string
  followers: number
  posts: number
}
