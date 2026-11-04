import { createFileRoute } from '@tanstack/react-router'
import { rules } from '../../rules'

export const Route = createFileRoute('/rules/')({
  component: RulesPage,
})

function RulesPage() {
  return (
    <ul>
      {Object.keys(rules).map((id) => (
        <li key={id}>{id}</li>
      ))}
    </ul>
  )
}
