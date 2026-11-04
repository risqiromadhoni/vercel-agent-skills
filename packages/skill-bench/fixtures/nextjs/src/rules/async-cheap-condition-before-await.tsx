// SOURCE: skills/react-best-practices/rules/async-cheap-condition-before-await.md
// HASH: b4cfe21bad5da504bcc8a00817862086fbc18bf385ed20fe83e44087cbd37ed8
export async function checkFlag(someCondition: boolean) {
  if (someCondition) {
    const someFlag = await getFlag()
    if (someFlag) {
      // ...
    }
  }
}

// Stand-in for the flag lookup.
async function getFlag() {
  return false
}
