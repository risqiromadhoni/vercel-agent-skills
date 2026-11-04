#!/usr/bin/env node
// Writes Tier 2 seeds: fixtures/<fw>/seeds/<rule-id>/seed.tsx (the rule's first Incorrect
// example, with a SOURCE/HASH header) and prompt.md (the agent task), and records
// { status: "auto", sourceHash } in fixtures/<fw>/seeds.manifest.json.
//
//   node --import tsx scripts/gen-seeds.mjs --skill=<skill> --fw=<nextjs|tanstack-start> [--rule=<id>] [--dry-run]
//
// Never overwrites an existing seed.tsx, prompt.md or an "adapted" manifest entry.
// Rules whose mapping status for the framework is "na" are skipped.
// Status messages go to stderr; the JSON summary goes to stdout.
import { mkdir, writeFile } from 'node:fs/promises'
import { parseArgs } from 'node:util'
import {
  FIXTURES,
  SKILLS,
  exists,
  frameworkStatus,
  hashCode,
  listRuleIds,
  log,
  readMapping,
  stubSource,
} from './lib/rules.mjs'
import {
  loadRuleExamples,
  readSeedManifest,
  seedDir,
  seedFile,
  seedPromptFile,
  writeSeedManifest,
} from './lib/seeds.mjs'

const { values } = parseArgs({
  options: {
    skill: { type: 'string' },
    fw: { type: 'string' },
    rule: { type: 'string' },
    'dry-run': { type: 'boolean', default: false },
  },
  strict: true,
})

if (!SKILLS.includes(values.skill) || !FIXTURES.includes(values.fw)) {
  log(`usage: --skill=<${SKILLS.join('|')}> --fw=<${FIXTURES.join('|')}> [--rule=<id>] [--dry-run]`)
  process.exit(2)
}

const { skill, fw, rule: onlyRule } = values
const dryRun = values['dry-run']
const FW_LABEL = { nextjs: 'Next.js 16 App Router', 'tanstack-start': 'TanStack Start' }

const SKILL_FOCUS = {
  'react-best-practices': 'React and framework performance problems (waterfalls, bundle size, server/client data handling, re-renders, rendering cost)',
  'composition-patterns': 'component composition and architecture problems (boolean-prop proliferation, coupling between UI and state, missing compound/provider structure, outdated React 19 APIs)',
}

/** The agent task. Same wording for every rule; only the framework label and the skill focus change. */
export function promptFor(fw, skillName = skill) {
  const focus = SKILL_FOCUS[skillName] ?? 'React problems'
  return [
    `You are working in a ${FW_LABEL[fw]} project. Review \`src/seed/seed.tsx\` for ${focus} and fix them in place. Keep behaviour identical. Run \`pnpm typecheck\` and make it pass. Do not touch other files.`,
    '',
  ].join('\n')
}

const mapping = await readMapping(skill)
const manifest = await readSeedManifest(fw)
const allIds = await listRuleIds(skill)

if (onlyRule && !allIds.includes(onlyRule)) {
  log(`unknown rule "${onlyRule}": no skills/${skill}/rules/${onlyRule}.md`)
  process.exit(2)
}
const ids = onlyRule ? [onlyRule] : allIds

const summary = {
  skill,
  fw,
  dryRun,
  written: [],
  exists: [],
  adapted: [],
  na: [],
  unmapped: [],
  noIncorrect: [],
}

for (const id of ids) {
  const status = frameworkStatus(mapping, id, fw)
  if (status === null) {
    log(`skip ${id}: no mapping entry for ${fw}`)
    summary.unmapped.push(id)
    continue
  }
  if (status === 'na') {
    summary.na.push(id)
    continue
  }
  if (manifest[id]?.status === 'adapted') {
    summary.adapted.push(id)
    continue
  }
  if (await exists(seedFile(fw, id))) {
    summary.exists.push(id)
    continue
  }

  const { incorrect } = await loadRuleExamples(skill, id)
  if (!incorrect) {
    log(`skip ${id}: no "Incorrect" example in skills/${skill}/rules/${id}.md`)
    summary.noIncorrect.push(id)
    continue
  }

  const sourceHash = hashCode(incorrect.code)
  const target = seedFile(fw, id)
  summary.written.push(id)
  log(`${dryRun ? 'would write' : 'write'} ${target}`)
  if (dryRun) continue

  await mkdir(seedDir(fw, id), { recursive: true })
  await writeFile(target, stubSource(skill, id, sourceHash, incorrect.code))
  if (!(await exists(seedPromptFile(fw, id)))) {
    await writeFile(seedPromptFile(fw, id), promptFor(fw))
  }
  manifest[id] = { status: 'auto', sourceHash }
}

if (!dryRun && summary.written.length > 0) {
  await writeSeedManifest(fw, manifest)
}

log(`gen-seeds ${skill} -> ${fw}: ${summary.written.length} seed(s) ${dryRun ? 'planned' : 'written'}`)
process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`)
