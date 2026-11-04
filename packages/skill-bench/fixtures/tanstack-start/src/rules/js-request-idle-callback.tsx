// SOURCE: skills/react-best-practices/rules/js-request-idle-callback.md
// HASH: 46707c2c8bfcae9138483b51365c5b31c07f5e017970099883b823dcf00e19a3
import { useState } from 'react'
import { analytics, prefetchTopResults, saveToRecentSearches, searchItems, type Item } from './_shared'

export function SearchBox() {
  const [, setResults] = useState<Item[]>([])

  function handleSearch(query: string) {
    const results = searchItems(query)
    setResults(results)

    // Defer non-critical work to idle periods
    requestIdleCallback(() => {
      analytics.track('search', { query })
    })

    requestIdleCallback(() => {
      saveToRecentSearches(query)
    })

    requestIdleCallback(() => {
      prefetchTopResults(results.slice(0, 3))
    })
  }

  return <input onChange={(e) => handleSearch(e.target.value)} />
}
