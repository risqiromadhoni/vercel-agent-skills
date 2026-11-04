// SOURCE: skills/composition-patterns/rules/patterns-children-over-render-props.md
// HASH: 85472f5153cbdd5385523bf0ff1cbb5e8bcbc23b210a875925cd69c1267b2c89
import { Composer } from './_shared'

function ComposerFrame({ children }: { children: React.ReactNode }) {
  return <form>{children}</form>
}

function ComposerFooter({ children }: { children: React.ReactNode }) {
  return <footer className='flex'>{children}</footer>
}

// Stand-ins for the custom children the example passes in.
function CustomHeader() {
  return <header />
}

function SubmitButton() {
  return <button type="submit">Send</button>
}

// Usage is flexible
export function Usage() {
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
