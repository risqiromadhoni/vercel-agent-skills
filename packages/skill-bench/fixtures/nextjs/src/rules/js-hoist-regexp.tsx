// SOURCE: skills/react-best-practices/rules/js-hoist-regexp.md
// HASH: 38bfda27e1a588eab9c79c3a4ee66617a850256a6eda2096d3be1a4319d5b68f
'use client'

import { useMemo } from 'react'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Stand-in: escapes regex metacharacters so the query can be used in a RegExp.
function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

type Props = { text: string; query: string }

export function Highlighter({ text, query }: Props) {
  const regex = useMemo(
    () => new RegExp(`(${escapeRegex(query)})`, 'gi'),
    [query]
  )
  const parts = text.split(regex)
  // split() with a capture group puts the matches at odd indexes.
  return <>{parts.map((part, i) => i % 2 === 1 ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>)}</>
}
