// SOURCE: skills/react-best-practices/rules/bundle-conditional.md
// HASH: a3573e250090201758e18bb0cda9a2436a55fc1a29d7be867127d37a2db0a3dd
import { useEffect, useState, type Dispatch, type SetStateAction } from 'react'
import { Skeleton, frames as animationFrames } from './_shared'

type Frame = string

function Canvas({ frames }: { frames: Frame[] }) {
  return <canvas data-frames={frames.length} />
}

// Plain import() inside an effect: no framework API is involved, so the example carries over to Vite.
// The Next original is identical; it is listed as an equivalent because Next's own loader (next/dynamic) is not used.
export function AnimationPlayer({ enabled, setEnabled }: { enabled: boolean; setEnabled: Dispatch<SetStateAction<boolean>> }) {
  const [frames, setFrames] = useState<Frame[] | null>(null)

  useEffect(() => {
    if (enabled && !frames && typeof window !== 'undefined') {
      import('./_shared')
        .then(mod => setFrames(mod.frames))
        .catch(() => setEnabled(false))
    }
  }, [enabled, frames, setEnabled])

  if (!frames) return <Skeleton />
  return <Canvas frames={frames} />
}

export const initialFrames: Frame[] = animationFrames
