// SOURCE: skills/react-best-practices/rules/js-set-map-lookups.md
// HASH: e8dc8842935ec14dcea680188ef504d3da6af34c581c2181922475e7ba3c3df3
import type { Item } from './_shared'

export const allowedIds = new Set(['a', 'b', 'c', 'd'])

export function filterAllowed(items: Item[]) {
  return items.filter(item => allowedIds.has(item.id))
}
