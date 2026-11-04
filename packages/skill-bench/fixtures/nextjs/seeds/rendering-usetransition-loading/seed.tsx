// SOURCE: skills/react-best-practices/rules/rendering-usetransition-loading.md
// HASH: 362ed5c207ff61c014498d5ed377be895d721c7f66b062e722c0495fa4e42e36
'use client'

import { useState } from 'react'

export function SearchResults() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Result[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async (value: string) => {
    setIsLoading(true)
    setQuery(value)
    const data = await fetchResults(value)
    setResults(data)
    setIsLoading(false)
  }

  return (
    <>
      <input onChange={(e) => handleSearch(e.target.value)} />
      {isLoading && <Spinner />}
      <ResultsList results={results} />
    </>
  )
}

// ---- test scaffolding (not part of the exercise) ----
interface Result {
  id: string
  title: string
}

async function fetchResults(_query: string): Promise<Result[]> {
  throw new Error('seed stand-in: fetchResults')
}

function Spinner() {
  return <span>Loading</span>
}

function ResultsList({ results }: { results: Result[] }) {
  return <ul>{results.map((r) => <li key={r.id}>{r.title}</li>)}</ul>
}
