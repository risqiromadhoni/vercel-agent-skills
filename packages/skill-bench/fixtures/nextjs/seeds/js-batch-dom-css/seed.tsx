// SOURCE: skills/react-best-practices/rules/js-batch-dom-css.md
// HASH: 8e2b1b494ec35d2bdd8d279c68c8b0cfe7859fe89123f8436ae17ce58f9dec73
export function layoutThrashing(element: HTMLElement) {
  element.style.width = '100px'
  const width = element.offsetWidth  // Forces reflow
  element.style.height = '200px'
  const height = element.offsetHeight  // Forces another reflow
}
