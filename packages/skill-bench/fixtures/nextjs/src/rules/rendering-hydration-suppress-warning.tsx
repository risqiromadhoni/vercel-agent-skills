// SOURCE: skills/react-best-practices/rules/rendering-hydration-suppress-warning.md
// HASH: feb4ed180c1f2885dfcb07236af7ff5c677580b124ded34f9478e1afc3c3701c
export function Timestamp() {
  return (
    <span suppressHydrationWarning>
      {new Date().toLocaleString()}
    </span>
  )
}
