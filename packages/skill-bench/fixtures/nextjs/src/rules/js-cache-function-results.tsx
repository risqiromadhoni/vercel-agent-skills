// SOURCE: skills/react-best-practices/rules/js-cache-function-results.md
// HASH: 0d0cab7ad6b84d2c1edeb30e4ecf9396586068591ff2e2d0d56d79b0725cd1c2
import type { Project } from './_shared'

// Module-level cache
const slugifyCache = new Map<string, string>()

// Stand-in for the slug function the example assumes.
function slugify(text: string): string {
  return text.toLowerCase().replace(/\s+/g, '-')
}

function cachedSlugify(text: string): string {
  if (slugifyCache.has(text)) {
    return slugifyCache.get(text)!
  }
  const result = slugify(text)
  slugifyCache.set(text, result)
  return result
}

export function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <div>
      {projects.map(project => {
        // Computed only once per unique project name
        const slug = cachedSlugify(project.name)

        return <ProjectCard key={project.id} slug={slug} />
      })}
    </div>
  )
}

// Stand-in for the card the example renders.
function ProjectCard(_props: { slug: string }) {
  return null
}
