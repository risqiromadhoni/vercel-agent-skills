// SOURCE: skills/react-best-practices/rules/server-after-nonblocking.md
// HASH: 439d8aa18d6fc4efd82647cd2725c9f7792ef8b4366ed32e935b380110c1b7d8
import { after } from 'next/server'
import { headers, cookies } from 'next/headers'

// Stand-ins for the mutation and logger the example assumes.
async function updateDatabase(_request: Request) {}

function logUserAction(_action: { sessionCookie: string; userAgent: string }) {}

export async function POST(request: Request) {
  // Perform mutation
  await updateDatabase(request)

  // Log after response is sent
  after(async () => {
    const userAgent = (await headers()).get('user-agent') || 'unknown'
    const sessionCookie = (await cookies()).get('session-id')?.value || 'anonymous'

    logUserAction({ sessionCookie, userAgent })
  })

  return new Response(JSON.stringify({ status: 'success' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}
