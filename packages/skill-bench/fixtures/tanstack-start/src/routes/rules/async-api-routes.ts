// Next original: app/.../route.ts exporting GET (a Route Handler). TanStack equivalent: a server route GET handler.
// The config fetch starts immediately, and the data fetch starts as soon as the session resolves. All three are awaited together.
import { createFileRoute } from '@tanstack/react-router'
import { auth, fetchConfig, fetchData } from '../../rules/_shared'

export const Route = createFileRoute('/rules/async-api-routes')({
  server: {
    handlers: {
      GET: async () => {
        const sessionPromise = auth()
        const configPromise = fetchConfig()
        const dataPromise = sessionPromise.then((session) =>
          session ? fetchData(session.user.id) : null
        )
        const [session, config, data] = await Promise.all([sessionPromise, configPromise, dataPromise])
        if (!session) {
          return new Response('Unauthorized', { status: 401 })
        }
        return Response.json({ data, config })
      },
    },
  },
})
