// SOURCE: skills/react-best-practices/rules/rendering-usetransition-loading.md
// HASH: 5f6d75dd0a0e05c4ffbf5246cb4bdea9ac4c6fa358bef59025f476177e20b52b
import { useTransition, useState } from 'react'
import { ResultsList, Spinner, fetchResults, type Item } from './_shared'

export function SearchResults() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Item[]>([])
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
