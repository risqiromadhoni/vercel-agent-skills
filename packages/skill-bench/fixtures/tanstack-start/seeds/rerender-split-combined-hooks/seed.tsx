// SOURCE: skills/react-best-practices/rules/rerender-split-combined-hooks.md
// HASH: 9f0645f4ab3eac607fdfdf1b2e7187e8ecdbeecde84ca2deecf90a78bb9f80c3
import { useMemo } from 'react'

const sortedProducts = useMemo(() => {
  const filtered = products.filter((p) => p.category === category)
  const sorted = filtered.toSorted((a, b) =>
    sortOrder === "asc" ? a.price - b.price : b.price - a.price
  )
  return sorted
}, [products, category, sortOrder])

// ---- test scaffolding (not part of the exercise) ----
type Product = { category: string; price: number }
declare const products: Product[]
declare const category: string
declare const sortOrder: 'asc' | 'desc'
export {}
