// SOURCE: skills/react-best-practices/rules/rerender-split-combined-hooks.md
// HASH: 432b644739be525c8c412277ce604d729bdde15276c606dccfca43ab218c18f1
import { useMemo } from 'react'
import type { Item } from './_shared'

export function ProductList({ products, category, sortOrder }: {
  products: Item[]
  category: string
  sortOrder: 'asc' | 'desc'
}) {
  const filteredProducts = useMemo(
    () => products.filter((p) => p.category === category),
    [products, category]
  )

  const sortedProducts = useMemo(
    () =>
      filteredProducts.toSorted((a, b) =>
        sortOrder === "asc" ? a.price - b.price : b.price - a.price
      ),
    [filteredProducts, sortOrder]
  )

  return <ul>{sortedProducts.map((p) => <li key={p.id}>{p.name}</li>)}</ul>
}
