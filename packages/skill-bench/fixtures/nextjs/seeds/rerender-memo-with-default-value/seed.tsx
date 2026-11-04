// SOURCE: skills/react-best-practices/rules/rerender-memo-with-default-value.md
// HASH: 837eae8a2817db65bb1d786dcb2184464ad8c00e31a40ab0e9d8760dc29cf5ef
'use client'

import { memo, useEffect } from 'react'

const UserAvatar = memo(function UserAvatar({ userId, label, onClick = () => {} }: { userId: string; label: string; onClick?: () => void }) {
  useEffect(() => {
    // Re-runs when `label` changes, even though the subscription only depends on `userId`
    const unsubscribe = subscribeToPresence(userId, onClick)
    return unsubscribe
  }, [userId, onClick])

  return <span>{label}</span>
});

export function Profile({ userId, label }: { userId: string; label: string }) {
  // Used without optional onClick; a label change re-renders the component
  return <UserAvatar userId={userId} label={label} />
}

// ---- test scaffolding (not part of the exercise) ----
function subscribeToPresence(_userId: string, _onChange: () => void): () => void {
  throw new Error('seed stand-in: subscribeToPresence')
}
