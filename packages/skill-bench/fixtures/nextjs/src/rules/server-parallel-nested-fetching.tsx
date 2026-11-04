// SOURCE: skills/react-best-practices/rules/server-parallel-nested-fetching.md
// HASH: 99e789345fd2a7a443a35bee35b18c153b095080cde693238cb8d8b3ba323ebd
// Stand-ins for the chat and user lookups the example assumes.
async function getChat(_id: string) {
  return { author: 'user-1' }
}

async function getUser(_id: string) {
  return { id: 'user-1', name: 'Ada' }
}

export async function loadChatAuthors(chatIds: string[]) {
  const chatAuthors = await Promise.all(
    chatIds.map(id => getChat(id).then(chat => getUser(chat.author)))
  )
  return chatAuthors
}
