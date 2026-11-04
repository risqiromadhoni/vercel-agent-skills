// SOURCE: skills/react-best-practices/rules/server-connection-over-force-dynamic.md
// HASH: 28ba9c46aa4e6367a08af6eef497b2fc038a8e8e64029c22bc2b2b6eeb8937c3
// app/page.tsx
import { Suspense } from 'react'
import { connection } from 'next/server'

export default function Page() {
  return (
    <main>
      <Header />
      <ProductCatalog />
      <Suspense fallback={<p>Loading time...</p>}>
        <RequestTime />
      </Suspense>
    </main>
  )
}

// Stand-ins for the page sections the example assumes.
function Header() {
  return <header />
}

function ProductCatalog() {
  return <ul />
}

async function RequestTime() {
  await connection() // prerendering stops here; the lines below run per request
  return <p>Rendered at {Date.now()}</p>
}
