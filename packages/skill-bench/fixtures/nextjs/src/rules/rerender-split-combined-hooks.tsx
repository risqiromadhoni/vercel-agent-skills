// SOURCE: skills/react-best-practices/rules/rerender-split-combined-hooks.md
// HASH: 432b644739be525c8c412277ce604d729bdde15276c606dccfca43ab218c18f1
'use client'

import { useMemo } from 'react'

type Product = { category: string; price: number }

export function useSortedProducts(products: Product[], category: string, sortOrder: 'asc' | 'desc') {
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
  return sortedProducts
}
