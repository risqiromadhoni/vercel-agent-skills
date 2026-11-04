/**
 * Rule ID assignment shared by the AGENTS.md build and test-case extraction
 */

import { Rule } from './types.js'

/**
 * Assign each rule an ID of the form "<section>.<n>" and return the rules
 * ordered by section, then title.
 *
 * Within a section, rules are sorted by title (en-US, case-insensitive) and
 * numbered from 1. Rule objects are mutated in place (`id`, `subsection`); the
 * input array is not reordered.
 */
export function assignRuleIds(rules: Rule[]): Rule[] {
  // Using the same comparator inside each section keeps the numbering stable across environments
  const sorted = [...rules].sort(
    (a, b) =>
      a.section - b.section ||
      a.title.localeCompare(b.title, 'en-US', { sensitivity: 'base' })
  )

  let currentSection: number | undefined
  let index = 0
  for (const rule of sorted) {
    if (rule.section !== currentSection) {
      currentSection = rule.section
      index = 0
    }
    index++
    rule.id = `${rule.section}.${index}`
    rule.subsection = index
  }

  return sorted
}
