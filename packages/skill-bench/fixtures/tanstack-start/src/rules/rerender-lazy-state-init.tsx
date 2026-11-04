// SOURCE: skills/react-best-practices/rules/rerender-lazy-state-init.md
// HASH: 152ad70b2deef3341c930fd1957d4e50d0041cea8a9b156312080dbe31bb7e8b
import { useState } from 'react'
import type { Item } from './_shared'

function buildSearchIndex(items: Item[]): Map<string, Item> {
  return new Map(items.map((item) => [item.id, item] as const))
}

function SearchResults({ index, query }: { index: Map<string, Item>; query: string }) {
  return <p>{index.size} indexed, query: {query}</p>
}

function SettingsForm({ settings, onChange }: { settings: Record<string, unknown>; onChange: (s: Record<string, unknown>) => void }) {
  return <button onClick={() => onChange({ ...settings })}>Save</button>
}

export function FilteredList({ items }: { items: Item[] }) {
  // buildSearchIndex() runs ONLY on initial render
  const [searchIndex, setSearchIndex] = useState(() => buildSearchIndex(items))
  const [query, setQuery] = useState('')

  return <SearchResults index={searchIndex} query={query} />
}

export function UserProfile() {
  // JSON.parse runs only on initial render
  const [settings, setSettings] = useState<Record<string, unknown>>(() => {
    const stored = localStorage.getItem('settings')
    return stored ? JSON.parse(stored) : {}
  })

  return <SettingsForm settings={settings} onChange={setSettings} />
}
