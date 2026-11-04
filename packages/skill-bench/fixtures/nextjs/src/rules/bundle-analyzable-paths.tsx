// SOURCE: skills/react-best-practices/rules/bundle-analyzable-paths.md
// HASH: 11fb505bbb88fbcc8e9106d7224a4c5c2a5f427efb173c027bf3d9e3439672b8
// Each page path is a literal, so the bundler can resolve every chunk at build time.
// The fixture points both paths at the shared stand-in module.
const PAGE_MODULES = {
  home: () => import('./_shared'),
  settings: () => import('./_shared'),
} as const

export async function loadPage(pageName: keyof typeof PAGE_MODULES) {
  const Page = await PAGE_MODULES[pageName]()
  return Page
}
