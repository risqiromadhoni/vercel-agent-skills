// SOURCE: skills/react-best-practices/rules/rendering-script-defer-async.md
// HASH: a4b9dd74e626a49ce841db8e65504510280ecfc2b757ec57aa997b81c5d075fa
// Next original: app/layout.tsx RootLayout (next/head-less root). TanStack: the root document in src/routes/__root.tsx.
import * as React from 'react'

export function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script src="https://example.com/analytics.js" />
        <script src="/scripts/utils.js" />
      </head>
      <body>{children}</body>
    </html>
  )
}
