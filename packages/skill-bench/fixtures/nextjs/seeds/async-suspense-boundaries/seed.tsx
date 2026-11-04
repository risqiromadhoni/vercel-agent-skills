// SOURCE: skills/react-best-practices/rules/async-suspense-boundaries.md
// HASH: 060b98e3d0e15eb8bf5526152740d25a5b86f070c0e756cfa6634e544bdda92f
export async function Page() {
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
async function fetchData(): Promise<string> {
  throw new Error('seed stand-in: fetchData')
}

function DataDisplay({ data }: { data: string }) {
  return <p>{data}</p>
}
