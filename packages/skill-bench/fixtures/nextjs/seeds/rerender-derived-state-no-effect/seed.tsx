// SOURCE: skills/react-best-practices/rules/rerender-derived-state-no-effect.md
// HASH: a9cd01385decbc4aa139514aeab6cc08f3dfbcab0ed03fa3dbb18e0a2a7d391c
'use client'

import { useEffect, useState } from 'react'

export function Form() {
  const [firstName, setFirstName] = useState('First')
  const [lastName, setLastName] = useState('Last')
  const [fullName, setFullName] = useState('')

  useEffect(() => {
    setFullName(firstName + ' ' + lastName)
  }, [firstName, lastName])

  return <p>{fullName}</p>
}
