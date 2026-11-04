// SOURCE: skills/react-best-practices/rules/js-index-maps.md
// HASH: de928e695d21db81580f6ab510c371bc4c563e98eba9a1a4c71759a32c3a16a2
import type { User } from './_shared'

type Order = { id: string; userId: string; total: number }

export function processOrders(orders: Order[], users: User[]) {
  const userById = new Map(users.map(u => [u.id, u]))

  return orders.map(order => ({
    ...order,
    user: userById.get(order.userId)
  }))
}
