// SOURCE: skills/react-best-practices/rules/server-parallel-fetching.md
// HASH: 617e90dcf59794be0834db272cadd3eb6fe7e6ecc485fb519d9908858c45e6bd
// Stand-ins for the data functions the example assumes.
async function fetchHeader() {
  return 'header'
}

async function fetchSidebarItems() {
  return [] as string[]
}

function renderItem(item: string) {
  return <li key={item}>{item}</li>
}

async function Header() {
  const data = await fetchHeader()
  return <div>{data}</div>
}

async function Sidebar() {
  const items = await fetchSidebarItems()
  return <nav>{items.map(renderItem)}</nav>
}

export default function Page() {
  return (
    <div>
      <Header />
      <Sidebar />
    </div>
  )
}
