// SOURCE: skills/react-best-practices/rules/bundle-analyzable-paths.md
// HASH: a0ecd4f55b039e3108afec544c1566104055b2519e7346258a1b57f333452619
const PAGE_MODULES = {
  home: './pages/home',
  settings: './pages/settings',
} as const

export async function loadPage(pageName: keyof typeof PAGE_MODULES) {
  const Page = await import(PAGE_MODULES[pageName])
  return Page
}
