// SOURCE: skills/react-best-practices/rules/server-connection-over-force-dynamic.md
// HASH: 585f69f8bb1b82f0f59f06eb80646a905ea4fee3b43dfbd69dd9f63de0d68a60
// app/page.tsx
export const dynamic = 'force-dynamic'

export default async function Page() {
  // Only this value must differ per request, but the whole route is now dynamic
  const requestTime = Date.now()
  return (
    <main>
      <Header />
      <ProductCatalog />
      <p>Rendered at {requestTime}</p>
    </main>
  )
}

// ---- test scaffolding (not part of the exercise) ----
function Header() {
  return <header />
}

function ProductCatalog() {
  return <section />
}
