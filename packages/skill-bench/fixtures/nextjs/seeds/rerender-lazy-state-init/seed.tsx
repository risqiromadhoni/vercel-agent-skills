// SOURCE: skills/react-best-practices/rules/rerender-lazy-state-init.md
// HASH: fca2eb0bee6ad7ffa3de6628f600ee75ee5aaa1b023012c629df95c8ea27875f
'use client'

import { useState } from 'react'

export function FilteredList({ items }: { items: Item[] }) {
  // buildSearchIndex() runs on EVERY render, even after initialization
  const [searchIndex, setSearchIndex] = useState(buildSearchIndex(items))
  const [query, setQuery] = useState('')

  // When query changes, buildSearchIndex runs again unnecessarily
  return <SearchResults index={searchIndex} query={query} />
}

export function UserProfile() {
  // JSON.parse runs on every render
  const [settings, setSettings] = useState(
    JSON.parse(localStorage.getItem('settings') || '{}')
  )

  return <SettingsForm settings={settings} onChange={setSettings} />
}

// ---- test scaffolding (not part of the exercise) ----
interface Item {
  id: string
}

interface SearchIndex {
  size: number
}

function buildSearchIndex(_items: Item[]): SearchIndex {
  throw new Error('seed stand-in: buildSearchIndex')
}

function SearchResults(_props: { index: SearchIndex; query: string }) {
  return null
}

function SettingsForm(_props: { settings: unknown; onChange: (value: unknown) => void }) {
  return null
}
