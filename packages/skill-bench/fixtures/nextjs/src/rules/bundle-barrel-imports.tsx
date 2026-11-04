// SOURCE: skills/react-best-practices/rules/bundle-barrel-imports.md
// HASH: 410d67c27bfb714ec56f9f54535c6af441e9105b7500162867d0067f23cc65b2
// next.config.ts - optimizes barrel imports at build time
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['@acme/ui']
  }
}

export default nextConfig
