// SOURCE: skills/react-best-practices/rules/rendering-script-defer-async.md
// HASH: d6bfdcdbe1f8fcc2a4a9e9bbc97064286b2f0befa65bed9bc950389364d10b1c
// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Independent script - use async */}
        <script src="https://example.com/analytics.js" async />
        {/* DOM-dependent script - use defer */}
        <script src="/scripts/utils.js" defer />
      </head>
      <body>{children}</body>
    </html>
  )
}
