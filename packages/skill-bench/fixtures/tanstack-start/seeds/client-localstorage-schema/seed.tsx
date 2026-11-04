// SOURCE: skills/react-best-practices/rules/client-localstorage-schema.md
// HASH: 5cd00df273fa50a60081be2e239c6eb2f43affde58c25725788d9d857f0fd9f3
// No version, stores everything, no error handling
localStorage.setItem('userConfig', JSON.stringify(fullUserObject))
const data = localStorage.getItem('userConfig')

// ---- test scaffolding (not part of the exercise) ----
declare const fullUserObject: { id: string; name: string }
export {}
