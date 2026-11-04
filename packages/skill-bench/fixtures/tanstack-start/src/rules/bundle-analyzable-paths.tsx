// SOURCE: skills/react-best-practices/rules/bundle-analyzable-paths.md
// HASH: 11fb505bbb88fbcc8e9106d7224a4c5c2a5f427efb173c027bf3d9e3439672b8
// Next original: the same literal import() specifiers under Turbopack/webpack. Vite resolves literal
// specifiers statically too, so the pattern carries over unchanged. Targets are real route modules here.
const PAGE_MODULES = {
  home: () => import('../routes/index'),
  settings: () => import('../routes/rules/index'),
} as const

export async function loadPage(pageName: keyof typeof PAGE_MODULES) {
  const Page = await PAGE_MODULES[pageName]()
  return Page
}
