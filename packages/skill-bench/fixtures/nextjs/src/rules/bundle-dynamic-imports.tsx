// SOURCE: skills/react-best-practices/rules/bundle-dynamic-imports.md
// HASH: 36d2546b0420d15d79630f1dee6a65e9baeab18d2a3d5d3ec373350a75a2418f
'use client'

import dynamic from 'next/dynamic'

// components/monaco-editor.client.tsx
export const MonacoEditor = dynamic(
  () => import('./_shared').then((m) => m.MonacoEditor),
  { ssr: false }
)
