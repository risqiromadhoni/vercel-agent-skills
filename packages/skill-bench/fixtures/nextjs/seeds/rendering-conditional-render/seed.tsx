// SOURCE: skills/react-best-practices/rules/rendering-conditional-render.md
// HASH: 77a2ba73953731e6f80b29d4630e8708fb1c0d750df3c3381d7681dd40f85896
export function Badge({ count }: { count: number }) {
  return (
    <div>
      {count && <span className="badge">{count}</span>}
    </div>
  )
}

// When count = 0, renders: <div>0</div>
// When count = 5, renders: <div><span class="badge">5</span></div>
