// SOURCE: skills/react-best-practices/rules/server-after-nonblocking.md
// HASH: 5fe3ee10cb855ea19c9f56ff9aa20d77768f5e492f080e5b0161f569e9436233
export async function POST(request: Request) {
  // Perform mutation
  await updateDatabase(request)

  // Logging blocks the response
  const userAgent = request.headers.get('user-agent') || 'unknown'
  await logUserAction({ userAgent })

  return new Response(JSON.stringify({ status: 'success' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}

// ---- test scaffolding (not part of the exercise) ----
// The example imports logUserAction from '@/app/utils'; the fixture has no such module.
async function updateDatabase(_request: Request): Promise<void> {
  throw new Error('seed stand-in: updateDatabase')
}

async function logUserAction(_action: { userAgent: string }): Promise<void> {
  throw new Error('seed stand-in: logUserAction')
}
