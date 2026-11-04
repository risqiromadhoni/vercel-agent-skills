// SOURCE: skills/react-best-practices/rules/rerender-derived-state.md
// HASH: f37aa17f64a492a78ca2aa0cd61f99ed5957e2bcbfe793369be973404be75fc0
function Sidebar() {
  const width = useWindowWidth()  // updates continuously
  const isMobile = width < 768
  return <nav className={isMobile ? 'mobile' : 'desktop'} />
}

// ---- test scaffolding (not part of the exercise) ----
declare function useWindowWidth(): number
export {}
