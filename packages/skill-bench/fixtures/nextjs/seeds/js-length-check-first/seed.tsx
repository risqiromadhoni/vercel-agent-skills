// SOURCE: skills/react-best-practices/rules/js-length-check-first.md
// HASH: ac7dfc89adf3774854a7f999fc5509f73f28c949c57d5f448c5516ab4f4ca5f5
export function hasChanges(current: string[], original: string[]) {
  // Always sorts and joins, even when lengths differ
  return current.sort().join() !== original.sort().join()
}
