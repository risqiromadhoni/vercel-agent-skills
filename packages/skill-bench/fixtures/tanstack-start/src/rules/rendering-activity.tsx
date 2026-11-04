// SOURCE: skills/react-best-practices/rules/rendering-activity.md
// HASH: 145eaff7fdcf1715b30c90523d818bc1f16b1907c26d808cd391884b63b9797e
import { Activity } from 'react'

function ExpensiveMenu() {
  return (
    <ul role="menu">
      <li>Expensive menu</li>
    </ul>
  )
}

export function Dropdown({ isOpen }: { isOpen: boolean }) {
  return (
    <Activity mode={isOpen ? 'visible' : 'hidden'}>
      <ExpensiveMenu />
    </Activity>
  )
}
