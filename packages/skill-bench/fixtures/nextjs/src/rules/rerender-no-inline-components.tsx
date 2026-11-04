// SOURCE: skills/react-best-practices/rules/rerender-no-inline-components.md
// HASH: fbaf069835a9c2455b5fc9dfc3c57b49000bf5c51f99205c0d6ca297051b1425
import type { User } from './_shared'

function Avatar({ src, theme }: { src: string; theme: string }) {
  return (
    <img
      src={src}
      className={theme === 'dark' ? 'avatar-dark' : 'avatar-light'}
    />
  )
}

function Stats({ followers, posts }: { followers: number; posts: number }) {
  return (
    <div>
      <span>{followers} followers</span>
      <span>{posts} posts</span>
    </div>
  )
}

export function UserProfile({ user, theme }: { user: User; theme: string }) {
  return (
    <div>
      <Avatar src={user.avatarUrl} theme={theme} />
      <Stats followers={user.followers} posts={user.posts} />
    </div>
  )
}
