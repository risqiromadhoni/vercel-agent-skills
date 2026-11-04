// SOURCE: skills/react-best-practices/rules/rendering-usetransition-loading.md
// HASH: 362ed5c207ff61c014498d5ed377be895d721c7f66b062e722c0495fa4e42e36
import { useState } from 'react'

function SearchResults() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Item[]>([])
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
type Item = { id: string; name: string }
declare function fetchResults(query: string): Promise<Item[]>
declare function Spinner(props: any): null
declare function ResultsList(props: any): null
export {}
