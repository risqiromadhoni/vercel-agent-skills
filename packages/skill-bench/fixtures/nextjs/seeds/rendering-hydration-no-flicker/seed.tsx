// SOURCE: skills/react-best-practices/rules/rendering-hydration-no-flicker.md
// HASH: 7fc6c34fd90ba69ca71f33e0f5607d4fe13eb8dce87350719fa2b962fc2c6e5f
import type { ReactNode } from 'react'

export function ThemeWrapper({ children }: { children: ReactNode }) {
  // localStorage is not available on server - throws error
  const theme = localStorage.getItem('theme') || 'light'

  return (
    <div className={theme}>
      {children}
    </div>
  )
}
