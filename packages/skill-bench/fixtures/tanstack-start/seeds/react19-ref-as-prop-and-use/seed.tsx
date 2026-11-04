// SOURCE: skills/composition-patterns/rules/react19-ref-as-prop-and-use.md
// HASH: 6f82faeaf5e5e48a5948430c0507b637d90b58e30deb4d4d5dcf26a6edea4934
import type * as React from 'react'
import { forwardRef } from 'react'

const ComposerInput = forwardRef<HTMLTextAreaElement, React.ComponentProps<'textarea'>>(
  (props, ref) => {
    return <textarea ref={ref} {...props} />
  }
)

export { ComposerInput }
