// SOURCE: skills/react-best-practices/rules/js-cache-property-access.md
// HASH: dab6b18a975689f763c5fef226922af490c0eae4d16fbece9213e21305fb7df0
for (let i = 0; i < arr.length; i++) {
  processValue(obj.config.settings.value)
}

// ---- test scaffolding (not part of the exercise) ----
declare const arr: unknown[]
declare const obj: { config: { settings: { value: unknown } } }
declare function processValue(value: unknown): void
export {}
