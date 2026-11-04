// SOURCE: skills/react-best-practices/rules/advanced-effect-event-deps.md
// HASH: 20493a416fadb8496327c914f45d6224a19da7977d58947c4e4a5355b330ee32
'use client'

import { useEffect, useEffectEvent } from 'react'

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

// Stand-in for the connection the example assumes.
function createConnection(_roomId: string) {
  return {
    on(_event: string, _listener: () => void) {},
    connect() {},
    disconnect() {},
  }
}
