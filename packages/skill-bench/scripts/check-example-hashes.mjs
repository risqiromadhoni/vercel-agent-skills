#!/usr/bin/env node
// Recomputes the sha256 of each mapped rule's "Correct" code and compares it with
// fixtures/<fw>/rules.manifest.json. Exits 1 on any hash drift, missing or stale
// entry, missing fixture file, or unmapped rule. Rules mapped "na" for a framework
// are skipped; rules with no manifest entry yet are counted as "not ported".
//
//   node --import tsx scripts/check-example-hashes.mjs [--fw=<fw>] [--skill=<skill>] [--accept <rule-id>] [--adapted <rule-id>]
//
// --accept re-stamps one entry's sourceHash (and the // HASH line of its stub).
// Use it only after the port has been re-checked against the changed source.
// --adapted sets one entry's status to "adapted" and keeps its hash, so sync skips it.
// The entry's stub must exist. Hash drift is still reported for adapted entries.
// Whenever the manifest is written, src/rules/index.ts is regenerated too.
import { readFile, writeFile } from 'node:fs/promises'
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
  writeManifest,
  writeRulesIndex,
} from './lib/rules.mjs'

const { values } = parseArgs({
  options: {
    fw: { type: 'string' },
    skill: { type: 'string' },
    accept: { type: 'string' },
    adapted: { type: 'string' },
  },
  strict: true,
})

if ((values.fw && !FIXTURES.includes(values.fw)) || (values.skill && !SKILLS.includes(values.skill))) {
  log(
    `usage: [--fw=<${FIXTURES.join('|')}>] [--skill=<${SKILLS.join('|')}>] [--accept <rule-id>] [--adapted <rule-id>]`,
  )
  process.exit(2)
}

const fws = values.fw ? [values.fw] : FIXTURES
const skills = values.skill ? [values.skill] : SKILLS
const { accept, adapted } = values

let failed = false
let acceptFound = false
let adaptFound = false
const results = []

async function restampHeader(path, hash) {
  if (!(await exists(path))) return
  const text = await readFile(path, 'utf8')
  const next = text.replace(/^\/\/ HASH: .*$/m, `// HASH: ${hash}`)
  if (next !== text) await writeFile(path, next)
}

for (const fw of fws) {
  const manifest = await readManifest(fw)
  const emptyManifest = Object.keys(manifest).length === 0
  const seen = new Set()
  const problems = []
  const accepted = []
  const adaptedHere = []
  let checked = 0
  let notPorted = 0
  let manifestChanged = false

  for (const skill of skills) {
    const mapping = await readMapping(skill)
    for (const id of await listRuleIds(skill)) {
      const where = `${skill}/${id}`
      const status = frameworkStatus(mapping, id, fw)
      if (status === null) {
        problems.push(`${where}: no mapping entry for ${fw}`)
        continue
      }
      seen.add(id)
      if (status === 'na') {
        if (manifest[id]) problems.push(`${where}: mapped na for ${fw} but has a manifest entry`)
        continue
      }

      const entry = manifest[id]
      if (!entry) {
        notPorted++
        continue
      }
      checked++

      const example = await correctExample(skill, id)
      if (!example) {
        problems.push(`${where}: manifest entry exists but the rule has no "Correct" example`)
        continue
      }

      if (adapted === id) {
        adaptFound = true
        if ((await exists(stubPath(fw, id))) && entry.status !== 'adapted') {
          entry.status = 'adapted'
          manifestChanged = true
          adaptedHere.push(id)
        }
      }

      if (accept === id) {
        acceptFound = true
        entry.sourceHash = example.hash
        manifestChanged = true
        accepted.push(id)
        await restampHeader(stubPath(fw, id), example.hash)
      } else if (entry.sourceHash !== example.hash) {
        problems.push(
          `${where}: hash drift (manifest ${entry.sourceHash.slice(0, 12)}, source ${example.hash.slice(0, 12)})`,
        )
      }

      if (!(await exists(stubPath(fw, id)))) {
        problems.push(`${where}: missing fixture file src/rules/${id}.tsx`)
      }
    }
  }

  if (!values.skill) {
    for (const id of Object.keys(manifest)) {
      if (!seen.has(id)) problems.push(`manifest: ${id} has no rule in any skill`)
    }
  }

  if (manifestChanged) {
    await writeManifest(fw, manifest)
    await writeRulesIndex(fw)
  }
  if (emptyManifest) log(`${fw}: empty manifest, no rule examples recorded yet; nothing to compare`)
  for (const problem of problems) log(`FAIL ${fw} ${problem}`)
  log(`${fw}: checked ${checked}, not ported ${notPorted}, problems ${problems.length}`)

  if (problems.length > 0) failed = true
  results.push({ fw, emptyManifest, checked, notPorted, accepted, adapted: adaptedHere, problems })
}

if (accept && !acceptFound) {
  log(`FAIL --accept ${accept}: no manifest entry for it in ${fws.join(', ')}`)
  failed = true
}

if (adapted && !adaptFound) {
  log(`FAIL --adapted ${adapted}: no manifest entry for it in ${fws.join(', ')}`)
  failed = true
}

process.stdout.write(`${JSON.stringify({ ok: !failed, results }, null, 2)}\n`)
process.exitCode = failed ? 1 : 0
