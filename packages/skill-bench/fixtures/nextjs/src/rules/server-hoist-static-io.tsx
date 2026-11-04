// SOURCE: skills/react-best-practices/rules/server-hoist-static-io.md
// HASH: 2cadaa7424a7503accd8753a630293057144a4d707b87080ba47ceba3ee8b6cf
// app/api/og/route.tsx
import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

// adapted: the fixture ships Geist-Regular.ttf (copied from next's bundled @vercel/og) instead of Inter.ttf, so the font name is Geist.
// Module-level: runs ONCE when module is first imported
const fontData = readFile(join(process.cwd(), 'assets/Geist-Regular.ttf'))
const logoSrc = readFile(join(process.cwd(), 'assets/logo.png')).then(
  (logo) => `data:image/png;base64,${logo.toString('base64')}`
)

export async function GET(request: Request) {
  // Await the already-started promises
  const [font, logo] = await Promise.all([fontData, logoSrc])

  return new ImageResponse(
    <div style={{ fontFamily: 'Geist' }}>
      <img src={logo} />
      Hello World
    </div>,
    { fonts: [{ name: 'Geist', data: font }] }
  )
}
