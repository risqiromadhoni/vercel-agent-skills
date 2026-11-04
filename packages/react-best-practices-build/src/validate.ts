#!/usr/bin/env node
/**
 * Validate rule files follow the correct structure
 */

import { readdir, readFile } from 'fs/promises'
import { join } from 'path'
import { Rule } from './types.js'
import { parseRuleFile } from './parser.js'
import { SkillConfig } from './config.js'
import { resolveSkills } from './cli.js'

interface ValidationError {
  file: string
  ruleId?: string
  message: string
}

/**
 * Validate a rule
 */
function validateRule(rule: Rule, file: string): ValidationError[] {
  const errors: ValidationError[] = []

  // Note: rule.id is auto-generated during build, not required in source files

  if (!rule.title || rule.title.trim().length === 0) {
    errors.push({ file, ruleId: rule.id, message: 'Missing or empty title' })
  }

  if (!rule.explanation || rule.explanation.trim().length === 0) {
    errors.push({ file, ruleId: rule.id, message: 'Missing or empty explanation' })
  }

  if (!rule.examples || rule.examples.length === 0) {
    errors.push({ file, ruleId: rule.id, message: 'Missing examples (need at least one bad and one good example)' })
  } else {
    // Filter out informational examples (notes, trade-offs, etc.) that don't have code
    const codeExamples = rule.examples.filter(e => e.code && e.code.trim().length > 0)

    const hasBad = codeExamples.some(e =>
      e.label.toLowerCase().includes('incorrect') ||
      e.label.toLowerCase().includes('wrong') ||
      e.label.toLowerCase().includes('bad')
    )
    const hasGood = codeExamples.some(e =>
      e.label.toLowerCase().includes('correct') ||
      e.label.toLowerCase().includes('good') ||
      e.label.toLowerCase().includes('usage') ||
      e.label.toLowerCase().includes('implementation') ||
      e.label.toLowerCase().includes('example')
    )

    if (codeExamples.length === 0) {
      errors.push({ file, ruleId: rule.id, message: 'Missing code examples' })
    } else if (!hasBad && !hasGood) {
      errors.push({ file, ruleId: rule.id, message: 'Missing bad/incorrect or good/correct examples' })
    }
  }

  const validImpacts: Rule['impact'][] = ['CRITICAL', 'HIGH', 'MEDIUM-HIGH', 'MEDIUM', 'LOW-MEDIUM', 'LOW']
  if (!validImpacts.includes(rule.impact)) {
    errors.push({ file, ruleId: rule.id, message: `Invalid impact level: ${rule.impact}. Must be one of: ${validImpacts.join(', ')}` })
  }

  return errors
}

/**
 * Validate the file as written. These checks need the raw text because the parser
 * silently drops some of it.
 */
function validateRawText(content: string, file: string): ValidationError[] {
  const errors: ValidationError[] = []
  const lines = content.replace(/\r\n/g, '\n').split('\n')

  // Frontmatter must be one contiguous block
  let bodyStart = 0
  if (lines[0].trim() === '---') {
    const closing = lines.findIndex((line, i) => i > 0 && line.trim() === '---')
    if (closing !== -1) {
      const blankLines: number[] = []
      for (let i = 1; i < closing; i++) {
        if (lines[i].trim() === '') blankLines.push(i + 1)
      }
      if (blankLines.length > 0) {
        errors.push({
          file,
          message: `Blank line inside frontmatter (line ${blankLines.join(', ')}); keep the frontmatter contiguous`,
        })
      }
      bodyStart = closing + 1
    }
  }

  // The parser attaches a code block to the label above it and keeps only the last one.
  // Each segment runs from one label, Reference: line or heading to the next. Code blocks
  // outside any label are dropped, so a segment of that kind must not hold any either.
  type Segment = { anchor: string; label: string | null; fences: number }
  const segments: Segment[] = [{ anchor: 'start of file', label: null, fences: 0 }]
  let inCodeBlock = false

  for (let i = bodyStart; i < lines.length; i++) {
    const line = lines[i]

    if (line.startsWith('```')) {
      if (!inCodeBlock) segments[segments.length - 1].fences++
      inCodeBlock = !inCodeBlock
      continue
    }
    if (inCodeBlock) continue

    // Same label pattern as parser.ts; **Impact:** lines are not labels
    const labelMatch = line.includes('**Impact:') ? null : line.match(/^\*\*([^:]+?):\*?\*?$/)
    if (labelMatch) {
      segments.push({ anchor: `label ${labelMatch[1].trim()}`, label: labelMatch[1].trim(), fences: 0 })
    } else if (line.startsWith('Reference:') || line.startsWith('References:')) {
      segments.push({ anchor: 'Reference line', label: null, fences: 0 })
    } else if (line.startsWith('#')) {
      const heading = line.replace(/^#+\s*/, '').trim()
      segments.push({ anchor: `heading "${heading}"`, label: null, fences: 0 })
    }
  }

  for (const segment of segments) {
    if (segment.fences <= 1) continue
    errors.push({
      file,
      message: segment.label !== null
        ? `multiple code blocks under label ${segment.label}; parser keeps only the last`
        : `multiple code blocks outside any label (after ${segment.anchor}); parser drops them`,
    })
  }

  return errors
}

/**
 * Validate every rule file in one skill
 */
async function validateSkill(skill: SkillConfig): Promise<{ count: number; errors: ValidationError[] }> {
  const files = await readdir(skill.rulesDir)
  const ruleFiles = files.filter(f => f.endsWith('.md') && !f.startsWith('_'))

  const errors: ValidationError[] = []
  const firstFileByTitle = new Map<string, string>()

  for (const file of ruleFiles) {
    const filePath = join(skill.rulesDir, file)
    try {
      const content = await readFile(filePath, 'utf-8')
      const { section, rule } = await parseRuleFile(filePath, skill.sectionMap)

      errors.push(...validateRule(rule, file))
      errors.push(...validateRawText(content, file))

      if (!section) {
        errors.push({
          file,
          message: `Filename prefix is not in ${skill.name} sectionMap (src/config.ts) and no frontmatter section is set`,
        })
      }

      const titleKey = rule.title.trim().toLowerCase()
      if (titleKey) {
        const firstFile = firstFileByTitle.get(titleKey)
        if (firstFile) {
          errors.push({ file, message: `Duplicate title "${rule.title}" (also used by ${firstFile})` })
        } else {
          firstFileByTitle.set(titleKey, file)
        }
      }
    } catch (error) {
      errors.push({
        file,
        message: `Failed to parse: ${error instanceof Error ? error.message : String(error)}`
      })
    }
  }

  return { count: ruleFiles.length, errors }
}

/**
 * Main validation function
 */
async function validate() {
  try {
    let failed = false

    for (const skill of resolveSkills(process.argv.slice(2))) {
      console.log(`Validating ${skill.name} rule files...`)
      console.log(`Rules directory: ${skill.rulesDir}`)

      const { count, errors } = await validateSkill(skill)

      if (errors.length > 0) {
        failed = true
        console.error(`\n✗ ${skill.name}: validation failed:\n`)
        errors.forEach(error => {
          console.error(`  ${error.file}${error.ruleId ? ` (${error.ruleId})` : ''}: ${error.message}`)
        })
      } else {
        console.log(`✓ All ${count} ${skill.name} rule files are valid`)
      }
    }

    if (failed) {
      process.exit(1)
    }
  } catch (error) {
    console.error('Validation failed:', error)
    process.exit(1)
  }
}

validate()
