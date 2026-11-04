#!/usr/bin/env node
// Seeds fixtures/<fw>/src/rules/<rule-id>.tsx from the first "Correct" example
// of skills/<skill>/rules/<rule-id>.md, and records {status: "auto", sourceHash}
// in fixtures/<fw>/rules.manifest.json. Then regenerates fixtures/<fw>/src/rules/index.ts
// from the manifest, so every ported rule is compiled by the fixture build.
//
//   node --import tsx scripts/sync-examples.mjs --skill=<skill> --fw=<nextjs|tanstack-start> [--rule=<id>] [--dry-run]
//
// Never overwrites an existing stub or an entry whose status is "adapted".
// Status messages go to stderr; the JSON summary goes to stdout.
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'
import { parseArgs } from 'node:util'
import {
  FIXTURES,
  SKILLS,
  correctExample,
  exists,
  frameworkStatus,
  listRuleIds,
  log,
  readManifest,
  readMapping,
  stubPath,
  stubSource,
  writeManifest,
  writeRulesIndex,
} from './lib/rules.mjs'

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

const mapping = await readMapping(skill)
const manifest = await readManifest(fw)
const ids = onlyRule ? [onlyRule] : await listRuleIds(skill)

const summary = {
  skill,
  fw,
  dryRun,
  written: [],
  exists: [],
  adapted: [],
  na: [],
  unmapped: [],
  noCorrect: [],
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

  const example = await correctExample(skill, id)
  if (!example) {
    log(`skip ${id}: no "Correct" example in skills/${skill}/rules/${id}.md`)
    summary.noCorrect.push(id)
    continue
  }

  const target = stubPath(fw, id)
  if (await exists(target)) {
    summary.exists.push(id)
    continue
  }

  summary.written.push(id)
  log(`${dryRun ? 'would write' : 'write'} ${target}`)
  if (dryRun) continue

  await mkdir(dirname(target), { recursive: true })
  await writeFile(target, stubSource(skill, id, example.hash, example.code))
  manifest[id] = { status: 'auto', sourceHash: example.hash }
}

if (!dryRun && summary.written.length > 0) {
  await writeManifest(fw, manifest)
}

// Runs on every invocation, including --dry-run. The index is derived from the manifest
// and the stubs on disk, so this never changes a stub or the manifest.
summary.rulesIndex = await writeRulesIndex(fw)

log(`sync ${skill} -> ${fw}: ${summary.written.length} stub(s) ${dryRun ? 'planned' : 'written'}`)
process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`)
