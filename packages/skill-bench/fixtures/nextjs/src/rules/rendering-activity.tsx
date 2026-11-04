// SOURCE: skills/react-best-practices/rules/rendering-activity.md
// HASH: 145eaff7fdcf1715b30c90523d818bc1f16b1907c26d808cd391884b63b9797e
import { Activity } from 'react'

type Props = { isOpen: boolean }

export function Dropdown({ isOpen }: Props) {
  return (
    <Activity mode={isOpen ? 'visible' : 'hidden'}>
      <ExpensiveMenu />
    </Activity>
  )
}

// Stand-in for the menu the example hides.
function ExpensiveMenu() {
  return <ul />
}
