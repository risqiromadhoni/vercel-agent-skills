// SOURCE: skills/react-best-practices/rules/async-suspense-boundaries.md
// HASH: 060b98e3d0e15eb8bf5526152740d25a5b86f070c0e756cfa6634e544bdda92f
async function Page() {
  const data = await fetchData() // Blocks entire page

  return (
    <div>
      <div>Sidebar</div>
      <div>Header</div>
      <div>
        <DataDisplay data={data} />
      </div>
      <div>Footer</div>
    </div>
  )
}

// ---- test scaffolding (not part of the exercise) ----
declare function fetchData(): Promise<{ content: string }>
declare function DataDisplay(props: any): null
export {}
