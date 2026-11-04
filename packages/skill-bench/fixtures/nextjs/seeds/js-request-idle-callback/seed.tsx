// SOURCE: skills/react-best-practices/rules/js-request-idle-callback.md
// HASH: 581eab836d55bc901f23d69f25f454b7e47c06f31d24392b92f20699c34ff8c2
export function handleSearch(query: string) {
  const results = searchItems(query)
  setResults(results)

  // These block the main thread immediately
  analytics.track('search', { query })
  saveToRecentSearches(query)
  prefetchTopResults(results.slice(0, 3))
}

// ---- test scaffolding (not part of the exercise) ----
interface Result {
  id: string
  title: string
}

function searchItems(_query: string): Result[] {
  throw new Error('seed stand-in: searchItems')
}

function setResults(_results: Result[]): void {
  throw new Error('seed stand-in: setResults')
}

const analytics = {
  track(_event: string, _props: { query: string }): void {
    throw new Error('seed stand-in: analytics.track')
  },
}

function saveToRecentSearches(_query: string): void {
  throw new Error('seed stand-in: saveToRecentSearches')
}

function prefetchTopResults(_results: Result[]): void {
  throw new Error('seed stand-in: prefetchTopResults')
}
