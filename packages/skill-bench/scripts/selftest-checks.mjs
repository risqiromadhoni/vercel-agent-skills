#!/usr/bin/env node
// Quality gate for the Tier 2 specs in checks/<skill>.json.
// For every rule in skills/<skill>/rules/:
//   (a) its Incorrect example must NOT pass (applied:false), or be manual (applied:null)
//   (b) its Correct example must pass (applied:true), or be manual (applied:null)
// Framework: nextjs always, and tanstack-start when the rule has no tanstack override.
// For a tanstack override, the Tier 1 port fixtures/tanstack-start/src/rules/<id>.tsx is
// checked as the Correct case when it exists; otherwise the override is reported as untested.
//
//   node --import tsx scripts/selftest-checks.mjs
//
// Exit 0 when there are no mismatches and every spec is valid. Human summary goes to stderr.
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { checkRule, effectiveSpec, loadSpecs, validateSpecs } from './lib/check.mjs'
import { loadRuleExamples } from './lib/seeds.mjs'
import { BENCH_DIR, SKILLS, listRuleIds, log } from './lib/rules.mjs'

const mismatches = []
const untested = []
let checked = 0
let regexRules = 0
let manualRules = 0

async function readOrNull(path) {
  try {
    return await readFile(path, 'utf8')
  } catch (err) {
    if (err.code === 'ENOENT') return null
    throw err
  }
}

function expectation(expected, result, label) {
  if (result.applied !== expected) {
    mismatches.push(`${label}: expected applied=${expected}, got ${result.applied}. ${result.reason}`)
    return false
  }
  return true
}

for (const skill of SKILLS) {
  const specs = loadSpecs(skill)
  const ids = await listRuleIds(skill)

  for (const err of validateSpecs(skill, specs)) mismatches.push(`spec: ${err}`)
  for (const id of ids) {
    if (!specs[id]) mismatches.push(`${skill}:${id}: no spec in checks/${skill}.json`)
  }
  for (const id of Object.keys(specs)) {
    if (!ids.includes(id)) mismatches.push(`${skill}:${id}: spec has no rule file`)
  }

  for (const id of ids) {
    const spec = specs[id]
    if (!spec) continue
    // Manual rules are not self-tested (the engine returns null); they only need a valid spec.
    if (effectiveSpec(spec, 'nextjs').manual) {
      manualRules++
      continue
    }
    regexRules++

    const { incorrect, correct } = await loadRuleExamples(skill, id)
    if (!incorrect) mismatches.push(`${skill}:${id}: no Incorrect example to test against (mark manual or label the rule file)`)
    if (!correct) mismatches.push(`${skill}:${id}: no Correct example to test against (mark manual or label the rule file)`)
    if (!incorrect || !correct) continue

    const expectedA = false
    const expectedB = true

    // Next.js: the rule examples are the Next.js-shaped baseline.
    checked++
    expectation(expectedA, checkRule(id, skill, 'nextjs', incorrect.code), `${skill}:${id} [nextjs Incorrect]`)
    expectation(expectedB, checkRule(id, skill, 'nextjs', correct.code), `${skill}:${id} [nextjs Correct]`)

    // TanStack Start: base patterns apply unless the rule overrides them for this framework.
    const tanstack = effectiveSpec(spec, 'tanstack-start')
    if (!tanstack.hasOverride) {
      checked++
      expectation(expectedA, checkRule(id, skill, 'tanstack-start', incorrect.code), `${skill}:${id} [tanstack-start Incorrect]`)
      expectation(expectedB, checkRule(id, skill, 'tanstack-start', correct.code), `${skill}:${id} [tanstack-start Correct]`)
    } else {
      const portPath = join(BENCH_DIR, 'fixtures', 'tanstack-start', 'src', 'rules', `${id}.tsx`)
      const port = await readOrNull(portPath)
      if (port === null) {
        untested.push(`${skill}:${id}`)
      } else {
        checked++
        expectation(true, checkRule(id, skill, 'tanstack-start', port), `${skill}:${id} [tanstack-start port]`)
      }
    }
  }
}

log(`selftest-checks: ${checked} assertions across ${regexRules} regex rule(s) and ${manualRules} manual rule(s)`)
log(`manual (applied:null) rules: ${manualRules}`)
if (untested.length) {
  log(`tanstack override untested (no Tier 1 port file yet): ${untested.length}`)
  for (const u of untested) log(`  - ${u}`)
}
if (mismatches.length) {
  log(`FAIL: ${mismatches.length} mismatch(es)`)
  for (const m of mismatches) log(`  - ${m}`)
  process.exitCode = 1
} else {
  log('PASS: 0 mismatches')
}
