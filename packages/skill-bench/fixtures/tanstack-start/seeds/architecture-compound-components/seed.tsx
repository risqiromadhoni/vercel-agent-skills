// SOURCE: skills/composition-patterns/rules/architecture-compound-components.md
// HASH: bd42cf2a6b57045f1f52d353c68353c1085918c727c1868c08a999c6208dd999
function Composer({
  renderHeader,
  renderFooter,
  renderActions,
  showAttachments,
  showFormatting,
  showEmojis,
}: Props) {
  return (
    <form>
      {renderHeader?.()}
      <Input />
      {showAttachments && <Attachments />}
      {renderFooter ? (
        renderFooter()
      ) : (
        <Footer>
          {showFormatting && <Formatting />}
          {showEmojis && <Emojis />}
          {renderActions?.()}
        </Footer>
      )}
    </form>
  )
}

// ---- test scaffolding (not part of the exercise) ----
import type { ReactNode } from 'react'
type Props = {
  renderHeader?: () => ReactNode
  renderFooter?: () => ReactNode
  renderActions?: () => ReactNode
  showAttachments?: boolean
  showFormatting?: boolean
  showEmojis?: boolean
}
declare function Input(props: any): null
declare function Attachments(props: any): null
declare function Footer(props: any): null
declare function Formatting(props: any): null
declare function Emojis(props: any): null
export {}
