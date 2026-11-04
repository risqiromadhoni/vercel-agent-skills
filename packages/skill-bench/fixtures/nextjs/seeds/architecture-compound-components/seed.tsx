// SOURCE: skills/composition-patterns/rules/architecture-compound-components.md
// HASH: bd42cf2a6b57045f1f52d353c68353c1085918c727c1868c08a999c6208dd999
import type { ReactNode } from 'react'

export function Composer({
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
interface Props {
  renderHeader?: () => ReactNode
  renderFooter?: () => ReactNode
  renderActions?: () => ReactNode
  showAttachments: boolean
  showFormatting: boolean
  showEmojis: boolean
}

function Input() {
  return null
}

function Attachments() {
  return null
}

function Formatting() {
  return null
}

function Emojis() {
  return null
}

function Footer({ children }: { children?: ReactNode }) {
  return <footer>{children}</footer>
}
