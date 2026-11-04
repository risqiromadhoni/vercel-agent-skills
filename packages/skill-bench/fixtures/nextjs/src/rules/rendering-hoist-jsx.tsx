// SOURCE: skills/react-best-practices/rules/rendering-hoist-jsx.md
// HASH: 5aad2ad3159837940ff9475e2815c11d928d0bf205e25f4d0b7c83caf81bb6d6
const loadingSkeleton = (
  <div className="animate-pulse h-20 bg-gray-200" />
)

export function Container({ loading }: { loading: boolean }) {
  return (
    <div>
      {loading && loadingSkeleton}
    </div>
  )
}
