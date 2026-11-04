// SOURCE: skills/react-best-practices/rules/rerender-defer-reads.md
// HASH: f59c3c72d19ad07388fb918f67efa11c4bc3f3fefee982ff6d5a253c8555aef8
function shareChat(_chatId: string, _options: { ref: string | null }) {}

export function ShareButton({ chatId }: { chatId: string }) {
  const handleShare = () => {
    const params = new URLSearchParams(window.location.search)
    const ref = params.get('ref')
    shareChat(chatId, { ref })
  }

  return <button onClick={handleShare}>Share</button>
}
