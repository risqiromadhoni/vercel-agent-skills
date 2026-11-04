// SOURCE: skills/react-best-practices/rules/advanced-use-effect-event-latest-values.md
// HASH: 9fba22fce3e3949f47d4ecd702e1918804bbf9ef7f3adc7cfd2fb0ef5280ca53
'use client'

import { useEffect, useEffectEvent, useState } from 'react';

export function SearchInput({ onSearch }: { onSearch: (q: string) => void }) {
  const [query, setQuery] = useState('')
  const onSearchEvent = useEffectEvent(onSearch)

  useEffect(() => {
    const timeout = setTimeout(() => onSearchEvent(query), 300)
    return () => clearTimeout(timeout)
  }, [query])
}
