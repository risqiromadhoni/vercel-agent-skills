// Next original: a Server Component Page awaited auth() on every request; nothing request-specific lived at module scope.
// TanStack equivalent: the server route reads the session inside the handler, so each request gets its own user.
import { createFileRoute } from '@tanstack/react-router'
import { auth } from '../../rules/_shared'

export const Route = createFileRoute('/rules/server-no-shared-module-state')({
  server: {
    handlers: {
      GET: async () => {
        // Read per request. Never keep the session in a module-level variable.
        const session = await auth()
        return Response.json({ userId: session?.user.id ?? null })
      },
    },
  },
})
