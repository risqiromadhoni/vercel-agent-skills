// SOURCE: skills/react-best-practices/rules/rerender-use-deferred-value.md
// HASH: ba963207ddcaf6312a5d10bb67811dd296d5784ddaf641fc663d42fc5743f353
import { useDeferredValue, useMemo, useState } from 'react'
import { ResultsList, type Item } from './_shared'

function fuzzyMatch(item: Item, query: string): boolean {
  return item.name.toLowerCase().includes(query.toLowerCase())
}

export function Search({ items }: { items: Item[] }) {
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)
  const filtered = useMemo(
    () => items.filter(item => fuzzyMatch(item, deferredQuery)),
    [items, deferredQuery]
  )
  const isStale = query !== deferredQuery

  return (
    <>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      <div style={{ opacity: isStale ? 0.7 : 1 }}>
        <ResultsList results={filtered} />
      </div>
    </>
  )
}
