// SOURCE: skills/react-best-practices/rules/js-cache-property-access.md
// HASH: f8d5cf10965b457f2406d1d15756a5cdd417c4cad00da916d5a3c84fec064c83
// Stand-in for the function the example calls once per item.
function processValue(_value: unknown) {}

export function cachePropertyAccess(obj: { config: { settings: { value: number } } }, arr: unknown[]) {
  const value = obj.config.settings.value
  const len = arr.length
  for (let i = 0; i < len; i++) {
    processValue(value)
  }
}
