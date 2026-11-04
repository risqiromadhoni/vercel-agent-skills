// SOURCE: skills/react-best-practices/rules/advanced-effect-event-deps.md
// HASH: 73ede7a5444c48ce12079f10674326234359c3a0d70c474957c9f63867408e9f
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
  }, [roomId, handleConnected])
}

// ---- test scaffolding (not part of the exercise) ----
interface Connection {
  on(event: string, listener: () => void): void
  connect(): void
  disconnect(): void
}

function createConnection(_roomId: string): Connection {
  throw new Error('seed stand-in: createConnection')
}
