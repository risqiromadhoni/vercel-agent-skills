// SOURCE: skills/react-best-practices/rules/async-defer-await.md
// HASH: 4b048c65059711b8f5b5a40718c529bf39d8aff081b489c0903c4a1556b88b13
export async function handleRequest(userId: string, skipProcessing: boolean) {
  const userData = await fetchUserData(userId)

  if (skipProcessing) {
    // Returns immediately but still waited for userData
    return { skipped: true }
  }

  // Only this branch uses userData
  return processUserData(userData)
}

// ---- test scaffolding (not part of the exercise) ----
interface UserData {
  id: string
}

async function fetchUserData(_userId: string): Promise<UserData> {
  throw new Error('seed stand-in: fetchUserData')
}

async function processUserData(_data: UserData): Promise<{ processed: true }> {
  throw new Error('seed stand-in: processUserData')
}
