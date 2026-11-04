// SOURCE: skills/react-best-practices/rules/js-index-maps.md
// HASH: 7348a8578ad8a5f97b59f8691c6ad3d5fbb8e1d6628b8c4b9f551f8dd8291396
function processOrders(orders: Order[], users: User[]) {
  return orders.map(order => ({
    ...order,
    user: users.find(u => u.id === order.userId)
  }))
}

// ---- test scaffolding (not part of the exercise) ----
type Order = { id: string; userId: string }
type User = { id: string }
export {}
