// SOURCE: skills/react-best-practices/rules/bundle-dynamic-imports.md
// HASH: 36d2546b0420d15d79630f1dee6a65e9baeab18d2a3d5d3ec373350a75a2418f
// Next original: 'use client' + next/dynamic(() => import('./monaco-editor'), { ssr: false }).
// TanStack equivalent: React.lazy inside <Suspense>. TanStack Start SSRs lazy components, so the editor
// is rendered only after mount to keep it client-only, the same effect ssr:false has in Next.
import { lazy, Suspense, useEffect, useState } from 'react'

const MonacoEditor = lazy(() => import('./_shared').then((m) => ({ default: m.MonacoEditor })))

export function Editor() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) return null
  return (
    <Suspense fallback={<div>Loading editor...</div>}>
      <MonacoEditor />
    </Suspense>
  )
}
