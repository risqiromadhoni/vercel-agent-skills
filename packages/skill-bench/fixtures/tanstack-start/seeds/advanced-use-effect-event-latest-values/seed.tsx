// SOURCE: skills/react-best-practices/rules/advanced-use-effect-event-latest-values.md
// HASH: e26f2e26f6be08d52f6654bd79f46f5fdda737709d16966d212ef63771d71c42
import { useEffect, useState } from 'react'

function SearchInput({ onSearch }: { onSearch: (q: string) => void }) {
  const [query, setQuery] = useState('')

  useEffect(() => {
    const timeout = setTimeout(() => onSearch(query), 300)
    return () => clearTimeout(timeout)
  }, [query, onSearch])
}

export {}
