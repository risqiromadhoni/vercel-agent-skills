// SOURCE: skills/react-best-practices/rules/rendering-content-visibility.md
// HASH: ace8f321592aea8d8f4d2b50cb4b5643c252b7b362087de2fc96a5d124d41e5a
import { Avatar, type Message } from './_shared'

export function MessageList({ messages }: { messages: Message[] }) {
  return (
    <div className="overflow-y-auto h-screen">
      {messages.map(msg => (
        <div key={msg.id} className="message-item">
          <Avatar user={msg.author} />
          <div>{msg.content}</div>
        </div>
      ))}
    </div>
  )
}
