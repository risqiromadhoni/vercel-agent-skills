// SOURCE: skills/react-best-practices/rules/rerender-move-effect-to-event.md
// HASH: 4b19fc60ab9ea962a73d0f0a50b37d09d7ccb9b6359e1a9dafc37a2f2b296e6d
'use client'

import { createContext, useContext, useEffect, useState } from 'react'

export function Form() {
  const [submitted, setSubmitted] = useState(false)
  const theme = useContext(ThemeContext)

  useEffect(() => {
    if (submitted) {
      post('/api/register')
      showToast('Registered', theme)
    }
  }, [submitted, theme])

  return <button onClick={() => setSubmitted(true)}>Submit</button>
}

// ---- test scaffolding (not part of the exercise) ----
const ThemeContext = createContext<'light' | 'dark'>('light')

function post(_url: string): void {
  throw new Error('seed stand-in: post')
}

function showToast(_message: string, _theme: 'light' | 'dark'): void {
  throw new Error('seed stand-in: showToast')
}
