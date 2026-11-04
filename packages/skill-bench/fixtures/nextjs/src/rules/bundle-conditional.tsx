// SOURCE: skills/react-best-practices/rules/bundle-conditional.md
// HASH: a3573e250090201758e18bb0cda9a2436a55fc1a29d7be867127d37a2db0a3dd
'use client'

import { useEffect, useState } from 'react'
import { Skeleton, type Frame } from './_shared'

export function AnimationPlayer({ enabled, setEnabled }: { enabled: boolean; setEnabled: React.Dispatch<React.SetStateAction<boolean>> }) {
  const [frames, setFrames] = useState<Frame[] | null>(null)

  useEffect(() => {
    if (enabled && !frames && typeof window !== 'undefined') {
      // Stand-in: the frames module lives in _shared.
      import('./_shared')
        .then(mod => setFrames(mod.frames))
        .catch(() => setEnabled(false))
    }
  }, [enabled, frames, setEnabled])

  if (!frames) return <Skeleton />
  return <Canvas frames={frames} />
}

// Stand-in for the canvas the example renders.
function Canvas(_props: { frames: Frame[] }) {
  return null
}
