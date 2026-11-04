// SOURCE: skills/composition-patterns/rules/react19-ref-as-prop-and-use.md
// HASH: 16a51513cccb6b57302bd43405ed7c9602814d1698b3b84d4fdf1910265aefa2
import type { ComponentProps, Ref } from 'react'

export function ComposerInput({
  ref,
  ...props
}: ComponentProps<'textarea'> & { ref?: Ref<HTMLTextAreaElement> }) {
  return <textarea ref={ref} {...props} />
}
