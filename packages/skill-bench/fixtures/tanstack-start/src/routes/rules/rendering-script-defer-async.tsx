// Next original: app/layout.tsx RootLayout rendered <script async> and <script defer> in <head>.
// TanStack equivalent: the route's head() scripts. async and defer are passed through as script attributes.
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/rules/rendering-script-defer-async')({
  head: () => ({
    scripts: [
      // Independent script: async, runs as soon as it downloads
      { src: 'https://example.com/analytics.js', async: true },
      // DOM-dependent script: defer, runs after the document is parsed
      { src: '/scripts/utils.js', defer: true },
    ],
  }),
  component: RenderingScriptDeferAsync,
})

function RenderingScriptDeferAsync() {
  return <main>Scripts for this route are declared in its head().</main>
}
