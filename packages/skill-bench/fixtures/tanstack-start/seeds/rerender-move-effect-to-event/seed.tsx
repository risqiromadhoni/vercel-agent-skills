// SOURCE: skills/react-best-practices/rules/rerender-move-effect-to-event.md
// HASH: 4b19fc60ab9ea962a73d0f0a50b37d09d7ccb9b6359e1a9dafc37a2f2b296e6d
import { createContext, useContext, useEffect, useState } from 'react'

function Form() {
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
const ThemeContext = createContext('light')
declare function post(url: string): void
declare function showToast(message: string, theme: string): void
export {}
