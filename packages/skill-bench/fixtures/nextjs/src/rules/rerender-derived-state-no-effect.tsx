// SOURCE: skills/react-best-practices/rules/rerender-derived-state-no-effect.md
// HASH: 6f60aee34aef45003d202e9e2873ffd75036a3834be422255f2b718ac8c3e10f
'use client'

import { useState } from 'react'

export function Form() {
  const [firstName, setFirstName] = useState('First')
  const [lastName, setLastName] = useState('Last')
  const fullName = firstName + ' ' + lastName

  return <p>{fullName}</p>
}
