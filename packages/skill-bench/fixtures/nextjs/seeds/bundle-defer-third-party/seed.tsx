// SOURCE: skills/react-best-practices/rules/bundle-defer-third-party.md
// HASH: ad58091323c22a24617315125a8791e55cada7ea19f2b51741d1bd0f11fb3cbf
// @ts-expect-error -- the fixture has no @vercel/analytics package; the static import is the anti-pattern under review
import { Analytics } from '@vercel/analytics/react'
import type { ReactNode } from 'react'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
