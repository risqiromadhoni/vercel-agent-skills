// SOURCE: skills/react-best-practices/rules/server-parallel-nested-fetching.md
// HASH: be8dfefcbea86647447864c8dc5571c623b8232c4f1ed8b25078aaecd3c5fcc0
const chats = await Promise.all(
  chatIds.map(id => getChat(id))
)

const chatAuthors = await Promise.all(
  chats.map(chat => getUser(chat.author))
)

// ---- test scaffolding (not part of the exercise) ----
declare const chatIds: string[]
declare function getChat(id: string): Promise<{ id: string; author: string }>
declare function getUser(id: string): Promise<{ id: string; name: string }>
export {}
