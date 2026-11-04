// SOURCE: skills/composition-patterns/rules/patterns-children-over-render-props.md
// HASH: 85472f5153cbdd5385523bf0ff1cbb5e8bcbc23b210a875925cd69c1267b2c89
import { type ReactNode } from 'react'
import { Composer } from './architecture-compound-components'

function ComposerFrame({ children }: { children: ReactNode }) {
  return <form>{children}</form>
}

function ComposerFooter({ children }: { children: ReactNode }) {
  return <footer className='flex'>{children}</footer>
}

// Stand-ins for the custom parts the example drops in as children.
function CustomHeader() {
  return <header>Custom header</header>
}

function SubmitButton() {
  return <button type="submit">Send</button>
}

// Usage is flexible
export function FlexibleComposer() {
  return (
    <Composer.Frame>
      <CustomHeader />
      <Composer.Input />
      <Composer.Footer>
        <Composer.Formatting />
        <Composer.Emojis />
        <SubmitButton />
      </Composer.Footer>
    </Composer.Frame>
  )
}

export { ComposerFrame, ComposerFooter }
