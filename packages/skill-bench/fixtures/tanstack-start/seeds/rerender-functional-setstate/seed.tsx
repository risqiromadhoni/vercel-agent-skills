// SOURCE: skills/react-best-practices/rules/rerender-functional-setstate.md
// HASH: 595b0f17fa318b932586694c1575b4c16122e86b4c3a8eeaf835f5dbd36a59a5
import { useCallback, useState } from 'react'

function TodoList() {
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
type Item = { id: string; name: string }
declare const initialItems: Item[]
declare function ItemsEditor(props: any): null
export {}
