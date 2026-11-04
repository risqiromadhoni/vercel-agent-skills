// SOURCE: skills/react-best-practices/rules/server-async-request-apis.md
// HASH: 9739e9a2ccb3e7ef683ec1cb41204ce34539e3b644ba2a6d39ab8f14e5381124
// app/products/[id]/page.tsx
import { cookies, headers } from 'next/headers'

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ q?: string }>
}) {
  const { id } = await params
  const { q } = await searchParams
  const token = (await cookies()).get('token')
  const agent = (await headers()).get('user-agent')
  return <div>{id} {q} {token?.value} {agent}</div>
}
