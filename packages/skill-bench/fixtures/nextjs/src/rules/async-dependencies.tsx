// SOURCE: skills/react-best-practices/rules/async-dependencies.md
// HASH: 4a43603a0968bc1144bcd957b993581bde474e8466a284536bb61801dc3b940e
import { all } from 'better-all'
import { fetchConfig, fetchUser } from './_shared'

export async function loadDashboard() {
  const { user, config, profile } = await all({
    async user() { return fetchUser() },
    async config() { return fetchConfig() },
    async profile() {
      return fetchProfile((await this.$.user).id)
    }
  })
  return { user, config, profile }
}

// Stand-in for the profile lookup.
async function fetchProfile(_userId: string) {
  return { bio: '' }
}
