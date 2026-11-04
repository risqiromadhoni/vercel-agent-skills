// SOURCE: skills/react-best-practices/rules/async-defer-await.md
// HASH: 174a12447d44cfd95064bf99ed67c568b9554de12d3ed1e010e8ee3ffe127615
import { fetchUserData, processUserData } from './_shared'

export async function handleRequest(userId: string, skipProcessing: boolean) {
  if (skipProcessing) {
    // Returns immediately without waiting
    return { skipped: true }
  }

  // Fetch only when needed
  const userData = await fetchUserData(userId)
  return processUserData(userData)
}
