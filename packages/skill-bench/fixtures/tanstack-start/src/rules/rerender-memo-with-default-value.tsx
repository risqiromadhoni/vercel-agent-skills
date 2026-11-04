// SOURCE: skills/react-best-practices/rules/rerender-memo-with-default-value.md
// HASH: 1b0afa557e643459adf83843fd1fa6a8cd79ef1ee913e09d94073858023015c1
import { memo, useEffect } from 'react'

// Stand-in presence subscription: returns an unsubscribe function.
function subscribeToPresence(_userId: string, _onChange: () => void): () => void {
  return () => {}
}

const NOOP = () => {};

const UserAvatar = memo(function UserAvatar({ userId, label, onClick = NOOP }: { userId: string; label: string; onClick?: () => void }) {
  useEffect(() => {
    const unsubscribe = subscribeToPresence(userId, onClick)
    return unsubscribe
  }, [userId, onClick])

  return <span>{label}</span>
});

// Used without optional onClick; a label change no longer resubscribes
export function Profile({ userId, label }: { userId: string; label: string }) {
  return <UserAvatar userId={userId} label={label} />
}
