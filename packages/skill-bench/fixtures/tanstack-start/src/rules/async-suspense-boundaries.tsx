// SOURCE: skills/react-best-practices/rules/async-suspense-boundaries.md
// HASH: 01c822a4d0bdf73b3aa2bb7db3f2d237d2d8d991480b06a321468b845a8ee25c
import { Suspense } from 'react'
import { Skeleton, fetchData } from './_shared'

export function Page() {
  return (
    <div>
      <div>Sidebar</div>
      <div>Header</div>
      <div>
        <Suspense fallback={<Skeleton />}>
          <DataDisplay />
        </Suspense>
      </div>
      <div>Footer</div>
    </div>
  )
}

// Server Component: async, awaits its own data
export async function DataDisplay() {
  const data = await fetchData() // Only blocks this component
  return <div>{data.content}</div>
}
