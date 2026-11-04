// Next original: a Route Handler (or module code) with a module-level LRU cache.
// TanStack equivalent: a server route GET handler. The LRU lives in this server process, so it is
// per process and cannot be invalidated across instances. Misses are not cached here (LRUCache values must be non-null).
import { createFileRoute } from '@tanstack/react-router'
import { LRUCache } from 'lru-cache'
import { db, type User } from '../../rules/_shared'

const cache = new LRUCache<string, User>({
  max: 1000,
  ttl: 5 * 60 * 1000  // 5 minutes
})

export async function getUser(id: string) {
  const cached = cache.get(id)
  if (cached) return cached

  const user = await db.user.findUnique({ where: { id } })
  if (user) cache.set(id, user)
  return user
}

// Request 1: DB query, result cached
// Request 2: cache hit, no DB query
export const Route = createFileRoute('/rules/server-cache-lru')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const id = new URL(request.url).searchParams.get('id') ?? '1'
        return Response.json(await getUser(id))
      },
    },
  },
})
