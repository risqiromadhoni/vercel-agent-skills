// Next original: app/api/og/route.tsx rendered an ImageResponse (next/og, Next-only) and started file reads at module scope.
// TanStack equivalent: a server route GET handler. The module-scope promises still start once per process and every
// request awaits the same promises. ImageResponse is replaced by a plain Response with the stand-in bytes.
import { createFileRoute } from '@tanstack/react-router'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

// Module-level: runs ONCE when module is first imported.
// Stand-in files: the fixture ships no font or logo, so these reads use files that exist at its root.
// (A missing file here would reject at import time and crash the server process.)
const fontData = readFile(join(process.cwd(), 'package.json'))
const logoData = readFile(join(process.cwd(), 'tsconfig.json'))

export const Route = createFileRoute('/rules/server-hoist-static-io')({
  server: {
    handlers: {
      GET: async () => {
        // Await the already-started promises
        const [font, logo] = await Promise.all([fontData, logoData])

        return new Response(logo, {
          headers: {
            'Content-Type': 'application/json',
            'X-Font-Bytes': String(font.byteLength),
          },
        })
      },
    },
  },
})
