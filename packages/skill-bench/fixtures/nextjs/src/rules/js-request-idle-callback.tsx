// SOURCE: skills/react-best-practices/rules/js-request-idle-callback.md
// HASH: 46707c2c8bfcae9138483b51365c5b31c07f5e017970099883b823dcf00e19a3
export function handleSearch(query: string) {
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

// Stand-ins for the helpers the example assumes.
function searchItems(query: string): string[] {
  return [query]
}

function setResults(_results: string[]) {}

const analytics = {
  track(_event: string, _data: { query: string }) {},
}

function saveToRecentSearches(_query: string) {}

function prefetchTopResults(_results: string[]) {}
