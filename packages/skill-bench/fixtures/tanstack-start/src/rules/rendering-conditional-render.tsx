// SOURCE: skills/react-best-practices/rules/rendering-conditional-render.md
// HASH: 148fdd772143ac10944a034e27ad956ab290174ca0f1f7d16feee345962cb752
export function Badge({ count }: { count: number }) {
  return (
    <div>
      {count > 0 ? <span className="badge">{count}</span> : null}
    </div>
  )
}

// When count = 0, renders: <div></div>
// When count = 5, renders: <div><span class="badge">5</span></div>
