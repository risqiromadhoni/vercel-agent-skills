// SOURCE: skills/react-best-practices/rules/js-cache-function-results.md
// HASH: 5f3443e9c90788b03c29d6acf6c54b8bc93c0690465a350c84b9b2d333e532d8
function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <div>
      {projects.map(project => {
        // slugify() called 100+ times for same project names
        const slug = slugify(project.name)

        return <ProjectCard key={project.id} slug={slug} />
      })}
    </div>
  )
}

// ---- test scaffolding (not part of the exercise) ----
type Project = { id: string; name: string }
declare function slugify(name: string): string
declare function ProjectCard(props: any): null
export {}
