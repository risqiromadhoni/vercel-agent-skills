// SOURCE: skills/react-best-practices/rules/rerender-lazy-state-init.md
// HASH: 152ad70b2deef3341c930fd1957d4e50d0041cea8a9b156312080dbe31bb7e8b
'use client'

import { useState } from 'react'
import type { Item } from './_shared'

export function FilteredList({ items }: { items: Item[] }) {
  // buildSearchIndex() runs ONLY on initial render
  const [searchIndex, setSearchIndex] = useState(() => buildSearchIndex(items))
  const [query, setQuery] = useState('')

  return <SearchResults index={searchIndex} query={query} />
}

export function UserProfile() {
  // JSON.parse runs only on initial render
  const [settings, setSettings] = useState(() => {
    const stored = localStorage.getItem('settings')
    return stored ? JSON.parse(stored) : {}
  })

  return <SettingsForm settings={settings} onChange={setSettings} />
}

// Stand-ins for the index builder and components the example assumes.
function buildSearchIndex(items: Item[]): Item[] {
  return items
}

function SearchResults(_props: { index: Item[]; query: string }) {
  return null
}

function SettingsForm(_props: { settings: Record<string, unknown>; onChange: (value: unknown) => void }) {
  return null
}
