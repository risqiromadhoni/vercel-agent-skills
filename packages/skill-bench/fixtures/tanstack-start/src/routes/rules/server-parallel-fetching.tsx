// Next original: Header and Sidebar were async Server Components that each awaited their own fetch.
// TanStack equivalent: the route loader starts both fetches together with Promise.all; the components render loader data.
import { createFileRoute } from '@tanstack/react-router'
import { fetchHeader, fetchSidebarItems, renderItem } from '../../rules/_shared'

export const Route = createFileRoute('/rules/server-parallel-fetching')({
  loader: async () => {
    // Both fetches start now; the loader waits for the slower one, not for the two in turn
    const [header, items] = await Promise.all([fetchHeader(), fetchSidebarItems()])
    return { header, items }
  },
  component: Page,
})

function Header({ data }: { data: string }) {
  return <div>{data}</div>
}

function Sidebar({ items }: { items: string[] }) {
  return <nav>{items.map(renderItem)}</nav>
}

function Page() {
  const { header, items } = Route.useLoaderData()
  return (
    <div>
      <Header data={header} />
      <Sidebar items={items} />
    </div>
  )
}
