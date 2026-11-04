// SOURCE: skills/react-best-practices/rules/rerender-defer-reads.md
// HASH: f596745308185385a8776534cb94ceba30de9ca0fa0c03f4f824fc5ab262affc
function ShareButton({ chatId }: { chatId: string }) {
  const searchParams = useSearchParams()

  const handleShare = () => {
    const ref = searchParams.get('ref')
    shareChat(chatId, { ref })
  }

  return <button onClick={handleShare}>Share</button>
}

// ---- test scaffolding (not part of the exercise) ----
// Stand-in for the search-params hook the anti-pattern subscribes to on every render.
declare function useSearchParams(): URLSearchParams
declare function shareChat(chatId: string, options: { ref: string | null }): void
export {}
