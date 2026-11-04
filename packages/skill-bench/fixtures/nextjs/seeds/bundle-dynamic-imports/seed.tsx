// SOURCE: skills/react-best-practices/rules/bundle-dynamic-imports.md
// HASH: b3c1944715368184283a50177470dcd177461e80968951ee0242d9aa23c5bbdb
// @ts-expect-error -- the fixture has no ./monaco-editor module; the static import is the anti-pattern under review
import { MonacoEditor } from './monaco-editor'

export function CodePanel({ code }: { code: string }) {
  return <MonacoEditor value={code} />
}
