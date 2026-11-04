// SOURCE: skills/react-best-practices/rules/rerender-functional-setstate.md
// HASH: e611eba5f9a96abe86e0e958421a518d3b354619630e0d0175f4beaa5cf2db6a
import { useCallback, useState } from 'react'
import type { Item } from './_shared'

const initialItems: Item[] = []

function ItemsEditor(_props: { items: Item[]; onAdd: (items: Item[]) => void; onRemove: (id: string) => void }) {
  return null
}

export function TodoList() {
  const [items, setItems] = useState(initialItems)

  // Stable callback, never recreated
  const addItems = useCallback((newItems: Item[]) => {
    setItems(curr => [...curr, ...newItems])
  }, [])  // ✅ No dependencies needed

  // Always uses latest state, no stale closure risk
  const removeItem = useCallback((id: string) => {
    setItems(curr => curr.filter(item => item.id !== id))
  }, [])  // ✅ Safe and stable

  return <ItemsEditor items={items} onAdd={addItems} onRemove={removeItem} />
}
