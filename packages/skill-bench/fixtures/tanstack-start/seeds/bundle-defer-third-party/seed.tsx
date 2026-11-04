// SOURCE: skills/react-best-practices/rules/bundle-defer-third-party.md
// HASH: ad58091323c22a24617315125a8791e55cada7ea19f2b51741d1bd0f11fb3cbf
// Next original: app/layout.tsx RootLayout. TanStack: the root document in src/routes/__root.tsx.
// @ts-expect-error -- stand-in: @vercel/analytics is not installed in this fixture
import { Analytics } from '@vercel/analytics/react'
import * as React from 'react'

export function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
