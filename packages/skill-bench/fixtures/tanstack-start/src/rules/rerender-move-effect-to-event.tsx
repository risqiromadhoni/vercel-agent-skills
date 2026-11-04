// SOURCE: skills/react-best-practices/rules/rerender-move-effect-to-event.md
// HASH: 9c3aab64fa49c58f7989590c25f3753cfc8233237266183db79be14ec452e2ea
import { createContext, useContext } from 'react'

const ThemeContext = createContext('light')

function post(_url: string): void {}

function showToast(_message: string, _theme: string): void {}

export function Form() {
  const theme = useContext(ThemeContext)

  function handleSubmit() {
    post('/api/register')
    showToast('Registered', theme)
  }

  return <button onClick={handleSubmit}>Submit</button>
}
