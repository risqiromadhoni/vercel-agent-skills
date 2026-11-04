// SOURCE: skills/react-best-practices/rules/js-hoist-regexp.md
// HASH: 38bfda27e1a588eab9c79c3a4ee66617a850256a6eda2096d3be1a4319d5b68f
import { useMemo } from 'react'

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Escapes regex metacharacters so user input can be used inside new RegExp().
function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

type Props = { text: string; query: string }

export function Highlighter({ text, query }: Props) {
  const regex = useMemo(
    () => new RegExp(`(${escapeRegex(query)})`, 'gi'),
    [query]
  )
  // split() with a capture group alternates: odd indexes are the matches.
  const parts = text.split(regex)
  return <>{parts.map((part, i) => i % 2 === 1 ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>)}</>
}
