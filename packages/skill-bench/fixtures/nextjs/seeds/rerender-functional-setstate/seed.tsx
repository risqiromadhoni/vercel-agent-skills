// SOURCE: skills/react-best-practices/rules/rerender-functional-setstate.md
// HASH: 595b0f17fa318b932586694c1575b4c16122e86b4c3a8eeaf835f5dbd36a59a5
'use client'

import { useCallback, useState } from 'react'

export function TodoList() {
  const [items, setItems] = useState(initialItems)

  // Callback must depend on items, recreated on every items change
  const addItems = useCallback((newItems: Item[]) => {
    setItems([...items, ...newItems])
  }, [items])  // ❌ items dependency causes recreations

  // Risk of stale closure if dependency is forgotten
  const removeItem = useCallback((id: string) => {
    setItems(items.filter(item => item.id !== id))
  }, [])  // ❌ Missing items dependency - will use stale items!

  return <ItemsEditor items={items} onAdd={addItems} onRemove={removeItem} />
}

// ---- test scaffolding (not part of the exercise) ----
interface Item {
  id: string
}

const initialItems: Item[] = []

function ItemsEditor(_props: {
  items: Item[]
  onAdd: (items: Item[]) => void
  onRemove: (id: string) => void
}) {
  return null
}
