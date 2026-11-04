// SOURCE: skills/react-best-practices/rules/js-cache-storage.md
// HASH: 9f1fc4bfd0548747f931532bc5211fc898337bf15dd6801c1195162884f15169
function getTheme() {
  return localStorage.getItem('theme') ?? 'light'
}
// Called 10 times = 10 storage reads

export {}
