// SOURCE: skills/react-best-practices/rules/server-parallel-nested-fetching.md
// HASH: 99e789345fd2a7a443a35bee35b18c153b095080cde693238cb8d8b3ba323ebd
// Next original: top-level await in a Server Component. TanStack equivalent: the same Promise.all inside a
// server function handler, so the fan-out runs on the server and only the result crosses to the client.
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { getChat, getUser } from './_shared'

export const getChatAuthors = createServerFn({ method: 'GET' })
  .validator(z.object({ chatIds: z.array(z.string()) }))
  .handler(async ({ data }) => {
    const chatAuthors = await Promise.all(
      data.chatIds.map(id => getChat(id).then(chat => getUser(chat.author)))
    )
    return chatAuthors
  })
