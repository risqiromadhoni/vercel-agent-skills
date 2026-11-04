// SOURCE: skills/composition-patterns/rules/patterns-explicit-variants.md
// HASH: 19686a9353e1c0bc627ddd3f3771e215be8aa44ea954e864fcebd2130f921bd8
// What does this component actually render?
export function Example() {
  return (
    <Composer
      isThread
      isEditing={false}
      channelId='abc'
      showAttachments
      showFormatting={false}
    />
  )
}

// ---- test scaffolding (not part of the exercise) ----
interface Props {
  isThread?: boolean
  isEditing?: boolean
  channelId?: string
  showAttachments?: boolean
  showFormatting?: boolean
}

function Composer(_props: Props) {
  return null
}
