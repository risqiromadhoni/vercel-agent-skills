// SOURCE: skills/react-best-practices/rules/rendering-script-defer-async.md
// HASH: a4b9dd74e626a49ce841db8e65504510280ecfc2b757ec57aa997b81c5d075fa
// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
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
