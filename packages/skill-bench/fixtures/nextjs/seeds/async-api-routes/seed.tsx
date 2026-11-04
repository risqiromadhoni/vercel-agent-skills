// SOURCE: skills/react-best-practices/rules/async-api-routes.md
// HASH: cfe869c0207b01de4fdea09925d5fcc77156bbc183037ada610c6e8207df6136
export async function GET(request: Request) {
  const session = await auth()
  const config = await fetchConfig()
  const data = await fetchData(session.user.id)
  return Response.json({ data, config })
}

// ---- test scaffolding (not part of the exercise) ----
async function auth(): Promise<{ user: { id: string } }> {
  throw new Error('seed stand-in: auth')
}

async function fetchConfig(): Promise<{ theme: string }> {
  throw new Error('seed stand-in: fetchConfig')
}

async function fetchData(_userId: string): Promise<{ content: string }> {
  throw new Error('seed stand-in: fetchData')
}
