// SOURCE: skills/react-best-practices/rules/advanced-init-once.md
// HASH: 6a9a97a8def866a810a68669df512872cd7fa5f5d7d07efc6f5aa23914018762
import { useEffect } from 'react'
import { checkAuthToken, loadFromStorage } from './_shared'

let didInit = false

export function Comp() {
  useEffect(() => {
    if (didInit) return
    didInit = true
    loadFromStorage()
    checkAuthToken()
  }, [])

  // ...
}
