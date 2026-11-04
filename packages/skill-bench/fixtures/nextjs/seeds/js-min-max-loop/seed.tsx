// SOURCE: skills/react-best-practices/rules/js-min-max-loop.md
// HASH: 10c99bd22150000c686401f18778c9e96e99108490d9398a36ea99e995e396e7
interface Project {
  id: string
  name: string
  updatedAt: number
}

export function getLatestProject(projects: Project[]) {
  const sorted = [...projects].sort((a, b) => b.updatedAt - a.updatedAt)
  return sorted[0]
}
