// SOURCE: skills/react-best-practices/rules/server-auth-actions.md
// HASH: 322a01ac01bd5d9f18084b7a1a0d5d9f42452a827d0dcddd23436d2765c556ec
'use server'

import { db } from './_shared'

type Session = { user: { id: string; role: string } }

// Stand-ins for the session and error helpers the example assumes.
async function verifySession(): Promise<Session | null> {
  return null
}

function unauthorized(message: string) {
  return new Error(message)
}

export async function deleteUser(userId: string) {
  // Always check auth inside the action
  const session = await verifySession()

  if (!session) {
    throw unauthorized('Must be logged in')
  }

  // Check authorization too
  if (session.user.role !== 'admin' && session.user.id !== userId) {
    throw unauthorized('Cannot delete other users')
  }

  await db.user.delete({ where: { id: userId } })
  return { success: true }
}
