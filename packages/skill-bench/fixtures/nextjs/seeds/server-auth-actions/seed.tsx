// SOURCE: skills/react-best-practices/rules/server-auth-actions.md
// HASH: 35bc8dc78ca5b9a2563707bdfe3fd5973eba36a28b071200b958b3dd76bd80eb
'use server'

export async function deleteUser(userId: string) {
  // Anyone can call this! No auth check
  await db.user.delete({ where: { id: userId } })
  return { success: true }
}

// ---- test scaffolding (not part of the exercise) ----
const db = {
  user: {
    async delete(_args: { where: { id: string } }): Promise<{ id: string }> {
      throw new Error('seed stand-in: db.user.delete')
    },
  },
}
