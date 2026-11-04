// SOURCE: skills/react-best-practices/rules/js-length-check-first.md
// HASH: cb763540f1887b86378eeef4f3e85fdc3db50320d37aa8cc852576c4f30c754d

export function hasChanges(current: string[], original: string[]) {
  // Early return if lengths differ
  if (current.length !== original.length) {
    return true
  }
  // Only sort when lengths match
  const currentSorted = current.toSorted()
  const originalSorted = original.toSorted()
  for (let i = 0; i < currentSorted.length; i++) {
    if (currentSorted[i] !== originalSorted[i]) {
      return true
    }
  }
  return false
}
