#!/usr/bin/env node
/**
 * Extract test cases from rules for LLM evaluation
 */

import { readdir, writeFile } from 'fs/promises'
import { join } from 'path'
import { Rule, TestCase } from './types.js'
import { parseRuleFile } from './parser.js'
import { resolveSkills } from './cli.js'
import { assignRuleIds } from './ids.js'

/**
 * Extract test cases from a rule
 */
function extractTestCases(rule: Rule, skill: string): TestCase[] {
  const testCases: TestCase[] = []
  
  rule.examples.forEach((example, index) => {
    const isBad = example.label.toLowerCase().includes('incorrect') || 
                  example.label.toLowerCase().includes('wrong') ||
                  example.label.toLowerCase().includes('bad')
    const isGood = example.label.toLowerCase().includes('correct') ||
                   example.label.toLowerCase().includes('good')
    
    if (isBad || isGood) {
      testCases.push({
        skill,
        ruleId: rule.id,
        ruleTitle: rule.title,
        type: isBad ? 'bad' : 'good',
        code: example.code,
        language: example.language || 'typescript',
        description: example.description || `${example.label} example for ${rule.title}`
      })
    }
  })
  
  return testCases
}

/**
 * Main extraction function
 */
async function extractTests() {
  try {
    for (const skill of resolveSkills(process.argv.slice(2))) {
      console.log(`Extracting test cases from ${skill.name} rules...`)
      console.log(`Rules directory: ${skill.rulesDir}`)
      console.log(`Output file: ${skill.testCasesFile}`)

      const files = await readdir(skill.rulesDir)
      const ruleFiles = files.filter(f => f.endsWith('.md') && !f.startsWith('_') && f !== 'README.md')

      const rules: Rule[] = []

      for (const file of ruleFiles) {
        const filePath = join(skill.rulesDir, file)
        try {
          const { rule } = await parseRuleFile(filePath, skill.sectionMap)
          rules.push(rule)
        } catch (error) {
          console.error(`Error processing ${file}:`, error)
          process.exitCode = 1
        }
      }

      // IDs must be assigned before extraction so each test case carries its rule's ID
      const allTestCases = assignRuleIds(rules).flatMap(rule => extractTestCases(rule, skill.name))

      // Write test cases as JSON
      await writeFile(skill.testCasesFile, JSON.stringify(allTestCases, null, 2), 'utf-8')

      console.log(`✓ Extracted ${allTestCases.length} test cases to ${skill.testCasesFile}`)
      console.log(`  - Bad examples: ${allTestCases.filter(tc => tc.type === 'bad').length}`)
      console.log(`  - Good examples: ${allTestCases.filter(tc => tc.type === 'good').length}`)
    }
  } catch (error) {
    console.error('Extraction failed:', error)
    process.exit(1)
  }
}

extractTests()
