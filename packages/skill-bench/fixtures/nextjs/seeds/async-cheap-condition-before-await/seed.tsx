// SOURCE: skills/react-best-practices/rules/async-cheap-condition-before-await.md
// HASH: ee3eb45bd29317f7d8533d81cbc5d10cfbbcbce7916a9c8703a170163619d3fd
export async function checkFlag() {
  const someFlag = await getFlag()

  if (someFlag && someCondition) {
    // ...
  }
}

// ---- test scaffolding (not part of the exercise) ----
const someCondition = true

async function getFlag(): Promise<boolean> {
  throw new Error('seed stand-in: getFlag')
}
