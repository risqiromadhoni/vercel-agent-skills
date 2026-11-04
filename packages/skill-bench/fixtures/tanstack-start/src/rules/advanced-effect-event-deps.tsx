// SOURCE: skills/react-best-practices/rules/advanced-effect-event-deps.md
// HASH: 20493a416fadb8496327c914f45d6224a19da7977d58947c4e4a5355b330ee32
import { useEffect, useEffectEvent } from 'react'
import { createConnection } from './_shared'

export function ChatRoom({ roomId, onConnected }: {
  roomId: string
  onConnected: () => void
}) {
  const handleConnected = useEffectEvent(onConnected)

  useEffect(() => {
    const connection = createConnection(roomId)
    connection.on('connected', handleConnected)
    connection.connect()

    return () => connection.disconnect()
  }, [roomId])
}
