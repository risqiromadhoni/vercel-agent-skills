// SOURCE: skills/react-best-practices/rules/rendering-animate-svg-wrapper.md
// HASH: 3f9020339d3e9e2b84533eb5e0ec4815ea1bf57200d36313fa3ba16a6313ecd4
export function LoadingSpinner() {
  return (
    <svg
      className="animate-spin"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" />
    </svg>
  )
}
