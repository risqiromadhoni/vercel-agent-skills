// SOURCE: skills/react-best-practices/rules/js-cache-storage.md
// HASH: 03d4071805c49c62aa4938577ff64c978271ac27fcb321bfbbeb067cb301ad0a
const storageCache = new Map<string, string | null>()

export function getLocalStorage(key: string) {
  if (!storageCache.has(key)) {
    storageCache.set(key, localStorage.getItem(key))
  }
  return storageCache.get(key)
}

export function setLocalStorage(key: string, value: string) {
  localStorage.setItem(key, value)
  storageCache.set(key, value)  // keep cache in sync
}
