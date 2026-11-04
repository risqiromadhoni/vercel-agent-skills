// SOURCE: skills/react-best-practices/rules/async-cheap-condition-before-await.md
// HASH: ee3eb45bd29317f7d8533d81cbc5d10cfbbcbce7916a9c8703a170163619d3fd
const someFlag = await getFlag()

if (someFlag && someCondition) {
  // ...
}

// ---- test scaffolding (not part of the exercise) ----
declare function getFlag(): Promise<boolean>
declare const someCondition: boolean
export {}
