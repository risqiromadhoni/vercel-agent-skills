// SOURCE: skills/react-best-practices/rules/bundle-barrel-imports.md
// HASH: 410d67c27bfb714ec56f9f54535c6af441e9105b7500162867d0067f23cc65b2
// Next original: next.config.ts `experimental.optimizePackageImports: ['@acme/ui']` rewrote barrel imports at build time.
// Vite has no optimizePackageImports. It tree-shakes ESM barrels itself, but direct imports still shrink the
// module graph the bundler must parse, so import each symbol from the module that defines it.
// '@acme/ui' is a stand-in that cannot be installed here; ./_shared plays the role of the package.
import { Avatar } from './_shared'
import type { User } from './_shared'

export function UserCard({ user }: { user: User }) {
  return <Avatar user={user} />
}
