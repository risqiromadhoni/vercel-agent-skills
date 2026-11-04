// SOURCE: skills/react-best-practices/rules/server-parallel-fetching.md
// HASH: daddc740e97eebee9744e4454366b7b27187e4525be277e940f63394a4e8835d
export default async function Page() {
  const header = await fetchHeader()
  return (
    <div>
      <div>{header}</div>
      <Sidebar />
    </div>
  )
}

async function Sidebar() {
  const items = await fetchSidebarItems()
  return <nav>{items.map(renderItem)}</nav>
}

// ---- test scaffolding (not part of the exercise) ----
interface SidebarItem {
  id: string
  label: string
}

async function fetchHeader(): Promise<string> {
  throw new Error('seed stand-in: fetchHeader')
}

async function fetchSidebarItems(): Promise<SidebarItem[]> {
  throw new Error('seed stand-in: fetchSidebarItems')
}

function renderItem(item: SidebarItem) {
  return <a key={item.id} href={item.label}>{item.label}</a>
}
