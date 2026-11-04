// SOURCE: skills/react-best-practices/rules/server-hoist-static-io.md
// HASH: 6ad34c1269b9233f5949d1c89dfb877078aea4e81902c89e5c84a7ed91295671
// Next original: app/api/og/route.tsx (Route Handler with next/og ImageResponse). TanStack: a createServerFn handler.
import { createServerFn } from '@tanstack/react-start'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const getOgImage = createServerFn({ method: 'GET' }).handler(async () => {
  // Runs on EVERY request - expensive!
  const fontData = await readFile(join(process.cwd(), 'assets/Inter.ttf'))
  const logo = await readFile(join(process.cwd(), 'assets/logo.png'))
  const logoSrc = `data:image/png;base64,${logo.toString('base64')}`

  return { fontBytes: fontData.length, logoSrc }
})

export {}
