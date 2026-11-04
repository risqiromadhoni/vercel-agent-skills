// Next original: a Server Component passed the whole list into a Client Component, which sorted it with useMemo.
// TanStack equivalent: the server function returns only the field the route renders, and the component sorts it on the client.
import { useMemo } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'

const getUsernames = createServerFn({ method: 'GET' }).handler(async () => {
  // Return the one field the page renders, not whole user records
  return { usernames: ['zoe', 'amy', 'mo'] }
})

export const Route = createFileRoute('/rules/server-dedup-props')({
  loader: () => getUsernames(),
  component: UserListPage,
})

function UserListPage() {
  const { usernames } = Route.useLoaderData()
  // Client: transform there
  const sorted = useMemo(() => [...usernames].sort(), [usernames])
  return <ul>{sorted.map((name) => <li key={name}>{name}</li>)}</ul>
}
