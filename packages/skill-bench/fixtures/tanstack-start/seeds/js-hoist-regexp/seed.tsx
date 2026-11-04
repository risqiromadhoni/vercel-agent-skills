// SOURCE: skills/react-best-practices/rules/js-hoist-regexp.md
// HASH: de9f7603f3c005106417d32ef9c23221c1fe0885260702152b3901fc192c2998
function Highlighter({ text, query }: Props) {
  const regex = new RegExp(`(${query})`, 'gi')
  const parts = text.split(regex)
  return <>{parts.map((part, i) => i % 2 === 1 ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>)}</>
}

// ---- test scaffolding (not part of the exercise) ----
type Props = { text: string; query: string }
export {}
