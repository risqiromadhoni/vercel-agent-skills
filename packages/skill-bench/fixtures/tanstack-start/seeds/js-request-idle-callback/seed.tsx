// SOURCE: skills/react-best-practices/rules/js-request-idle-callback.md
// HASH: 581eab836d55bc901f23d69f25f454b7e47c06f31d24392b92f20699c34ff8c2
function handleSearch(query: string) {
  const results = searchItems(query)
  setResults(results)

  // These block the main thread immediately
  analytics.track('search', { query })
  saveToRecentSearches(query)
  prefetchTopResults(results.slice(0, 3))
}

// ---- test scaffolding (not part of the exercise) ----
type Item = { id: string }
declare function searchItems(query: string): Item[]
declare function setResults(items: Item[]): void
declare const analytics: { track(name: string, props: object): void }
declare function saveToRecentSearches(query: string): void
declare function prefetchTopResults(items: Item[]): void
export {}
