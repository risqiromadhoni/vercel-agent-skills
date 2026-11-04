// SOURCE: skills/react-best-practices/rules/server-cache-react.md
// HASH: 467d89d9f333ff3a35a4fb4888beab33f74f6cbf68839fab6fbbdb3943246fa5
import { cache } from 'react'
import { db } from './_shared'

export const getUser = cache(async (uid: number) => {
  return await db.user.findUnique({ where: { id: uid } })
})

// Primitive args use value equality
export async function demoCacheHits() {
  getUser(1)
  getUser(1)  // Cache hit, returns cached result
}
