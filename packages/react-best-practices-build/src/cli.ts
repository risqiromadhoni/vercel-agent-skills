/**
 * Shared command-line handling for the build scripts
 */

import { SKILLS, SkillConfig, DEFAULT_SKILL } from './config.js'

/**
 * Resolve which skills a script should run on:
 *   --all            every skill in SKILLS
 *   --skill=<name>   one skill
 *   (no flag)        DEFAULT_SKILL
 * Exits with status 1 when the named skill does not exist.
 */
export function resolveSkills(argv: string[]): SkillConfig[] {
  if (argv.includes('--all')) {
    return Object.values(SKILLS)
  }

  const skillArg = argv.find((arg) => arg.startsWith('--skill='))
  if (skillArg) {
    const name = skillArg.slice('--skill='.length)
    if (!Object.hasOwn(SKILLS, name)) {
      console.error(`Unknown skill: ${name}`)
      console.error(`Available skills: ${Object.keys(SKILLS).join(', ')}`)
      process.exit(1)
    }
    return [SKILLS[name]]
  }

  return [SKILLS[DEFAULT_SKILL]]
}
