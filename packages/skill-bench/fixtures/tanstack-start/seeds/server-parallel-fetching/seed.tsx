// SOURCE: skills/react-best-practices/rules/server-parallel-fetching.md
// HASH: daddc740e97eebee9744e4454366b7b27187e4525be277e940f63394a4e8835d
// Next original: async Server Components (Page awaits, then renders async Sidebar). TanStack: createServerFn calls from the route component.
import { createServerFn } from '@tanstack/react-start'

const getHeader = createServerFn({ method: 'GET' }).handler(async () => fetchHeader())
const getSidebarItems = createServerFn({ method: 'GET' }).handler(async () => fetchSidebarItems())

export async function Page() {
  const header = await getHeader()
  return (
    <div>
      <div>{header}</div>
      <Sidebar />
    </div>
  )
}

async function Sidebar() {
  const items = await getSidebarItems()
  return <nav>{items.map(renderItem)}</nav>
}

// ---- test scaffolding (not part of the exercise) ----
declare function fetchHeader(): Promise<string>
declare function fetchSidebarItems(): Promise<string[]>
function renderItem(item: string) {
  return <li key={item}>{item}</li>
}
export {}
