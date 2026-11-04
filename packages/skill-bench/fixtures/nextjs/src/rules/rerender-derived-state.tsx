// SOURCE: skills/react-best-practices/rules/rerender-derived-state.md
// HASH: bffe74c0fba74d37220a434afc046bec1547d066d4c7cff69418f8dfd21cd221
'use client'

export function Sidebar() {
  const isMobile = useMediaQuery('(max-width: 767px)')
  return <nav className={isMobile ? 'mobile' : 'desktop'} />
}

// Stand-in for the media-query hook the example assumes.
function useMediaQuery(_query: string): boolean {
  return false
}
