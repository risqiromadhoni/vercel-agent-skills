// SOURCE: skills/react-best-practices/rules/rerender-memo-with-default-value.md
// HASH: 1b0afa557e643459adf83843fd1fa6a8cd79ef1ee913e09d94073858023015c1
'use client'

import { memo, useEffect } from 'react'

const NOOP = () => {};

const UserAvatar = memo(function UserAvatar({ userId, label, onClick = NOOP }: { userId: string; label: string; onClick?: () => void }) {
  useEffect(() => {
    const unsubscribe = subscribeToPresence(userId, onClick)
    return unsubscribe
  }, [userId, onClick])

  return <span>{label}</span>
});

export function Profile({ userId, label }: { userId: string; label: string }) {
  // Used without optional onClick; a label change no longer resubscribes
  return <UserAvatar userId={userId} label={label} />
}

// Stand-in for the presence subscription.
function subscribeToPresence(_userId: string, _onChange: () => void) {
  return () => {}
}
