// SOURCE: skills/react-best-practices/rules/server-cache-react.md
// HASH: ce7f1287c9e35026b328cb169b8defffd79da5c29f39caf90f289dc506cedcca
import { cache } from 'react'

const getUser = cache(async (params: { uid: number }) => {
  return await db.user.findUnique({ where: { id: params.uid } })
})

// Each call creates new object, never hits cache
export async function loadUsers() {
  getUser({ uid: 1 })
  getUser({ uid: 1 })  // Cache miss, runs query again
}

// ---- test scaffolding (not part of the exercise) ----
const db = {
  user: {
    async findUnique(_args: { where: { id: string | number } }): Promise<{ id: string } | null> {
      throw new Error('seed stand-in: db.user.findUnique')
    },
  },
}
