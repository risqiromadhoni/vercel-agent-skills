// SOURCE: skills/react-best-practices/rules/js-batch-dom-css.md
// HASH: c2529ad08407ed47a99d1dea8b224685f2b48ba71502efb9dca5a36e9d811b2c
export function updateElementStyles(element: HTMLElement) {
  // Batch all writes together
  element.style.width = '100px'
  element.style.height = '200px'
  element.style.backgroundColor = 'blue'
  element.style.border = '1px solid black'

  // Read after all writes are done (single reflow)
  const { width, height } = element.getBoundingClientRect()
}
