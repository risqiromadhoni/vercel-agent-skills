// SOURCE: skills/composition-patterns/rules/architecture-avoid-boolean-props.md
// HASH: 90cd02de82a9349518644ec52323afafe2d4cee7c4bc4699c6577442472eea01
function Composer({
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
type Props = {
  onSubmit: () => void
  isThread?: boolean
  channelId?: string
  isDMThread?: boolean
  dmId?: string
  isEditing?: boolean
  isForwarding?: boolean
}
declare function Header(props: any): null
declare function Input(props: any): null
declare function Footer(props: any): null
declare function AlsoSendToDMField(props: any): null
declare function AlsoSendToChannelField(props: any): null
declare function EditActions(props: any): null
declare function ForwardActions(props: any): null
declare function DefaultActions(props: any): null
export {}
