// SOURCE: skills/react-best-practices/rules/server-auth-actions.md
// HASH: 35bc8dc78ca5b9a2563707bdfe3fd5973eba36a28b071200b958b3dd76bd80eb
// Next original: 'use server' (Server Action file). TanStack: a createServerFn handler.
import { createServerFn } from '@tanstack/react-start'

export const deleteUser = createServerFn({ method: 'POST' })
  .inputValidator((userId: string) => userId)
  .handler(async ({ data: userId }) => {
    // Anyone can call this! No auth check
    await db.user.delete({ where: { id: userId } })
    return { success: true }
  })

// ---- test scaffolding (not part of the exercise) ----
declare const db: { user: { delete(args: any): Promise<unknown>; findUnique(args: any): Promise<unknown> } }
export {}
