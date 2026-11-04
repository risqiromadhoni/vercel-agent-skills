// SOURCE: skills/react-best-practices/rules/bundle-preload.md
// HASH: d99ea7be4f62cf900138fda2436ea55d9f19a5b888200fc5fdaf2ea310c32597
export function EditorButton({ onClick }: { onClick: () => void }) {
  const preload = () => {
    if (typeof window !== 'undefined') {
      void import('./_shared')
    }
  }

  return (
    <button
      onMouseEnter={preload}
      onFocus={preload}
      onClick={onClick}
    >
      Open Editor
    </button>
  )
}
