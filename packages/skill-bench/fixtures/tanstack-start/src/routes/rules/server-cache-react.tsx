// Next original: React.cache memoized getUser within one render pass, so repeated calls with the same id hit the cache.
// TanStack equivalent: the route loader calls the server function once per navigation, and components read that
// loader data (Route.useLoaderData) instead of calling the function again at each call site.
import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { db } from '../../rules/_shared'

const getUser = createServerFn({ method: 'GET' })
  .validator(z.number())
  .handler(async ({ data: uid }) => {
    return await db.user.findUnique({ where: { id: uid } })
  })

export const Route = createFileRoute('/rules/server-cache-react')({
  loader: async () => {
    // One call per navigation; every component below reads this result
    const user = await getUser({ data: 1 })
    return { user }
  },
  component: UserCard,
})

function UserCard() {
  const { user } = Route.useLoaderData()
  return <p>{user?.name ?? 'unknown'}</p>
}
