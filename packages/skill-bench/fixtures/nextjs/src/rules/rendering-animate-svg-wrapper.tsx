// SOURCE: skills/react-best-practices/rules/rendering-animate-svg-wrapper.md
// HASH: 2aaaedea675fcc5bf73f90f0f2b106398b3af1a0ed6f1710646cf992448dd905
export function LoadingSpinner() {
  return (
    <div className="animate-spin">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="10" stroke="currentColor" />
      </svg>
    </div>
  )
}
