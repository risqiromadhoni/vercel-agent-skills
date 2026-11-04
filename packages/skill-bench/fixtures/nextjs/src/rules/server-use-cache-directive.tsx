// SOURCE: skills/react-best-practices/rules/server-use-cache-directive.md
// HASH: 57a5f02f6fadcec343c162edc0faab00d6f140f00fc47b716e26a8840433532a
// lib/products.ts
import { cacheLife, cacheTag } from 'next/cache'
import { db } from './_shared'

export async function getProducts() {
  'use cache'
  cacheLife('hours')
  cacheTag('products')

  return db.product.findMany({ where: { published: true } })
}
