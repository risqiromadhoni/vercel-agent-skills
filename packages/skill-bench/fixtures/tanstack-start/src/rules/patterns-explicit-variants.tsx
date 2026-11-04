// SOURCE: skills/composition-patterns/rules/patterns-explicit-variants.md
// HASH: 1dda12a186e959d7494d9c9772a0d251ce83f8cf5fdc0d7ba8ae202e40e2f17f
import { Composer } from './architecture-compound-components'

// One named component per mode, instead of one component with mode booleans.
function ThreadComposer({ channelId }: { channelId: string }) {
  return <Composer.Frame data-channel={channelId}><Composer.Input /></Composer.Frame>
}

function EditMessageComposer({ messageId }: { messageId: string }) {
  return <Composer.Frame data-message={messageId}><Composer.Input /></Composer.Frame>
}

function ForwardMessageComposer({ messageId }: { messageId: string }) {
  return <Composer.Frame data-message={messageId}><Composer.Input /></Composer.Frame>
}

export function ComposerVariants() {
  return (
    <>
      {/* Immediately clear what this renders */}
      <ThreadComposer channelId="abc" />

      {/* Or */}
      <EditMessageComposer messageId="xyz" />

      {/* Or */}
      <ForwardMessageComposer messageId="123" />
    </>
  )
}
