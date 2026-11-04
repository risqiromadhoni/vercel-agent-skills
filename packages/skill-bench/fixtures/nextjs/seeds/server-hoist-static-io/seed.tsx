// SOURCE: skills/react-best-practices/rules/server-hoist-static-io.md
// HASH: 6ad34c1269b9233f5949d1c89dfb877078aea4e81902c89e5c84a7ed91295671
// app/api/og/route.tsx
import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export async function GET(request: Request) {
  // Runs on EVERY request - expensive!
  const fontData = await readFile(join(process.cwd(), 'assets/Inter.ttf'))
  const logo = await readFile(join(process.cwd(), 'assets/logo.png'))
  const logoSrc = `data:image/png;base64,${logo.toString('base64')}`

  return new ImageResponse(
    <div style={{ fontFamily: 'Inter' }}>
      <img src={logoSrc} />
      Hello World
    </div>,
    { fonts: [{ name: 'Inter', data: fontData }] }
  )
}
