---
title: Avoid Barrel File Imports
impact: CRITICAL
impactDescription: 200-800ms import cost, slow builds
tags: bundle, imports, tree-shaking, barrel-files, performance
---

## Avoid Barrel File Imports

Import directly from source files instead of barrel files to avoid loading thousands of unused modules. **Barrel files** are entry points that re-export multiple modules (e.g., `index.js` that does `export * from './module'`).

Popular icon and component libraries can have **up to 10,000 re-exports** in their entry file. For many React packages, **it takes 200-800ms just to import them** (measured on Next.js 13.5, 2024), affecting both development speed and production cold starts.

**Why tree-shaking doesn't help:** When a library is marked as external (not bundled), the bundler can't optimize it. If you bundle it to enable tree-shaking, builds become substantially slower analyzing the entire module graph.

**Incorrect (imports entire library):**

```tsx
import { Button, TextField } from '@acme/ui'
// Loads every re-export of the barrel, even the ones unused here.
// Illustration of scale from icon barrels (lucide-react loads 1,583 modules and takes ~2.8s extra in dev;
// @mui/material loads 2,225 modules and takes ~4.2s extra in dev) (measured on Next.js 13.5, 2024)
```

**Correct (optimizePackageImports for packages outside the default list):**

```ts
// next.config.ts - optimizes barrel imports at build time
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['@acme/ui']
  }
}

export default nextConfig
```

`optimizePackageImports` is still experimental. Next.js already optimizes packages such as `lucide-react` and `@mui/material` by default, so list only packages that are missing from the [default list](https://nextjs.org/docs/app/api-reference/config/next-config-js/optimizePackageImports).

**Correct (keep the standard named import):**

```tsx
// Keep the standard imports - Next.js transforms them to direct imports
import { Button, TextField } from '@acme/ui'
// Full TypeScript support, no manual path wrangling
```

This is the recommended approach because it preserves TypeScript type safety and editor autocompletion while still eliminating the barrel import cost.

**Correct - Direct imports (non-Next.js projects):**

```tsx
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
// Loads only what you use
```

> **TypeScript warning:** Some libraries (notably `lucide-react`) don't ship `.d.ts` files for their deep import paths. Importing from `lucide-react/dist/esm/icons/check` resolves to an implicit `any` type, causing errors under `strict` or `noImplicitAny`. Prefer `optimizePackageImports` when available, or verify the library exports types for its subpaths before using direct imports.

These optimizations provide 15-70% faster dev boot, 28% faster builds, 40% faster cold starts, and significantly faster HMR (measured on Next.js 13.5, 2024).

Libraries commonly affected: `lucide-react`, `@mui/material`, `@mui/icons-material`, `@tabler/icons-react`, `react-icons`, `@headlessui/react`, `@radix-ui/react-*`, `lodash`, `ramda`, `date-fns`, `rxjs`, `react-use`.

Reference: [How we optimized package imports in Next.js](https://vercel.com/blog/how-we-optimized-package-imports-in-next-js)
