// SOURCE: skills/react-best-practices/rules/rendering-hoist-jsx.md
// HASH: 255f834136a32831c328f35cf180c538ce2d6a3456c0a78a0bd74bf487a5ae9f
export function LoadingSkeleton() {
  return <div className="animate-pulse h-20 bg-gray-200" />
}

export function Container({ loading }: { loading: boolean }) {
  return (
    <div>
      {loading && <LoadingSkeleton />}
    </div>
  )
}
