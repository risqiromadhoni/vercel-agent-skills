// SOURCE: skills/composition-patterns/rules/architecture-avoid-boolean-props.md
// HASH: 90cd02de82a9349518644ec52323afafe2d4cee7c4bc4699c6577442472eea01
export function Composer({
  onSubmit,
  isThread,
  channelId,
  isDMThread,
  dmId,
  isEditing,
  isForwarding,
}: Props) {
  return (
    <form>
      <Header />
      <Input />
      {isDMThread ? (
        <AlsoSendToDMField id={dmId} />
      ) : isThread ? (
        <AlsoSendToChannelField id={channelId} />
      ) : null}
      {isEditing ? (
        <EditActions />
      ) : isForwarding ? (
        <ForwardActions />
      ) : (
        <DefaultActions />
      )}
      <Footer onSubmit={onSubmit} />
    </form>
  )
}

// ---- test scaffolding (not part of the exercise) ----
interface Props {
  onSubmit: () => void
  isThread: boolean
  channelId: string
  isDMThread: boolean
  dmId: string
  isEditing: boolean
  isForwarding: boolean
}

function Header() {
  return null
}

function Input() {
  return null
}

function AlsoSendToDMField(_props: { id: string }) {
  return null
}

function AlsoSendToChannelField(_props: { id: string }) {
  return null
}

function EditActions() {
  return null
}

function ForwardActions() {
  return null
}

function DefaultActions() {
  return null
}

function Footer(_props: { onSubmit: () => void }) {
  return null
}
