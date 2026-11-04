// Example selection shared by gen-seeds.mjs and selftest-checks.mjs.
// Kept apart from lib/rules.mjs so both Tier 2 scripts agree on which example is the seed.
import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { parseRuleFile } from '../../../react-best-practices-build/src/parser.ts'
import { BENCH_DIR, fixtureDir, pickCorrectExample } from './rules.mjs'

export const SKILLS_ROOT = join(BENCH_DIR, '..', '..', 'skills')

// Whole-word match: "Incorrect (...)", "Wrong", "Bad". Mirrors pickCorrectExample's whole-word rule.
const INCORRECT_LABEL = /\b(?:incorrect|wrong|bad)\b/i

/** First example whose label says Incorrect/Wrong/Bad, or null. This is the seed for Tier 2. */
export function pickIncorrectExample(rule) {
  return rule.examples.find((ex) => INCORRECT_LABEL.test(ex.label)) ?? null
}

/** Parsed rule plus its picked Incorrect and Correct examples. */
export async function loadRuleExamples(skill, id) {
  const { rule } = await parseRuleFile(join(SKILLS_ROOT, skill, 'rules', `${id}.md`))
  return {
    rule,
    incorrect: pickIncorrectExample(rule),
    correct: pickCorrectExample(rule),
  }
}

/** fixtures/<fw>/seeds/<id>/seed.tsx */
export const seedDir = (fw, id) => join(fixtureDir(fw), 'seeds', id)
export const seedFile = (fw, id) => join(seedDir(fw, id), 'seed.tsx')
export const seedPromptFile = (fw, id) => join(seedDir(fw, id), 'prompt.md')
const seedManifestPath = (fw) => join(fixtureDir(fw), 'seeds.manifest.json')

/** { "<id>": { status: "auto" | "adapted", sourceHash } }. Empty object when the file is absent. */
export async function readSeedManifest(fw) {
  try {
    return JSON.parse(await readFile(seedManifestPath(fw), 'utf8'))
  } catch (err) {
    if (err.code === 'ENOENT') return {}
    throw err
  }
}

/** Writes the seed manifest with keys sorted so diffs stay small. */
export async function writeSeedManifest(fw, manifest) {
  const sorted = Object.fromEntries(
    Object.entries(manifest).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)),
  )
  await writeFile(seedManifestPath(fw), `${JSON.stringify(sorted, null, 2)}\n`)
}
