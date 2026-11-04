// SOURCE: skills/react-best-practices/rules/server-dedup-props.md
// HASH: 2da1f17f6f1f5baa4586f39cdf93604b6392f868bb510f24d2dbc9aee8ccb4ba
import { ClientList } from '@/app/rules/server-dedup-props/client-list'

// RSC: send once
export function Page({ usernames }: { usernames: string[] }) {
  return <ClientList usernames={usernames} />
}
