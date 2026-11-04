#!/usr/bin/env node
// Renders a Tier 2 results JSON (written by run-eval.mjs) as a markdown scorecard next to it.
//
//   node --import tsx scripts/report.mjs [--input <results.json>]
//
// Without --input, the newest results/<fw>/<skill>/*.json is used. Writes <same name>.md
// and prints its path on stdout; status goes to stderr.
import { readdir, readFile, stat, writeFile } from 'node:fs/promises'
import { join, relative } from 'node:path'
import { parseArgs } from 'node:util'
import { BENCH_DIR, log, readMapping } from './lib/rules.mjs'

const { values } = parseArgs({ options: { input: { type: 'string' } }, strict: true })
const RESULTS = join(BENCH_DIR, 'results')

async function newestResult() {
  const candidates = []
  for (const fw of await subdirs(RESULTS)) {
    if (fw === 'manual') continue
    for (const skill of await subdirs(join(RESULTS, fw))) {
      for (const file of await readdirSafe(join(RESULTS, fw, skill))) {
        if (!file.endsWith('.json')) continue
        const path = join(RESULTS, fw, skill, file)
        candidates.push({ path, mtime: (await stat(path)).mtimeMs })
      }
    }
  }
  candidates.sort((a, b) => b.mtime - a.mtime)
  return candidates[0]?.path ?? null
}

async function readdirSafe(dir) {
  try {
    return await readdir(dir)
  } catch (err) {
    if (err.code === 'ENOENT' || err.code === 'ENOTDIR') return []
    throw err
  }
}

async function subdirs(dir) {
  const entries = await readdir(dir, { withFileTypes: true }).catch((err) => {
    if (err.code === 'ENOENT' || err.code === 'ENOTDIR') return []
    throw err
  })
  return entries.filter((e) => e.isDirectory()).map((e) => e.name)
}

const inputPath = values.input ?? (await newestResult())
if (!inputPath) {
  log(`no results found under ${relative(BENCH_DIR, RESULTS)}/; run pnpm eval first`)
  process.exit(2)
}
const data = JSON.parse(await readFile(inputPath, 'utf8'))
const { meta, rules } = data
const mapping = await readMapping(meta.skill)

const pct = (n, d) => (d === 0 ? 'n/a' : `${n}/${d} (${Math.round((100 * n) / d)}%)`)
const money = (n) => (typeof n === 'number' ? `$${n.toFixed(4)}` : 'n/a')
const cell = (s) => String(s ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ')
const yn = (v) => (v === true ? 'pass' : v === false ? 'fail' : v === null || v === undefined ? '-' : String(v))
const applied = (run) => (run === undefined ? '-' : run.applied === true ? 'yes' : run.applied === false ? 'no' : 'manual')

const scored = Object.entries(rules).filter(([, r]) => r.status === 'scored')
const armRuns = (arm) => scored.map(([, r]) => r[arm]).filter(Boolean)
const totals = (arm) => {
  const runs = armRuns(arm)
  const decided = runs.filter((run) => typeof run.applied === 'boolean')
  const ok = decided.filter((run) => run.applied).length
  const tcPass = runs.filter((run) => run.typecheck === true).length
  const builds = runs.filter((run) => typeof run.build === 'boolean')
  const buildPass = builds.filter((run) => run.build).length
  const cost = runs.reduce((sum, run) => sum + (typeof run.costUsd === 'number' ? run.costUsd : 0), 0)
  const turns = runs.reduce((sum, run) => sum + (typeof run.turns === 'number' ? run.turns : 0), 0)
  return {
    runs: runs.length,
    decided: decided.length,
    ok,
    tcPass,
    builds: builds.length,
    buildPass,
    cost,
    turns,
  }
}

const lines = []
const out = (s = '') => lines.push(s)

out(`# Tier 2 scorecard: ${meta.skill} on ${meta.fw}`)
out()
out(`- Run: ${meta.startedAt} (${meta.finishedAt})`)
out(`- Model: \`${meta.model}\`; claude: ${meta.claude?.version ?? 'n/a'}; arms: ${meta.arms.join(', ')}`)
out(`- Build check: ${meta.build ? 'on (BENCH_BUILD=1)' : 'off (typecheck only)'}; concurrency ${meta.concurrency}; timeout ${meta.timeoutMs} ms`)
out(`- Rules selected: ${meta.selectedRules.length}; scored: ${scored.length}; not scored: ${Object.values(rules).filter((r) => r.status !== 'scored').length}`)
out()

out('## Headline')
out()
out('| Arm | Applied (rule satisfied) | Typecheck pass | Build pass | Cost | Turns |')
out('|---|---|---|---|---|---|')
for (const arm of ['with', 'without']) {
  if (!meta.arms.includes(arm)) continue
  const t = totals(arm)
  out(`| ${arm} | ${pct(t.ok, t.decided)} | ${pct(t.tcPass, t.runs)} | ${meta.build ? pct(t.buildPass, t.builds) : 'off'} | ${money(t.cost)} | ${t.turns} |`)
}
out()
out('Applied is the share of runs whose edited seed passes every regex in `checks/<skill>.json`. A rule that is not manual counts as decided. Manual rules are excluded (see below).')
out()

out('## Per rule')
out()
out('| Rule | Mapping | with applied | with typecheck | without applied | without typecheck | with cost | without cost |')
out('|---|---|---|---|---|---|---|---|')
for (const [id, r] of Object.entries(rules).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))) {
  if (r.status !== 'scored') {
    out(`| ${cell(id)} | ${cell(r.mappingStatus)} | ${r.status} | - | - | - | - | - |`)
    continue
  }
  out(
    `| ${cell(id)} | ${cell(r.mappingStatus)} | ${applied(r.with)} | ${yn(r.with?.typecheck)} | ${applied(r.without)} | ${yn(r.without?.typecheck)} | ${money(r.with?.costUsd)} | ${money(r.without?.costUsd)} |`,
  )
}
out()

const manual = Object.entries(rules).filter(([, r]) => r.status === 'manual')
const manualRuns = scored.filter(([, r]) => ['with', 'without'].some((arm) => r[arm]?.applied === null))
out('## Needs manual review')
out()
if (manual.length === 0 && manualRuns.length === 0) {
  out('None.')
} else {
  for (const [id, r] of manual) out(`- \`${id}\`: not scored. ${cell(r.note)}`)
  for (const [id] of manualRuns) out(`- \`${id}\`: scored as manual (applied null).`)
}
out()

const notRun = Object.entries(rules).filter(([, r]) => r.status === 'no-seed' || r.status === 'na')
if (notRun.length) {
  out('## Not run')
  out()
  for (const [id, r] of notRun) out(`- \`${id}\`: ${r.status}${r.error ? `. ${cell(r.error)}` : ''}`)
  out()
}

out(`## N/A for ${meta.fw} (from mapping)`)
out()
const naRules = Object.entries(mapping).filter(([id, m]) => id !== 'note' && m[meta.fw] === 'na')
if (naRules.length === 0) {
  out('None.')
} else {
  for (const [id, m] of naRules) out(`- \`${id}\`: ${cell(m.note)}`)
}
out()

const failing = scored.flatMap(([id, r]) =>
  ['with', 'without']
    .filter((arm) => r[arm] && r[arm].applied === false)
    .map((arm) => `- \`${id}\` [${arm}]: ${cell((r[arm].failed ?? []).join('; ') || 'no detail')}`),
)
out('## Failed checks')
out()
out(failing.length ? failing.join('\n') : 'None.')
out()

const errors = scored.flatMap(([id, r]) =>
  ['with', 'without']
    .filter((arm) => r[arm]?.agent?.error || (r[arm] && !r[arm].typecheck))
    .map((arm) => `- \`${id}\` [${arm}]: ${cell(r[arm].agent?.error ?? 'typecheck failed')}`),
)
out('## Agent and typecheck errors')
out()
out(errors.length ? errors.join('\n') : 'None.')
out()

const markdown = `${lines.join('\n')}\n`
const outPath = inputPath.replace(/\.json$/, '.md')
await writeFile(outPath, markdown)
log(`wrote ${outPath}`)
process.stdout.write(`${outPath}\n`)
