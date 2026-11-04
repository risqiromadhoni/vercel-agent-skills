#!/usr/bin/env node
// Tier 2 agent eval. For each seeded rule and each arm (with = skill copied into the
// project, without = no skill), runs `claude -p` in a throwaway copy of the fixture,
// then typechecks (and optionally builds) the result and scores the seed with checkRule().
//
//   BENCH_FW=nextjs BENCH_SKILL=react-best-practices [BENCH_RULES=a,b] node --import tsx scripts/run-eval.mjs
//
// Env: BENCH_FW (required), BENCH_SKILL (required), BENCH_RULES (comma list; default all
// non-N/A rules), BENCH_ARMS (with,without), BENCH_MODEL (claude-sonnet-5-5),
// BENCH_CONCURRENCY (2), BENCH_TIMEOUT_MS (600000, per agent run), BENCH_MAX_TURNS (30,
// only passed when `claude --help` lists --max-turns), BENCH_BUILD=1 (also run pnpm build).
//
// Status goes to stderr; the path of the written JSON goes to stdout.
// If the `claude` CLI is not installed, prompts are written to results/manual/ and the script exits 0.
import { spawn, spawnSync } from 'node:child_process'
import { rmSync, unlinkSync } from 'node:fs'
import { copyFile, cp, mkdir, mkdtemp, readFile, symlink, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, relative, resolve, sep } from 'node:path'
import { checkRule, effectiveSpec, loadSpecs } from './lib/check.mjs'
import {
  BENCH_DIR,
  FIXTURES,
  SKILLS,
  exists,
  fixtureDir,
  frameworkStatus,
  listRuleIds,
  log,
  readMapping,
} from './lib/rules.mjs'
import { seedFile, seedPromptFile } from './lib/seeds.mjs'

const ROOT = resolve(BENCH_DIR, '..', '..')
const ALLOWED_TOOLS = 'Read,Edit,Write,Bash(pnpm typecheck*)'
const TYPECHECK_TIMEOUT_MS = 5 * 60_000
const BUILD_TIMEOUT_MS = 15 * 60_000
const DEFAULT_ARMS = ['with', 'without']
// Never copied into the eval project: build output, the seeds themselves, and the answer key
// (src/rules stubs and app/rules pages are the Correct examples, so the agent must not see them).
const EXCLUDED_NAMES = new Set([
  'node_modules', '.next', 'dist', '.output', '.nitro', '.tanstack', 'seeds',
  'README.md', 'rules.manifest.json', 'seeds.manifest.json', 'tsconfig.tsbuildinfo',
])

// ---------- env ----------

function fail(message) {
  log(message)
  process.exit(2)
}

const fw = process.env.BENCH_FW
const skill = process.env.BENCH_SKILL
if (!FIXTURES.includes(fw) || !SKILLS.includes(skill)) {
  fail(`set BENCH_FW=<${FIXTURES.join('|')}> and BENCH_SKILL=<${SKILLS.join('|')}>`)
}
const model = process.env.BENCH_MODEL || 'claude-sonnet-5-5'
const concurrency = Number.parseInt(process.env.BENCH_CONCURRENCY || '2', 10)
if (!Number.isInteger(concurrency) || concurrency < 1) fail('BENCH_CONCURRENCY must be an integer >= 1')
const timeoutMs = Number.parseInt(process.env.BENCH_TIMEOUT_MS || '600000', 10)
if (!Number.isInteger(timeoutMs) || timeoutMs < 1) fail('BENCH_TIMEOUT_MS must be a positive integer')
const maxTurns = Number.parseInt(process.env.BENCH_MAX_TURNS || '30', 10)
const build = process.env.BENCH_BUILD === '1'
const arms = (process.env.BENCH_ARMS || DEFAULT_ARMS.join(','))
  .split(',')
  .map((a) => a.trim())
  .filter(Boolean)
if (arms.length === 0 || arms.some((a) => !DEFAULT_ARMS.includes(a))) {
  fail(`BENCH_ARMS must be a comma list of ${DEFAULT_ARMS.join(' and ')}`)
}

const mapping = await readMapping(skill)
const allIds = await listRuleIds(skill)
const specs = loadSpecs(skill)
const requested = process.env.BENCH_RULES
  ? process.env.BENCH_RULES.split(',').map((r) => r.trim()).filter(Boolean)
  : allIds.filter((id) => frameworkStatus(mapping, id, fw) !== 'na')
for (const id of requested) {
  if (!allIds.includes(id)) fail(`unknown rule "${id}" in BENCH_RULES`)
}
if (requested.length === 0) fail('no rules selected')

// ---------- preflight ----------

/** Returns null when the claude CLI is not installed. */
function probeClaude() {
  const version = spawnSync('claude', ['--version'], { encoding: 'utf8', timeout: 30_000 })
  if (version.error?.code === 'ENOENT') return null
  if (version.error) throw version.error
  if (version.status !== 0) throw new Error(`claude --version exited ${version.status}: ${version.stderr}`)
  const help = spawnSync('claude', ['--help'], { encoding: 'utf8', timeout: 30_000 })
  const text = `${help.stdout ?? ''}${help.stderr ?? ''}`
  return {
    version: version.stdout.trim(),
    flags: {
      maxTurns: text.includes('--max-turns'),
      settingSources: text.includes('--setting-sources'),
      strictMcpConfig: text.includes('--strict-mcp-config'),
      permissionMode: text.includes('--permission-mode'),
      allowedTools: text.includes('--allowedTools') || text.includes('--allowed-tools'),
      outputFormat: text.includes('--output-format'),
    },
  }
}

const probe = probeClaude()
const startedAt = new Date()
const stamp = startedAt.toISOString().replace(/[:.]/g, '-')

if (probe === null) {
  // Manual fallback: write the prompt and seed per rule so a person can run the eval by hand.
  const outDir = join(BENCH_DIR, 'results', 'manual', fw, skill)
  const index = { reason: 'claude CLI not found on PATH', fw, skill, arms, model, rules: [] }
  for (const id of requested) {
    if (frameworkStatus(mapping, id, fw) === 'na' || !(await exists(seedFile(fw, id)))) continue
    const dir = join(outDir, id)
    await mkdir(dir, { recursive: true })
    await copyFile(seedPromptFile(fw, id), join(dir, 'prompt.md'))
    await copyFile(seedFile(fw, id), join(dir, 'seed.tsx'))
    index.rules.push({ id, prompt: join(dir, 'prompt.md'), seed: join(dir, 'seed.tsx') })
  }
  await mkdir(outDir, { recursive: true })
  await writeFile(join(outDir, 'index.json'), `${JSON.stringify(index, null, 2)}\n`)
  log(`claude CLI not found: wrote ${index.rules.length} prompt(s) to ${outDir}; nothing was run`)
  process.stdout.write(`${join(outDir, 'index.json')}\n`)
  process.exit(0)
}

if (!(await exists(join(fixtureDir(fw), 'node_modules')))) {
  fail(`fixtures/${fw}/node_modules is missing: run pnpm fixtures:install first`)
}

const claudeFlags = probe.flags
log(`claude ${probe.version}; flags: ${Object.entries(claudeFlags).map(([k, v]) => `${k}=${v}`).join(' ')}`)
if (!claudeFlags.maxTurns) log('omitting --max-turns: not listed in claude --help')

// ---------- temp dirs and child processes: clean up on exit and on SIGINT/SIGTERM ----------

const liveTmp = new Set()
const liveChildren = new Set()

function cleanupSync() {
  for (const child of liveChildren) {
    try {
      child.kill('SIGTERM')
    } catch {
      // already exited
    }
  }
  for (const dir of liveTmp) {
    try {
      unlinkSync(join(dir, 'node_modules')) // the symlink only; never recurse into the fixture's real node_modules
    } catch {
      // absent
    }
    try {
      rmSync(dir, { recursive: true, force: true })
    } catch {
      // best effort
    }
  }
  liveTmp.clear()
}

process.on('exit', cleanupSync)
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    cleanupSync()
    process.exit(130)
  })
}

// ---------- fixture copy, sanitising, skill copy ----------

function keepPath(fixtureRoot, src) {
  const rel = relative(fixtureRoot, src)
  if (rel === '') return true
  const parts = rel.split(sep)
  if (parts.some((p) => EXCLUDED_NAMES.has(p))) return false
  if (parts[0] === 'app' && parts[1] === 'rules') return false
  if (parts[0] === 'src' && parts[1] === 'rules' && parts.length > 2 && parts[2] !== 'index.ts') return false
  if (parts[0] === 'src' && parts[1] === 'routes' && parts[2] === 'rules' && parts.length > 3 && parts[3] !== 'index.tsx') {
    return false
  }
  return true
}

async function copyFixture(dest) {
  const src = fixtureDir(fw)
  await cp(src, dest, { recursive: true, filter: (p) => keepPath(src, p) })
  // The copied rules index would re-export the answer stubs (now removed); replace it with an empty map.
  // Routes and pages that import it still typecheck.
  if (await exists(join(dest, 'src', 'rules', 'index.ts'))) {
    await writeFile(
      join(dest, 'src', 'rules', 'index.ts'),
      '// Answer key removed for the Tier 2 eval.\nexport const rules: Record<string, any> = {}\n',
    )
  }
}

async function copySkill(dest) {
  const src = join(ROOT, 'skills', skill)
  await mkdir(dest, { recursive: true })
  await cp(join(src, 'SKILL.md'), join(dest, 'SKILL.md'))
  await cp(join(src, 'rules'), join(dest, 'rules'), { recursive: true })
  for (const file of ['AGENTS.md', 'metadata.json']) {
    if (await exists(join(src, file))) await cp(join(src, file), join(dest, file))
  }
}

// ---------- child processes ----------

function runProcess(cmd, args, { cwd, timeout }) {
  return new Promise((done) => {
    const child = spawn(cmd, args, { cwd, env: process.env, stdio: ['ignore', 'pipe', 'pipe'] })
    liveChildren.add(child)
    let stdout = ''
    let stderr = ''
    let timedOut = false
    const cap = (s) => (s.length > 2_000_000 ? s.slice(-2_000_000) : s)
    child.stdout.on('data', (d) => {
      stdout = cap(stdout + d)
    })
    child.stderr.on('data', (d) => {
      stderr = cap(stderr + d)
    })
    const timer = setTimeout(() => {
      timedOut = true
      child.kill('SIGTERM')
      setTimeout(() => child.kill('SIGKILL'), 5_000).unref()
    }, timeout)
    child.on('error', (err) => {
      clearTimeout(timer)
      liveChildren.delete(child)
      done({ exitCode: null, signal: null, timedOut, stdout, stderr: `${stderr}${err.message}` })
    })
    child.on('close', (exitCode, signal) => {
      clearTimeout(timer)
      liveChildren.delete(child)
      done({ exitCode, signal, timedOut, stdout, stderr })
    })
  })
}

/** Parses `claude -p --output-format json` output. Returns { parsed, error }. */
function parseAgentJson(stdout) {
  const text = stdout.trim()
  if (!text) return { parsed: null, error: 'empty stdout' }
  try {
    let value = JSON.parse(text)
    if (Array.isArray(value)) value = [...value].reverse().find((v) => v?.type === 'result') ?? value.at(-1)
    return { parsed: value ?? null, error: null }
  } catch (err) {
    return { parsed: null, error: `stdout is not JSON: ${err.message}` }
  }
}

async function runAgent(cwd, prompt) {
  const args = ['-p', prompt, '--model', model]
  if (claudeFlags.outputFormat) args.push('--output-format', 'json')
  if (claudeFlags.allowedTools) args.push('--allowedTools', ALLOWED_TOOLS)
  if (claudeFlags.permissionMode) args.push('--permission-mode', 'acceptEdits')
  if (claudeFlags.settingSources) args.push('--setting-sources', 'project')
  if (claudeFlags.strictMcpConfig) args.push('--strict-mcp-config')
  if (claudeFlags.maxTurns) args.push('--max-turns', String(maxTurns))

  const started = Date.now()
  const proc = await runProcess('claude', args, { cwd, timeout: timeoutMs })
  const durationMs = Date.now() - started
  const { parsed, error: parseError } = claudeFlags.outputFormat
    ? parseAgentJson(proc.stdout)
    : { parsed: null, error: null }
  let error = null
  if (proc.timedOut) error = `timed out after ${timeoutMs} ms`
  else if (proc.exitCode !== 0) error = `exit ${proc.exitCode}: ${proc.stderr.slice(-1000)}`
  else if (parseError) error = parseError
  return {
    durationMs,
    exitCode: proc.exitCode,
    timedOut: proc.timedOut,
    costUsd: parsed?.total_cost_usd ?? parsed?.cost_usd ?? null,
    turns: parsed?.num_turns ?? null,
    isError: parsed?.is_error ?? null,
    subtype: parsed?.subtype ?? null,
    resultExcerpt: (typeof parsed?.result === 'string' ? parsed.result : proc.stdout).slice(0, 500),
    error,
  }
}

async function runPnpm(cwd, script, timeout) {
  const proc = await runProcess('pnpm', [script], { cwd, timeout })
  const ok = proc.exitCode === 0
  return {
    ok,
    exitCode: proc.exitCode,
    tail: ok ? null : `${proc.stdout}${proc.stderr}`.slice(-1500),
  }
}

// ---------- one run ----------

async function runArm({ id, arm, prompt }) {
  const tmp = await mkdtemp(join(tmpdir(), `skill-bench-${fw}-${id}-${arm}-`))
  liveTmp.add(tmp)
  try {
    await copyFixture(tmp)
    await symlink(join(fixtureDir(fw), 'node_modules'), join(tmp, 'node_modules'), 'dir')
    await mkdir(join(tmp, 'src', 'seed'), { recursive: true })
    await copyFile(seedFile(fw, id), join(tmp, 'src', 'seed', 'seed.tsx'))
    if (arm === 'with') await copySkill(join(tmp, '.claude', 'skills', skill))

    const agent = await runAgent(tmp, prompt)
    const typecheck = await runPnpm(tmp, 'typecheck', TYPECHECK_TIMEOUT_MS)
    const buildResult = build ? await runPnpm(tmp, 'build', BUILD_TIMEOUT_MS) : null

    let seedAfter = null
    try {
      seedAfter = await readFile(join(tmp, 'src', 'seed', 'seed.tsx'), 'utf8')
    } catch {
      // deleted or moved by the agent
    }
    const verdict = seedAfter === null
      ? { applied: false, failed: ['src/seed/seed.tsx missing after the agent run'], reason: 'seed missing' }
      : checkRule(id, skill, fw, seedAfter)

    return {
      applied: verdict.applied,
      failed: verdict.failed,
      typecheck: typecheck.ok,
      typecheckExitCode: typecheck.exitCode,
      build: buildResult ? buildResult.ok : null,
      costUsd: agent.costUsd,
      durationMs: agent.durationMs,
      turns: agent.turns,
      agent: {
        exitCode: agent.exitCode,
        timedOut: agent.timedOut,
        isError: agent.isError,
        subtype: agent.subtype,
        error: agent.error,
        resultExcerpt: agent.resultExcerpt,
      },
      ...(typecheck.ok ? {} : { typecheckTail: typecheck.tail }),
      ...(buildResult && !buildResult.ok ? { buildTail: buildResult.tail } : {}),
      seedAfter,
    }
  } finally {
    // Remove the symlink first so rmSync never walks into the fixture's real node_modules.
    try {
      unlinkSync(join(tmp, 'node_modules'))
    } catch {
      // not created
    }
    rmSync(tmp, { recursive: true, force: true })
    liveTmp.delete(tmp)
  }
}

// ---------- plan and run ----------

const rules = {}
const runs = []
for (const id of requested) {
  const mappingStatus = frameworkStatus(mapping, id, fw)
  if (mappingStatus === 'na') {
    rules[id] = { status: 'na', mappingStatus, note: mapping[id]?.note ?? null }
    continue
  }
  if (!(await exists(seedFile(fw, id)))) {
    rules[id] = {
      status: 'no-seed',
      mappingStatus,
      error: `no seed: run pnpm gen-seeds --skill=${skill} --fw=${fw} --rule=${id}`,
    }
    log(`skip ${id}: no seed`)
    continue
  }
  const spec = specs[id]
  if (spec && effectiveSpec(spec, fw).manual) {
    rules[id] = { status: 'manual', mappingStatus, note: spec.notes }
    log(`skip ${id}: manual review, not scored`)
    continue
  }
  rules[id] = { status: 'scored', mappingStatus }
  const prompt = await readFile(seedPromptFile(fw, id), 'utf8')
  for (const arm of arms) runs.push({ id, arm, prompt })
}

async function pool(items, limit, worker) {
  let next = 0
  const lanes = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) {
      const item = items[next++]
      await worker(item)
    }
  })
  await Promise.all(lanes)
}

log(`running ${runs.length} agent run(s) for ${requested.length} rule(s): ${fw} / ${skill}, model ${model}, concurrency ${concurrency}`)
await pool(runs, concurrency, async ({ id, arm, prompt }) => {
  log(`start ${id} [${arm}]`)
  const result = await runArm({ id, arm, prompt })
  rules[id][arm] = result
  log(`done ${id} [${arm}] typecheck=${result.typecheck} applied=${result.applied} cost=${result.costUsd ?? 'n/a'} turns=${result.turns ?? 'n/a'}`)
})

const finishedAt = new Date()
const output = {
  meta: {
    startedAt: startedAt.toISOString(),
    finishedAt: finishedAt.toISOString(),
    fw,
    skill,
    model,
    arms,
    concurrency,
    timeoutMs,
    build,
    maxTurns: claudeFlags.maxTurns ? maxTurns : null,
    allowedTools: ALLOWED_TOOLS,
    claude: { version: probe.version, flags: claudeFlags },
    node: process.version,
    fixture: relative(BENCH_DIR, fixtureDir(fw)),
    selectedRules: requested,
  },
  rules,
}

const outDir = join(BENCH_DIR, 'results', fw, skill)
await mkdir(outDir, { recursive: true })
const outPath = join(outDir, `${stamp}.json`)
await writeFile(outPath, `${JSON.stringify(output, null, 2)}\n`)
log(`wrote ${outPath}`)
process.stdout.write(`${outPath}\n`)
