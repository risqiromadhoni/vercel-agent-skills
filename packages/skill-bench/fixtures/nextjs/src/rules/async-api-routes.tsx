// SOURCE: skills/react-best-practices/rules/async-api-routes.md
// HASH: 8133e4cd3970174af3bb672836edc3c20956b06bdcab6ac94c25e99c3a521a59
import { fetchConfig, fetchData } from './_shared'

// Stand-in for the session lookup the example assumes.
async function auth() {
  return { user: { id: 'user-1' } }
}

export async function GET(request: Request) {
  const sessionPromise = auth()
  const configPromise = fetchConfig()
  const dataPromise = sessionPromise.then((session) => fetchData(session.user.id))
  const [config, data] = await Promise.all([configPromise, dataPromise])
  return Response.json({ data, config })
}
