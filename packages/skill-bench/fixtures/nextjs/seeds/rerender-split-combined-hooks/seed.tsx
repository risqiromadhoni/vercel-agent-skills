// SOURCE: skills/react-best-practices/rules/rerender-split-combined-hooks.md
// HASH: 9f0645f4ab3eac607fdfdf1b2e7187e8ecdbeecde84ca2deecf90a78bb9f80c3
'use client'

import { useMemo } from 'react'

export function SortedProducts({ products, category, sortOrder }: Props) {
  const sortedProducts = useMemo(() => {
    const filtered = products.filter((p) => p.category === category)
    const sorted = filtered.toSorted((a, b) =>
      sortOrder === "asc" ? a.price - b.price : b.price - a.price
    )
    return sorted
  }, [products, category, sortOrder])

  return <ul>{sortedProducts.map((p) => <li key={p.id}>{p.price}</li>)}</ul>
}

// ---- test scaffolding (not part of the exercise) ----
interface Product {
  id: string
  category: string
  price: number
}

interface Props {
  products: Product[]
  category: string
  sortOrder: 'asc' | 'desc'
}
