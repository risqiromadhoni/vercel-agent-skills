// SOURCE: skills/react-best-practices/rules/js-set-map-lookups.md
// HASH: 9d231355ca4a668406a80e3e5fc281ababacd570f02dfee8bd8759ed0e9c34c0
const allowedIds = ['a', 'b', 'c', 'd']
items.filter(item => allowedIds.includes(item.id))

// ---- test scaffolding (not part of the exercise) ----
declare const items: { id: string }[]
export {}
