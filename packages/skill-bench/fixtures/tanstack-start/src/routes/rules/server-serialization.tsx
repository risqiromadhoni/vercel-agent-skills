// Next original: the Server Component passed user.name (not the whole user record) into a Client Component.
// TanStack equivalent: the server function returns only the field the page renders, so the loader data stays small.
import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { fetchUser } from '../../rules/_shared'

const getProfileName = createServerFn({ method: 'GET' }).handler(async () => {
  const user = await fetchUser()
  // Return only what the page renders, not the whole record
  return { name: user.name }
})

export const Route = createFileRoute('/rules/server-serialization')({
  loader: () => getProfileName(),
  component: Page,
})

function Profile({ name }: { name: string }) {
  return <div>{name}</div>
}

function Page() {
  const { name } = Route.useLoaderData()
  return <Profile name={name} />
}
