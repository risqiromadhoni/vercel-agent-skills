// SOURCE: skills/react-best-practices/rules/bundle-dynamic-imports.md
// HASH: b3c1944715368184283a50177470dcd177461e80968951ee0242d9aa23c5bbdb
// @ts-expect-error -- stand-in: ./monaco-editor does not exist in this fixture
import { MonacoEditor } from './monaco-editor'

function CodePanel({ code }: { code: string }) {
  return <MonacoEditor value={code} />
}
