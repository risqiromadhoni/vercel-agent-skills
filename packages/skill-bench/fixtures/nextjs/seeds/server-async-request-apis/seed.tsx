// SOURCE: skills/react-best-practices/rules/server-async-request-apis.md
// HASH: fce3dfda5e9ac600bda0c7d996d41b9336138fa2f433ea917a110df86ba286ff
// app/products/[id]/page.tsx
export default async function Page({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { q?: string }
}) {
  const id = params.id // not allowed: params is a Promise
  const q = searchParams.q // not allowed: searchParams is a Promise
  const token = cookies().get('token') // not allowed: cookies() must be awaited
  const agent = headers().get('user-agent') // not allowed: headers() must be awaited
  return <div>{id} {q} {token?.value} {agent}</div>
}

// ---- test scaffolding (not part of the exercise) ----
// Synchronous stand-ins. next/headers returns a Promise from cookies() and headers() in Next 16,
// and the Promise-typed params would not typecheck with the example's sync access, so the types are simplified.
function cookies(): { get(name: string): { value: string } | undefined } {
  throw new Error('seed stand-in: cookies')
}

function headers(): { get(name: string): string | null } {
  throw new Error('seed stand-in: headers')
}
