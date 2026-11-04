// SOURCE: skills/react-best-practices/rules/rendering-hydration-suppress-warning.md
// HASH: 83d119fd246daf63e8270f2244ece630cda6b1b77ae7ac7215f9e44e905a4129
function Timestamp() {
  return <span>{new Date().toLocaleString()}</span>
}

export { Timestamp }
