// SOURCE: skills/react-best-practices/rules/server-cache-lru.md
// HASH: 28d27a5932b503211dfa2cbde0c37c1402091b8d26122be9240d01f5cb13597a
import { LRUCache } from 'lru-cache'
import { db } from './_shared'

const cache = new LRUCache<string, any>({
  max: 1000,
  ttl: 5 * 60 * 1000  // 5 minutes
})

export async function getUser(id: string) {
  const cached = cache.get(id)
  if (cached) return cached

  const user = await db.user.findUnique({ where: { id } })
  cache.set(id, user)
  return user
}

// Request 1: DB query, result cached
// Request 2: cache hit, no DB query
