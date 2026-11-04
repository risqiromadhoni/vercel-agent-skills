// SOURCE: skills/react-best-practices/rules/rendering-resource-hints.md
// HASH: 2a16cbaa6f52b08d08b6bc05dbeb05e67a86052200d7f223290fa1b29309bc54
import { preconnect, prefetchDNS } from 'react-dom'

export default function App() {
  prefetchDNS('https://analytics.example.com')
  preconnect('https://api.example.com')

  return <main>{/* content */}</main>
}
