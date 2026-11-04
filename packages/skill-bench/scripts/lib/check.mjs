// Generic rule checker for Tier 2 (agent eval). Each skill has one spec file,
// checks/<skill>.json, mapping rule ids to regex expectations:
//
//   "<rule-id>": {
//     "mustNotMatch": ["<regex>", ...],   // anti-pattern that must be gone
//     "mustMatch":    ["<regex>", ...],   // fix that must be present
//     "flags": "ms",                      // optional, default "ms"
//     "notes": "why these patterns",
//     "overrides": { "tanstack-start": { "mustMatch": [...] } },
//     "manual": true                      // optional: no regex can express the fix
//   }
//
// An override replaces the base list of the same key for that framework.
// Source is comment-stripped before matching, so a commented-out anti-pattern
// does not count. Dependency: typescript (scanner only); no tsx loader needed.
import { readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

const CHECKS_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..', 'checks')
const DEFAULT_FLAGS = 'ms'
const cache = new Map()

/** Blanks out // and /* *\/ comments, keeping newlines and offsets so line numbers stay valid. */
export function stripComments(text) {
  const scanner = ts.createScanner(ts.ScriptTarget.Latest, false, ts.LanguageVariant.JSX, text)
  const chars = [...text]
  for (let kind = scanner.scan(); kind !== ts.SyntaxKind.EndOfFileToken; kind = scanner.scan()) {
    if (kind === ts.SyntaxKind.SingleLineCommentTrivia || kind === ts.SyntaxKind.MultiLineCommentTrivia) {
      const end = scanner.getTextPos()
      for (let i = scanner.getTokenStart(); i < end; i++) {
        if (chars[i] !== '\n') chars[i] = ' '
      }
    }
  }
  return chars.join('')
}

export function specPath(skill) {
  return join(CHECKS_DIR, `${skill}.json`)
}

/** Loads checks/<skill>.json (cached). Returns {} when the file is absent. */
export function loadSpecs(skill) {
  if (!cache.has(skill)) {
    let parsed = {}
    try {
      parsed = JSON.parse(readFileSync(specPath(skill), 'utf8'))
    } catch (err) {
      if (err.code !== 'ENOENT') throw err
    }
    cache.set(skill, parsed)
  }
  return cache.get(skill)
}

/** Effective expectations for one framework: base lists, replaced by a framework override when present. */
export function effectiveSpec(spec, fw) {
  const override = spec.overrides?.[fw] ?? {}
  return {
    manual: Boolean(override.manual ?? spec.manual),
    flags: override.flags ?? spec.flags ?? DEFAULT_FLAGS,
    mustMatch: override.mustMatch ?? spec.mustMatch ?? [],
    mustNotMatch: override.mustNotMatch ?? spec.mustNotMatch ?? [],
    hasOverride: Object.hasOwn(spec.overrides ?? {}, fw),
  }
}

/** Structural problems in a spec file. Empty array when valid. */
export function validateSpecs(skill, specs = loadSpecs(skill)) {
  const errors = []
  const fws = ['nextjs', 'tanstack-start']
  for (const [id, spec] of Object.entries(specs)) {
    const where = `${skill}:${id}`
    if (!spec || typeof spec !== 'object') {
      errors.push(`${where}: spec must be an object`)
      continue
    }
    const lists = [spec.mustMatch ?? [], spec.mustNotMatch ?? []]
    if (!lists.every((l) => Array.isArray(l) && l.every((p) => typeof p === 'string'))) {
      errors.push(`${where}: mustMatch and mustNotMatch must be arrays of strings`)
    }
    if (!spec.notes || typeof spec.notes !== 'string') errors.push(`${where}: notes is required`)
    for (const fw of Object.keys(spec.overrides ?? {})) {
      if (!fws.includes(fw)) errors.push(`${where}: unknown override framework "${fw}"`)
    }
    for (const fw of fws) {
      const eff = effectiveSpec(spec, fw)
      if (eff.manual) continue
      if (eff.mustMatch.length === 0 && eff.mustNotMatch.length === 0) {
        errors.push(`${where} (${fw}): no patterns and not manual`)
      }
      for (const p of [...eff.mustMatch, ...eff.mustNotMatch]) {
        try {
          new RegExp(p, eff.flags)
        } catch (err) {
          errors.push(`${where} (${fw}): bad regex /${p}/: ${err.message}`)
        }
      }
    }
  }
  return errors
}

/**
 * Checks source text against a rule's spec for a framework.
 * @returns {{applied: boolean|null, failed: string[], reason: string}}
 *   applied: true when every mustNotMatch is absent and every mustMatch is present;
 *   null when the rule is manual (needs human review) or has no spec.
 */
export function checkRule(ruleId, skill, fw, srcText) {
  const spec = loadSpecs(skill)[ruleId]
  if (!spec) {
    return { applied: null, failed: [], reason: `no spec for ${ruleId} in checks/${skill}.json` }
  }
  const eff = effectiveSpec(spec, fw)
  if (eff.manual) {
    return { applied: null, failed: [], reason: `manual review: ${spec.notes}` }
  }
  const code = stripComments(srcText)
  const failed = []
  for (const p of eff.mustNotMatch) {
    if (new RegExp(p, eff.flags).test(code)) failed.push(`forbidden pattern present: /${p}/`)
  }
  for (const p of eff.mustMatch) {
    if (!new RegExp(p, eff.flags).test(code)) failed.push(`required pattern missing: /${p}/`)
  }
  const applied = failed.length === 0
  return {
    applied,
    failed,
    reason: applied ? 'all patterns satisfied' : failed.join('; '),
  }
}
