// SOURCE: skills/react-best-practices/rules/server-serialization.md
// HASH: 851e2d0ccb78d5207ae32b14f31cb5a16ebd293475d6432999349418fb58b1b3
import { fetchUser } from './_shared'
import { Profile } from '@/app/rules/server-serialization/profile'

export async function Page() {
  const user = await fetchUser()
  return <Profile name={user.name} />
}
