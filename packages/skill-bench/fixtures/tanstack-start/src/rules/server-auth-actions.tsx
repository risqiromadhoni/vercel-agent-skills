// SOURCE: skills/react-best-practices/rules/server-auth-actions.md
// HASH: 322a01ac01bd5d9f18084b7a1a0d5d9f42452a827d0dcddd23436d2765c556ec
// Next original: 'use server' Server Action that checked the session inside the action (and imported '@/lib/auth').
// TanStack equivalent: a server function whose auth check runs in a function middleware before the handler.
import { createMiddleware, createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { db, unauthorized, verifySession } from './_shared'

const authMiddleware = createMiddleware({ type: 'function' }).server(async ({ next }) => {
  // Always check auth inside the middleware, before the handler runs
  const session = await verifySession()
  if (!session) {
    throw unauthorized('Must be logged in')
  }
  return next({ context: { session } })
})

const deleteUserInput = z.object({ userId: z.string() })

export const deleteUser = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator(deleteUserInput)
  .handler(async ({ data, context }) => {
    // Check authorization too
    if (context.session.user.role !== 'admin' && context.session.user.id !== data.userId) {
      throw unauthorized('Cannot delete other users')
    }

    await db.user.delete({ where: { id: data.userId } })
    return { success: true }
  })
