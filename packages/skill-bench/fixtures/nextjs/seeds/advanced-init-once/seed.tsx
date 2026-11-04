// SOURCE: skills/react-best-practices/rules/advanced-init-once.md
// HASH: 712069eb30de75cff0399d33a38dc898fe79f627f6fd5699cd3c84432a5407d0
'use client'

import { useEffect } from 'react'

export function Comp() {
  useEffect(() => {
    loadFromStorage()
    checkAuthToken()
  }, [])

  // ...
}

// ---- test scaffolding (not part of the exercise) ----
function loadFromStorage(): void {
  throw new Error('seed stand-in: loadFromStorage')
}

function checkAuthToken(): void {
  throw new Error('seed stand-in: checkAuthToken')
}
