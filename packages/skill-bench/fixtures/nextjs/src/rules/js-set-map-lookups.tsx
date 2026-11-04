// SOURCE: skills/react-best-practices/rules/js-set-map-lookups.md
// HASH: e8dc8842935ec14dcea680188ef504d3da6af34c581c2181922475e7ba3c3df3
export function filterAllowed(items: Array<{ id: string }>) {
  const allowedIds = new Set(['a', 'b', 'c', 'd'])
  return items.filter(item => allowedIds.has(item.id))
}
