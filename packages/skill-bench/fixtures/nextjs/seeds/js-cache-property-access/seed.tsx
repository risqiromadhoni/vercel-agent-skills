// SOURCE: skills/react-best-practices/rules/js-cache-property-access.md
// HASH: dab6b18a975689f763c5fef226922af490c0eae4d16fbece9213e21305fb7df0
export function processAll(arr: unknown[], obj: Config) {
  for (let i = 0; i < arr.length; i++) {
    processValue(obj.config.settings.value)
  }
}

// ---- test scaffolding (not part of the exercise) ----
interface Config {
  config: { settings: { value: number } }
}

function processValue(_value: number): void {
  throw new Error('seed stand-in: processValue')
}
