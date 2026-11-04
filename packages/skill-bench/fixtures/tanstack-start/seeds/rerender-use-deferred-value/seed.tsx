// SOURCE: skills/react-best-practices/rules/rerender-use-deferred-value.md
// HASH: 669b14c438ad753275d4fafdc8d8b83c8d5991b3d9ad4ddd3867b78923c3d317
import { useState } from 'react'

function Search({ items }: { items: Item[] }) {
  const [query, setQuery] = useState('')
  const filtered = items.filter(item => fuzzyMatch(item, query))

  return (
    <>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      <ResultsList results={filtered} />
    </>
  )
}

// ---- test scaffolding (not part of the exercise) ----
type Item = { id: string; name: string }
declare function fuzzyMatch(item: Item, query: string): boolean
declare function ResultsList(props: any): null
export {}
