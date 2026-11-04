// SOURCE: skills/composition-patterns/rules/patterns-explicit-variants.md
// HASH: 1dda12a186e959d7494d9c9772a0d251ce83f8cf5fdc0d7ba8ae202e40e2f17f
import { ForwardMessageComposer } from './_shared'

// Stand-ins for the variants the example renders.
function ThreadComposer({ channelId }: { channelId: string }) {
  return <form data-channel={channelId} />
}

function EditMessageComposer({ messageId }: { messageId: string }) {
  return <form data-message={messageId} />
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
