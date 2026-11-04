// SOURCE: skills/react-best-practices/rules/rendering-usetransition-loading.md
// HASH: 5f6d75dd0a0e05c4ffbf5246cb4bdea9ac4c6fa358bef59025f476177e20b52b
'use client'

import { useTransition, useState } from 'react'
import { ResultsList, type Result } from './_shared'

// Stand-in for the search request.
async function fetchResults(_query: string): Promise<Result[]> {
  throw new Error('fixture stand-in: fetchResults')
}

// Stand-in for the pending indicator.
function Spinner() {
  return <p>Loading...</p>
}

export function SearchResults() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Result[]>([])
  const [isPending, startTransition] = useTransition()

  const handleSearch = (value: string) => {
    setQuery(value) // Update input immediately

    startTransition(async () => {
      // Fetch and update results
      const data = await fetchResults(value)
      // State updates after an await must be wrapped in another startTransition
      startTransition(() => {
        setResults(data)
      })
    })
  }

  return (
    <>
      <input onChange={(e) => handleSearch(e.target.value)} />
      {isPending && <Spinner />}
      <ResultsList results={results} />
    </>
  )
}
