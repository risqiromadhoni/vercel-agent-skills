// SOURCE: skills/react-best-practices/rules/server-parallel-nested-fetching.md
// HASH: be8dfefcbea86647447864c8dc5571c623b8232c4f1ed8b25078aaecd3c5fcc0
export async function loadAuthors(chatIds: string[]) {
  const chats = await Promise.all(
    chatIds.map(id => getChat(id))
  )

  const chatAuthors = await Promise.all(
    chats.map(chat => getUser(chat.author))
  )
}

// ---- test scaffolding (not part of the exercise) ----
async function getChat(_id: string): Promise<{ author: string }> {
  throw new Error('seed stand-in: getChat')
}

async function getUser(_id: string): Promise<{ name: string }> {
  throw new Error('seed stand-in: getUser')
}
