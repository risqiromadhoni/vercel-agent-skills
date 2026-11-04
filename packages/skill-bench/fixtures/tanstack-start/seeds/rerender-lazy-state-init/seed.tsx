// SOURCE: skills/react-best-practices/rules/rerender-lazy-state-init.md
// HASH: fca2eb0bee6ad7ffa3de6628f600ee75ee5aaa1b023012c629df95c8ea27875f
import { useState } from 'react'

function FilteredList({ items }: { items: Item[] }) {
  // buildSearchIndex() runs on EVERY render, even after initialization
  const [searchIndex, setSearchIndex] = useState(buildSearchIndex(items))
  const [query, setQuery] = useState('')

  // When query changes, buildSearchIndex runs again unnecessarily
  return <SearchResults index={searchIndex} query={query} />
}

function UserProfile() {
  // JSON.parse runs on every render
  const [settings, setSettings] = useState(
    JSON.parse(localStorage.getItem('settings') || '{}')
  )

  return <SettingsForm settings={settings} onChange={setSettings} />
}

// ---- test scaffolding (not part of the exercise) ----
type Item = { id: string }
declare function buildSearchIndex(items: Item[]): unknown
declare function SearchResults(props: any): null
declare function SettingsForm(props: any): null
export {}
